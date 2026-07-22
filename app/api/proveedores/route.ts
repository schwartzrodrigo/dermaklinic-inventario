import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const where: any = {};
    if (query) {
      where.OR = [
        { nombre: { contains: query } },
        { rut: { contains: query } },
        { contacto: { contains: query } },
        { email: { contains: query } },
      ];
    }

    const proveedores = await db.proveedor.findMany({
      where,
      include: {
        documentos: true,
      },
      orderBy: { nombre: 'asc' },
    });

    return NextResponse.json({ success: true, proveedores });
  } catch (error) {
    console.error('Error al consultar proveedores:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener proveedores' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rut, nombre, contacto, telefono, email, direccion } = body;

    if (!nombre) {
      return NextResponse.json(
        { success: false, error: 'El nombre del proveedor es obligatorio' },
        { status: 400 }
      );
    }

    if (rut) {
      const existeRut = await db.proveedor.findUnique({ where: { rut } });
      if (existeRut) {
        return NextResponse.json(
          { success: false, error: `El RUT "${rut}" ya está registrado` },
          { status: 400 }
        );
      }
    }

    const proveedor = await db.proveedor.create({
      data: {
        rut: rut || null,
        nombre,
        contacto: contacto || null,
        telefono: telefono || null,
        email: email || null,
        direccion: direccion || null,
      },
    });

    return NextResponse.json({ success: true, proveedor });
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    return NextResponse.json(
      { success: false, error: 'Error al registrar el proveedor' },
      { status: 500 }
    );
  }
}
