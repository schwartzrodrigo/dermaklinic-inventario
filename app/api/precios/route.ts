import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const alertas = await db.alertaPrecio.findMany({
      include: {
        producto: true,
        proveedor: true,
      },
      orderBy: { fechaDetectada: 'desc' },
    });

    const lotesHistorial = await db.loteProducto.findMany({
      include: {
        producto: true,
        documentoCompra: {
          include: { proveedor: true },
        },
      },
      orderBy: { fechaIngreso: 'asc' },
    });

    return NextResponse.json({ success: true, alertas, lotesHistorial });
  } catch (error) {
    console.error('Error al obtener alertas de precio:', error);
    return NextResponse.json(
      { success: false, error: 'Error al consultar historial de precios' },
      { status: 500 }
    );
  }
}
