import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const grupo = searchParams.get('grupo');
    const query = searchParams.get('q');

    const where: any = {};
    if (categoria && categoria !== 'TODAS') {
      where.categoria = categoria;
    }
    if (grupo && grupo !== 'TODOS') {
      where.grupo = grupo;
    }
    if (query) {
      where.OR = [
        { nombre: { contains: query } },
        { sku: { contains: query } },
        { marca: { contains: query } },
      ];
    }

    const productos = await db.producto.findMany({
      where,
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
    console.error('Error al consultar productos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al consultar productos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sku, nombre, marca, categoria, grupo, unidad, stockMinimo, precioActual } = body;

    if (!sku || !nombre || !categoria || !grupo || !unidad) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    const existeSKU = await db.producto.findUnique({ where: { sku } });
    if (existeSKU) {
      return NextResponse.json(
        { success: false, error: `El SKU "${sku}" ya está registrado` },
        { status: 400 }
      );
    }

    const producto = await db.producto.create({
      data: {
        sku,
        nombre,
        marca: marca || null,
        categoria,
        grupo,
        unidad,
        stockMinimo: Number(stockMinimo) || 5,
        precioActual: Number(precioActual) || 0,
      },
    });

    return NextResponse.json({ success: true, producto });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar el producto' },
      { status: 500 }
    );
  }
}
