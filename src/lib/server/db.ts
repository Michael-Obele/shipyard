/**
 * Database connection singleton for Drizzle ORM
 * Handles connection pooling and lifecycle management
 * Uses Neon's serverless HTTP driver for optimal performance
 */

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './drizzle';

if (!process.env.DATABASE_URL) {
	throw new Error('❌ DATABASE_URL environment variable is not set');
}

// Initialize Neon serverless driver for PostgreSQL
const sql = neon(process.env.DATABASE_URL);

// Create singleton Drizzle instance with schema
const db = drizzle(sql, { schema });

/**
 * Export the database instance for use throughout the app
 * This is a singleton - the same instance is reused across all requests
 *
 * Usage:
 * ```ts
 * import { db } from '$lib/server/db';
 *
 * const repos = await db.select().from(repositoryCache).where(...);
 * ```
 */
export { db };

export default db;
