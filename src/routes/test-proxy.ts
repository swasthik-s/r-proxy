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

  const testUrl = 'https://httpbin.org/json';

  try {
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'simple-proxy-test',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      status: 'success',
      message: 'Proxy functionality test completed successfully',
      timestamp: new Date().toISOString(),
      test: {
        targetUrl: testUrl,
        responseStatus: response.status,
        responseHeaders: Object.fromEntries(response.headers.entries()),
        responseData: data,
      },
      proxy: {
        version: useRuntimeConfig(event).version,
        corsEnabled: true,
        working: true,
      }
    };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      status: 'error',
      message: 'Proxy functionality test failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      test: {
        targetUrl: testUrl,
        working: false,
      },
      proxy: {
        version: useRuntimeConfig(event).version,
        corsEnabled: true,
      }
    };
  }
});
