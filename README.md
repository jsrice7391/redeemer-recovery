# Redeemer Recovery

A full-stack TypeScript application with Express backend and React frontend.

## Project Structure

```
redeemer-recovery/
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Express backend (TypeScript)
└── package.json     # Root package.json with scripts
```

## Getting Started

### Installation

Install dependencies for both client and server:

```bash
npm run install:all
```

Or install separately:

```bash
npm run install:server  # Install server dependencies
npm run install:client  # Install client dependencies
```

### Development

Run both the server and client in development mode:

**Server** (runs on http://localhost:5000):
```bash
npm run dev:server
```

**Client** (runs on http://localhost:3000):
```bash
npm run dev:client
```

Run them in separate terminals to develop both simultaneously.

### Building for Production

Build both client and server:

```bash
npm run build
```

Or build separately:

```bash
npm run build:server
npm run build:client
```

### Running in Production

```bash
npm start
```

## Tech Stack

### Backend
- **Express**: Web framework
- **TypeScript**: Type-safe JavaScript
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Axios**: HTTP client

## API Endpoints

- `GET /api` - Welcome message
- `GET /api/health` - Health check endpoint

## Development Notes

- The client is configured to proxy API requests to the server in development
- Server runs on port 5000, client on port 3000
- TypeScript is configured for strict type checking on both client and server
