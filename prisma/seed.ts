import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || '';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const realProducts = [
  {
    "sku": "DK-INS-001",
    "nombre": "Aceite desmaquillante",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 13990
  },
  {
    "sku": "DK-INS-002",
    "nombre": "Agua Inyectables 10cc",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 386
  },
  {
    "sku": "DK-INS-003",
    "nombre": "Agua Micelar",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-004",
    "nombre": "Agua Termal",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-005",
    "nombre": "agua termal 50cc",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 4990
  },
  {
    "sku": "DK-INS-006",
    "nombre": "Aguja 18G",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-007",
    "nombre": "Aguja 21G",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 20,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-008",
    "nombre": "Aguja 30G",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 20,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-009",
    "nombre": "Aguja 32G 13mm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 20,
    "stockActual": 0,
    "precioActual": 7848
  },
  {
    "sku": "DK-INS-010",
    "nombre": "Aguja 32G 4mm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-011",
    "nombre": "alcohol + gliserina",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 2433
  },
  {
    "sku": "DK-INS-012",
    "nombre": "Alcohol Gel",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ASEO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 5240
  },
  {
    "sku": "DK-INS-013",
    "nombre": "Alcohol Pad (caja)",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 517
  },
  {
    "sku": "DK-INS-014",
    "nombre": "Alginato de calcio",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-015",
    "nombre": "Aluminio Cloruro",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 27
  },
  {
    "sku": "DK-INS-016",
    "nombre": "AnteAGE MD Travel",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 59990
  },
  {
    "sku": "DK-INS-017",
    "nombre": "Apsito espuma hidroflica",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 2000
  },
  {
    "sku": "DK-INS-018",
    "nombre": "Aquaphore",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-019",
    "nombre": "Atropina 1mg/1ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-020",
    "nombre": "Babero dental (pqte)",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESCRITORIO",
    "grupo": "NO_ESTERIL",
    "unidad": "PAQUETE",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 1735
  },
  {
    "sku": "DK-INS-021",
    "nombre": "Baja lengua c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 30,
    "stockActual": 0,
    "precioActual": 42
  },
  {
    "sku": "DK-INS-022",
    "nombre": "Bandeja alusa c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 702
  },
  {
    "sku": "DK-INS-023",
    "nombre": "Bariederm Cica 50spf",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 17000
  },
  {
    "sku": "DK-INS-024",
    "nombre": "Bata Paciente no est c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 605
  },
  {
    "sku": "DK-INS-025",
    "nombre": "Betametasona pomo",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "TUBO",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-026",
    "nombre": "Biosyn 4-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 8,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-027",
    "nombre": "Biosyn 5-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 8,
    "stockActual": 0,
    "precioActual": 6625
  },
  {
    "sku": "DK-INS-028",
    "nombre": "Bistur PARAGON #11 caja",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 10676
  },
  {
    "sku": "DK-INS-029",
    "nombre": "Bistur PARAGON #15 caja",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 6636
  },
  {
    "sku": "DK-INS-030",
    "nombre": "bolsa impermeable brazo/pierna",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 16000
  },
  {
    "sku": "DK-INS-031",
    "nombre": "Botox 100UI",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 4,
    "stockActual": 0,
    "precioActual": 600000
  },
  {
    "sku": "DK-INS-032",
    "nombre": "Campo clinico c/F 80*80",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 15,
    "stockActual": 0,
    "precioActual": 990
  },
  {
    "sku": "DK-INS-033",
    "nombre": "Campo clinico S/F 90*90",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 15,
    "stockActual": 0,
    "precioActual": 990
  },
  {
    "sku": "DK-INS-034",
    "nombre": "Cantacur PS",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 27
  },
  {
    "sku": "DK-INS-035",
    "nombre": "Canula 22*50 c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 126
  },
  {
    "sku": "DK-INS-036",
    "nombre": "Canula 23*50",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 116
  },
  {
    "sku": "DK-INS-037",
    "nombre": "Canula 25*50",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 999
  },
  {
    "sku": "DK-INS-038",
    "nombre": "Carbocaina s/vaso",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 168
  },
  {
    "sku": "DK-INS-039",
    "nombre": "Cartucho Dr. Pen A6",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 1423
  },
  {
    "sku": "DK-INS-040",
    "nombre": "Cavilon",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 20000
  },
  {
    "sku": "DK-INS-041",
    "nombre": "Cetaphil Crema Dia",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 15
  },
  {
    "sku": "DK-INS-042",
    "nombre": "Cintillo desechable c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 25,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-043",
    "nombre": "Clorhexidina acuosa 125ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 5330
  },
  {
    "sku": "DK-INS-044",
    "nombre": "Clorhexidina acuosa 50ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 3,
    "stockActual": 0,
    "precioActual": 997
  },
  {
    "sku": "DK-INS-045",
    "nombre": "Clorhexidina jabonosa 2% 340cc",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ASEO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 5912
  },
  {
    "sku": "DK-INS-046",
    "nombre": "clorhexidina jabonosa 50ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ASEO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 3000
  },
  {
    "sku": "DK-INS-047",
    "nombre": "Coban",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 3265
  },
  {
    "sku": "DK-INS-048",
    "nombre": "Cofia (pqte)",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "PAQUETE",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 16558
  },
  {
    "sku": "DK-INS-049",
    "nombre": "Colgeno 10*10",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 3360
  },
  {
    "sku": "DK-INS-050",
    "nombre": "Compresa Gasa",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 15,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-051",
    "nombre": "Cotonitos pqte",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "PAQUETE",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-052",
    "nombre": "Cubre Calzado par",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 305
  },
  {
    "sku": "DK-INS-053",
    "nombre": "Cureta desechable 4.0mm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 4,
    "stockActual": 0,
    "precioActual": 2
  },
  {
    "sku": "DK-INS-054",
    "nombre": "Cureta desechable3.0mm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 4,
    "stockActual": 0,
    "precioActual": 2
  },
  {
    "sku": "DK-INS-055",
    "nombre": "Dacam",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-056",
    "nombre": "Defyne",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-057",
    "nombre": "Dieco Gel",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-058",
    "nombre": "Duta ox",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 36667
  },
  {
    "sku": "DK-INS-059",
    "nombre": "Dysport 500UI",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 460000
  },
  {
    "sku": "DK-INS-060",
    "nombre": "Elastomul venda 8cm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-061",
    "nombre": "Epinefrina 1mg/ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 3,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-062",
    "nombre": "Exosoma Cara Exocobio",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 127
  },
  {
    "sku": "DK-INS-063",
    "nombre": "Exosoma pelo Exocobio",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 123899
  },
  {
    "sku": "DK-INS-064",
    "nombre": "Fixomul 10cm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 14990
  },
  {
    "sku": "DK-INS-065",
    "nombre": "Fixomull 5cm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 7990
  },
  {
    "sku": "DK-INS-066",
    "nombre": "Fluorouracil 5% Crema",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 38000
  },
  {
    "sku": "DK-INS-067",
    "nombre": "Fluorouracil 500mg7/ 10ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 30
  },
  {
    "sku": "DK-INS-068",
    "nombre": "Frasco orina",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "BOTELLA",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 244
  },
  {
    "sku": "DK-INS-069",
    "nombre": "Fundas electrobistur",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 30,
    "stockActual": 0,
    "precioActual": 849
  },
  {
    "sku": "DK-INS-070",
    "nombre": "Gasa esteril 5*5 caja",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 918
  },
  {
    "sku": "DK-INS-071",
    "nombre": "Gasa esteril 7.5*7.5 caja",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 146
  },
  {
    "sku": "DK-INS-072",
    "nombre": "Gasa Parafinada c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 6,
    "stockActual": 0,
    "precioActual": 121
  },
  {
    "sku": "DK-INS-073",
    "nombre": "gasa tubo 5*5 no esteril pqte",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "PAQUETE",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 5553
  },
  {
    "sku": "DK-INS-074",
    "nombre": "gel incoloro 250ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-075",
    "nombre": "Gel incoloro bidon",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 18490
  },
  {
    "sku": "DK-INS-076",
    "nombre": "gel soluble 250ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-077",
    "nombre": "Guante alto riesgo M",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-078",
    "nombre": "Guante ESTERIL 6.0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 338
  },
  {
    "sku": "DK-INS-079",
    "nombre": "Guante ESTERIL 6.5",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 15,
    "stockActual": 0,
    "precioActual": 17
  },
  {
    "sku": "DK-INS-080",
    "nombre": "Guante ESTERIL 7.0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 25,
    "stockActual": 0,
    "precioActual": 17
  },
  {
    "sku": "DK-INS-081",
    "nombre": "Guante ESTERIL 7.5",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 15,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-082",
    "nombre": "Guante Proced L",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 1127
  },
  {
    "sku": "DK-INS-083",
    "nombre": "Guante Proced M",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 190
  },
  {
    "sku": "DK-INS-084",
    "nombre": "Guante Proced S",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 656
  },
  {
    "sku": "DK-INS-085",
    "nombre": "Guante S/Ltex 6.5",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-086",
    "nombre": "Guante S/Ltex 7.0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-087",
    "nombre": "Guante S/Ltex 7.5",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-088",
    "nombre": "HarmonyCa (caja)",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 185
  },
  {
    "sku": "DK-INS-089",
    "nombre": "ISDIN Eryfotona Fluid spf100 50ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 26990
  },
  {
    "sku": "DK-INS-090",
    "nombre": "ISDIN Eryfotona NIGHT 50ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 26990
  },
  {
    "sku": "DK-INS-091",
    "nombre": "ISDIN FusionWater Magic MEDIUM spf50 50ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-092",
    "nombre": "ISDIN FusionWater Magic SPF50 50ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-093",
    "nombre": "ISDIN Magic Repair COLOR  50ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-094",
    "nombre": "Isdinceutics K-Ox Eyes 15G",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-095",
    "nombre": "Isdinceutics Retinal Intense Serum 50ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 50000
  },
  {
    "sku": "DK-INS-096",
    "nombre": "Jeringa 10cc",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 25,
    "stockActual": 0,
    "precioActual": 5
  },
  {
    "sku": "DK-INS-097",
    "nombre": "Jeringa 20cc",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-098",
    "nombre": "Jeringa 3cc",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 25,
    "stockActual": 0,
    "precioActual": 19
  },
  {
    "sku": "DK-INS-099",
    "nombre": "Jeringa 5cc",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 25,
    "stockActual": 0,
    "precioActual": 811
  },
  {
    "sku": "DK-INS-100",
    "nombre": "Jeringa INSULINA",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-101",
    "nombre": "JERINGA INSULINA 0.3ML",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 20,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-102",
    "nombre": "Jeringa TUBERCULINA",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 25,
    "stockActual": 0,
    "precioActual": 160
  },
  {
    "sku": "DK-INS-103",
    "nombre": "Kysse",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-104",
    "nombre": "Lapiz electrobistur",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESCRITORIO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 2
  },
  {
    "sku": "DK-INS-105",
    "nombre": "Lpiz maracador ESTERIL",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 1344
  },
  {
    "sku": "DK-INS-106",
    "nombre": "Lido + tetra ADULTO",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 4936
  },
  {
    "sku": "DK-INS-107",
    "nombre": "Lidocaina 2% + epinefrina 1:100.000",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 40,
    "stockActual": 0,
    "precioActual": 481
  },
  {
    "sku": "DK-INS-108",
    "nombre": "Lidocaina 2% 5cc",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 850
  },
  {
    "sku": "DK-INS-109",
    "nombre": "Liporase",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-110",
    "nombre": "Llave 3 pasos",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-111",
    "nombre": "Lyft",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-112",
    "nombre": "Mascarilla 3 pliegues caja",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 502
  },
  {
    "sku": "DK-INS-113",
    "nombre": "Maxon 3-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 20,
    "stockActual": 0,
    "precioActual": 1142
  },
  {
    "sku": "DK-INS-114",
    "nombre": "Maxon 4-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 20,
    "stockActual": 0,
    "precioActual": 2217
  },
  {
    "sku": "DK-INS-115",
    "nombre": "Maxon 6-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 15,
    "stockActual": 0,
    "precioActual": 1531
  },
  {
    "sku": "DK-INS-116",
    "nombre": "Micropore 5cm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 5000
  },
  {
    "sku": "DK-INS-117",
    "nombre": "Micropore Caf 1,25cm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 3,
    "stockActual": 0,
    "precioActual": 2400
  },
  {
    "sku": "DK-INS-118",
    "nombre": "Micropore Caf 2,5cm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 1490
  },
  {
    "sku": "DK-INS-119",
    "nombre": "Mupirocina pomo",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "TUBO",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 6800
  },
  {
    "sku": "DK-INS-120",
    "nombre": "Opticlude adulto",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-121",
    "nombre": "Paales desechables c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 6,
    "stockActual": 0,
    "precioActual": 400
  },
  {
    "sku": "DK-INS-122",
    "nombre": "Parche punto negro c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-123",
    "nombre": "PDS 4-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 8,
    "stockActual": 0,
    "precioActual": 1029
  },
  {
    "sku": "DK-INS-124",
    "nombre": "PDS 5 -0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 1301
  },
  {
    "sku": "DK-INS-125",
    "nombre": "Perspirex",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 1990
  },
  {
    "sku": "DK-INS-126",
    "nombre": "Petalos de limpieza pqte",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "PAQUETE",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-127",
    "nombre": "Pink Aging 5ml (CAJA)",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 90000
  },
  {
    "sku": "DK-INS-128",
    "nombre": "Placa pcte electo",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-129",
    "nombre": "Polysorb 3-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-130",
    "nombre": "Polysorb 4-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 15,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-131",
    "nombre": "Polysorb 5-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 15,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-132",
    "nombre": "Povidona 30ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 2833
  },
  {
    "sku": "DK-INS-133",
    "nombre": "Povidona 50 cc",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 3690
  },
  {
    "sku": "DK-INS-134",
    "nombre": "Povidona espumante 125ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 5000
  },
  {
    "sku": "DK-INS-135",
    "nombre": "Prepzyme",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 20000
  },
  {
    "sku": "DK-INS-136",
    "nombre": "Prestobarba ( incluido repuesto)",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-137",
    "nombre": "Profhilo",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-138",
    "nombre": "Prolene 5-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 509
  },
  {
    "sku": "DK-INS-139",
    "nombre": "PROLENE 6 / 0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 6,
    "stockActual": 0,
    "precioActual": 2780
  },
  {
    "sku": "DK-INS-140",
    "nombre": "Prontosan Gel",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 23000
  },
  {
    "sku": "DK-INS-141",
    "nombre": "Prontosan Spray",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-142",
    "nombre": "Punch 2.0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 4,
    "stockActual": 0,
    "precioActual": 1688
  },
  {
    "sku": "DK-INS-143",
    "nombre": "Punch 3.0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 4,
    "stockActual": 0,
    "precioActual": 2700
  },
  {
    "sku": "DK-INS-144",
    "nombre": "Punch 4.0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 1655
  },
  {
    "sku": "DK-INS-145",
    "nombre": "Punch 5.0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 1471
  },
  {
    "sku": "DK-INS-146",
    "nombre": "Punch 6.0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 3,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-147",
    "nombre": "Puntas electrobistur",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 66
  },
  {
    "sku": "DK-INS-148",
    "nombre": "Remove c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 5092
  },
  {
    "sku": "DK-INS-149",
    "nombre": "Sculptra",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 600000
  },
  {
    "sku": "DK-INS-150",
    "nombre": "Skinvive (caja)",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "NO_ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-151",
    "nombre": "Steri-Strip",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-152",
    "nombre": "Suero Fisiolgico 20cc",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 25,
    "stockActual": 0,
    "precioActual": 17800
  },
  {
    "sku": "DK-INS-153",
    "nombre": "Surgipro 3-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 20,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-154",
    "nombre": "Surgipro 4-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 20,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-155",
    "nombre": "Surgipro 5-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 20,
    "stockActual": 0,
    "precioActual": 2800
  },
  {
    "sku": "DK-INS-156",
    "nombre": "Surgipro 6-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 2000
  },
  {
    "sku": "DK-INS-157",
    "nombre": "Surgipro 7-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 3014
  },
  {
    "sku": "DK-INS-158",
    "nombre": "surgispon",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 198
  },
  {
    "sku": "DK-INS-159",
    "nombre": "Talco",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-160",
    "nombre": "Tapa roja (caja)",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 3000
  },
  {
    "sku": "DK-INS-161",
    "nombre": "Tega 10/5",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-162",
    "nombre": "tega punch",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 160
  },
  {
    "sku": "DK-INS-163",
    "nombre": "Tegaderm gde",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 53
  },
  {
    "sku": "DK-INS-164",
    "nombre": "Toalla desmaquillante pqte",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESCRITORIO",
    "grupo": "NO_ESTERIL",
    "unidad": "PAQUETE",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 1000
  },
  {
    "sku": "DK-INS-165",
    "nombre": "Transpore white",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-166",
    "nombre": "Triamcinolona 10mg/ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 45000
  },
  {
    "sku": "DK-INS-167",
    "nombre": "Triamcinolona 40mg/ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 45000
  },
  {
    "sku": "DK-INS-168",
    "nombre": "Tricloro acetico al 70%",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 6
  },
  {
    "sku": "DK-INS-169",
    "nombre": "Turtlepin 0,5 mm, 19pins",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 7500
  },
  {
    "sku": "DK-INS-170",
    "nombre": "Turtlepin 1.0mm, 32G",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-171",
    "nombre": "Vital",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 300000
  },
  {
    "sku": "DK-INS-172",
    "nombre": "Vital Light",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 300000
  },
  {
    "sku": "DK-INS-173",
    "nombre": "Volift (caja)",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-174",
    "nombre": "Voluma (caja)",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-175",
    "nombre": "Volux (caja)",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-176",
    "nombre": "Volyme",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  }
];
const realSuppliers = [
  {
    "nombre": "Ensus",
    "categoria": "insumos clínicos",
    "rut": "76.123.456-1",
    "contacto": "Ventas Ensus",
    "telefono": "+56 2 2211 3344",
    "email": "ventas@ensus.cl"
  },
  {
    "nombre": "Dimerc",
    "categoria": "insumos oficina, aseo",
    "rut": "96.543.210-K",
    "contacto": "Servicio Cliente Dimerc",
    "telefono": "+56 2 2790 0000",
    "email": "ventas@dimerc.cl"
  },
  {
    "nombre": "Maske",
    "categoria": "insumos clínicos",
    "rut": "77.890.123-4",
    "contacto": "Ejecutivo Maske",
    "telefono": "+56 2 2345 6789",
    "email": "contacto@maske.cl"
  },
  {
    "nombre": "Abbvie (Juvederm y allergan)",
    "categoria": "rellenos y botox",
    "rut": "76.999.888-5",
    "contacto": "Allergan Aesthetics Chile",
    "telefono": "+56 2 2580 9000",
    "email": "pedidos.chile@abbvie.com"
  },
  {
    "nombre": "Galderma",
    "categoria": "rellenos",
    "rut": "76.444.333-2",
    "contacto": "Ventas Galderma",
    "telefono": "+56 2 2876 5432",
    "email": "contacto@galderma.cl"
  },
  {
    "nombre": "Salcobrand",
    "categoria": "Recetario magistral",
    "rut": "96.876.543-9",
    "contacto": "Farmacia Magistral",
    "telefono": "+56 600 360 6000",
    "email": "magistral@salcobrand.cl"
  },
  {
    "nombre": "HEBE",
    "categoria": "Glowskin, rellenos, cánulas",
    "rut": "77.111.222-3",
    "contacto": "Representante HEBE",
    "telefono": "+56 9 7766 5544",
    "email": "ventas@hebe.cl"
  },
  {
    "nombre": "Medtronic",
    "categoria": "suturas",
    "rut": "76.333.222-1",
    "contacto": "Cirugía & Suturas Medtronic",
    "telefono": "+56 2 2585 3000",
    "email": "chile@medtronic.com"
  },
  {
    "nombre": "SIEM",
    "categoria": "esterilización",
    "rut": "76.777.888-9",
    "contacto": "Servicios SIEM",
    "telefono": "+56 2 2444 5555",
    "email": "contacto@siem.cl"
  },
  {
    "nombre": "esterilizalo.cl",
    "categoria": "esterilización autoclave",
    "rut": "77.333.444-8",
    "contacto": "Soporte Esterilízalo",
    "telefono": "+56 9 8877 6655",
    "email": "contacto@esterilizalo.cl"
  },
  {
    "nombre": "MedStyle neostrata",
    "categoria": "cosmetologia",
    "rut": "76.222.111-6",
    "contacto": "MedStyle Derma",
    "telefono": "+56 2 2333 4444",
    "email": "ventas@medstyle.cl"
  },
  {
    "nombre": "dental laval",
    "categoria": "anestesia",
    "rut": "76.555.666-7",
    "contacto": "Dental Laval Chile",
    "telefono": "+56 2 2666 7777",
    "email": "ventas@dentallaval.cl"
  },
  {
    "nombre": "Bioclin",
    "categoria": "incumos clinicos esteriles",
    "rut": "77.666.555-4",
    "contacto": "Línea Médica Bioclin",
    "telefono": "+56 2 2777 8888",
    "email": "contacto@bioclin.cl"
  },
  {
    "nombre": "DGmed",
    "categoria": "suturas",
    "rut": "76.888.999-0",
    "contacto": "Ventas DGmed",
    "telefono": "+56 2 2888 9999",
    "email": "contacto@dgmed.cl"
  },
  {
    "nombre": "Dermik",
    "categoria": "Paula cosmet",
    "rut": "76.111.999-2",
    "contacto": "Dermik Cosmetología",
    "telefono": "+56 2 2999 0000",
    "email": "ventas@dermik.cl"
  },
  {
    "nombre": "IMV",
    "categoria": "Punch medical (verde)",
    "rut": "77.999.000-1",
    "contacto": "IMV Medical",
    "telefono": "+56 2 2111 2222",
    "email": "contacto@imvmedical.cl"
  },
  {
    "nombre": "Klap",
    "categoria": "POS",
    "rut": "96.111.222-3",
    "contacto": "Soporte Klap POS",
    "telefono": "+56 600 400 2000",
    "email": "soporte@klap.cl"
  },
  {
    "nombre": "Mercado Pago",
    "categoria": "POS",
    "rut": "76.444.555-8",
    "contacto": "Mercado Pago Empresas",
    "telefono": "+56 600 300 4000",
    "email": "empresas@mercadopago.cl"
  },
  {
    "nombre": "zubimed",
    "categoria": "desechos",
    "rut": "77.222.333-5",
    "contacto": "Gestión Residuos Zubimed",
    "telefono": "+56 2 2444 6666",
    "email": "residuos@zubimed.cl"
  },
  {
    "nombre": "blue medical spa",
    "categoria": "placa retorno bipolar",
    "rut": "76.666.777-1",
    "contacto": "Blue Medical Spa Equipment",
    "telefono": "+56 2 2555 7777",
    "email": "contacto@bluemedicalspa.cl"
  },
  {
    "nombre": "suero fisiologico barato",
    "categoria": "Ahorromedical",
    "rut": "77.444.555-9",
    "contacto": "Ventas Ahorromedical",
    "telefono": "+56 9 6655 4433",
    "email": "ventas@ahorromedical.cl"
  },
  {
    "nombre": "Pronaturae",
    "categoria": "Glisodin",
    "rut": "76.333.444-2",
    "contacto": "Distribución Pronaturae",
    "telefono": "+56 2 2333 5555",
    "email": "contacto@pronaturae.cl"
  }
];

async function main() {
  console.log('Seeding official 176 DermaKlinic inventory items with ZERO stock & clean prices...');

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

  // 2. Usuarios del sistema
  const passAdmin = await bcrypt.hash('admin123', 10);
  const passParcial = await bcrypt.hash('clinica123', 10);

  await prisma.usuario.create({
    data: {
      nombre: 'Catalina Frías',
      email: 'catalina.f@dermaklinic.cl',
      password: passAdmin,
      rol: 'ADMINISTRADOR',
      cargo: 'Directora Médica',
      avatarColor: '#10b981',
    },
  });

  await prisma.usuario.create({
    data: {
      nombre: 'Rodrigo Schwartz',
      email: 'schwartz.rodrigo@gmail.com',
      password: passAdmin,
      rol: 'ADMINISTRADOR',
      cargo: 'Administrador General',
      avatarColor: '#0ea5e9',
    },
  });

  await prisma.usuario.create({
    data: {
      nombre: 'América Díaz',
      email: 'america.diaz@dermaklinic.cl',
      password: passParcial,
      rol: 'PERSONAL_CLINICO',
      cargo: 'Asistente de Inventario',
      avatarColor: '#8b5cf6',
    },
  });

  // 3. Proveedores Reales
  for (const s of realSuppliers) {
    await prisma.proveedor.create({
      data: s,
    });
  }

  // 4. Inserción masiva de 176 Insumos Reales
  for (const p of realProducts) {
    await prisma.producto.create({
      data: p,
    });
  }

  console.log('Base de datos cargada con exito con 176 productos');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
