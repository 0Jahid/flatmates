# FlatMates - Meal Management System

A full-stack web application for managing meals and contributions among flatmates, built with Next.js, Prisma, and PostgreSQL.

## Features

- **User Authentication**: JWT-based authentication with NextAuth.js, supporting admin and member roles
- **Meal Tracking**: Admin can add daily meals (lunch/dinner) for each user
- **Contribution Management**: Track financial contributions from each user
- **Balance Calculation**: Automatic calculation of user balances based on meals consumed vs. contributions
- **WhatsApp Alerts**: Automated WhatsApp notifications via Twilio for negative balances
- **Dashboard**: Real-time overview of system stats and user balances
- **Reports**: Visual charts and analytics using Chart.js
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Clean, mobile-friendly UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase recommended)
- **Authentication**: NextAuth.js with credentials provider
- **Notifications**: Twilio WhatsApp API
- **Charts**: Chart.js with react-chartjs-2
- **UI Components**: Heroicons for icons

## Quick Start

### 1. Environment Setup

Copy the environment file and update with your credentials:

```bash
cp .env.example .env.local
```

Update the following variables in `.env.local`:

```env
# Database (Get from Supabase or your PostgreSQL provider)
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Twilio (Get from Twilio Console)
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"

# JWT
JWT_SECRET="your-jwt-secret-key"
```

### 2. Database Setup

Run Prisma migrations to set up the database schema:

```bash
npx prisma db push
npx prisma generate
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses the following main models:

- **User**: User accounts with roles (ADMIN/MEMBER)
- **Meal**: Daily meal tracking (lunch/dinner per user per date)
- **Contribution**: Financial contributions by users
- **NotificationLog**: Log of sent WhatsApp notifications

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth routes

### Meals
- `GET /api/meals` - Fetch meals (with optional filters)
- `POST /api/meals` - Create/update meal entry (Admin only)

### Contributions
- `GET /api/contributions` - Fetch contributions
- `POST /api/contributions` - Add contribution (Admin only)

### Users
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create user (Admin only)

### Dashboard
- `GET /api/dashboard` - Get dashboard data (balances + stats)

### Notifications
- `POST /api/notifications/send-alerts` - Send WhatsApp alerts (Admin only)

## Balance Calculation Logic

The system automatically calculates user balances using this formula:

```
total_meals = sum of all meals for all users
per_meal_cost = total_contribution / total_meals
user_balance = user_contribution - (user_meals * per_meal_cost)
```

Users with negative balances are highlighted in red and can receive automated WhatsApp alerts.

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Database Setup (Supabase)

1. Create a new project on [Supabase](https://supabase.com)
2. Get your PostgreSQL connection string
3. Update `DATABASE_URL` in your environment variables
4. Run `npx prisma db push` to create tables

### Twilio Setup

1. Sign up for [Twilio](https://www.twilio.com)
2. Get your Account SID and Auth Token
3. Set up WhatsApp Sandbox for testing
4. Update Twilio environment variables

## Default Admin Setup

To create the first admin user:

1. Register a user through the signup page
2. Manually update the user's role in the database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

Or use Prisma Studio:
```bash
npx prisma studio
```

## Features Overview

### For Admins:
- Add/edit meal entries for all users
- Record financial contributions
- View comprehensive dashboard with system stats
- Send WhatsApp alerts to users with negative balances
- Manage user accounts
- Access reports and analytics

### For Members:
- View personal meal history and balance
- See contribution history
- Access reports and charts
- Toggle dark/light mode

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## API Routes

This directory contains example API routes for the headless API app.

For more details, see [route.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route).
