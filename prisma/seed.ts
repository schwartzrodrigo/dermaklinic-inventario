import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding DermaKlinic inventory system with specified users and audit logs...');

  // 1. Limpieza inicial
  await prisma.alertaPrecio.deleteMany();
  await prisma.detalleAuditoria.deleteMany();
  await prisma.auditoriaMensual.deleteMany();
  await prisma.movimientoInventario.deleteMany();
  await prisma.loteProducto.deleteMany();
  await prisma.documentoCompra.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.proveedor.deleteMany();
  await prisma.usuario.deleteMany();

  // 2. Crear los Usuarios Solicitados
  const passAdmin = await bcrypt.hash('admin123', 10);
  const passParcial = await bcrypt.hash('clinica123', 10);

  // Usuario Acceso Total 1: Catalina Frías
  const uCatalina = await prisma.usuario.create({
    data: {
      nombre: 'Catalina Frías',
      email: 'catalina.frias@dermaklinic.cl',
      password: passAdmin,
      rol: 'ADMINISTRADOR',
      cargo: 'Directora Médica (Acceso Total)',
      avatarColor: '#10b981',
    },
  });

  // Usuario Acceso Total 2: Rodrigo Schwartz
  const uRodrigo = await prisma.usuario.create({
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
  const uAmerica = await prisma.usuario.create({
    data: {
      nombre: 'América Díaz',
      email: 'america.diaz@dermaklinic.cl',
      password: passParcial,
      rol: 'PERSONAL_CLINICO',
      cargo: 'Asistente de Inventario (Acceso Parcial: Solo Ingresos y Salidas)',
      avatarColor: '#8b5cf6',
    },
  });

  console.log('Usuarios creados: Catalina Frías (Admin), Rodrigo Schwartz (Admin), América Díaz (Parcial)');

  // 3. Proveedores
  const provDermo = await prisma.proveedor.create({
    data: {
      rut: '76.849.201-9',
      nombre: 'Dermaceuticals Chile SpA',
      contacto: 'Mariana López',
      telefono: '+56 9 8765 4321',
      email: 'ventas@dermaceuticals.cl',
      direccion: 'Av. Vitacura 2900, Santiago',
    },
  });

  const provMed = await prisma.proveedor.create({
    data: {
      rut: '96.551.430-K',
      nombre: 'Distribuidora Médica San Andrés',
      contacto: 'Carlos Mendoza',
      telefono: '+56 9 5544 3322',
      email: 'pedidos@medicasanandres.cl',
      direccion: 'Av. Providencia 1450, Santiago',
    },
  });

  const provAseo = await prisma.proveedor.create({
    data: {
      rut: '77.102.390-5',
      nombre: 'Suministros & Aseo Industrial Central',
      contacto: 'Rodrigo Fuentes',
      telefono: '+56 2 2233 4455',
      email: 'contacto@aseocentral.cl',
      direccion: 'San Diego 890, Santiago',
    },
  });

  // 4. Productos
  const p1 = await prisma.producto.create({
    data: {
      sku: 'MED-001',
      nombre: 'Guantes de Nitrilo Quirúrgico (Caja 100u)',
      marca: 'MedGlove',
      categoria: 'INSUMO_MEDICO',
      grupo: 'ESTERIL',
      unidad: 'CAJA',
      stockMinimo: 10,
      stockActual: 18,
      precioActual: 12500,
    },
  });

  const p2 = await prisma.producto.create({
    data: {
      sku: 'MED-002',
      nombre: 'Jeringas 3ml con Aguja 21G (Caja 100u)',
      marca: 'BD Plastipak',
      categoria: 'INSUMO_MEDICO',
      grupo: 'ESTERIL',
      unidad: 'CAJA',
      stockMinimo: 8,
      stockActual: 12,
      precioActual: 18900,
    },
  });

  const p3 = await prisma.producto.create({
    data: {
      sku: 'EST-001',
      nombre: 'Ácido Hialurónico Juvederm Ultra 3 (1ml)',
      marca: 'Allergan Aesthetics',
      categoria: 'INSUMO_ESTETICO',
      grupo: 'ESTERIL',
      unidad: 'UNIDAD',
      stockMinimo: 5,
      stockActual: 9,
      precioActual: 145000,
    },
  });

  const p4 = await prisma.producto.create({
    data: {
      sku: 'EST-002',
      nombre: 'Toxina Botulínica Botox (100 UI)',
      marca: 'Allergan Aesthetics',
      categoria: 'INSUMO_ESTETICO',
      grupo: 'ESTERIL',
      unidad: 'UNIDAD',
      stockMinimo: 4,
      stockActual: 6,
      precioActual: 215000,
    },
  });

  const p5 = await prisma.producto.create({
    data: {
      sku: 'EST-003',
      nombre: 'Cánulas Estéticas 25G x 50mm (Caja 20u)',
      marca: 'SoftFil',
      categoria: 'INSUMO_ESTETICO',
      grupo: 'ESTERIL',
      unidad: 'CAJA',
      stockMinimo: 5,
      stockActual: 7,
      precioActual: 38000,
    },
  });

  const p6 = await prisma.producto.create({
    data: {
      sku: 'ESC-001',
      nombre: 'Papel Camilla Clínico 50cm x 100m (Rollo)',
      marca: 'SanitaryPaper',
      categoria: 'INSUMO_ESCRITORIO',
      grupo: 'NO_ESTERIL',
      unidad: 'UNIDAD',
      stockMinimo: 10,
      stockActual: 14,
      precioActual: 6900,
    },
  });

  const p7 = await prisma.producto.create({
    data: {
      sku: 'ASE-001',
      nombre: 'Amomium Cuaternario Desinfectante Grado Clínico 5L',
      marca: 'Clinell Professional',
      categoria: 'INSUMO_ASEO',
      grupo: 'NO_ESTERIL',
      unidad: 'BOTELLA',
      stockMinimo: 3,
      stockActual: 5,
      precioActual: 15400,
    },
  });

  // 5. Documentos de Compra & Lotes registrados por usuario específico (Rodrigo Schwartz y América Díaz)
  const doc1 = await prisma.documentoCompra.create({
    data: {
      tipo: 'FACTURA',
      numeroDoc: 'F-8821',
      proveedorId: provDermo.id,
      usuarioId: uRodrigo.id,
      usuarioNombre: uRodrigo.nombre,
      fechaEmision: new Date('2026-05-10'),
      fechaRecepcion: new Date('2026-05-12T10:30:00Z'),
      observaciones: 'Compra mensual insumos de dermoestética',
      totalDoc: 1450000,
    },
  });

  const doc2 = await prisma.documentoCompra.create({
    data: {
      tipo: 'FACTURA',
      numeroDoc: 'F-9410',
      proveedorId: provDermo.id,
      usuarioId: uAmerica.id,
      usuarioNombre: uAmerica.nombre,
      fechaEmision: new Date('2026-06-20'),
      fechaRecepcion: new Date('2026-06-22T14:15:00Z'),
      observaciones: 'Ingresada por América Díaz (Reabastecimiento con ajuste de tarifa)',
      totalDoc: 2150000,
    },
  });

  // Lotes
  const lote1 = await prisma.loteProducto.create({
    data: {
      productoId: p3.id,
      documentoCompraId: doc1.id,
      numeroLote: 'LOT-JUV-2026A',
      fechaVencimiento: new Date('2026-08-15'),
      cantidadInicial: 10,
      cantidadDisponible: 3,
      costoUnitario: 132000,
      fechaIngreso: new Date('2026-05-12T10:30:00Z'),
    },
  });

  const lote2 = await prisma.loteProducto.create({
    data: {
      productoId: p3.id,
      documentoCompraId: doc2.id,
      numeroLote: 'LOT-JUV-2026B',
      fechaVencimiento: new Date('2027-04-30'),
      cantidadInicial: 6,
      cantidadDisponible: 6,
      costoUnitario: 145000,
      fechaIngreso: new Date('2026-06-22T14:15:00Z'),
    },
  });

  const loteBotox = await prisma.loteProducto.create({
    data: {
      productoId: p4.id,
      documentoCompraId: doc2.id,
      numeroLote: 'BTX-8849-CL',
      fechaVencimiento: new Date('2027-01-20'),
      cantidadInicial: 10,
      cantidadDisponible: 6,
      costoUnitario: 215000,
      fechaIngreso: new Date('2026-06-22T14:15:00Z'),
    },
  });

  const loteGuantes = await prisma.loteProducto.create({
    data: {
      productoId: p1.id,
      documentoCompraId: doc1.id,
      numeroLote: 'GUA-2026-09',
      fechaVencimiento: new Date('2028-11-30'),
      cantidadInicial: 25,
      cantidadDisponible: 18,
      costoUnitario: 12500,
      fechaIngreso: new Date('2026-05-12T10:30:00Z'),
    },
  });

  // 6. Alertas de precio
  await prisma.alertaPrecio.create({
    data: {
      productoId: p3.id,
      proveedorId: provDermo.id,
      precioAnterior: 132000,
      precioNuevo: 145000,
      porcentajeVariacion: 9.85,
      fechaDetectada: new Date('2026-06-22T14:15:00Z'),
    },
  });

  // 7. Movimientos con autor explícito en la Bitácora (Audit Log)
  await prisma.movimientoInventario.createMany({
    data: [
      {
        productoId: p3.id,
        loteId: lote1.id,
        usuarioId: uRodrigo.id,
        tipoMovimiento: 'INGRESO',
        motivo: 'COMPRA',
        cantidad: 10,
        costoUnitario: 132000,
        fechaHora: new Date('2026-05-12T10:30:00Z'),
        usuario: uRodrigo.nombre,
        notas: 'Factura F-8821 ingresada a bodega',
      },
      {
        productoId: p3.id,
        loteId: lote1.id,
        usuarioId: uCatalina.id,
        tipoMovimiento: 'EGRESO',
        motivo: 'USO_CLINICO',
        cantidad: 4,
        costoUnitario: 132000,
        fechaHora: new Date('2026-07-10T16:45:00Z'),
        usuario: uCatalina.nombre,
        notas: 'Procedimiento Relleno Labial Paciente #4029',
      },
      {
        productoId: p3.id,
        loteId: lote1.id,
        usuarioId: uAmerica.id,
        tipoMovimiento: 'EGRESO',
        motivo: 'USO_CLINICO',
        cantidad: 3,
        costoUnitario: 132000,
        fechaHora: new Date('2026-07-18T11:20:00Z'),
        usuario: uAmerica.nombre,
        notas: 'Egreso registrado por América Díaz (Armonización Facial)',
      },
      {
        productoId: p4.id,
        loteId: loteBotox.id,
        usuarioId: uAmerica.id,
        tipoMovimiento: 'EGRESO',
        motivo: 'USO_CLINICO',
        cantidad: 4,
        costoUnitario: 215000,
        fechaHora: new Date('2026-07-21T18:00:00Z'),
        usuario: uAmerica.nombre,
        notas: 'Egreso registrado por América Díaz (Botox 4 Pacientes)',
      },
    ],
  });

  // 8. Auditoría Mensual realizada por Catalina Frías
  const auditoriaJulio = await prisma.auditoriaMensual.create({
    data: {
      fecha: new Date('2026-07-01'),
      mesAno: '2026-07',
      estado: 'FINALIZADA',
      auditorNombre: uCatalina.nombre,
      observaciones: 'Auditoria mensual periódica revisada y aprobada por Catalina Frías.',
    },
  });

  await prisma.detalleAuditoria.createMany({
    data: [
      {
        auditoriaId: auditoriaJulio.id,
        productoId: p4.id,
        stockSistema: 7,
        stockFisico: 6,
        diferencia: -1,
        valorDiferencia: -215000,
        justificacion: 'Falta 1 unidad sin registro de egreso clínico (Investigación pendiente)',
      },
      {
        auditoriaId: auditoriaJulio.id,
        productoId: p1.id,
        stockSistema: 16,
        stockFisico: 18,
        diferencia: 2,
        valorDiferencia: 25000,
        justificacion: 'Cajas no contabilizadas en guía previa',
      },
    ],
  });

  console.log('Base de datos inicializada con éxito');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
