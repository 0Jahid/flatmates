# FlatMates - Meal Management System

This is a full-stack Next.js application for managing meals and contributions among flatmates.

## Project Structure

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes with Prisma ORM
- **Database**: PostgreSQL with Prisma schema
- **Authentication**: NextAuth.js with JWT
- **Notifications**: Twilio WhatsApp API
- **Charts**: Chart.js for reports and analytics

## Key Features

1. User authentication with admin/member roles
2. Daily meal tracking (lunch/dinner)
3. Financial contribution management
4. Automatic balance calculations
5. WhatsApp alerts for negative balances
6. Dashboard with system statistics
7. Reports with visual charts
8. Dark mode support
9. Responsive design

## Development Guidelines

- Use TypeScript for all new code
- Follow the existing component structure
- Use Tailwind CSS for styling
- Keep API routes RESTful
- Use Prisma for database operations
- Handle errors gracefully with try-catch blocks
- Add proper TypeScript types for all functions
- Use React hooks appropriately
- Keep components focused and reusable

## Database Schema

The main entities are:
- User (with roles: ADMIN/MEMBER)
- Meal (daily entries per user)
- Contribution (financial records)
- NotificationLog (sent alerts tracking)

## Environment Variables Required

- DATABASE_URL (PostgreSQL connection)
- NEXTAUTH_URL and NEXTAUTH_SECRET
- TWILIO credentials for WhatsApp
- JWT_SECRET for token signing

## Deployment

- Frontend/Backend: Vercel
- Database: Supabase or any PostgreSQL provider
- Environment variables must be set in production
