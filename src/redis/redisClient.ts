import Redis from "ioredis";
import Logger from "../logs/Logger";
import { environmentVariables } from "../configurations/EnvironmentVariables";

const MAX_RETIRES = 5;

const REDIS_URL = 'redis://redis-interview-smasher:6379';

class RedisClient {
    public client: Redis;

    constructor() {
        this.client = new Redis(environmentVariables.REDIS_URL, {
            retryStrategy: (times) => {
                const delay = 1000; // Delay in milliseconds between retries
                if (times >= MAX_RETIRES) {
                    Logger.error("Redis Error: Maximum retry attempts reached");
                    console.error("Redis Error: Maximum retry attempts reached");
                    return null; // Stop retrying
                }
                Logger.warn(`Redis Error: Retry attempt ${times}, retrying in ${delay}ms`);
                console.warn(`Redis Error: Retry attempt ${times}, retrying in ${delay}ms`);
                return delay;
            },
        });
        this.client.on('error', (error) => {
            Logger.error("Failed to connect to Redis:", error.message);
            console.error("Failed to connect to Redis:", error.message);
        });
    }

    async init() {
        try {
            const result = await this.client.ping();
            Logger.info("Redis is connected with ping result:", result);
            console.log("Redis is connected with ping result:", result);
        } catch (error: any) {
            Logger.error("Failed to connect to Redis:", error.message);
            console.error("Failed to connect to Redis:", error.message);
            throw new Error("Redis connection failed");
        }
    }
}

const redisClient = new RedisClient();
export { redisClient };