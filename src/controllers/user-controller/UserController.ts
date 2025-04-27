import { Response, Request } from "express";
import { userService } from "../../services/user-service/UserService";
import jwt from "jsonwebtoken";
import { environmentVariables } from "../../configurations/EnvironmentVariables";

class UserController {
    public async validateJsonToken(req: Request, res: Response) {
        try {
            const token = req?.headers?.authorization?.split(" ")[1] || req?.query?.token || req?.body?.token;
            if (!token) {
                return res.status(400).send({
                    statusMessage: "Token is required",
                    statusCode: -1,
                });
            }
            const decoded = jwt.verify(token, environmentVariables.JWT_SECRET_KEY);
            let messageModel = {
                statusMessage: "Successfully logged in!",
                statusCode: 0,
            };
            let userModel = {
                messageModel: messageModel,
                token: token
            };
            if (typeof decoded === "object") {
                userModel["email"] = decoded.email;
                userModel["firstName"] = decoded.firstName;
                userModel["lastName"] = decoded.lastName;
                userModel["phoneNumber"] = decoded.phoneNumber;
                userModel["profilePicURL"] = decoded?.profilePicURL;
            }
            res.send(userModel);
        } catch (error) {
            console.error("Invalid token:", error);
            let messageModel = { statusMessage: "Invalid token", statusCode: -1 }
            let userModel = {
                messageModel,
                firstName: null,
                lastName: null,
                phoneNumber: null,
                email: null,
                token: null
            };
            res.status(401).send(userModel);
        }
    }

    public async registerUser(req: Request, res: Response) {
        try {
            const userDetails = req?.body;
            const response = await userService.registerUser(userDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

    public async loginUser(req: Request, res: Response) {
        console.log("[UserController] login api started");
        let user = req?.body;
        if (!user.email || !user.password) {
            res.status(500).send("Invalid input");
        }
        try {
            if (user.email === "" || user.password === "" || user.email === null || user.password === null
                || user.email === undefined || user.password === undefined) {
                let messageModel = {
                    statusMessage: "Invalid input!",
                    statusCode: -1,
                };
                res.send(messageModel);
            }

            const result = await userService.loginUser(user);
            console.log("user details after login: ", result);
            res.cookie("is_token", result?.token);
            console.log("[UserController] login api completed");
            res.send(result);
        } catch (error) {
            res.send(error);
        }
    }

    public async updateUserProfile(req: Request, res: Response) {
        try {
            const userDetails = req?.body;
            const response = await userService.updateUserProfile(userDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

    public async updateUserProfilePicture(req: Request, res: Response) {
        try {
            const userDetails = req?.body;
            const userProfilePicFile = req?.file;
            const response = await userService.updateUserProfilePicture(userDetails, userProfilePicFile);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }
}

const userController = new UserController();
export { userController };