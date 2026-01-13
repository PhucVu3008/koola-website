import 'dotenv/config';
import { buildServer } from './server';
import { pool } from './db';

const start = async () => {
  const server = await buildServer();

  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connected');

    const port = Number(process.env.PORT) || 4000;
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port, host });
    console.log(`🚀 Server running on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
