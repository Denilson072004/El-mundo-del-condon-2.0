import type { APIRoute } from 'astro';
import { query } from '../../../lib/server/db';

export const DELETE: APIRoute = async ({ url }) => {
  const id_usuario = Number(url.searchParams.get('user'));
  if (!id_usuario) return new Response(JSON.stringify({ error: '?user=ID requerido' }), { status: 400 });

  const cart = await query<{ id_carrito: number }>(
    'SELECT id_carrito FROM carritos WHERE id_usuario=$1 ORDER BY fecha_creacion DESC LIMIT 1;',
    [id_usuario]
  );
  if (!cart.rows.length) return new Response(JSON.stringify({ ok: true }));

  await query('DELETE FROM carrito_items WHERE id_carrito=$1;', [cart.rows[0].id_carrito]);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
};
