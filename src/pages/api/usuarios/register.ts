import type { APIRoute } from 'astro';
import { query } from '../../../lib/server/db';

export const POST: APIRoute = async ({ request }) => {
  const { correo, contrasena } = await request.json();
  if (!correo || !contrasena)
    return new Response(JSON.stringify({ error: 'correo y contrasena requeridos' }), { status: 400 });

  try {
    const sql = `INSERT INTO usuarios (correo, contrasena)
                 VALUES ($1,$2) RETURNING id_usuario, correo, creado_en;`;
    const { rows } = await query(sql, [correo, contrasena]);
    return new Response(JSON.stringify(rows[0]), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    if (String(e?.message).includes('duplicate key'))
      return new Response(JSON.stringify({ error: 'Correo ya registrado' }), { status: 409 });
    return new Response(JSON.stringify({ error: 'Error en registro' }), { status: 500 });
  }
};
