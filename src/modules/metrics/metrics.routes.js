import { Router } from 'express';
import client from 'prom-client';

const router = Router();
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.get('/ready', (req, res) => res.json({ status: 'ready' }));
router.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

export default router;
