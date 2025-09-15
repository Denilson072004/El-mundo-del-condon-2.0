import type { APIRoute } from 'astro';
import { pool } from '../../../lib/server/db';

export const POST: APIRoute = async ({ request }) => {
  const { id_usuario, id_producto, cantidad } = await request.json();

  if (!id_usuario || !id_producto || !cantidad || cantidad <= 0) {
    return new Response(JSON.stringify({ error: 'id_usuario, id_producto y cantidad > 0 son requeridos' }), { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1) obtener o crear carrito del usuario
    const cartRes = await client.query<{ id_carrito: number }>(
      `WITH existing AS (
         SELECT id_carrito FROM carritos WHERE id_usuario = $1 ORDER BY fecha_creacion DESC LIMIT 1
       ), inserted AS (
         INSERT INTO carritos (id_usuario) 
         SELECT $1 WHERE NOT EXISTS (SELECT 1 FROM existing)
         RETURNING id_carrito
       )
       SELECT id_carrito FROM inserted
       UNION ALL
       SELECT id_carrito FROM existing;`,
      [id_usuario]
    );
    const id_carrito = cartRes.rows[0].id_carrito;

    // 2) UPSERT del item
    await client.query(
      `INSERT INTO carrito_items (id_carrito, id_producto, cantidad)
       VALUES ($1,$2,$3)
       ON CONFLICT (id_carrito, id_producto)
       DO UPDATE SET cantidad = carrito_items.cantidad + EXCLUDED.cantidad;`,
      [id_carrito, id_producto, cantidad]
    );

    await client.query('COMMIT');
    return new Response(JSON.stringify({ ok: true, id_carrito }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    await client.query('ROLLBACK');
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: e?.message }), { status: 500 });
  } finally {
    client.release();
  }
};
