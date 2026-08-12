import bcrypt from 'bcryptjs';

export const realProducts = [
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
    "precioActual": 0
  },
  {
    "sku": "DK-INS-073",
    "nombre": "Geles ecograficos",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 4500
  },
  {
    "sku": "DK-INS-074",
    "nombre": "Geringa 20 cc c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 1785
  },
  {
    "sku": "DK-INS-075",
    "nombre": "Geringa luer lock 1cc",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 20,
    "stockActual": 0,
    "precioActual": 105
  },
  {
    "sku": "DK-INS-076",
    "nombre": "Geringa luer lock 10cc c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 1500
  },
  {
    "sku": "DK-INS-077",
    "nombre": "Geringa luer lock 3cc c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 20,
    "stockActual": 0,
    "precioActual": 178
  },
  {
    "sku": "DK-INS-078",
    "nombre": "Geringa luer slip 10cc c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 1390
  },
  {
    "sku": "DK-INS-079",
    "nombre": "Geringa luer slip 5cc c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 20,
    "stockActual": 0,
    "precioActual": 2420
  },
  {
    "sku": "DK-INS-080",
    "nombre": "Geringa tuberculina 1cc c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 20,
    "stockActual": 0,
    "precioActual": 128
  },
  {
    "sku": "DK-INS-081",
    "nombre": "Guantes Cirujano N6.5 par",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 450
  },
  {
    "sku": "DK-INS-082",
    "nombre": "Guantes Cirujano N7 par",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 450
  },
  {
    "sku": "DK-INS-083",
    "nombre": "Guantes Cirujano N7.5 par",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 450
  },
  {
    "sku": "DK-INS-084",
    "nombre": "Guantes Cirujano N8 par",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 450
  },
  {
    "sku": "DK-INS-085",
    "nombre": "Guantes Nitrilo L caja",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 3280
  },
  {
    "sku": "DK-INS-086",
    "nombre": "Guantes Nitrilo M caja",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 3280
  },
  {
    "sku": "DK-INS-087",
    "nombre": "Guantes Nitrilo S caja",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 3280
  },
  {
    "sku": "DK-INS-088",
    "nombre": "Hialuronidasa ampolla",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 18333
  },
  {
    "sku": "DK-INS-089",
    "nombre": "Hidrocoloide 10*10 c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 3,
    "stockActual": 0,
    "precioActual": 2000
  },
  {
    "sku": "DK-INS-090",
    "nombre": "Hidrogel tubo",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "TUBO",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 8000
  },
  {
    "sku": "DK-INS-091",
    "nombre": "Hilos lisos 29g 38mm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-092",
    "nombre": "Hilos lisos 30g 25mm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-093",
    "nombre": "Hilos lisos 30g 8mm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-094",
    "nombre": "Hilos espiculados",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-095",
    "nombre": "Hoja bistur #11 c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-096",
    "nombre": "Hoja bistur #15 c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-097",
    "nombre": "Infiltrador suero",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 1042
  },
  {
    "sku": "DK-INS-098",
    "nombre": "Jabon Neutro 1lt",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ASEO",
    "grupo": "NO_ESTERIL",
    "unidad": "BOTELLA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 3290
  },
  {
    "sku": "DK-INS-099",
    "nombre": "Jeringas de insulina c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 20,
    "stockActual": 0,
    "precioActual": 139
  },
  {
    "sku": "DK-INS-100",
    "nombre": "Juvederm Volbella",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 140000
  },
  {
    "sku": "DK-INS-101",
    "nombre": "Juvederm Volift",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 140000
  },
  {
    "sku": "DK-INS-102",
    "nombre": "Juvederm Voluma",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 140000
  },
  {
    "sku": "DK-INS-103",
    "nombre": "Juvederm Volux",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 150000
  },
  {
    "sku": "DK-INS-104",
    "nombre": "Kenacort 10mg/ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 18000
  },
  {
    "sku": "DK-INS-105",
    "nombre": "Kytel 100mg",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-106",
    "nombre": "Lidocaina 2% c/vaso c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 155
  },
  {
    "sku": "DK-INS-107",
    "nombre": "Lidocaina 2% s/vaso c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 155
  },
  {
    "sku": "DK-INS-108",
    "nombre": "Lidocaina crema 10% 500gr",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 45000
  },
  {
    "sku": "DK-INS-109",
    "nombre": "Lidocaina spray 10%",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 15990
  },
  {
    "sku": "DK-INS-110",
    "nombre": "Linterna examen medica",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 4990
  },
  {
    "sku": "DK-INS-111",
    "nombre": "Lentes de Proteccion laser paciente",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 15000
  },
  {
    "sku": "DK-INS-112",
    "nombre": "Malla tubular #3",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-113",
    "nombre": "Malla tubular #5",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-114",
    "nombre": "Mascara Quirurgica caja",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 1490
  },
  {
    "sku": "DK-INS-115",
    "nombre": "Mascarilla N95 c/u",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 500
  },
  {
    "sku": "DK-INS-116",
    "nombre": "Mepitel 7.5*10",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 4500
  },
  {
    "sku": "DK-INS-117",
    "nombre": "Mepilex Border 10*10",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 5500
  },
  {
    "sku": "DK-INS-118",
    "nombre": "Micropore 1 pulgada",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 1290
  },
  {
    "sku": "DK-INS-119",
    "nombre": "Micropore 1/2 pulgada",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 990
  },
  {
    "sku": "DK-INS-120",
    "nombre": "Minoxidil 5% locion",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "NO_ESTERIL",
    "unidad": "BOTELLA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 14990
  },
  {
    "sku": "DK-INS-121",
    "nombre": "Monocryl 4-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 8,
    "stockActual": 0,
    "precioActual": 4500
  },
  {
    "sku": "DK-INS-122",
    "nombre": "Monocryl 5-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 8,
    "stockActual": 0,
    "precioActual": 4500
  },
  {
    "sku": "DK-INS-123",
    "nombre": "Nylon 4-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 1800
  },
  {
    "sku": "DK-INS-124",
    "nombre": "Nylon 5-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 1800
  },
  {
    "sku": "DK-INS-125",
    "nombre": "Nylon 6-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 1800
  },
  {
    "sku": "DK-INS-126",
    "nombre": "Optive Gotas",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 16990
  },
  {
    "sku": "DK-INS-127",
    "nombre": "Papel Camilla rollo",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 3,
    "stockActual": 0,
    "precioActual": 4990
  },
  {
    "sku": "DK-INS-128",
    "nombre": "Paracetamol 500mg",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "CAJA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 1200
  },
  {
    "sku": "DK-INS-129",
    "nombre": "Parche curacion esteril 5*7",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 350
  },
  {
    "sku": "DK-INS-130",
    "nombre": "Pencil electrobisturi desechable",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 3500
  },
  {
    "sku": "DK-INS-131",
    "nombre": "Povidona Yodada 125ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 2990
  },
  {
    "sku": "DK-INS-132",
    "nombre": "Profhilo 2ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 120000
  },
  {
    "sku": "DK-INS-133",
    "nombre": "Punch Biopsia 2mm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 2500
  },
  {
    "sku": "DK-INS-134",
    "nombre": "Punch Biopsia 3mm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 2500
  },
  {
    "sku": "DK-INS-135",
    "nombre": "Punch Biopsia 4mm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 2500
  },
  {
    "sku": "DK-INS-136",
    "nombre": "Punch Biopsia 5mm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 2500
  },
  {
    "sku": "DK-INS-137",
    "nombre": "Radiesse 1.5ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 140000
  },
  {
    "sku": "DK-INS-138",
    "nombre": "Restylane Kysse",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 115000
  },
  {
    "sku": "DK-INS-139",
    "nombre": "Restylane Lyft",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 115000
  },
  {
    "sku": "DK-INS-140",
    "nombre": "Restylane Volyme",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 115000
  },
  {
    "sku": "DK-INS-141",
    "nombre": "Sabana Camilla desechable",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 890
  },
  {
    "sku": "DK-INS-142",
    "nombre": "Sculptra 1 vial",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 220000
  },
  {
    "sku": "DK-INS-143",
    "nombre": "Solucion Fisiologica 0.9% 100ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 1200
  },
  {
    "sku": "DK-INS-144",
    "nombre": "Solucion Fisiologica 0.9% 250ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 1500
  },
  {
    "sku": "DK-INS-145",
    "nombre": "Solucion Fisiologica 0.9% 500ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 1800
  },
  {
    "sku": "DK-INS-146",
    "nombre": "Steren 30g 4mm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 250
  },
  {
    "sku": "DK-INS-147",
    "nombre": "Steren 32g 4mm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 300
  },
  {
    "sku": "DK-INS-148",
    "nombre": "Steri Strip 1/2 pulgada",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 1500
  },
  {
    "sku": "DK-INS-149",
    "nombre": "Steri Strip 1/4 pulgada",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 1200
  },
  {
    "sku": "DK-INS-150",
    "nombre": "Tegaderm 10*12",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 2500
  },
  {
    "sku": "DK-INS-151",
    "nombre": "Tegaderm 6*7",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 1800
  },
  {
    "sku": "DK-INS-152",
    "nombre": "Termometro Infrarrojo",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 12990
  },
  {
    "sku": "DK-INS-153",
    "nombre": "Tijera Mayo Curva",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 8990
  },
  {
    "sku": "DK-INS-154",
    "nombre": "Tijera Mayo Recta",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 8990
  },
  {
    "sku": "DK-INS-155",
    "nombre": "Tiras de pH",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "PAQUETE",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 6990
  },
  {
    "sku": "DK-INS-156",
    "nombre": "Toallas Húmedas pqte",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ASEO",
    "grupo": "NO_ESTERIL",
    "unidad": "PAQUETE",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 1990
  },
  {
    "sku": "DK-INS-157",
    "nombre": "Toalla Papel Intercalada",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ASEO",
    "grupo": "NO_ESTERIL",
    "unidad": "PAQUETE",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 2490
  },
  {
    "sku": "DK-INS-158",
    "nombre": "Torulas de Algodón bolsa",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "PAQUETE",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 3490
  },
  {
    "sku": "DK-INS-159",
    "nombre": "Tubo de Examen EDTA",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 180
  },
  {
    "sku": "DK-INS-160",
    "nombre": "Tubo de Examen Tapa Roja",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 180
  },
  {
    "sku": "DK-INS-161",
    "nombre": "Tubo PRP con citrato",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 10,
    "stockActual": 0,
    "precioActual": 1500
  },
  {
    "sku": "DK-INS-162",
    "nombre": "Vaselina liquida 1lt",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "BOTELLA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 5990
  },
  {
    "sku": "DK-INS-163",
    "nombre": "Vaselina solida pomo",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "TUBO",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 2490
  },
  {
    "sku": "DK-INS-164",
    "nombre": "Venda Elastica 10cm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 1290
  },
  {
    "sku": "DK-INS-165",
    "nombre": "Venda Gasa 10cm",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 690
  },
  {
    "sku": "DK-INS-166",
    "nombre": "Vessel Loop",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 2990
  },
  {
    "sku": "DK-INS-167",
    "nombre": "Vicryl 4-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 8,
    "stockActual": 0,
    "precioActual": 3800
  },
  {
    "sku": "DK-INS-168",
    "nombre": "Vicryl 5-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 8,
    "stockActual": 0,
    "precioActual": 3800
  },
  {
    "sku": "DK-INS-169",
    "nombre": "Vicryl Rapide 4-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 4200
  },
  {
    "sku": "DK-INS-170",
    "nombre": "Vicryl Rapide 5-0",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 5,
    "stockActual": 0,
    "precioActual": 4200
  },
  {
    "sku": "DK-INS-171",
    "nombre": "Visudyne 15mg",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 0
  },
  {
    "sku": "DK-INS-172",
    "nombre": "Xeomin 100UI",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 135000
  },
  {
    "sku": "DK-INS-173",
    "nombre": "Xylocaina 2% jalea",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "TUBO",
    "stockMinimo": 2,
    "stockActual": 0,
    "precioActual": 3500
  },
  {
    "sku": "DK-INS-174",
    "nombre": "Yodopovidona Jabonosa 1lt",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ASEO",
    "grupo": "NO_ESTERIL",
    "unidad": "BOTELLA",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 6990
  },
  {
    "sku": "DK-INS-175",
    "nombre": "Zymed Gel 100g",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_MEDICO",
    "grupo": "NO_ESTERIL",
    "unidad": "TUBO",
    "stockMinimo": 1,
    "stockActual": 0,
    "precioActual": 4990
  },
  {
    "sku": "DK-INS-176",
    "nombre": "Zyplast 1ml",
    "marca": "DermaKlinic",
    "categoria": "INSUMO_ESTETICO",
    "grupo": "ESTERIL",
    "unidad": "UNIDAD",
    "stockMinimo": 0,
    "stockActual": 0,
    "precioActual": 0
  }
];

export const realSuppliers = [
  {
    "nombre": "Galderma Chile",
    "categoria": "rellenos y botox",
    "rut": "76.123.456-7",
    "contacto": "Ventas Galderma",
    "telefono": "+56 2 2999 1111",
    "email": "contacto@galderma.cl"
  },
  {
    "nombre": "Allergan Aesthetics",
    "categoria": "rellenos y botox",
    "rut": "76.987.654-3",
    "contacto": "Ejecutivo Allergan",
    "telefono": "+56 2 2888 2222",
    "email": "pedidos@allergan.cl"
  },
  {
    "nombre": "Rehavita",
    "categoria": "insumos clínicos",
    "rut": "77.111.222-4",
    "contacto": "Atención Rehavita",
    "telefono": "+56 2 2777 3333",
    "email": "ventas@rehavita.cl"
  },
  {
    "nombre": "Zubimed Medical",
    "categoria": "insumos clínicos",
    "rut": "76.555.444-1",
    "contacto": "Despacho Zubimed",
    "telefono": "+56 2 2666 4444",
    "email": "contacto@zubimed.cl"
  },
  {
    "nombre": "Merz Aesthetics",
    "categoria": "rellenos y botox",
    "rut": "76.444.333-2",
    "contacto": "Ventas Merz",
    "telefono": "+56 2 2555 5555",
    "email": "contacto@merz.cl"
  },
  {
    "nombre": "Diprolab",
    "categoria": "insumos clínicos",
    "rut": "77.888.999-0",
    "contacto": "Diprolab Distribuidora",
    "telefono": "+56 2 2444 1122",
    "email": "ventas@diprolab.cl"
  },
  {
    "nombre": "3M Chile Health Care",
    "categoria": "suturas y parches",
    "rut": "96.555.111-9",
    "contacto": "Línea Médica 3M",
    "telefono": "+56 2 2410 3000",
    "email": "salud@3m.cl"
  },
  {
    "nombre": "Johnson & Johnson MedTech",
    "categoria": "suturas y parches",
    "rut": "96.777.888-5",
    "contacto": "Ethicon Suturas",
    "telefono": "+56 2 2830 5000",
    "email": "medtech@jnj.cl"
  },
  {
    "nombre": "Exocobio Chile",
    "categoria": "exosomas y biológicos",
    "rut": "76.222.111-6",
    "contacto": "Representante Exocobio",
    "telefono": "+56 9 8765 4321",
    "email": "exosomas@exocobio.cl"
  },
  {
    "nombre": "Prisa Depósito Médico",
    "categoria": "escritorio y aseo",
    "rut": "76.000.111-2",
    "contacto": "Atención Prisa",
    "telefono": "+56 2 2500 6000",
    "email": "contacto@prisa.cl"
  },
  {
    "nombre": "Medipack Insumos",
    "categoria": "insumos clínicos",
    "rut": "77.333.222-1",
    "contacto": "Despachos Medipack",
    "telefono": "+56 2 2333 4455",
    "email": "ventas@medipack.cl"
  },
  {
    "nombre": "Farmacias Ahumada Droguería",
    "categoria": "fármacos",
    "rut": "93.111.000-8",
    "contacto": "Droguería Institucional",
    "telefono": "+56 600 222 4000",
    "email": "institucional@ahumada.cl"
  },
  {
    "nombre": "Salcobrand Institucional",
    "categoria": "fármacos",
    "rut": "96.333.222-7",
    "contacto": "Ventas Clínicas",
    "telefono": "+56 600 360 2000",
    "email": "clinicas@salcobrand.cl"
  },
  {
    "nombre": "Klap Transbank POS",
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

export async function executeSeed(prisma: any) {
  // 1. Limpieza inicial completa de stock y movimientos
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

  // 4. Inserción masiva de 176 Insumos Reales con STOCK 0 (CERO)
  for (const p of realProducts) {
    await prisma.producto.create({
      data: {
        ...p,
        stockActual: 0,
      },
    });
  }
}
