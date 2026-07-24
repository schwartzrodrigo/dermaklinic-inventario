import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    const productos = await db.producto.findMany({
      include: {
        lotes: {
          include: {
            documentoCompra: {
              include: {
                proveedor: true,
              },
            },
          },
          orderBy: { fechaIngreso: 'desc' },
        },
      },
      orderBy: { nombre: 'asc' },
    });

    const todosProveedores = await db.proveedor.findMany({
      orderBy: { nombre: 'asc' },
    });

    const result = productos.map((p) => {
      const proveMap = new Map<string, any>();

      p.lotes.forEach((lote) => {
        const prov = lote.documentoCompra?.proveedor;
        if (prov) {
          if (!proveMap.has(prov.id)) {
            proveMap.set(prov.id, {
              id: prov.id,
              nombre: prov.nombre,
              categoria: prov.categoria,
              rut: prov.rut,
              telefono: prov.telefono,
              email: prov.email,
              contacto: prov.contacto,
              ultimoPrecioPagado: lote.costoUnitario || p.precioActual,
              totalComprado: lote.cantidadInicial || 0,
              ultimaFechaCompra: lote.fechaIngreso,
              numeroUltimoDoc: lote.documentoCompra?.numeroDoc || 'Sin doc',
            });
          } else {
            const existing = proveMap.get(prov.id);
            existing.totalComprado += lote.cantidadInicial || 0;
          }
        }
      });

      const proveedoresComprados = Array.from(proveMap.values());

      // Proveedores sugeridos segun rubro si no hay compras o para sugerir opciones adicionales
      const nLower = p.nombre.toLowerCase();
      const proveedoresSugeridos = todosProveedores.filter((prov) => {
        const provCat = (prov.categoria || '').toLowerCase();
        if (nLower.includes('botox') || nLower.includes('juvederm') || nLower.includes('hialuronico') || nLower.includes('relleno')) {
          return provCat.includes('relleno') || provCat.includes('botox') || prov.nombre.toLowerCase().includes('abbvie') || prov.nombre.toLowerCase().includes('galderma');
        }
        if (nLower.includes('sutura') || nLower.includes('biosyn') || nLower.includes('vicryl')) {
          return provCat.includes('sutura') || prov.nombre.toLowerCase().includes('medtronic') || prov.nombre.toLowerCase().includes('dgmed');
        }
        if (nLower.includes('glisodin') || nLower.includes('suplemento')) {
          return provCat.includes('glisodin') || prov.nombre.toLowerCase().includes('pronaturae');
        }
        if (nLower.includes('suero') || nLower.includes('fisiologico')) {
          return prov.nombre.toLowerCase().includes('ahorromedical') || provCat.includes('ahorromedical');
        }
        if (nLower.includes('esteril') || nLower.includes('autoclave')) {
          return provCat.includes('esteriliz');
        }
        return false;
      });

      return {
        id: p.id,
        sku: p.sku,
        nombre: p.nombre,
        categoria: p.categoria,
        grupo: p.grupo,
        unidad: p.unidad,
        stockActual: p.stockActual,
        precioActual: p.precioActual,
        proveedoresComprados,
        proveedoresSugeridos: proveedoresSugeridos.map((pr) => ({
          id: pr.id,
          nombre: pr.nombre,
          categoria: pr.categoria,
          rut: pr.rut,
          telefono: pr.telefono,
          email: pr.email,
        })),
      };
    });

    // Filtering if search query is provided
    const qLower = query.trim().toLowerCase();
    const filteredResult = qLower
      ? result.filter((item) => {
          const matchProduct =
            item.nombre.toLowerCase().includes(qLower) ||
            item.sku.toLowerCase().includes(qLower) ||
            item.categoria.toLowerCase().includes(qLower);

          const matchComprados = item.proveedoresComprados.some(
            (pr) =>
              pr.nombre.toLowerCase().includes(qLower) ||
              (pr.categoria || '').toLowerCase().includes(qLower)
          );

          const matchSugeridos = item.proveedoresSugeridos.some(
            (pr) =>
              pr.nombre.toLowerCase().includes(qLower) ||
              (pr.categoria || '').toLowerCase().includes(qLower)
          );

          return matchProduct || matchComprados || matchSugeridos;
        })
      : result;

    return NextResponse.json({
      success: true,
      count: filteredResult.length,
      insumosProveedores: filteredResult,
    });
  } catch (error) {
    console.error('Error en /api/insumos-proveedores:', error);
    return NextResponse.json(
      { success: false, error: 'Error al consultar historial insumo-proveedor' },
      { status: 500 }
    );
  }
}
