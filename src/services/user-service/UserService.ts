import User from "src/models/DBCollectionSchemaModel/User.model";
import { db } from "../../db";
import bcrypt from "bcrypt";
import { auth } from "../../auth/auth";

class UserService {
    public async registerUser(userDetails: User) {
        try {
            console.log(`[UserService] post register api service started for user: ${userDetails}`);
            const userCollection = db.dbConnector.db("InterviewSmasher").collection("users");
            let salt = bcrypt.genSaltSync(10);
            if (userDetails.password) {
                userDetails.password = bcrypt.hashSync(userDetails.password, salt);
            }
            const response = await userCollection.insertOne(userDetails);
            console.log("[UserService] post register api completed");
            return {
                statusMessage: "success! user registered.",
                statusCode: 0,
            };
        } catch (error) {
            console.log(
                "[UserService] registerUser: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while registering user!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

    public async loginUser(userDetails: User) {
        console.log("[User Service] login user api started");
        try {
            const userCollection = db.dbConnector.db("InterviewSmasher").collection("users");
            const userDetailsResult = await userCollection.findOne({
                email: userDetails.email,
            });
            if (userDetails && bcrypt.compareSync(userDetails.password, userDetailsResult.password)) {
                const token = await auth.createToken(userDetails);
                let messageModel = {
                    statusMessage: "Successfully logged in!",
                    statusCode: 0,
                };
                let userModel = {
                    messageModel: messageModel,
                    email: userDetails.email,
                    token: token
                };
                console.log(
                    "[User Service] login user api completed with success creds"
                );
                return userModel;
            } else {
                let messageModel = {
                    statusMessage: "Invalid credentials!",
                    statusCode: -1,
                };
                let userModel = {
                    messageModel: messageModel,
                    email: null,
                    token: null
                };
                console.log(
                    "[User Service] login user api completed with invalid creds"
                );
                return userModel;
            }
        } catch (error) {
            console.log("[User Service] login user api error occured: ", error);
            let messageModel = {
                statusMessage: "Invalid credentials!",
                statusCode: -1,
            };
            let userModel = {
                messageModel: messageModel,
                email: null,
                token: null
            };
            console.log(
                "[User Service] login user api completed with invalid creds"
            );
            throw userModel;
        }
    }

}

const userService = new UserService();
export { userService };