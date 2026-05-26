import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getAlertLevel } from './alerts.js';
import { createSensorStore } from './sensor-store.js';

const parseTemperature = async (c) => {
  const body = await c.req.json().catch(() => undefined);

  if (body === undefined) {
    return { success: false, error: 'Invalid JSON body' };
  }

  const temperature = body?.temperature;

  if (typeof temperature !== 'number' || Number.isNaN(temperature)) {
    return { success: false, error: 'Missing or invalid field: temperature' };
  }

  return { success: true, temperature };
};

const createEmptyReadingPayload = () => ({
  temperature: null,
  timestamp: null,
  source: null,
  alert: null,
});

const createReadingPayload = (reading) => ({
  temperature: reading.temperature,
  timestamp: reading.timestamp,
  source: reading.source,
  alert: getAlertLevel(reading.temperature),
});

export const createApp = ({ sensorStore = createSensorStore() } = {}) => {
  const app = new Hono();

  app.use('*', cors());

  app.get('/', (c) => c.json({ status: 'ok' }));
  app.get('/health', (c) => c.json({ status: 'ok' }));

  app.post('/api/sensor-data', async (c) => {
    const result = await parseTemperature(c);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    sensorStore.save(result.temperature, 'sensor');

    return c.json({ status: 'ok' });
  });

  app.get('/api/sensor-latest', (c) => {
    const latestReading = sensorStore.getLatest();

    if (!latestReading) {
      return c.json(createEmptyReadingPayload());
    }

    return c.json(createReadingPayload(latestReading));
  });

  app.post('/api/sensor-override', async (c) => {
    const result = await parseTemperature(c);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    sensorStore.save(result.temperature, 'override');

    return c.json({
      status: 'overridden',
      temperature: result.temperature,
    });
  });

  return app;
};
