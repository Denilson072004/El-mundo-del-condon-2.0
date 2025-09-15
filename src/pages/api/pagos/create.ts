import type { APIRoute } from 'astro';
import { query } from '../../../lib/server/db';

export const POST: APIRoute = async ({ request }) => {
  const { id_pedido, id_metodo, monto } = await request.json();
  if (!id_pedido || !id_metodo || !monto) {
    return new Response(JSON.stringify({ error: 'id_pedido, id_metodo y monto requeridos' }), { status: 400 });
  }
  try {
    const { rows } = await query<{ id_pago: number }>(
      `INSERT INTO pagos (id_pedido, id_metodo, monto, estado_pago)
       VALUES ($1,$2,$3,'pagado') RETURNING id_pago;`,
      [id_pedido, id_metodo, monto]
    );
    return new Response(JSON.stringify({ ok: true, id_pago: rows[0].id_pago }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message }), { status: 500 });
  }
};
