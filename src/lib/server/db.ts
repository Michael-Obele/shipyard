/**
 * Database connection singleton for Prisma ORM
 * Handles connection pooling and lifecycle management
 */

import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
	throw new Error('❌ DATABASE_URL environment variable is not set');
}

// Create singleton Prisma instance
const db = new PrismaClient();

/**
 * Export the database instance for use throughout the app
 * This is a singleton - the same instance is reused across all requests
 *
 * Usage:
 * ```ts
 * import { db } from '$lib/server/db';
 *
 * const clusters = await db.cluster.findMany();
 * ```
 */
export { db };

export default db;
