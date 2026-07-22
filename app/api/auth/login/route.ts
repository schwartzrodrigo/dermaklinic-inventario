import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, usuarioId } = body;

    // Si se pasa usuarioId directamente (selector rápido)
    if (usuarioId) {
      const usuario = await db.usuario.findUnique({ where: { id: usuarioId } });
      if (!usuario) {
        return NextResponse.json({ success: false, error: 'Usuario no encontrado' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        user: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          cargo: usuario.cargo,
          avatarColor: usuario.avatarColor,
        },
      });
    }

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    const usuario = await db.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return NextResponse.json({ success: false, error: 'Credenciales inválidas' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return NextResponse.json({ success: false, error: 'Credenciales inválidas' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        cargo: usuario.cargo,
        avatarColor: usuario.avatarColor,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ success: false, error: 'Error al procesar el inicio de sesión' }, { status: 500 });
  }
}
