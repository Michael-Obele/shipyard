import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/server/schema.ts',
	out: './src/lib/server/migrations',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	},
	// Casing convention: snake_case for database columns
	casing: 'snake_case'
	// If using Drizzle Studio, run 'drizzle-kit studio' separately or update drizzle-kit to a version that supports inline studio config.
});
