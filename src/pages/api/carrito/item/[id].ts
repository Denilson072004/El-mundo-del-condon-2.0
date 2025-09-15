import type { APIRoute } from 'astro';
import { query } from '../../../../lib/server/db';

export const DELETE: APIRoute = async ({ params, url }) => {
  const id_producto = Number(params.id);
  const id_usuario = Number(url.searchParams.get('user'));
  if (!id_usuario || !id_producto) return new Response(JSON.stringify({ error: 'user e id del producto requeridos' }), { status: 400 });

  const cart = await query<{ id_carrito: number }>(
    'SELECT id_carrito FROM carritos WHERE id_usuario=$1 ORDER BY fecha_creacion DESC LIMIT 1;',
    [id_usuario]
  );
  if (!cart.rows.length) return new Response(JSON.stringify({ ok: true })); // nada que borrar

  await query('DELETE FROM carrito_items WHERE id_carrito=$1 AND id_producto=$2;', [cart.rows[0].id_carrito, id_producto]);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
};
