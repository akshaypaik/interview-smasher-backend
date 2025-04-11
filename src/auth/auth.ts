import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { environmentVariables } from "../configurations/EnvironmentVariables";
import User from "src/models/DBCollectionSchemaModel/User.model";

class Auth {
    public async createToken(userDetails: User) {
        const payload = {
            email: userDetails?.email,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            phoneNumber: userDetails.phoneNumber,
        }
        const token = jwt.sign(
            payload,
            environmentVariables.JWT_SECRET_KEY,
            {
                expiresIn: "24h",
            }
        );
        return token;
    }

    public async verifyUser(req: any, res: any, next: NextFunction) {
        const token =
            req?.body?.token || req?.query?.token || req?.headers?.authorization;
        if (!token) {
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
            return res.status(401).send({
                message: "Invalid token"
            });
        }
        return next();
    }

}

const auth = new Auth();
export { auth };
