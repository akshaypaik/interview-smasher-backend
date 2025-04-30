import Logger from "../logs/Logger";

const MAX_REQUEST_COUNT = 120;

class RateLimiter{
    
    public userInfo: any = {};

    public setUserInfo(userDetails: any){
        const userInfo = {
            email: userDetails.email,
            startTime: Date.now(),
            // endTime: Date.now() + 60 * 1000,    // 1 minute
            endTime: Date.now() + 60 * 1000,    // 60 minute
            count: 1
        }
        this.userInfo[userDetails.email] = userInfo;
    }
    
    public async checkRateLimiter(userDetails: any, res: any){
        console.log(`check rate limiter started for user: ${userDetails.email}`);
        if(!this.userInfo[userDetails.email]){
            console.log(`setting user info object rate limiter for user: ${userDetails.email}`);
            Logger.info(`setting user info object rate limiter for user: ${userDetails.email}`);
            this.setUserInfo(userDetails);
            return true;
        }
        else if(this.userInfo[userDetails.email].count < MAX_REQUEST_COUNT 
            && Date.now() > this.userInfo[userDetails.email].startTime 
            && Date.now() < this.userInfo[userDetails.email].endTime){
            // allow api access
            this.userInfo[userDetails.email].count += 1; 
            console.log(`check rate limiter count: ${this.userInfo[userDetails.email].count}`);
            Logger.info(`check rate limiter count: ${this.userInfo[userDetails.email].count}`);
            return true;
        } 
        else if(Date.now() > this.userInfo[userDetails.email].endTime){
            this.setUserInfo(userDetails);
            return true;
        }
        else{
            console.log(`check rate limiter ended with a deny for user: ${userDetails.email}`);
            Logger.error(`check rate limiter ended with a deny for user: ${userDetails.email}`);
            return false;
           
        }
    }
}

const rateLimiter = new RateLimiter();
export { rateLimiter };