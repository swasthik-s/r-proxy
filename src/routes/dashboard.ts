export default defineEventHandler(async (event) => {
  // Handle CORS preflight requests
  if (isPreflightRequest(event)) {
    return handleCors(event, {});
  }

  setHeaders(event, {
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*',
  });

  const baseUrl = getRequestURL(event).origin;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Proxy - Test Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 12px; 
            padding: 30px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { color: #333; font-size: 2.5em; margin-bottom: 10px; }
        .header p { color: #666; font-size: 1.1em; }
        .status { 
            display: inline-block; 
            padding: 8px 16px; 
            background: #10b981; 
            color: white; 
            border-radius: 20px; 
            font-weight: 500;
            margin-top: 10px;
        }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card { 
            background: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 8px; 
            padding: 20px; 
            transition: transform 0.2s;
        }
        .card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .card h3 { color: #1a202c; margin-bottom: 15px; font-size: 1.3em; }
        .card p { color: #4a5568; margin-bottom: 15px; line-height: 1.5; }
        .btn { 
            background: #3182ce; 
            color: white; 
            padding: 10px 20px; 
            border: none; 
            border-radius: 6px; 
            cursor: pointer; 
            font-size: 14px; 
            font-weight: 500;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover { background: #2c5aa0; transform: translateY(-1px); }
        .btn-secondary { background: #718096; }
        .btn-secondary:hover { background: #4a5568; }
        .result { 
            margin-top: 15px; 
            padding: 15px; 
            background: #edf2f7; 
            border-radius: 6px; 
            font-family: monospace; 
            font-size: 12px; 
            white-space: pre-wrap; 
            max-height: 200px; 
            overflow-y: auto;
            display: none;
        }
        .endpoint { 
            background: #f1f5f9; 
            padding: 8px 12px; 
            border-radius: 4px; 
            font-family: monospace; 
            color: #1e293b; 
            margin: 10px 0;
            word-break: break-all;
        }
        .footer { 
            text-align: center; 
            padding-top: 30px; 
            border-top: 1px solid #e2e8f0; 
            color: #718096; 
        }
        .loading { display: none; }
        .error { background: #fed7d7; color: #c53030; }
        .success { background: #c6f6d5; color: #22543d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔄 Simple Proxy</h1>
            <p>Reverse proxy service for bypassing CORS and handling streaming content</p>
            <div class="status">✅ Proxy is Online</div>
        </div>

        <div class="grid">
            <div class="card">
                <h3>🩺 Health Check</h3>
                <p>Test basic proxy connectivity and get version information.</p>
                <div class="endpoint">GET ${baseUrl}/</div>
                <button class="btn" onclick="testEndpoint('/', 'health-result')">Test Health Check</button>
                <div id="health-result" class="result"></div>
            </div>

            <div class="card">
                <h3>🔍 System Test</h3>
                <p>Get detailed information about proxy configuration and request details.</p>
                <div class="endpoint">GET ${baseUrl}/test</div>
                <button class="btn" onclick="testEndpoint('/test', 'system-result')">Run System Test</button>
                <div id="system-result" class="result"></div>
            </div>

            <div class="card">
                <h3>🚀 Proxy Test</h3>
                <p>Test actual proxy functionality by making a request through the proxy.</p>
                <div class="endpoint">GET ${baseUrl}/test-proxy</div>
                <button class="btn" onclick="testEndpoint('/test-proxy', 'proxy-result')">Test Proxy Function</button>
                <div id="proxy-result" class="result"></div>
            </div>

            <div class="card">
                <h3>🌐 Custom Proxy</h3>
                <p>Test proxying to a custom URL. Enter any public API endpoint.</p>
                <input type="text" id="custom-url" placeholder="https://api.example.com/data" 
                       style="width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #d1d5db; border-radius: 4px;">
                <button class="btn" onclick="testCustomProxy()">Test Custom URL</button>
                <div id="custom-result" class="result"></div>
            </div>

            <div class="card">
                <h3>📺 M3U8 Proxy</h3>
                <p>Test M3U8 playlist proxying for video streaming.</p>
                <input type="text" id="m3u8-url" placeholder="https://example.com/playlist.m3u8" 
                       style="width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #d1d5db; border-radius: 4px;">
                <button class="btn btn-secondary" onclick="testM3U8Proxy()">Test M3U8 Proxy</button>
                <div id="m3u8-result" class="result"></div>
            </div>

            <div class="card">
                <h3>📖 Usage Examples</h3>
                <p>Copy these examples to use the proxy in your applications:</p>
                <div style="margin-top: 15px;">
                    <strong>JavaScript:</strong>
                    <div class="endpoint">fetch('${baseUrl}/?destination=' + encodeURIComponent('https://api.example.com'))</div>
                    
                    <strong>cURL:</strong>
                    <div class="endpoint">curl "${baseUrl}/?destination=https://api.example.com"</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Simple Proxy v${useRuntimeConfig(event).version} | Built with Nitro | 
            <a href="https://github.com/your-repo/simple-proxy" style="color: #3182ce;">Documentation</a></p>
        </div>
    </div>

    <script>
        async function testEndpoint(endpoint, resultId) {
            const resultEl = document.getElementById(resultId);
            resultEl.style.display = 'block';
            resultEl.className = 'result loading';
            resultEl.textContent = 'Testing... Please wait.';

            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                
                resultEl.className = response.ok ? 'result success' : 'result error';
                resultEl.textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                resultEl.className = 'result error';
                resultEl.textContent = 'Error: ' + error.message;
            }
        }

        async function testCustomProxy() {
            const url = document.getElementById('custom-url').value.trim();
            const resultEl = document.getElementById('custom-result');
            
            if (!url) {
                alert('Please enter a URL to test');
                return;
            }

            resultEl.style.display = 'block';
            resultEl.className = 'result loading';
            resultEl.textContent = 'Testing custom proxy... Please wait.';

            try {
                const proxyUrl = '/?destination=' + encodeURIComponent(url);
                const response = await fetch(proxyUrl);
                
                let data;
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }
                
                resultEl.className = response.ok ? 'result success' : 'result error';
                resultEl.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
            } catch (error) {
                resultEl.className = 'result error';
                resultEl.textContent = 'Error: ' + error.message;
            }
        }

        async function testM3U8Proxy() {
            const url = document.getElementById('m3u8-url').value.trim();
            const resultEl = document.getElementById('m3u8-result');
            
            if (!url) {
                alert('Please enter an M3U8 URL to test');
                return;
            }

            resultEl.style.display = 'block';
            resultEl.className = 'result loading';
            resultEl.textContent = 'Testing M3U8 proxy... Please wait.';

            try {
                const proxyUrl = '/m3u8-proxy?url=' + encodeURIComponent(url);
                const response = await fetch(proxyUrl);
                const data = await response.text();
                
                resultEl.className = response.ok ? 'result success' : 'result error';
                resultEl.textContent = data;
            } catch (error) {
                resultEl.className = 'result error';
                resultEl.textContent = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>`;
});
