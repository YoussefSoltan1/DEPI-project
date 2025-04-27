import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { setupTmdbRoutes } from "./tmdb";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  setupAuth(app);
  
  // TMDB API routes
  setupTmdbRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}
