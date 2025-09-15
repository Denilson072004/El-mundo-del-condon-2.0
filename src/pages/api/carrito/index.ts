import type { APIRoute } from 'astro';
import { query } from '../../../lib/server/db';

export const GET: APIRoute = async ({ url }) => {
  const id_usuario = Number(url.searchParams.get('user'));
  if (!id_usuario) return new Response(JSON.stringify({ error: 'query ?user=ID requerido' }), { status: 400 });

  // carrito (si no tiene, devolver vacío)
  const cart = await query<{ id_carrito: number }>(
    'SELECT id_carrito FROM carritos WHERE id_usuario=$1 ORDER BY fecha_creacion DESC LIMIT 1;',
    [id_usuario]
  );
  if (!cart.rows.length) return new Response(JSON.stringify({ id_carrito: null, items: [] }), { headers: { 'Content-Type': 'application/json' } });

  const id_carrito = cart.rows[0].id_carrito;

  const items = await query<{
    id_producto: number; nombre: string; precio: string; cantidad: number; subtotal: string;
  }>(
    `SELECT ci.id_producto, p.nombre, p.precio::text, ci.cantidad,
            (ci.cantidad * p.precio)::text AS subtotal
     FROM carrito_items ci
     JOIN productos p ON p.id_producto = ci.id_producto
     WHERE ci.id_carrito = $1
     ORDER BY p.id_producto;`,
    [id_carrito]
  );

  return new Response(JSON.stringify({ id_carrito, items: items.rows }), { headers: { 'Content-Type': 'application/json' } });
};
