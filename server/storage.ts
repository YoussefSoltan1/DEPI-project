import session from "express-session";
import { PgStorage } from "./storage/pg-storage";
import { type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.SessionStore;
  addToWishlist(userId: number, movieId: number): Promise<void>;
  removeFromWishlist(userId: number, movieId: number): Promise<void>;
}


export const storage = new PgStorage();

