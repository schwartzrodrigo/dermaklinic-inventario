import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const usuarios = await db.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        cargo: true,
        avatarColor: true,
      },
      orderBy: { nombre: 'asc' },
    });

    return NextResponse.json({ success: true, usuarios });
  } catch (error: any) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({ success: false, error: 'Error al consultar usuarios', details: error?.message || String(error) }, { status: 500 });
  }
}
