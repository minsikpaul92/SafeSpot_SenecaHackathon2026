import { serve } from '@hono/node-server';
import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 8000);
const app = createApp();

serve({
  fetch: app.fetch,
  port,
});

console.log(`SafeSpot backend running on http://localhost:${port}`);
