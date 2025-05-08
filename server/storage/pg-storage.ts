import { db } from "../db";
import { users, InsertUser, User } from "@shared/schema";
import { eq,and } from "drizzle-orm";
import session from "express-session";
import { wishlists } from "@shared/schema";
import pgSession from "connect-pg-simple";

export class PgStorage {
  sessionStore: session.SessionStore;

  constructor() {
    const PGStore = pgSession(session);
    this.sessionStore = new PGStore({
      conString: process.env.DATABASE_URL!,
      tableName: "session",
    });
  }
  async addToWishlist(userId: number, movieId: number): Promise<void> {
    await db.insert(wishlists).values({
      userId,
      movieId,
    });
  }

  async removeFromWishlist(userId: number, movieId: number): Promise<void> {
    await db
      .delete(wishlists)
      .where(and(eq(wishlists.userId, userId), eq(wishlists.movieId, movieId)));
  }


  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(newUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(newUser).returning();
    return user;
  }
}
