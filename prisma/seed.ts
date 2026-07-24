import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || '';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing fictional demo data and keeping only real user accounts...');

  // 1. Limpieza total de tablas de inventario y transacciones
  await prisma.alertaPrecio.deleteMany();
  await prisma.detalleAuditoria.deleteMany();
  await prisma.auditoriaMensual.deleteMany();
  await prisma.movimientoInventario.deleteMany();
  await prisma.loteProducto.deleteMany();
  await prisma.documentoCompra.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.proveedor.deleteMany();
  await prisma.usuario.deleteMany();

  // 2. Crear ÚNICAMENTE los 3 usuarios reales autorizados
  const passAdmin = await bcrypt.hash('admin123', 10);
  const passParcial = await bcrypt.hash('clinica123', 10);

  // Usuario Acceso Total 1: Catalina Frías
  await prisma.usuario.create({
    data: {
      nombre: 'Catalina Frías',
      email: 'catalina.f@dermaklinic.cl',
      password: passAdmin,
      rol: 'ADMINISTRADOR',
      cargo: 'Directora Médica (Acceso Total)',
      avatarColor: '#10b981',
    },
  });

  // Usuario Acceso Total 2: Rodrigo Schwartz
  await prisma.usuario.create({
    data: {
      nombre: 'Rodrigo Schwartz',
      email: 'schwartz.rodrigo@gmail.com',
      password: passAdmin,
      rol: 'ADMINISTRADOR',
      cargo: 'Administrador General (Acceso Total)',
      avatarColor: '#0ea5e9',
    },
  });

  // Usuario Acceso Parcial 3: América Díaz
  await prisma.usuario.create({
    data: {
      nombre: 'América Díaz',
      email: 'america.diaz@dermaklinic.cl',
      password: passParcial,
      rol: 'PERSONAL_CLINICO',
      cargo: 'Asistente de Inventario (Acceso Parcial)',
      avatarColor: '#8b5cf6',
    },
  });

  console.log('✅ Base de datos limpiada con éxito. Solo permanecen los 3 usuarios del sistema.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
