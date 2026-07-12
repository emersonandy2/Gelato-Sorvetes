# Ice Cream Shop Platform - Production Ready

## Overview

A complete, production-ready ice cream shop platform built with Next.js 16, TypeScript, PostgreSQL, and modern web technologies. This application includes customer-facing features, admin panel, and comprehensive security hardening.

## Features

### Customer Features
- Product catalog with search, filter, and sort
- Product detail pages with images and reviews
- Shopping cart with persistent storage
- Checkout with multiple payment methods
- WhatsApp order integration
- User authentication via email OTP
- Order history tracking
- Favorite products
- Dark mode support

### Admin Features
- Dashboard with statistics
- Product management (CRUD)
- Category management
- Order management with status updates
- Coupon management
- Banner management
- Store settings configuration

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Auth**: JWT (jose) + bcryptjs
- **Testing**: Vitest + Playwright
- **Email**: Resend
- **Storage**: Cloudinary

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (customer)/        # Customer-facing pages
│   ├── (admin)/           # Admin panel pages
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── products/         # Product components
│   ├── cart/             # Cart components
│   ├── checkout/         # Checkout components
│   └── admin/            # Admin components
├── features/             # Feature-based modules
│   ├── auth/             # Authentication
│   ├── products/         # Product management
│   ├── categories/       # Category management
│   ├── orders/           # Order management
│   ├── coupons/          # Coupon management
│   ├── admin/            # Admin functionality
│   └── settings/         # Store settings
├── lib/                  # Utility functions
│   ├── __tests__/        # Unit tests
│   └── validation/       # Zod schemas
├── store/                # Zustand stores
│   └── __tests__/        # Store tests
├── hooks/                # Custom React hooks
├── providers/            # Context providers
└── middleware.ts         # Security headers
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Resend API key
- Cloudinary account (optional)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gelato_sorvetes"

# JWT Secret (minimum 32 characters)
JWT_SECRET="your-super-secret-jwt-key-at-least-32-chars"

# Resend (Email)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxx"
RESEND_FROM="noreply@yourdomain.com"

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME="xxxxxxxxxx"
CLOUDINARY_API_KEY="xxxxxxxxxx"
CLOUDINARY_API_SECRET="xxxxxxxxxx"

# WhatsApp
WHATSAPP_PHONE_NUMBER="5511999999999"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm run test:run         # Run unit tests
npm run test:e2e         # Run E2E tests

# Code Quality
npm run lint             # Check ESLint
npm run lint:fix         # Fix ESLint issues

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
```

## Testing

### Unit Tests
```bash
npm run test:run
```

### E2E Tests
```bash
npm run test:e2e
```

## Security Features

- **Authentication**: Email OTP with JWT tokens
- **Authorization**: Role-based access control (Customer/Admin)
- **Input Validation**: Zod schemas on all inputs
- **Rate Limiting**: On authentication endpoints
- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- **Password Hashing**: bcryptjs with salt rounds
- **Token Security**: Signed JWTs with expiration

## Performance Optimizations

- Image optimization with Next.js Image
- Lazy loading for product images
- Database indexes for query performance
- Static page generation where possible
- Bundle size optimization

## Accessibility

- Skip-to-content link
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- Focus management
- Color contrast compliance

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

## License

MIT License
