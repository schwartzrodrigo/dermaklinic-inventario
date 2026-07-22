import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const lotes = await db.loteProducto.findMany({
      include: {
        producto: true,
        documentoCompra: {
          include: { proveedor: true },
        },
      },
      orderBy: {
        fechaVencimiento: 'asc',
      },
    });

    const ahora = new Date();

    const lotesProcesados = lotes.map((lote: any) => {
      let estadoVencimiento = 'VIGENTE';
      let diasParaVencer: number | null = null;

      if (lote.fechaVencimiento) {
        const diffMs = new Date(lote.fechaVencimiento).getTime() - ahora.getTime();
        diasParaVencer = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diasParaVencer <= 0) {
          estadoVencimiento = 'VENCIDO';
        } else if (diasParaVencer <= 30) {
          estadoVencimiento = 'CRITICO_30_DIAS';
        } else if (diasParaVencer <= 60) {
          estadoVencimiento = 'ADVERTENCIA_60_DIAS';
        }
      }

      return {
        ...lote,
        estadoVencimiento,
        diasParaVencer,
      };
    });

    return NextResponse.json({ success: true, lotes: lotesProcesados });
  } catch (error) {
    console.error('Error al obtener lotes de bodega:', error);
    return NextResponse.json(
      { success: false, error: 'Error al consultar lotes de bodega' },
      { status: 500 }
    );
  }
}
