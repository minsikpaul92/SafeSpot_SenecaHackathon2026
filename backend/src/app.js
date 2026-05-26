import { Hono } from 'hono';
import { getAlertLevel } from './alerts.js';
import { createSensorStore } from './sensor-store.js';

const sensorStore = createSensorStore();

const parseTemperature = async (c) => {
  const body = await c.req.json().catch(() => null);
  const temperature = body?.temperature;

  if (typeof temperature !== 'number' || Number.isNaN(temperature)) {
    return null;
  }

  return temperature;
};

const createReadingPayload = (reading) => {
  const alert = getAlertLevel(reading.temperature);

  return {
    temperature: reading.temperature,
    timestamp: reading.timestamp,
    alert,
  };
};

export const createApp = () => {
  const app = new Hono();

  app.get('/health', (c) => c.json({ status: 'ok' }));

  app.post('/api/sensor-data', async (c) => {
    const temperature = await parseTemperature(c);

    if (temperature === null) {
      return c.json({ error: 'Missing required field: temperature' }, 400);
    }

    const reading = sensorStore.save(temperature);

    return c.json({ status: 'ok', ...createReadingPayload(reading) });
  });

  app.get('/api/sensor-latest', (c) => {
    const latestReading = sensorStore.getLatest();

    if (!latestReading) {
      return c.body('', 204);
    }

    return c.json(createReadingPayload(latestReading));
  });

  app.post('/api/sensor-override', async (c) => {
    const temperature = await parseTemperature(c);

    if (temperature === null) {
      return c.json({ error: 'Missing required field: temperature' }, 400);
    }

    sensorStore.save(temperature);

    return c.json({
      status: 'overridden',
      temperature,
    });
  });

  return app;
};
