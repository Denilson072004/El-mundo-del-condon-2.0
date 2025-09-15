import 'dotenv/config';
import { Pool } from 'pg';
import type { QueryResult, QueryResultRow } from 'pg';

const num = (v?: string) => (v ? Number(v) : undefined);

export const pool = new Pool({
  host: process.env.PGHOST,
  port: num(process.env.PGPORT) ?? 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max: 10,
  idleTimeoutMillis: 30_000,
});

// 👇 nota el `extends QueryResultRow`
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}
