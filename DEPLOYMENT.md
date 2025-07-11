# Deployment Guide

## Vercel Deployment

This project is optimized for deployment on Vercel with the following configurations:

### 1. Environment Variables

Set these environment variables in your Vercel dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon Database URL | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Secret for JWT tokens | `your-secure-random-string` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `https://your-app.vercel.app` |

### 2. Build Configuration

The project includes:
- `vercel.json` with optimized settings
- `vercel-build` script for database migrations
- `postinstall` hook for generating Drizzle schema

### 3. Database Setup

Before first deployment:

1. Create a Neon database
2. Add `DATABASE_URL` to Vercel environment variables
3. The migration will run automatically during build
4. Optionally run the seed script locally: `npm run db:seed`

### 4. Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Verify Deployment**
   - Check build logs for any errors
   - Test authentication flow
   - Verify database connection

### 5. Production Considerations

- **Database Scaling**: Neon automatically scales
- **Function Timeouts**: Configured in `vercel.json`
- **Edge Regions**: Set to `iad1` for optimal performance
- **Security**: All sensitive data uses environment variables

### 6. Monitoring

- Use Vercel Analytics for performance monitoring
- Check function logs for errors
- Monitor database connections in Neon dashboard

### 7. Custom Domain (Optional)

1. Add your domain in Vercel dashboard
2. Update `NEXT_PUBLIC_APP_URL` environment variable
3. Configure DNS records

## Other Platforms

While optimized for Vercel, this app can deploy to:

- **Railway**: Similar PostgreSQL setup
- **Render**: Configure build command as `npm run vercel-build`
- **Docker**: Create Dockerfile with Node.js 18+

## Environment Variables Reference

```env
# Required
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
JWT_SECRET="your-secure-secret-key"

# Optional
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## Troubleshooting

### Build Failures

1. **Database Connection**: Verify `DATABASE_URL` format
2. **Migration Errors**: Check Drizzle schema syntax
3. **TypeScript Errors**: Run `npm run build` locally first

### Runtime Issues

1. **Authentication**: Verify `JWT_SECRET` is set
2. **Database Queries**: Check Neon dashboard for connection limits
3. **Environment Variables**: Ensure all required vars are set

### Performance

1. **Cold Starts**: Vercel functions have ~100ms cold start
2. **Database Connections**: Neon serverless handles this automatically
3. **Caching**: Next.js PPR provides optimal caching strategy