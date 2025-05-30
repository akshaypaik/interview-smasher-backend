import User from "src/models/DBCollectionSchemaModel/User.model";
import { db } from "../../db";
import bcrypt from "bcrypt";
import { auth } from "../../auth/auth";
import Logger from "../../logs/Logger";
import { helperService } from "../../shared/helper";

class UserService {
    public async registerUser(userDetails: User) {
        try {
            console.log(`[UserService] post register api service started for user: ${userDetails}`);
            Logger.info(`[UserService] post register api service started for user: ${userDetails}`);
            const userCollection = db.dbConnector.db("InterviewSmasher").collection("users");
            let salt = bcrypt.genSaltSync(10);
            if (userDetails.password) {
                userDetails.password = bcrypt.hashSync(userDetails.password, salt);
            }
            const userId = helperService.generateUserIdFromEmail(userDetails.email);
            userDetails.userId = userId;
            const response = await userCollection.insertOne(userDetails);
            console.log("[UserService] post register api completed");
            Logger.info("[UserService] post register api completed");
            return {
                statusMessage: "success! user registered.",
                statusCode: 0,
            };
        } catch (error) {
            console.log(
                "[UserService] registerUser: error occured: ",
                error
            );
            Logger.error(
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
        Logger.info("[User Service] login user api started");
        try {
            const userCollection = db.dbConnector.db("InterviewSmasher").collection("users");
            const userDetailsResult = await userCollection.findOne({
                email: userDetails.email,
            });
            if (userDetails && bcrypt.compareSync(userDetails.password, userDetailsResult.password)) {
                const token = await auth.createToken(userDetailsResult);
                let messageModel = {
                    statusMessage: "Successfully logged in!",
                    statusCode: 0,
                };
                let userModel = {
                    messageModel: messageModel,
                    email: userDetails.email,
                    firstName: userDetailsResult.firstName,
                    lastName: userDetailsResult.lastName,
                    phoneNumber: userDetailsResult.phoneNumber,
                    profilePicURL: userDetailsResult?.profilePicURL,
                    githubProfileURL: userDetailsResult?.githubProfileURL,
                    linkedInProfileURL: userDetailsResult?.linkedInProfileURL,
                    portfolioWebsiteURL: userDetailsResult?.portfolioWebsiteURL,
                    token: token
                };
                console.log(
                    "[User Service] login user api completed with success creds"
                );
                Logger.info(
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
                Logger.error(
                    "[User Service] login user api completed with invalid creds"
                );
                return userModel;
            }
        } catch (error) {
            console.log("[User Service] login user api error occured: ", error);
            Logger.error("[User Service] login user api error occured: ", error);
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

    public async updateUserProfile(userDetails: User) {
        try {
            console.log(`[UserService] update user profile api service started for user: ${userDetails}`);
            Logger.info(`[UserService] update user profile api service started for user: ${userDetails}`);
            const userCollection = db.dbConnector.db("InterviewSmasher").collection("users");

            const response = await userCollection.updateOne(
                {
                    email: userDetails.email
                },
                {
                    $set: {
                        firstName: userDetails.firstName,
                        lastName: userDetails.lastName,
                        githubProfileURL: userDetails?.githubProfileURL,
                        linkedInProfileURL: userDetails?.linkedInProfileURL,
                        portfolioWebsiteURL: userDetails?.portfolioWebsiteURL
                    }
                }
            );
            const newToken = await auth.createToken(userDetails);
            let messageModel = {
                statusMessage:
                    "Successfully updated user profile!",
                statusCode: 0,
            };
            console.log("[UserService] updating user profile completed");
            Logger.info("[UserService] updating user profile completed");
            return {
                "status": "success",
                messageModel,
                token: newToken
            };
        } catch (error) {
            console.log(
                "[UserService] updateUserProfile: error occured: ",
                error
            );
            Logger.error(
                "[UserService] updateUserProfile: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while updating user profile!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

    public async updateUserProfilePicture(userDetails: User, userProfilePicFile: any) {
        try {
            console.log(`[UserService] update user profile picture api service started`);
            Logger.info(`[UserService] update user profile picture api service started`);
            const userCollection = db.dbConnector.db("InterviewSmasher").collection("users");


            const fileName = userDetails.email.split("@")[0] + "." + userProfilePicFile.mimetype.split("/").pop();
            const profilePicURL = `${userDetails.email}/${fileName}`;

            const response = await userCollection.updateOne(
                {
                    email: userDetails.email
                },
                {
                    $set: {
                        profilePicURL: profilePicURL
                    }
                }
            );
            userDetails.profilePicURL = profilePicURL;
            const newToken = await auth.createToken(userDetails);

            let messageModel = {
                statusMessage:
                    "Successfully updated user profile!",
                statusCode: 0,
            };
            console.log("[UserService] updating user profile picture completed");
            Logger.info("[UserService] updating user profile picture completed");
            return {
                "status": "success",
                messageModel,
                token: newToken,
                profilePicURL
            };
        } catch (error) {
            console.log(
                "[UserService] updateUserProfilePicture: error occured: ",
                error
            );
            Logger.error(
                "[UserService] updateUserProfilePicture: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while updating user profile picture!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

    async checkEmailExists(email: string) {
        try {
            console.log("[UserService] check user email exists api service started for ", email);
            Logger.info("[UserService] check user email exists api api service startedfor ", email);
            let appliedCompaniesDetails: [] = [];
            const userCollection = db.dbConnector.db("InterviewSmasher").collection("users");
            let messageModel = {};
            const response = await userCollection.findOne({
                "email": email
            });
            if (response) {
                messageModel = {
                    statusCode: 0,
                    statusMessage: "email found",
                    data: {
                        emailFound: true
                    }
                }
            } else {
                messageModel = {
                    statusCode: -1,
                    statusMessage: "email not found",
                    data: {
                        emailFound: false
                    }
                }
            }
            console.log("[UserService] check user email exists api service completed for ", email);
            Logger.info("[UserService] check user email exists api service completed for ", email);
            return messageModel;
        } catch (error) {
            console.log(
                "[UserService] checkEmailExists: error occured: ",
                error
            );
            Logger.error(
                "[UserService] checkEmailExists: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while checking email exists!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

}

const userService = new UserService();
export { userService };