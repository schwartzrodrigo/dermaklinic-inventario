import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const productos = await db.producto.findMany({
      where: { stockActual: { gt: 0 } },
      include: {
        lotes: {
          where: { cantidadDisponible: { gt: 0 } },
          orderBy: { fechaVencimiento: 'asc' },
        },
      },
      orderBy: { nombre: 'asc' },
    });

    return NextResponse.json({ success: true, productos });
  } catch (error) {
    console.error('Error al obtener productos para egresos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al consultar productos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productoId,
      loteId,
      usuarioId,
      cantidad,
      motivo, // USO_CLINICO | CONSUMO_INTERNO | MERMA | VENCIMIENTO
      usuario,
      notas,
      fechaHora,
    } = body;

    const qty = Number(cantidad);

    if (!productoId || !qty || qty <= 0 || !motivo) {
      return NextResponse.json(
        { success: false, error: 'Producto, motivo y cantidad válida son obligatorios' },
        { status: 400 }
      );
    }

    const producto = await db.producto.findUnique({
      where: { id: productoId },
      include: {
        lotes: {
          where: { cantidadDisponible: { gt: 0 } },
          orderBy: { fechaVencimiento: 'asc' }, // FIFO: primero lo que vence antes
        },
      },
    });

    if (!producto) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    if (producto.stockActual < qty) {
      return NextResponse.json(
        {
          success: false,
          error: `Stock insuficiente. Stock actual: ${producto.stockActual}, intentas egresar: ${qty}`,
        },
        { status: 400 }
      );
    }

    let pendientePorDespachar = qty;
    let loteUsadoId = loteId;

    // Si se especificó un lote en particular:
    if (loteId && loteId !== 'AUTO_FIFO') {
      const loteEspecifico = await db.loteProducto.findUnique({ where: { id: loteId } });

      if (!loteEspecifico || loteEspecifico.cantidadDisponible < qty) {
        return NextResponse.json(
          {
            success: false,
            error: `El lote seleccionado no tiene suficiente stock disponible (${loteEspecifico?.cantidadDisponible || 0}).`,
          },
          { status: 400 }
        );
      }

      await db.loteProducto.update({
        where: { id: loteId },
        data: {
          cantidadDisponible: { decrement: qty },
        },
      });
    } else {
      // Despacho FIFO automático cruzando lotes disponibles en orden de vencimiento
      for (const lote of producto.lotes) {
        if (pendientePorDespachar <= 0) break;

        const aDespachar = Math.min(lote.cantidadDisponible, pendientePorDespachar);

        await db.loteProducto.update({
          where: { id: lote.id },
          data: {
            cantidadDisponible: { decrement: aDespachar },
          },
        });

        pendientePorDespachar -= aDespachar;
        if (!loteUsadoId) loteUsadoId = lote.id;
      }
    }

    // Descontar stock general del producto
    await db.producto.update({
      where: { id: productoId },
      data: {
        stockActual: { decrement: qty },
      },
    });

    // Registrar en la bitácora con timestamp exacto
    const timestamp = fechaHora ? new Date(fechaHora) : new Date();

    const movimiento = await db.movimientoInventario.create({
      data: {
        productoId,
        loteId: loteUsadoId || null,
        usuarioId: usuarioId || null,
        tipoMovimiento: 'EGRESO',
        motivo,
        cantidad: qty,
        costoUnitario: producto.precioActual,
        fechaHora: timestamp,
        usuario: usuario || 'Personal Clínico DermaKlinic',
        notas: notas || `Egreso registrado (${motivo})`,
      },
    });

    return NextResponse.json({
      success: true,
      movimientoId: movimiento.id,
      nuevoStockProducto: producto.stockActual - qty,
    });
  } catch (error) {
    console.error('Error al registrar egreso:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar el egreso de inventario' },
      { status: 500 }
    );
  }
}
