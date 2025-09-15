import type { APIRoute } from 'astro';
import { query } from '../../lib/server/db';

export const GET: APIRoute = async () => {
  try {
    const { rows } = await query<{ now: string }>('SELECT NOW() as now');
    return new Response(JSON.stringify({ ok: true, now: rows[0].now }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: e?.message }), { status: 500 });
  }
};
