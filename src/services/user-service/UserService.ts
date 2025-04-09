import User from "src/models/DBCollectionSchemaModel/User.model";
import { db } from "../../db";

class UserService {
    public async registerUser(userDetails: User) {
        try {
            console.log(`[UserService] post register api service started for user: ${userDetails}`);
            const userCollection = db.dbConnector.db("InterviewSmasher").collection("users");
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

}

const userService = new UserService();
export { userService };