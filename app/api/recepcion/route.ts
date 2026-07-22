import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const proveedores = await db.proveedor.findMany({ orderBy: { nombre: 'asc' } });
    const productos = await db.producto.findMany({ orderBy: { nombre: 'asc' } });
    const documentos = await db.documentoCompra.findMany({
      include: {
        proveedor: true,
        lotes: {
          include: { producto: true },
        },
      },
      orderBy: { fechaRecepcion: 'desc' },
    });

    return NextResponse.json({ success: true, proveedores, productos, documentos });
  } catch (error) {
    console.error('Error al obtener datos de recepcion:', error);
    return NextResponse.json(
      { success: false, error: 'Error al consultar recepciones' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tipo,
      numeroDoc,
      proveedorId,
      fechaEmision,
      usuarioId,
      usuarioNombre,
      observaciones,
      items, // array de { productoId, numeroLote, fechaVencimiento, cantidad, costoUnitario }
    } = body;

    if (!tipo || !numeroDoc || !proveedorId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Faltan datos obligatorios del documento o de los productos' },
        { status: 400 }
      );
    }

    let totalDocumento = 0;
    items.forEach((item: any) => {
      totalDocumento += Number(item.cantidad) * Number(item.costoUnitario);
    });

    const nombreRegistrador = usuarioNombre || 'Personal DermaKlinic';

    // Crear Documento de Compra
    const doc = await db.documentoCompra.create({
      data: {
        tipo,
        numeroDoc,
        proveedorId,
        usuarioId: usuarioId || null,
        usuarioNombre: nombreRegistrador,
        fechaEmision: new Date(fechaEmision || Date.now()),
        fechaRecepcion: new Date(),
        observaciones,
        totalDoc: totalDocumento,
      },
    });

    const alertasGeneradas = [];

    // Procesar cada ítem del documento
    for (const item of items) {
      const cantidad = Number(item.cantidad);
      const costoUnitario = Number(item.costoUnitario);
      const productoId = item.productoId;

      // Obtener producto actual para revisar precio previo
      const prodActual = await db.producto.findUnique({ where: { id: productoId } });

      if (prodActual) {
        // Si el costo unitario aumentó respecto a compras anteriores, registrar AlertaPrecio
        if (prodActual.precioActual > 0 && costoUnitario > prodActual.precioActual) {
          const diferencia = costoUnitario - prodActual.precioActual;
          const pct = Number(((diferencia / prodActual.precioActual) * 100).toFixed(2));

          const alerta = await db.alertaPrecio.create({
            data: {
              productoId,
              proveedorId,
              precioAnterior: prodActual.precioActual,
              precioNuevo: costoUnitario,
              porcentajeVariacion: pct,
              fechaDetectada: new Date(),
            },
          });
          alertasGeneradas.push(alerta);
        }

        // Actualizar precioActual del producto al nuevo costo y sumar al stockActual
        await db.producto.update({
          where: { id: productoId },
          data: {
            precioActual: costoUnitario,
            stockActual: { increment: cantidad },
          },
        });

        // Crear el lote físico recibido
        const lote = await db.loteProducto.create({
          data: {
            productoId,
            documentoCompraId: doc.id,
            numeroLote: item.numeroLote || `LOT-${Date.now().toString().slice(-6)}`,
            fechaVencimiento: item.fechaVencimiento ? new Date(item.fechaVencimiento) : null,
            cantidadInicial: cantidad,
            cantidadDisponible: cantidad,
            costoUnitario: costoUnitario,
            fechaIngreso: new Date(),
          },
        });

        // Registrar movimiento de ingreso en la bitácora
        await db.movimientoInventario.create({
          data: {
            productoId,
            loteId: lote.id,
            usuarioId: usuarioId || null,
            tipoMovimiento: 'INGRESO',
            motivo: 'COMPRA',
            cantidad,
            costoUnitario,
            fechaHora: new Date(),
            usuario: nombreRegistrador,
            notas: `Doc ${tipo} N° ${numeroDoc}`,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      documentoId: doc.id,
      totalDocumento,
      alertasGeneradas,
    });
  } catch (error) {
    console.error('Error al registrar recepción:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar la recepción de productos' },
      { status: 500 }
    );
  }
}
