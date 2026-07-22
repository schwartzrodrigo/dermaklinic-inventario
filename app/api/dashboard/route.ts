import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const totalProductos = await db.producto.count();

    const productos = await db.producto.findMany({
      include: { lotes: true },
    });

    let totalStockUnidades = 0;
    let valorizacionTotal = 0;
    productos.forEach((p) => {
      totalStockUnidades += p.stockActual;
      valorizacionTotal += p.stockActual * p.precioActual;
    });

    const ahora = new Date();
    const en60Dias = new Date();
    en60Dias.setDate(ahora.getDate() + 60);

    // Lotes por vencer (< 60 días) o vencidos
    const lotesCriticos = await db.loteProducto.findMany({
      where: {
        cantidadDisponible: { gt: 0 },
        fechaVencimiento: { lte: en60Dias },
      },
      include: {
        producto: true,
      },
      orderBy: {
        fechaVencimiento: 'asc',
      },
    });

    // Alertas de precio no resueltas
    const alertasPrecio = await db.alertaPrecio.findMany({
      take: 5,
      include: {
        producto: true,
        proveedor: true,
      },
      orderBy: {
        fechaDetectada: 'desc',
      },
    });

    // Movimientos recientes
    const movimientosRecientes = await db.movimientoInventario.findMany({
      take: 8,
      include: {
        producto: true,
      },
      orderBy: {
        fechaHora: 'desc',
      },
    });

    // Productos con stock bajo mínimo
    const productosStockBajo = productos.filter(
      (p) => p.stockActual <= p.stockMinimo
    );

    return NextResponse.json({
      success: true,
      summary: {
        totalProductos,
        totalStockUnidades,
        valorizacionTotal,
        lotesCriticosCount: lotesCriticos.length,
        alertasPrecioCount: alertasPrecio.length,
        stockBajoCount: productosStockBajo.length,
      },
      lotesCriticos,
      alertasPrecio,
      movimientosRecientes,
      productosStockBajo,
    });
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    return NextResponse.json(
      { success: false, error: 'Error al consultar el dashboard' },
      { status: 500 }
    );
  }
}
