# Deployment Guide

This guide will help you deploy the Simple Proxy to various platforms.

## 🚀 Netlify Deployment (Recommended)

### Option 1: One-Click Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-repo/simple-proxy)

### Option 2: Manual Deploy
1. Fork this repository
2. Go to [Netlify](https://netlify.com) and sign in
3. Click "New site from Git"
4. Choose your forked repository
5. Use these build settings:
   - **Build command**: `npm run build:netlify`
   - **Publish directory**: `.netlify/functions`
6. Click "Deploy site"

### Testing Your Netlify Deployment
Once deployed, visit these URLs (replace `your-site-name` with your actual Netlify site name):

- **Health Check**: `https://your-site-name.netlify.app/`
- **Dashboard**: `https://your-site-name.netlify.app/dashboard`
- **API Docs**: `https://your-site-name.netlify.app/docs`

## ☁️ Cloudflare Workers

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Build and deploy:
   ```bash
   npm run build:cloudflare
   wrangler deploy
   ```

4. (Optional) Set environment variables for Turnstile:
   ```bash
   wrangler secret put TURNSTILE_SECRET
   wrangler secret put JWT_SECRET
   ```

## 🌐 AWS Lambda

1. Build for AWS:
   ```bash
   npm run build:aws
   ```

2. Deploy using your preferred method:
   - AWS CLI
   - Serverless Framework
   - AWS CDK
   - Manual upload via AWS Console

## 🖥️ Node.js Server

### Local Development
```bash
npm install
npm run dev
```

### Production Deployment
```bash
npm install --production
npm run build:node
npm start
```

The server will run on port 3000 by default. You can change this with the `PORT` environment variable.

## 🔧 Environment Variables

Set these environment variables for additional features:

| Variable | Description | Required |
|----------|-------------|----------|
| `TURNSTILE_SECRET` | Cloudflare Turnstile secret (Cloudflare Workers only) | No |
| `JWT_SECRET` | Secret for JWT tokens (used with Turnstile) | No |
| `DISABLE_CACHE` | Set to `true` to disable TS segment caching | No |
| `REQ_DEBUG` | Set to `true` to enable request logging | No |

### Setting Environment Variables

**Netlify:**
1. Go to Site settings → Environment variables
2. Add your variables

**Cloudflare Workers:**
```bash
wrangler secret put VARIABLE_NAME
```

**Vercel:**
1. Go to Project settings → Environment Variables
2. Add your variables

## 🧪 Testing Your Deployment

After deployment, test your proxy with these commands:

```bash
# Health check
curl https://your-deployment-url.com/

# System test
curl https://your-deployment-url.com/test

# Proxy functionality test
curl https://your-deployment-url.com/test-proxy

# Test custom proxy
curl "https://your-deployment-url.com/?destination=https://httpbin.org/json"
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Errors**: Make sure you're using the correct build command for your platform
2. **Environment Variables**: Double-check that environment variables are set correctly
3. **CORS Issues**: The proxy should handle CORS automatically
4. **404 Errors**: Ensure your destination URLs are properly URL-encoded

### Debug Mode

Enable debug mode to see detailed request logs:
```bash
# Set environment variable
REQ_DEBUG=true
```

### Platform-Specific Issues

**Netlify:**
- Functions timeout after 10 seconds on free plan
- Use Edge Functions for better performance if needed

**Cloudflare Workers:**
- 50ms CPU time limit on free plan
- Some Node.js APIs may not be available

**AWS Lambda:**
- Cold start latency on infrequent requests
- Configure memory and timeout as needed

## 📊 Monitoring

### Built-in Endpoints

Use these endpoints to monitor your proxy:

- `/` - Basic health check
- `/test` - Detailed system information
- `/test-proxy` - Proxy functionality test
- `/dashboard` - Interactive test interface

### Custom Monitoring

You can integrate with monitoring services by calling these endpoints:

```javascript
// Basic health check
const response = await fetch('https://your-proxy.com/');
const health = await response.json();

// Detailed system check
const systemResponse = await fetch('https://your-proxy.com/test');
const systemInfo = await systemResponse.json();
```

## 🚨 Security Considerations

1. **Rate Limiting**: Consider implementing rate limiting for production use
2. **Domain Restrictions**: You may want to restrict which domains can be proxied
3. **Authentication**: Use Turnstile or implement custom authentication for sensitive deployments
4. **Monitoring**: Monitor for abuse and unusual traffic patterns

## 📞 Support

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Visit the [interactive dashboard](#testing-your-deployment) on your deployment
3. Check the GitHub repository for issues and documentation
4. Enable debug mode to get detailed logs
