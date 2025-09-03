# Deployment Guide for FlatMates

## Prerequisites

1. **GitHub Account** - For code repository
2. **Vercel Account** - For hosting (free tier available)
3. **Supabase Account** - For PostgreSQL database (free tier available)
4. **Twilio Account** - For WhatsApp API (trial available)

## Step 1: Database Setup (Supabase)

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Go to Settings > Database
4. Copy the connection string (URI format)
5. Replace `[YOUR-PASSWORD]` with your actual database password

Your DATABASE_URL will look like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
```

## Step 2: Twilio Setup

1. Sign up at [Twilio](https://www.twilio.com)
2. Get your Account SID and Auth Token from the Console
3. Set up WhatsApp Sandbox:
   - Go to Develop > Messaging > Try it out > Send a WhatsApp message
   - Follow the instructions to activate the sandbox
   - Note the sandbox number (usually `whatsapp:+14155238886`)

## Step 3: Vercel Deployment

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Configure environment variables in Vercel:

```env
DATABASE_URL=your_supabase_connection_string
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your_random_secret_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
JWT_SECRET=your_jwt_secret
```

4. Deploy the project

## Step 4: Database Migration

After deployment, run the database migration:

1. In your local project, with the production DATABASE_URL:
```bash
npx prisma db push
```

2. Optionally, seed the database with sample data:
```bash
npm run db:seed
```

## Step 5: Create Admin User

There are two ways to create the first admin user:

### Option 1: Use the seed script
The seed script creates an admin user with:
- Email: `admin@flatmates.com`
- Password: `admin123`

### Option 2: Manual creation
1. Register a user through the app
2. Go to your Supabase dashboard
3. Navigate to Table Editor > users
4. Find your user and change the `role` from `MEMBER` to `ADMIN`

## Step 6: Test the Application

1. Visit your deployed app
2. Sign in with admin credentials
3. Add some users, meals, and contributions
4. Test the WhatsApp alert functionality

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | Your app's URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | Generate with: `openssl rand -base64 32` |
| `TWILIO_ACCOUNT_SID` | From Twilio Console | `ACxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | From Twilio Console | `xxxxxxxxxxxxx` |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp number | `whatsapp:+14155238886` |
| `JWT_SECRET` | Random secret for JWT | Generate with: `openssl rand -base64 32` |

## Production Considerations

1. **Security**: Change default passwords and use strong secrets
2. **Phone Numbers**: For production, get a dedicated Twilio WhatsApp number
3. **Database**: Consider upgrading Supabase plan for higher limits
4. **Monitoring**: Set up error monitoring (Vercel has built-in monitoring)
5. **Backup**: Regularly backup your database

## Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Check if Supabase project is active
   - Ensure your IP is not blocked

2. **WhatsApp Not Working**
   - Verify Twilio credentials
   - Check if WhatsApp sandbox is active
   - Ensure phone numbers include country code

3. **Authentication Issues**
   - Verify NEXTAUTH_URL matches your domain
   - Check NEXTAUTH_SECRET is set
   - Clear browser cookies and try again

4. **Build Errors**
   - Check all environment variables are set
   - Verify TypeScript errors are resolved
   - Review Vercel build logs

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Review the browser console for errors
3. Check Supabase logs for database issues
4. Verify Twilio logs for messaging issues
