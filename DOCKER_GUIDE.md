# Docker Setup Guide

## 🐳 Running with Docker Compose

This setup includes:
- **PostgreSQL 16** - Database server
- **Express Server** - Your API
- **Prisma Studio** (optional) - Database GUI

## Quick Start

### 1. Start All Services

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL on port `5432`
- Build and start Express server on port `3001`
- Run database migrations automatically
- Create a persistent volume for database data

### 2. Check Status

```bash
docker-compose ps
```

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f postgres
```

## 🛠️ Development Commands

### Rebuild After Code Changes

```bash
docker-compose up -d --build
```

### Stop Services

```bash
docker-compose down
```

### Stop and Remove Volumes (⚠️ deletes database data)

```bash
docker-compose down -v
```

### Run Prisma Migrations

```bash
docker-compose exec server npx prisma migrate dev
```

### Access PostgreSQL CLI

```bash
docker-compose exec postgres psql -U postgres -d redeemer_recovery
```

## 🎨 Prisma Studio (Database GUI)

Start Prisma Studio on port `5555`:

```bash
docker-compose --profile studio up -d prisma-studio
```

Then open: http://localhost:5555

Stop Prisma Studio:

```bash
docker-compose --profile studio down
```

## 🧪 Testing the API

Once running, test the endpoints:

```bash
# Health check
curl http://localhost:3001/api/health

# Get all users
curl http://localhost:3001/api/users

# Create a user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Docker User","email":"docker@example.com"}'
```

## 📝 Environment Variables

The docker-compose file sets these automatically:

- `DATABASE_URL`: `postgresql://postgres:postgres@postgres:5432/redeemer_recovery`
- `PORT`: `3001`
- `NODE_ENV`: `production`

To customize, edit `docker-compose.yml` or create a `.env` file.

## 🔧 Local Development (without Docker)

If you want to use Docker for PostgreSQL only:

```bash
# Start just PostgreSQL
docker-compose up -d postgres

# Run server locally
cd server
npm run dev
```

Make sure your `server/.env` has:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/redeemer_recovery"
```

## 🐛 Troubleshooting

### Server won't start
```bash
# Check logs
docker-compose logs server

# Rebuild
docker-compose up -d --build --force-recreate
```

### Database connection issues
```bash
# Verify postgres is healthy
docker-compose ps
docker-compose logs postgres
```

### Reset everything
```bash
docker-compose down -v
docker-compose up -d --build
```

## 📦 Production Deployment

For production, update `docker-compose.yml`:

1. Use environment variables for secrets
2. Remove volume mounts for source code
3. Use proper PostgreSQL password
4. Add network security
5. Consider using Docker secrets

Example production DATABASE_URL:
```
postgresql://user:secure_password@postgres:5432/redeemer_recovery?schema=public&sslmode=require
```
