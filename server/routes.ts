import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { setupTmdbRoutes } from "./tmdb";
import { db } from "./db";
import { wishlists } from "@shared/schema";
import { and, eq } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";
import { getMovieDetails } from "./tmdb"; 

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);
  setupTmdbRoutes(app);

  app.post("/api/wishlist", async (req, res) => {
    const user = req.user;
    if (!user) return res.sendStatus(401);

    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ message: "Missing movieId" });

    const existing = await db
      .select()
      .from(wishlists)
      .where(and(eq(wishlists.userId, user.id), eq(wishlists.movieId, movieId)));

    if (existing.length > 0) {
      return res.status(409).json({ message: "Already in wishlist" });
    }

    console.log("Inserting movie to wishlist:", { userId: user.id, movieId });

    try {
      await db.insert(wishlists).values({ userId: user.id, movieId });
      res.status(201).json({ message: "Added to wishlist" });
    } catch (err) {
      console.error("❌ Wishlist insert failed:", err);
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  // Get wishlist
  app.get("/api/wishlist", async (req, res) => {
    const user = req.user;
    if (!user) return res.sendStatus(401);

    const userWishlist = await db
      .select()
      .from(wishlists)
      .where(eq(wishlists.userId, user.id));

    res.json(userWishlist);
  });

  // Remove from wishlist
  app.delete("/api/wishlist/:movieId", async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const movieId = parseInt(req.params.movieId, 10);

      if (!userId || isNaN(movieId)) {
        return res.status(400).json({ message: "Invalid request" });
      }

      await storage.removeFromWishlist(userId, movieId);
      res.status(200).json({ message: "Removed from wishlist" });
    } catch (error) {
      next(error);
    }
  });

  // Chat route (Gemini)
  app.post("/api/chat", handleChatRequest);

  const httpServer = createServer(app);
  return httpServer;
}


export async function handleChatRequest(req, res) {
  const userId = req.user?.id;
  const question = req.body.question;

  if (!userId || !question) {
    return res.status(400).json({ message: "Missing user or question" });
  }

  const wishlistItems = await db
    .select()
    .from(wishlists)
    .where(eq(wishlists.userId, userId));

  const movieSummaries = await Promise.all(
    wishlistItems.map(async ({ movieId }) => {
      try {
        const movie = await getMovieDetails(movieId);
        return `${movie.title} (${movie.release_date}): ${movie.overview}`;
      } catch (err) {
        console.warn(`⚠️ Failed to fetch movie with ID ${movieId}:`, err?.response?.status || err.message);
        return null; 
      }
    })
  );

  const validSummaries = movieSummaries.filter(Boolean);
  if (validSummaries.length === 0) {
    return res.status(200).json({ answer: "Your wishlist is empty or contains invalid entries. Please add valid movies first." });
  }

  const context = validSummaries.join("\n\n");
  const prompt = `Here are the movies in my wishlist:\n\n${context}\n\nQuestion: ${question}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are a movie recommendation assistant. Answer questions based on the user's movie wishlist.",
      },
    });

    res.json({ answer: response.text });
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    res.status(500).json({ message: "Gemini API error" });
  }
}


