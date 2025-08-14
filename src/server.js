const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { connectDB } = require('./config/db');
const { env } = require('./config/env');
const { connectRedis, redis } = require('./config/redis');
const { logger } = require('./utils/logger');


const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: env.corsOrigins, credentials: true }
});
app.set('io', io);

io.on('connection', (socket) => {
  socket.on('join', (userId) => { if (userId) socket.join(String(userId)); });
});

const start = async () => {
  await connectDB();
  await connectRedis();
  server.listen(env.port, () => logger.info(`API running on :${env.port}`));
};

const shutdown = async (signal) => {
  try {
    logger.info(`Received ${signal}, shutting down...`);
    io.close();
    server.close(() => logger.info('HTTP server closed'));
    if (redis.isOpen) await redis.quit();
    process.exit(0);
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
