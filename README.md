# FullStack Minimal Template

A modern, production-ready template for building full-stack React applications using React Router v7 with PostgreSQL database integration.

## Features

- 🚀 **React Router v7** - Server-side rendering with file-based routing
- ⚡️ **Hot Module Replacement** (HMR) for fast development
- 🗄️ **PostgreSQL Database** - Ready-to-use database setup with migrations
- 🔐 **Authentication System** - Login/signup with session management
- 🛒 **E-commerce Ready** - Products, categories, and user management
- 🎨 **TailwindCSS** - Modern styling with custom components
- 📦 **TypeScript** - Full type safety throughout the application
- 🔧 **Database Migrations** - Easy database setup and seeding

## Tech Stack

- **Frontend**: React Router v7, TypeScript, TailwindCSS
- **Backend**: Node.js with React Router SSR
- **Database**: PostgreSQL with pg client
- **Authentication**: bcryptjs for password hashing
- **Validation**: Zod for schema validation
- **Development**: Vite, ESLint, tsx for TypeScript execution

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd fullstack-minimal_template
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your database configuration:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/your_database
SESSION_SECRET=your-secret-key
```

### Database Setup

1. Create your PostgreSQL database
2. Run migrations to create tables:

```bash
npm run db:migrate
```

3. Seed the database with sample data:

```bash
npm run db:seed
```

### Development

Start the development server:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## Project Structure

```
app/
├── components/ui/     # Reusable UI components
├── lib/              # Utility functions and configurations
├── routes/           # Page components and route handlers
├── services/         # Database service functions
├── globals.css       # Global styles
├── root.tsx          # Root layout component
└── routes.ts         # Route configuration

scripts/
├── migrate.js        # Database migration script
└── seed.js          # Database seeding script
```

## Database Schema

The template includes the following tables:

- **users** - User authentication and profiles
- **categories** - Product categories
- **products** - Product catalog
- **orders** - User orders
- **order_items** - Order line items

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Environment Variables

Make sure to set these environment variables in production:

- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret key for session encryption

### Docker Deployment

Build and run using Docker:

```bash
docker build -t fullstack-app .
docker run -p 3000:3000 fullstack-app
```

### Platform Deployment

This application can be deployed to:

- Vercel
- Railway
- Fly.io
- Heroku
- AWS
- Digital Ocean
- Any Node.js hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see the LICENSE file for details.

---

Built with ❤️ using React Router v7, PostgreSQL, and modern web technologies.
