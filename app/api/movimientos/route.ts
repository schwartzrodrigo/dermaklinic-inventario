import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const movimientos = await db.movimientoInventario.findMany({
      include: {
        producto: true,
        lote: true,
      },
      orderBy: { fechaHora: 'desc' },
    });

    return NextResponse.json({ success: true, movimientos });
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al consultar movimientos' },
      { status: 500 }
    );
  }
}
