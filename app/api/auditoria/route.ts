import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Obtener la última auditoría o todas
    const auditorias = await db.auditoriaMensual.findMany({
      include: {
        detalles: {
          include: { producto: true },
        },
      },
      orderBy: { fecha: 'desc' },
    });

    const productosActuales = await db.producto.findMany({
      orderBy: { nombre: 'asc' },
    });

    return NextResponse.json({ success: true, auditorias, productosActuales });
  } catch (error) {
    console.error('Error al obtener auditorías:', error);
    return NextResponse.json(
      { success: false, error: 'Error al consultar auditorías de inventario' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mesAno, observaciones, conteos, aplicarAjustes } = body;
    // conteos es un array de { productoId, stockFisico, justificacion }

    if (!mesAno || !conteos || !Array.isArray(conteos)) {
      return NextResponse.json(
        { success: false, error: 'El mes/año y los conteos físicos son obligatorios' },
        { status: 400 }
      );
    }

    // Crear registro de auditoría mensual
    const auditoria = await db.auditoriaMensual.create({
      data: {
        mesAno,
        estado: aplicarAjustes ? 'FINALIZADA' : 'BORRADOR',
        observaciones,
        fecha: new Date(),
      },
    });

    const detallesProcesados = [];

    for (const item of conteos) {
      const prod = await db.producto.findUnique({ where: { id: item.productoId } });
      if (prod) {
        const stockSistema = prod.stockActual;
        const stockFisico = Number(item.stockFisico);
        const diferencia = stockFisico - stockSistema;
        const valorDiferencia = diferencia * prod.precioActual;

        const detalle = await db.detalleAuditoria.create({
          data: {
            auditoriaId: auditoria.id,
            productoId: prod.id,
            stockSistema,
            stockFisico,
            diferencia,
            valorDiferencia,
            justificacion: item.justificacion || null,
          },
        });
        detallesProcesados.push(detalle);

        // Si el usuario confirma la auditoría y solicita aplicar ajustes automáticos en el stock:
        if (aplicarAjustes && diferencia !== 0) {
          // Actualizar stock del producto al físico real
          await db.producto.update({
            where: { id: prod.id },
            data: { stockActual: stockFisico },
          });

          // Registrar movimiento de ajuste en bitácora
          await db.movimientoInventario.create({
            data: {
              productoId: prod.id,
              tipoMovimiento: 'AJUSTE_AUDITORIA',
              motivo: diferencia > 0 ? 'AJUSTE_POSITIVO' : 'AJUSTE_NEGATIVO',
              cantidad: Math.abs(diferencia),
              costoUnitario: prod.precioActual,
              fechaHora: new Date(),
              usuario: 'Auditoría Mensual',
              notas: `Cierre Auditoría ${mesAno}. ${item.justificacion || 'Sin justificación'}`,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      auditoriaId: auditoria.id,
      detallesCount: detallesProcesados.length,
    });
  } catch (error) {
    console.error('Error al guardar auditoría:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar la auditoría mensual' },
      { status: 500 }
    );
  }
}
