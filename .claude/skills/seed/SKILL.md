---
name: seed
description: Seed Firestore with sample data for development and testing. Creates institutions, services, users, and bookings with realistic Angolan data.
disable-model-invocation: true
---

# Seed Firestore Database

Create a seed script at `scripts/seed.ts` that populates Firestore with realistic sample data for development.

## Setup
1. Create `scripts/seed.ts` using the Firebase client SDK (same config as the app)
2. Add a script to `package.json`: `"seed": "npx tsx scripts/seed.ts"`
3. Use the existing Firebase config from `src/lib/firebase.ts`

## Data to Create

### Services (Collection: `services`)
Create services for each category:

**documentacao-pessoal:**
- Bilhete de Identidade (duration: 30min, capacity: 20, requirements: ["Certidão de Nascimento", "2 Fotografias tipo passe", "Comprovativo de residência"])
- Emissão do Passaporte (duration: 45min, capacity: 15, requirements: ["Bilhete de Identidade", "2 Fotografias tipo passe", "Comprovativo de pagamento de emolumentos"])
- Registo Criminal (duration: 20min, capacity: 25, requirements: ["Bilhete de Identidade", "Comprovativo de pagamento"])

**documentacao-habitacional:**
- Registo de Propriedade (duration: 60min, capacity: 10, requirements: ["Bilhete de Identidade", "Escritura de compra e venda", "Planta do imóvel"])
- Licença de Construção (duration: 45min, capacity: 8, requirements: ["Bilhete de Identidade", "Projecto de arquitectura", "Título de propriedade do terreno"])

**documentacao-automovel:**
- Carta de Condução (duration: 30min, capacity: 20, requirements: ["Bilhete de Identidade", "Atestado médico", "2 Fotografias tipo passe"])
- Registo de Veículo (duration: 40min, capacity: 15, requirements: ["Bilhete de Identidade", "Factura de compra do veículo", "Seguro automóvel válido"])

**documentacao-comercial:**
- Licença Comercial (duration: 60min, capacity: 10, requirements: ["Bilhete de Identidade", "NIF", "Plano de negócios", "Comprovativo de endereço comercial"])
- Registo Empresarial (duration: 45min, capacity: 12, requirements: ["Bilhete de Identidade", "Estatutos da empresa", "Acta de constituição"])

### Institutions (Collection: `institutions`)
Create Luanda-based institutions:

1. Arquivo de Identificação Civil — Rua Major Kanhangulo, 45, Luanda (-8.8383, 13.2344)
2. Serviço de Migração e Estrangeiros — Rua Direita de Luanda, 12 (-8.8147, 13.2302)
3. Direcção Nacional de Registos — Av. 4 de Fevereiro, 100, Luanda (-8.8100, 13.2350)
4. Conservatória do Registo Predial — Rua Rainha Ginga, 78, Luanda (-8.8200, 13.2280)
5. INATU — Rua Comandante Gika, 33, Luanda (-8.8350, 13.2400)

Each institution should include: name, address, coordinates, services (array of service IDs), maxCapacity.

### Test Users (Collection: `users`)
Create 2 test users via Firebase Auth + Firestore profile:
- Citizen: BI `000000001LA041`, password `test1234`, nome "Maria Silva", role "citizen"
- Admin: BI `000000002LA042`, password `admin1234`, nome "João Admin", role "admin"

### Sample Bookings (Collection: `bookings`)
Create 3-5 sample bookings for the citizen user with different statuses.

## Important Notes
- Use `Timestamp.fromDate()` for date fields
- Link service IDs in institution `services` arrays
- Set proper `status` values: "scheduled", "completed", "cancelled"
- Include both `createdAt` and `updatedAt` timestamps
- The script should be idempotent — check if data exists before creating

## After Running
Run the seed script with: `npm run seed`
