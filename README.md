
# Simple Proxy

Reverse proxy service for bypassing CORS and handling streaming content. Built for [movie-web](https://movie-web.app) and [P-Stream](https://pstream.org), but usable for any app needing a modern, stateless proxy.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-repo/simple-proxy)

---

## 🚀 Quick Start

### Test Locally

```bash
pnpm install
pnpm dev
# Visit http://localhost:3000/dashboard for the interactive dashboard
```

### Test on Netlify (or Cloud)

After deploying, use these endpoints (replace with your domain):

- **Dashboard:** `https://your-proxy.netlify.app/dashboard` (visual test UI)
- **API Docs:** `https://your-proxy.netlify.app/docs` (JSON API reference)
- **Health Check:** `https://your-proxy.netlify.app/`
- **System Test:** `https://your-proxy.netlify.app/test`
- **Proxy Test:** `https://your-proxy.netlify.app/test-proxy`

#### Example cURL:
```bash
curl https://your-proxy.netlify.app/
curl https://your-proxy.netlify.app/test
curl https://your-proxy.netlify.app/test-proxy
```

---


## 📖 Usage Guide

### Basic Proxy

**Endpoint:** `GET|POST|PUT|DELETE /?destination=<URL>`

Bypass CORS for any HTTP request:

```js
fetch('https://your-proxy.netlify.app/?destination=' +
  encodeURIComponent('https://api.example.com/data'))
  .then(r => r.json())
  .then(data => console.log(data));
```

```bash
curl "https://your-proxy.netlify.app/?destination=https://api.example.com/data"
```

### M3U8 Proxy (HLS Streaming)

**Endpoint:** `GET /m3u8-proxy?url=<M3U8_URL>`

```js
fetch('https://your-proxy.netlify.app/m3u8-proxy?url=' +
  encodeURIComponent('https://example.com/playlist.m3u8'))
  .then(r => r.text())
  .then(playlist => console.log(playlist));
```

### TS Segment Proxy

**Endpoint:** `GET /ts-proxy?url=<TS_URL>&headers=<JSON_HEADERS>`

```js
const headers = JSON.stringify({
  'Referer': 'https://example.com',
  'User-Agent': 'MyApp/1.0'
});
fetch('https://your-proxy.netlify.app/ts-proxy?url=' +
  encodeURIComponent('https://example.com/segment.ts') +
  '&headers=' + encodeURIComponent(headers))
  .then(r => r.arrayBuffer())
  .then(data => {/* handle TS segment */});
```

---


## 🔧 Configuration & Security

### Environment Variables

| Variable           | Description                                 | Default         |
|--------------------|---------------------------------------------|-----------------|
| `TURNSTILE_SECRET` | Cloudflare Turnstile secret (bot protection)| `null` (off)    |
| `JWT_SECRET`       | JWT token secret (for Turnstile)            | `null` (off)    |
| `DISABLE_CACHE`    | Disable TS segment caching                  | `false`         |
| `REQ_DEBUG`        | Enable request debugging                    | `false`         |

#### Turnstile (Cloudflare Workers only)
Set these in your environment:
```env
TURNSTILE_SECRET=your_turnstile_secret
JWT_SECRET=your_jwt_secret
```
Clients must send a valid Turnstile token in the `X-Token` header.

---


## 🏗️ Deployment

### Netlify (Recommended)

1. Fork this repository
2. Connect to Netlify
3. Set build command: `bash build-netlify.sh`
4. Deploy
5. Set environment variables in Netlify dashboard if needed

### Cloudflare Workers
```bash
pnpm run build:cloudflare
# Deploy using Wrangler CLI
```

### AWS Lambda
```bash
pnpm run build:aws
# Deploy using your preferred AWS deployment method
```

### Node.js Server (Local/Custom Cloud)
```bash
pnpm run build:node
pnpm start
# Visit http://localhost:3000/dashboard
```

---


## 🛠️ Development & Testing

### Local Development
```bash
pnpm install
pnpm dev
# Open http://localhost:3000/dashboard for the UI
```

### Local Testing Endpoints
- `http://localhost:3000/` - Health check
- `http://localhost:3000/test` - System info
- `http://localhost:3000/test-proxy` - Proxy test
- `http://localhost:3000/dashboard` - Interactive dashboard
- `http://localhost:3000/docs` - API docs (JSON)

---


## 📝 API Reference & Endpoints


### `/` (Health Check)
**GET /**
Returns proxy status and version.

### `/test` (System Test)
**GET /test**
Returns detailed info about proxy config and request.

### `/test-proxy` (Proxy Test)
**GET /test-proxy**
Tests proxying by fetching a public endpoint.

### `/dashboard` (Interactive UI)
**GET /dashboard**
Web dashboard for testing all endpoints.

### `/docs` (API Docs)
**GET /docs**
JSON API reference for all endpoints and config.

### Main Proxy
**GET|POST|PUT|DELETE /?destination=<URL>**
- `destination` (required): Target URL to proxy
- All headers forwarded except blacklisted
- CORS headers added automatically

### M3U8 Proxy
**GET /m3u8-proxy?url=<M3U8_URL>**
- `url` (required): M3U8 playlist URL
- Rewrites segment URLs, supports nested playlists

### TS Proxy
**GET /ts-proxy?url=<TS_URL>&headers=<JSON_HEADERS>**
- `url` (required): TS segment URL
- `headers` (optional): JSON string of custom headers
- Caches segments for 2 hours, max 2000 entries

---


## 🔍 Troubleshooting & Tips

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
