import http.server, socketserver, sys

class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

class S(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True
    request_queue_size = 256

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8124
    with S(('127.0.0.1', port), H) as httpd:
        httpd.serve_forever()
