import Logger from "../logs/Logger";
import { redisClient } from "./redisClient";

class RedisUtils {

    public client = redisClient.client;

    async setEntry(entity: string, key: string, value: string) {
        if (this.client) {
            {
                try {
                    console.log(`setting redis cache for: ${entity}:${key}`);
                    Logger.info(`setting redis cache for: ${entity}:${key}`);
                    this.client.set(`${entity}:${key}`, JSON.stringify(value));
                } catch (redisError: any) {
                    console.error(`[RedisUtils] Redis error: ${redisError?.message}`);
                    Logger.error(`[RedisUtils] Redis error: ${redisError?.message}`);
                }
            }
        }
    }

    async getEntry(entity: string, key: string) {
        if (this.client) {
            try {
                let data: any[] = [];
                const cachedData: any = await this.client.get(`${entity}:${key}`);
                if (cachedData) {
                    data = JSON.parse(cachedData);
                    if (data?.length > 0) {
                        console.log(`[RedisUtils] redis cache found. returning redis cache for : ${entity}:${key}`);
                        Logger.info(`[RedisUtils] redis cache found. returning redis cache for : ${entity}:${key}`);
                        return data;
                    }
                }
            } catch (redisError: any) {
                console.error(`[RedisUtils] Redis error while getting cache data for ${entity}:${key}: ${redisError?.message}`);
                Logger.error(`[RedisUtils] Redis error while getting cache data for ${entity}:${key}: ${redisError?.message}`);
            }
        }
    }

    setExpiry(entity: string, key: string, expirationSeconds: number) {
        if (this.client) {
            {
                try {
                    console.log(`setting expiry redis cache for: ${entity}:${key} with expiration seconds: ${expirationSeconds}`);
                    Logger.info(`setting expiry redis cache for: ${entity}:${key} with expiration seconds: ${expirationSeconds}`);
                    this.client.expire(`${entity}:${key}`, `${expirationSeconds}`);
                } catch (redisError: any) {
                    console.error(`[RedisUtils] Redis error while setting expiry for ${entity}:${key} : ${redisError?.message}`);
                    Logger.error(`[RedisUtils] Redis error while setting expiry for ${entity}:${key} : ${redisError?.message}`);
                }
            }
        }
    }

    async setExpiryToAllKeys(entity: string, expirationSeconds: number) {
        try {
            // Get all keys matching the cacheEntity pattern
            const keys: string[] = await this.client.keys(`${entity}:*`);

            // Set expiry for each key
            for (const key of keys) {
                await this.client.expire(key, expirationSeconds);
            }

            console.log(`[RedisUtils] Expiry set for all keys in entity: ${entity}`);
            Logger.info(`[RedisUtils] Expiry set for all keys in entity: ${entity}`);

        } catch (error) {
            console.log(
                `[RedisUtils] setExpiryToAllKeys: error occurred: `,
                error
            );
            Logger.error(
                `[RedisUtils] setExpiryToAllKeys: error occurred: `,
                error
            );
            throw new Error(`Error while setting expiry for all keys in entity: ${entity}.`);
        }
    }

}

const redisUtils = new RedisUtils();
export { redisUtils };