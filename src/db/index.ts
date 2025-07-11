import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  return url;
}

// Initialize database connection
function createDb() {
  const sql = neon(getDatabaseUrl());
  return drizzle(sql, { schema });
}

// Only create connection when needed (lazy loading)
let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop, receiver) {
    const database = getDb();
    const value = Reflect.get(database, prop, receiver);
    return typeof value === 'function' ? value.bind(database) : value;
  },
});

// Export schema for use in other files
export * from './schema';