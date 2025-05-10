import Logger from "../logs/Logger";
import { redisClient } from "./redisClient";

class RedisUtils {

    public client = redisClient.client;

    async setEntry(entity: string, key: string, value: string) {
        if (this.client) {
            {
                try {
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
                    this.client.expire(`${entity}:${key}`, `${expirationSeconds}`);
                } catch (redisError: any) {
                    console.error(`[RedisUtils] Redis error while setting expiry for ${entity}:${key} : ${redisError?.message}`);
                    Logger.error(`[RedisUtils] Redis error while setting expiry for ${entity}:${key} : ${redisError?.message}`);
                }
            }
        }
    }

}

const redisUtils = new RedisUtils();
export { redisUtils };