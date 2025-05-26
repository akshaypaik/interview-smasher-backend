import { redisClient } from "../redis/redisClient";
import Logger from "../logs/Logger";
import { redisUtils } from "../redis/redisUtils";

const MAX_REQUEST_COUNT = 120;

interface UserInfo {
    email: string;
    startTime: Date;
    endTime: Date;
    count: number;
}

class RateLimiter {

    public redisClient = redisClient.client;
    // not using this local object intead using redis for state management.
    public userInfo: UserInfo = {
        email: "",
        startTime: new Date(),
        endTime: new Date(),
        count: 0

    };

    public setUserInfo(userDetails: any, apiURL: string) {
        const redisEntity = `rateLimiter:${userDetails?.email}`
        const redisKey = `${apiURL}`;
        const userInfo = {
            email: userDetails.email,
            startTime: Date.now(),
            // endTime: Date.now() + 60 * 1000,    // 1 minute
            endTime: Date.now() + 60 * 1000,    // 60 minute
            count: 1
        }
        // this.userInfo[userDetails.email] = userInfo;
        redisUtils.setEntry(redisEntity, redisKey, JSON.stringify(userInfo));
    }

    public async checkRateLimiter(userDetails: any, res: any, apiURL: string) {
        console.log(`check rate limiter started for user: ${userDetails.email}`);
        const redisEntity = `rateLimiter:${userDetails?.email}`
        const redisKey = `${apiURL}`;
        let userInfo: any = await redisUtils.getEntry(redisEntity, redisKey);
        if (userInfo) {
            userInfo = JSON.parse(userInfo);
        }
        if (!userInfo) {
            console.log(`setting user info object rate limiter for user: ${userInfo?.email}`);
            Logger.info(`setting user info object rate limiter for user: ${userInfo?.email}`);
            this.setUserInfo(userDetails, apiURL);
            return true;
        }
        else if (userInfo.count < MAX_REQUEST_COUNT
            && Date.now() > userInfo.startTime
            && Date.now() < userInfo.endTime) {
            // allow api access
            userInfo.count += 1;
            console.log(`check rate limiter count: ${userInfo.count}`);
            Logger.info(`check rate limiter count: ${userInfo.count}`);
            redisUtils.setEntry(redisEntity, redisKey, JSON.stringify(userInfo));
            return true;
        }
        else if (Date.now() > userInfo.endTime) {
            this.setUserInfo(userDetails, apiURL);
            return true;
        }
        else {
            console.log(`check rate limiter ended with a deny for user: ${userDetails.email}`);
            Logger.error(`check rate limiter ended with a deny for user: ${userDetails.email}`);
            return false;

        }
    }
}

const rateLimiter = new RateLimiter();
export { rateLimiter };