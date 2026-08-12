import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { executeSeed } from '../lib/seedData';

const connectionString = process.env.DATABASE_URL || '';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Reiniciando catálogo e inventario a CERO con los 176 productos oficiales DermaKlinic...');
  await executeSeed(prisma);
  console.log('Base de datos cargada con éxito con 176 productos y 0 stock.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
