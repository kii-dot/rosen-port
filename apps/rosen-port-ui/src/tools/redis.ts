import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
dotenv.config();

const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_URL ?? '';
const UPSTASH_REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN ?? '';

const redisConfig = {
  url: UPSTASH_REDIS_URL,
  token: UPSTASH_REDIS_TOKEN,
};

export const redis = new Redis(redisConfig);
