import { relations, sql } from 'drizzle-orm'
import { boolean, foreignKey, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const RepositoryCache = pgTable('repository_caches', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	clusterName: text('clusterName').notNull().unique(),
	repoNames: jsonb('repoNames').notNull(),
	rawData: jsonb('rawData').notNull(),
	fetchedAt: timestamp('fetchedAt', { precision: 3 }).notNull().defaultNow(),
	ttlHours: integer('ttlHours').notNull().default(24),
	isStale: boolean('isStale').notNull().default(true),
	nextRefreshAt: timestamp('nextRefreshAt', { precision: 3 }).notNull().defaultNow(),
	rawDataMetadata: jsonb('rawDataMetadata'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull()
});

export const RefreshLog = pgTable('refresh_logs', {
	id: text('id').notNull().primaryKey().default(sql`cuid(1)`),
	clusterName: text('clusterName').notNull(),
	repositoryCacheId: text('repositoryCacheId').notNull(),
	status: text('status').notNull(),
	errorMessage: text('errorMessage'),
	itemsAttempted: integer('itemsAttempted').notNull(),
	apiRequestsUsed: integer('apiRequestsUsed').notNull(),
	retryAttempt: integer('retryAttempt').notNull(),
	attemptedAt: timestamp('attemptedAt', { precision: 3 }).notNull().defaultNow(),
	completedAt: timestamp('completedAt', { precision: 3 }),
	durationMs: integer('durationMs')
}, (RefreshLog) => ({
	'refresh_logs_repositoryCache_fkey': foreignKey({
		name: 'refresh_logs_repositoryCache_fkey',
		columns: [RefreshLog.repositoryCacheId],
		foreignColumns: [RepositoryCache.id]
	})
		.onDelete('cascade')
		.onUpdate('cascade')
}));

export const RepositoryCacheRelations = relations(RepositoryCache, ({ many }) => ({
	refreshLogs: many(RefreshLog, {
		relationName: 'RefreshLogToRepositoryCache'
	})
}));

export const RefreshLogRelations = relations(RefreshLog, ({ one }) => ({
	repositoryCache: one(RepositoryCache, {
		relationName: 'RefreshLogToRepositoryCache',
		fields: [RefreshLog.repositoryCacheId],
		references: [RepositoryCache.id]
	})
}));