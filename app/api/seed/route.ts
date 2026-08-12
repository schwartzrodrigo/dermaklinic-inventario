import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { executeSeed } from '@/lib/seedData';

export async function GET() {
  try {
    await executeSeed(db);
    return NextResponse.json({
      success: true,
      message: 'Base de datos e inventario reiniciados a CERO exitosamente con los 176 productos oficiales DermaKlinic.',
    });
  } catch (error: any) {
    console.error('Error al reiniciar inventario:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Error al reiniciar inventario' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
