import type { APIRoute } from 'astro';
import { query } from '../../../lib/server/db';

export const POST: APIRoute = async ({ request }) => {
  const { correo, contrasena } = await request.json();
  if (!correo || !contrasena)
    return new Response(JSON.stringify({ error: 'correo y contrasena requeridos' }), { status: 400 });

  try {
    const { rows } = await query(
      'SELECT id_usuario, correo, contrasena FROM usuarios WHERE correo = $1 LIMIT 1;',
      [correo]
    );
    if (!rows.length || rows[0].contrasena !== contrasena)
      return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), { status: 401 });

    return new Response(JSON.stringify({ id_usuario: rows[0].id_usuario, correo: rows[0].correo }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error en login' }), { status: 500 });
  }
};
