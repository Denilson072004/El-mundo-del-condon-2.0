import type { APIRoute } from 'astro';
import { pool } from '../../lib/server/db';

export const POST: APIRoute = async ({ request }) => {
  const { id_usuario } = await request.json();
  if (!id_usuario) return new Response(JSON.stringify({ error: 'id_usuario requerido' }), { status: 400 });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1) carrito actual
    const cartRes = await client.query<{ id_carrito: number }>(
      'SELECT id_carrito FROM carritos WHERE id_usuario=$1 ORDER BY fecha_creacion DESC LIMIT 1;', [id_usuario]
    );
    if (!cartRes.rows.length) throw new Error('No hay carrito para este usuario');

    const id_carrito = cartRes.rows[0].id_carrito;

    // 2) items del carrito + precios actuales
    const itemsRes = await client.query<{
      id_producto: number; cantidad: number; precio_unit: string;
    }>(
      `SELECT ci.id_producto, ci.cantidad, p.precio::text as precio_unit
       FROM carrito_items ci
       JOIN productos p ON p.id_producto = ci.id_producto
       WHERE ci.id_carrito = $1
       FOR UPDATE;`,
      [id_carrito]
    );
    if (!itemsRes.rows.length) throw new Error('Carrito vacío');

    // 3) crear pedido
    const pedRes = await client.query<{ id_pedido: number }>(
      'INSERT INTO pedidos (id_usuario, estado) VALUES ($1, $2) RETURNING id_pedido;',
      [id_usuario, 'pendiente']
    );
    const id_pedido = pedRes.rows[0].id_pedido;

    // 4) insertar detalle del pedido
    const values: any[] = [];
    const tuples = itemsRes.rows.map((r, i) => {
      const o = i * 4;
      values.push(id_pedido, r.id_producto, r.cantidad, Number(r.precio_unit));
      return `($${o + 1}, $${o + 2}, $${o + 3}, $${o + 4})`;
    }).join(',');

    await client.query(
      `INSERT INTO pedido_items (id_pedido, id_producto, cantidad, precio_unit) VALUES ${tuples};`,
      values
    );

    // 5) (opcional) actualizar stock
    // await client.query(`UPDATE productos p
    //   SET cantidad = cantidad - ci.cantidad
    //   FROM carrito_items ci
    //   WHERE ci.id_carrito=$1 AND ci.id_producto=p.id_producto;`, [id_carrito]);

    // 6) limpiar carrito
    await client.query('DELETE FROM carrito_items WHERE id_carrito=$1;', [id_carrito]);

    // total se recalcula por tu trigger; si lo quieres leer:
    const totalRes = await client.query<{ total: string }>('SELECT total::text FROM pedidos WHERE id_pedido=$1;', [id_pedido]);

    await client.query('COMMIT');

    return new Response(JSON.stringify({ ok: true, id_pedido, total: totalRes.rows[0].total }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    await client.query('ROLLBACK');
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: e?.message }), { status: 500 });
  } finally {
    client.release();
  }
};
