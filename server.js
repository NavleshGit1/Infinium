import fs from 'fs';
import path from 'path';
import { createServer } from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8000;
const UI_DIR = path.resolve(__dirname, 'UI');

console.log(`📂 Serving files from: ${UI_DIR}`);

const server = createServer((req, res) => {
    // Log incoming request
    console.log(`📥 ${req.method} ${req.url}`);
    
    // Parse URL and remove query params
    const urlPath = req.url.split('?')[0];
    
    // Handle root path
    let requestPath = urlPath === '/' ? '/index.html' : urlPath;
    let filePath = path.join(UI_DIR, requestPath);
    
    // Normalize path
    filePath = path.normalize(filePath);
    
    // Prevent directory traversal
    if (!filePath.startsWith(UI_DIR)) {
        console.log(`❌ Security: Attempted traversal to ${filePath}`);
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden', 'utf-8');
        return;
    }
    
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'text/html';
    
    if (ext === '.js') contentType = 'application/javascript';
    else if (ext === '.css') contentType = 'text/css';
    else if (ext === '.json') contentType = 'application/json';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            console.error(`❌ Error: ${err.code} for ${requestPath}`);
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`<h1>404 - File Not Found</h1><p>Path: ${requestPath}</p><p>Full: ${filePath}</p>`, 'utf-8');
            } else if (err.code === 'EISDIR') {
                // If it's a directory, try to serve index.html
                const indexPath = path.join(filePath, 'index.html');
                fs.readFile(indexPath, (indexErr, indexContent) => {
                    if (indexErr) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 - Not Found</h1>', 'utf-8');
                    } else {
                        res.writeHead(200, { 
                            'Content-Type': 'text/html',
                            'Access-Control-Allow-Origin': '*',
                            'Cache-Control': 'no-cache'
                        });
                        res.end(indexContent, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`<h1>500 - Server Error</h1><p>${err.message}</p>`, 'utf-8');
            }
        } else {
            console.log(`✅ Serving ${requestPath}`);
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.on('error', (err) => {
    console.error('🔴 Server error:', err);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🌐 Frontend Server running on http://localhost:${PORT}`);
    console.log(`📂 Serving: ${UI_DIR}`);
    console.log(`🔗 Backend API: http://localhost:3000`);
    console.log(`✨ Application ready at http://localhost:${PORT}\n`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Server shutting down...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});
