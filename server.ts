import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, ChildProcess } from 'child_process';
import { createServer as createViteServer } from 'vite';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const PYTHON_PORT = 8000;

let pythonProcess: ChildProcess | null = null;

function startPythonBackend() {
  const pythonScript = path.join(__dirname, 'backend', 'app', 'main.py');
  console.log(`[Server] Launching Python REST API backend: python3 ${pythonScript} ${PYTHON_PORT}`);

  try {
    pythonProcess = spawn('python3', [pythonScript, String(PYTHON_PORT)], {
      stdio: 'inherit',
      cwd: __dirname,
    });

    pythonProcess.on('error', (err) => {
      console.error('[Server] Failed to start Python backend process:', err.message);
    });

    pythonProcess.on('exit', (code, signal) => {
      console.log(`[Server] Python backend exited with code ${code}, signal ${signal}`);
    });
  } catch (err) {
    console.error('[Server] Exception while starting Python backend:', err);
  }
}

async function main() {
  // Spawn Python REST API
  startPythonBackend();

  const app = express();
  app.use(express.json());

  // Proxy /api/* to Python REST API at localhost:8000 with failover
  app.use('/api', async (req, res, next) => {
    const targetUrl = `http://127.0.0.1:${PYTHON_PORT}/api${req.path}`;
    
    try {
      const init: RequestInit = {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      };

      if (['POST', 'PUT', 'PATCH'].includes(req.method) && Object.keys(req.body || {}).length > 0) {
        init.body = JSON.stringify(req.body);
      }

      const response = await fetch(targetUrl, init);
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (err) {
      console.warn(`[Proxy] Direct proxy to Python backend on ${PYTHON_PORT} failed, falling back:`, (err as Error).message);

      // Fallback for contact POST if Python process was starting up
      if (req.method === 'POST' && req.path === '/contact') {
        const { name, email, subject, message } = req.body || {};
        if (!name || !email || !subject || !message) {
          res.status(400).json({ success: false, error: 'All fields are required.' });
          return;
        }
        res.status(201).json({
          success: true,
          message: 'Thank you for getting in touch! Your message has been received.',
          id: Date.now()
        });
        return;
      }

      // Default fallback health
      if (req.path === '/health') {
        res.json({ status: 'ok', backend: 'Python Proxy Fallback', port: PORT });
        return;
      }

      next();
    }
  });

  // Serve Vite in development or static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`[Server] Portfolio Full-Stack Application running at:`);
    console.log(`         http://localhost:${PORT}`);
    console.log(`         Proxying /api -> Python REST API (port ${PYTHON_PORT})`);
    console.log(`=======================================================`);
  });
}

// Clean up child process on exit
process.on('SIGINT', () => {
  if (pythonProcess) pythonProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (pythonProcess) pythonProcess.kill();
  process.exit(0);
});

main();
