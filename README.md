# Subscription Management API

Complete backend for managing subscriptions and recurring payments, built with Node.js, TypeScript and clean architecture.

## About the Project

Robust system to manage users, subscription plans, recurring billing and payments. Ideal for SaaS, startups and fintechs that need a complete billing system.

**Key Features:**
- JWT authentication with refresh tokens
- Multiple subscription plans
- Automated recurring payments
- Webhooks for gateway integrations (Stripe, Mercado Pago)
- Role-based access control (admin/user)
- Redis caching
- Structured logging

## Tech Stack

- **Runtime:** Node.js 18+
- **Language:** TypeScript
- **Framework:** Express
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT + bcrypt
- **Validation:** Zod
- **Cache:** Redis (ioredis)
- **Logging:** Winston
- **Testing:** Jest
- **Containerization:** Docker

## Installation

### With Make
```bash
npm install
make setup
make dev
```

### With Docker
```bash
docker-compose up -d
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed
```

### Manual
```bash
npm install

# Configure environment variables
cat > .env << EOF
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/subscription_db"
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
REDIS_HOST=localhost
REDIS_PORT=6379
EOF

# Database setup
npx prisma migrate dev
npx prisma db seed

# Start server
npm run dev
```

API available at `http://localhost:3000`

## Architecture

### Directory Structure
```
src/
├── modules/              # Business modules
│   └── auth/            # Authentication and authorization
├── shared/
│   ├── config/          # Configurations (DB, Redis, Logger)
│   ├── middlewares/     # Global middlewares
│   ├── errors/          # Custom error classes
│   └── utils/           # Utilities (JWT, Hash, Validators)
└── server.ts            # Entry point
```

### Design Patterns
- **Clean Architecture** - Clear separation of concerns
- **Repository Pattern** - Data access abstraction
- **Service Pattern** - Centralized business logic
- **Dependency Injection** - Component decoupling

## API Endpoints

### Authentication
```
POST   /api/auth/register      # Create new account
POST   /api/auth/login         # Authenticate user
POST   /api/auth/refresh       # Renew access token
POST   /api/auth/logout        # End session
GET    /api/auth/me            # Get authenticated user data
```

### Plans
```
GET    /api/plans              # List all plans
GET    /api/plans/:id          # Get plan details
POST   /api/plans              # Create plan (admin)
PUT    /api/plans/:id          # Update plan (admin)
DELETE /api/plans/:id          # Delete plan (admin)
```

### Subscriptions
```
POST   /api/subscriptions      # Create subscription
GET    /api/subscriptions/me   # Get my subscriptions
DELETE /api/subscriptions/:id  # Cancel subscription
```

### Payments
```
POST   /api/payments/initiate  # Initiate payment process
GET    /api/payments/history   # Payment history
```

### Webhooks
```
POST   /api/webhooks/payment   # Receive payment notifications
```

### Admin
```
GET    /api/admin/users        # List all users
GET    /api/admin/logs         # System activity logs
```

## Data Models

### User
System users with different access levels.
- Roles: `USER`, `ADMIN`
- JWT authentication

### Plan
Available subscription plans.
- Configurable price and duration
- Unlimited features per plan

### Subscription
Active user subscriptions.
- Status: `ACTIVE`, `CANCELLED`, `EXPIRED`, `PENDING`
- Automatic renewal

### Payment
Transaction history.
- Status: `PENDING`, `APPROVED`, `REJECTED`, `REFUNDED`, `CANCELLED`
- Methods: `CREDIT_CARD`, `PIX`, `BOLETO`

### ActivityLog
System action audit trail.

## Security

- Passwords encrypted with bcrypt (10 rounds)
- Short-lived JWT tokens (15min access, 7 days refresh)
- Refresh tokens stored in Redis
- Configurable CORS
- Helmet for security headers
- Strict input validation (Zod)
- Rate limiting (planned)

## Testing

```bash
# Run all tests
npm test

# Tests with coverage
npm run test:coverage

# Tests in watch mode
npm run test:watch
```

## Deployment

### Recommended Options

**Backend:**
- Render (free tier available)
- Railway
- Vercel (serverless)

**Database:**
- Neon.tech (serverless PostgreSQL)
- Supabase
- Railway PostgreSQL

**Redis:**
- Upstash (serverless)
- Redis Cloud

### Production Environment Variables

```env
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="strong-secret-key"
JWT_REFRESH_SECRET="another-strong-key"
REDIS_HOST="your-redis-host"
REDIS_PORT=6379
```

## Useful Commands

```bash
# Development
make dev              # Start development server
make test             # Run tests
make lint             # Check code

# Database
make migrate          # Create migration
make seed             # Populate database with initial data
make studio           # Open Prisma Studio

# Docker
make docker-up        # Start containers
make docker-down      # Stop containers
make docker-logs      # View logs

# See all commands
make help
```

## Additional Documentation

- [TESTING.md](TESTING.md) - API usage examples

## License

MIT

---

**Built with TypeScript, Express and software engineering best practices.**
