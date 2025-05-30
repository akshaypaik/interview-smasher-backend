import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { environmentVariables } from "../configurations/EnvironmentVariables";
import User from "src/models/DBCollectionSchemaModel/User.model";
import Logger from "../logs/Logger";

class Auth {
    public async createToken(userDetails: User) {
        Logger.info(`[Auth] creating json token started for user: ${JSON.stringify(userDetails)}`);
        const payload = {
            email: userDetails?.email,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            phoneNumber: userDetails.phoneNumber,
            profilePicURL: userDetails.profilePicURL,
            githubProfileURL: userDetails?.githubProfileURL,
            linkedInProfileURL: userDetails?.linkedInProfileURL,
            portfolioWebsiteURL: userDetails?.portfolioWebsiteURL
        }
        const token = jwt.sign(
            payload,
            environmentVariables.JWT_SECRET_KEY,
            {
                expiresIn: "24h",
            }
        );
        Logger.info(`[Auth] creation of token completed.`);
        return token;
    }

    public async verifyUser(req: any, res: any, next: NextFunction) {
        Logger.info(`[Auth] verifying user started`);
        const token =
            req?.body?.token || req?.query?.token || req?.headers?.authorization;
        if (!token) {
            Logger.error(`[Auth] token not valid`);
            return res.status(403).send({
                message: "A token is required for authentication"
            });
        }
        const decodedToken = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
        );
        try {
            const decoded = jwt.verify(token, environmentVariables.JWT_SECRET_KEY);
            req.user = decoded;
        } catch (err) {
            Logger.error(`[Auth] token decryption failed. Not a valid token`);
            return res.status(401).send({
                message: "Invalid token"
            });
        }
        return next();
    }

}

const auth = new Auth();
export { auth };
