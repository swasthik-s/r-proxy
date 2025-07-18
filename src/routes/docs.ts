export default defineEventHandler(async (event) => {
  // Handle CORS preflight requests
  if (isPreflightRequest(event)) {
    return handleCors(event, {});
  }

  setHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json',
  });

  const baseUrl = getRequestURL(event).origin;
  const version = useRuntimeConfig(event).version;

  return {
    name: 'Simple Proxy',
    version,
    description: 'Reverse proxy service for bypassing CORS and handling streaming content',
    baseUrl,
    endpoints: {
      health: {
        method: 'GET',
        path: '/',
        description: 'Health check endpoint',
        example: `${baseUrl}/`
      },
      systemTest: {
        method: 'GET',
        path: '/test',
        description: 'Detailed system and configuration test',
        example: `${baseUrl}/test`
      },
      proxyTest: {
        method: 'GET',
        path: '/test-proxy',
        description: 'Test proxy functionality with httpbin.org',
        example: `${baseUrl}/test-proxy`
      },
      dashboard: {
        method: 'GET',
        path: '/dashboard',
        description: 'Interactive test dashboard (HTML)',
        example: `${baseUrl}/dashboard`
      },
      docs: {
        method: 'GET',
        path: '/docs',
        description: 'API documentation (this endpoint)',
        example: `${baseUrl}/docs`
      },
      proxy: {
        method: 'GET|POST|PUT|DELETE',
        path: '/?destination=<URL>',
        description: 'Main proxy endpoint for bypassing CORS',
        parameters: {
          destination: {
            type: 'string',
            required: true,
            description: 'The target URL to proxy the request to',
            example: 'https://api.example.com/data'
          }
        },
        example: `${baseUrl}/?destination=https://httpbin.org/json`,
        usage: {
          javascript: `fetch('${baseUrl}/?destination=' + encodeURIComponent('https://api.example.com/data'))`,
          curl: `curl "${baseUrl}/?destination=https://api.example.com/data"`
        }
      },
      m3u8Proxy: {
        method: 'GET',
        path: '/m3u8-proxy?url=<M3U8_URL>',
        description: 'Proxy M3U8 playlists for video streaming',
        parameters: {
          url: {
            type: 'string',
            required: true,
            description: 'The M3U8 playlist URL to proxy',
            example: 'https://example.com/playlist.m3u8'
          }
        },
        example: `${baseUrl}/m3u8-proxy?url=https://example.com/playlist.m3u8`,
        features: [
          'Automatically rewrites segment URLs',
          'Handles relative and absolute URLs',
          'Supports nested playlists'
        ]
      },
      tsProxy: {
        method: 'GET',
        path: '/ts-proxy?url=<TS_URL>&headers=<JSON_HEADERS>',
        description: 'Proxy TS video segments with caching',
        parameters: {
          url: {
            type: 'string',
            required: true,
            description: 'The TS segment URL to proxy',
            example: 'https://example.com/segment.ts'
          },
          headers: {
            type: 'string',
            required: false,
            description: 'JSON string of custom headers',
            example: '{"Referer": "https://example.com"}'
          }
        },
        example: `${baseUrl}/ts-proxy?url=https://example.com/segment.ts&headers=${encodeURIComponent('{"Referer":"https://example.com"}')}`,
        features: [
          'Intelligent caching (2-hour expiry)',
          'Automatic cache management',
          'Optimized for streaming'
        ]
      }
    },
    configuration: {
      environmentVariables: {
        TURNSTILE_SECRET: {
          description: 'Cloudflare Turnstile secret for bot protection',
          default: 'null (disabled)',
          platform: 'Cloudflare Workers only'
        },
        JWT_SECRET: {
          description: 'Secret for JWT token generation',
          default: 'null (disabled)'
        },
        DISABLE_CACHE: {
          description: 'Disable TS segment caching',
          default: 'false'
        },
        REQ_DEBUG: {
          description: 'Enable request debugging',
          default: 'false'
        }
      },
      security: {
        cors: 'Enabled for all origins',
        turnstile: process.env.TURNSTILE_SECRET ? 'Enabled' : 'Disabled',
        caching: process.env.DISABLE_CACHE === 'true' ? 'Disabled' : 'Enabled'
      }
    },
    status: {
      online: true,
      platform: process.env.NITRO_PRESET || 'unknown',
      timestamp: new Date().toISOString()
    },
    links: {
      repository: 'https://github.com/your-repo/simple-proxy',
      documentation: 'https://docs.pstream.org/proxy/introduction',
      dashboard: `${baseUrl}/dashboard`
    }
  };
});
