import { createClient } from 'redis';
import { json } from '@redis/json';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  modules: { json },
});

client.on('error', (err) => console.error('Redis error', err));

await client.connect();

export default client;
