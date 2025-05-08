import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { setupTmdbRoutes } from "./tmdb";
import { db } from "./db"; // or wherever your drizzle db is
import { wishlists } from "@shared/schema";
import { and, eq } from "drizzle-orm";


export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  setupAuth(app);
  
  // TMDB API routes
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
  
    // Log the values before inserting
    console.log('Inserting movie to wishlist:', { userId: user.id, movieId });
  
    try {
      await db.insert(wishlists).values({
        userId: user.id,
        movieId,
      });
      res.status(201).json({ message: "Added to wishlist" });
    } catch (err) {
      console.error("❌ Wishlist insert failed:", err);
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });
  
  
  app.get("/api/wishlist", async (req, res) => {
    const user = req.user;
    if (!user) return res.sendStatus(401);
  
    const userWishlist = await db
      .select()
      .from(wishlists)
      .where(eq(wishlists.userId, user.id));
  
    res.json(userWishlist);
  });
  
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

  const httpServer = createServer(app);

  return httpServer;
}


