import Redis from 'ioredis';

const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
client.on('error', (err) => console.error('Redis error', err));

export default client;
