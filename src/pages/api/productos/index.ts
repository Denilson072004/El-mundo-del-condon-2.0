import type { APIRoute } from 'astro';
import { query } from '../../../lib/server/db';

export const GET: APIRoute = async () => {
  try {
    const { rows } = await query('SELECT id_producto, nombre, precio, cantidad FROM productos ORDER BY id_producto;');
    return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error al obtener productos' }), { status: 500 });
  }
};
