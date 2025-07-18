# Simple Proxy

A powerful reverse proxy service designed to bypass CORS restrictions and handle streaming content. Originally built for [movie-web](https://movie-web.app) and [P-Stream](https://pstream.org), but can be used for any application requiring proxy functionality.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-repo/simple-proxy)

## 🚀 Quick Start

### Testing Your Deployment

Once deployed, test your proxy with these endpoints:

1. **Basic Health Check**: `GET /`
   ```bash
   curl https://your-proxy-domain.netlify.app/
   ```

2. **Detailed Test**: `GET /test`
   ```bash
   curl https://your-proxy-domain.netlify.app/test
   ```

3. **Proxy Functionality Test**: `GET /test-proxy`
   ```bash
   curl https://your-proxy-domain.netlify.app/test-proxy
   ```

## 📖 Usage Guide

### Basic Proxy Usage

**Endpoint**: `GET|POST|PUT|DELETE /?destination=<URL>`

Proxy any HTTP request to bypass CORS:

```javascript
// Example: Fetch data from an API that blocks CORS
const response = await fetch('https://your-proxy.netlify.app/?destination=' + 
  encodeURIComponent('https://api.example.com/data'));
const data = await response.json();
```

```bash
# Using curl
curl "https://your-proxy.netlify.app/?destination=https://api.example.com/data"
```

### M3U8 Streaming Proxy

**Endpoint**: `GET /m3u8-proxy?url=<M3U8_URL>`

Handle HLS video streams and bypass IP restrictions:

```javascript
// Proxy an M3U8 playlist
const m3u8Response = await fetch('https://your-proxy.netlify.app/m3u8-proxy?url=' + 
  encodeURIComponent('https://example.com/playlist.m3u8'));
const playlist = await m3u8Response.text();
```

### TS Segment Proxy

**Endpoint**: `GET /ts-proxy?url=<TS_URL>&headers=<JSON_HEADERS>`

Efficiently proxy video segments with caching:

```javascript
// Proxy a video segment with custom headers
const headers = JSON.stringify({
  'Referer': 'https://example.com',
  'User-Agent': 'MyApp/1.0'
});

const segmentResponse = await fetch('https://your-proxy.netlify.app/ts-proxy?url=' + 
  encodeURIComponent('https://example.com/segment.ts') + 
  '&headers=' + encodeURIComponent(headers));
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TURNSTILE_SECRET` | Cloudflare Turnstile secret for bot protection | `null` (disabled) |
| `JWT_SECRET` | Secret for JWT token generation | `null` (disabled) |
| `DISABLE_CACHE` | Disable TS segment caching | `false` |
| `REQ_DEBUG` | Enable request debugging | `false` |

### Security Features

#### Turnstile Protection (Cloudflare Workers only)

Enable bot protection by setting environment variables:
```env
TURNSTILE_SECRET=your_turnstile_secret
JWT_SECRET=your_jwt_secret
```

When enabled, clients must include a valid Turnstile token in the `X-Token` header.

## 🏗️ Deployment

### Netlify (Recommended)

1. Fork this repository
2. Connect to Netlify
3. Deploy with default settings
4. Set environment variables in Netlify dashboard if needed

### Cloudflare Workers

```bash
npm run build:cloudflare
# Deploy using Wrangler CLI
```

### AWS Lambda

```bash
npm run build:aws
# Deploy using your preferred AWS deployment method
```

### Node.js Server

```bash
npm run build:node
npm start
```

## 🛠️ Development

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Testing

Access these endpoints during development:

- `http://localhost:3000/` - Health check
- `http://localhost:3000/test` - Detailed system info
- `http://localhost:3000/test-proxy` - Proxy functionality test

## 📝 API Reference

### Health Check

```http
GET /
```

Returns proxy status and version information.

### System Test

```http
GET /test
```

Returns detailed information about the proxy configuration, request details, and system status.

### Proxy Test

```http
GET /test-proxy
```

Tests the proxy functionality by making a request to a test endpoint and returning the results.

### Main Proxy

```http
GET|POST|PUT|DELETE /?destination=<URL>
```

**Parameters:**
- `destination` (required): The target URL to proxy the request to

**Headers:**
- All headers are forwarded except blacklisted ones
- CORS headers are automatically added to responses

### M3U8 Proxy

```http
GET /m3u8-proxy?url=<M3U8_URL>
```

**Parameters:**
- `url` (required): The M3U8 playlist URL to proxy

**Features:**
- Automatically rewrites segment URLs to route through the proxy
- Handles relative and absolute URLs in playlists
- Supports nested playlists

### TS Proxy

```http
GET /ts-proxy?url=<TS_URL>&headers=<JSON_HEADERS>
```

**Parameters:**
- `url` (required): The TS segment URL to proxy
- `headers` (optional): JSON string of custom headers to include

**Features:**
- Intelligent caching of segments (2-hour expiry)
- Automatic cache size management (max 2000 entries)
- Optimized for video streaming

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure you're using the correct proxy endpoint format
2. **404 Errors**: Check that your destination URL is properly encoded
3. **Turnstile Errors**: Ensure you're on Cloudflare Workers and have valid secrets
4. **Caching Issues**: Disable cache with `DISABLE_CACHE=true` if needed

### Debug Mode

Enable request debugging:
```env
REQ_DEBUG=true
```

This will log all proxied requests to the console.

## ⚡ Features

- ✅ **CORS Bypass**: Access any API without CORS restrictions
- ✅ **Multi-Platform**: Deploy on Cloudflare, AWS, Netlify, or Node.js
- ✅ **Video Streaming**: Specialized handling for M3U8 and TS files
- ✅ **Intelligent Caching**: Automatic caching of video segments
- ✅ **Security**: Optional Turnstile bot protection
- ✅ **Header Management**: Safe handling of protected headers
- ✅ **Modern Stack**: Built with Nitro and TypeScript

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Need help?** Check the [documentation](https://docs.pstream.org/proxy/introduction) or open an issue on GitHub.
