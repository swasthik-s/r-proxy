import { getIp } from '@/utils/ip';

export default defineEventHandler(async (event) => {
  // Handle CORS preflight requests
  if (isPreflightRequest(event)) {
    return handleCors(event, {});
  }

  const method = getMethod(event);
  const query = getQuery(event);
  const headers = Object.fromEntries(
    Object.entries(getHeaders(event)).filter(([key]) =>
      !key.toLowerCase().startsWith('x-forwarded') &&
      !key.toLowerCase().startsWith('cf-')
    )
  );

  let body = null;
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      body = await readBody(event);
    } catch {
      // Body might be empty or invalid, that's ok for testing
    }
  }

  const testResults = {
    status: 'success',
    message: 'Proxy test endpoint is working correctly',
    timestamp: new Date().toISOString(),
    request: {
      method,
      url: getRequestURL(event).toString(),
      query,
      headers,
      body,
      userAgent: getHeader(event, 'user-agent'),
      ip: (() => {
        try {
          return getIp(event);
        } catch {
          return getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown';
        }
      })(),
    },
    proxy: {
      version: useRuntimeConfig(event).version,
      platform: process.env.NITRO_PRESET || 'unknown',
      corsEnabled: true,
      turnstileEnabled: process.env.TURNSTILE_SECRET ? true : false,
      cacheEnabled: process.env.DISABLE_CACHE !== 'true',
    }
  };

  // Set CORS headers
  setHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json',
  });

  return testResults;
});
