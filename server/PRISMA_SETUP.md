# Prisma Setup Instructions

## 1. Install Dependencies

```bash
cd server
npm install
```

## 2. Configure Database

Update `server/.env` with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/redeemer_recovery?schema=public"
```

### Example connection strings:

**Local PostgreSQL:**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/redeemer_recovery"
```

**Docker PostgreSQL:**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/redeemer_recovery"
```

**Cloud providers (Supabase, Railway, Render):**
```
DATABASE_URL="postgresql://user:pass@host:port/database?sslmode=require"
```

## 3. Run Migrations

Create the database tables:

```bash
npm run prisma:migrate
```

When prompted, name your migration (e.g., "init" or "create_users_table").

## 4. Generate Prisma Client

```bash
npm run prisma:generate
```

## 5. Start the Server

```bash
npm run dev
```

## Optional: Prisma Studio

View and edit your database with a GUI:

```bash
npm run prisma:studio
```

Opens at http://localhost:5555

## Quick Start with Docker (PostgreSQL)

If you don't have PostgreSQL installed:

```bash
docker run --name postgres-dev \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=redeemer_recovery \
  -p 5432:5432 \
  -d postgres:16

# Then update .env to:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/redeemer_recovery"
```
