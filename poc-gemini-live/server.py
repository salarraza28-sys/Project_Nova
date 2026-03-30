"""
HTTP server for the POC.
- Serves static files with AudioWorklet-required headers.
- Exposes GET /config → {"apiKey": "..."} loaded from .env
Run: python server.py
"""
import http.server, socketserver, os, json, re

PORT = 3000
DIR  = os.path.dirname(os.path.abspath(__file__))

# ── Load .env ────────────────────────────────────────────────
def load_env(path):
    env = {}
    try:
        with open(path) as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                m = re.match(r'^([A-Z_]+)\s*=\s*(.+)$', line)
                if m:
                    env[m.group(1)] = m.group(2).strip().strip('"').strip("'")
    except FileNotFoundError:
        pass
    return env

env = load_env(os.path.join(DIR, '.env'))
API_KEY = env.get('GEMINI_API_KEY', '')

if API_KEY:
    print(f"  ✅  API key loaded from .env ({API_KEY[:8]}...)")
else:
    print("  ⚠️   No GEMINI_API_KEY found in .env — enter it manually in the browser")

# ── Handler ───────────────────────────────────────────────────
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def do_GET(self):
        # Config endpoint — returns the API key to the browser
        if self.path == '/config':
            body = json.dumps({"apiKey": API_KEY}).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def end_headers(self):
        self.send_header("Cross-Origin-Opener-Policy",   "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        super().end_headers()

    def log_message(self, fmt, *args):
        print(f"  {self.address_string()} — {fmt % args}")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.allow_reuse_address = True
    print(f"\n  🚀  POC server → http://localhost:{PORT}\n")
    httpd.serve_forever()
