import Logger from "../../logs/Logger";
import { db } from "../../db";
import QuickCareerJobLink from "../../models/DBCollectionSchemaModel/QuickCareerJobLink.model";
import User from "../../models/DBCollectionSchemaModel/User.model";

class QuickCareerService {


    async postQuickCareerJobLink(jobLinkDetails: QuickCareerJobLink) {
        try {
            console.log(`[QuickCareerService] posting job details link: ${jobLinkDetails}`);
            Logger.info(`[QuickCareerService] posting job details link: ${jobLinkDetails}`);
            const quickCareerJobLinkCollection = db.dbConnector.db("InterviewSmasher").collection("quickCareerJobLink");
            await quickCareerJobLinkCollection.insertOne(jobLinkDetails);
            console.log(`[QuickCareerService] posting job details link completed`);
            Logger.info(`[QuickCareerService] posting job details link completed`);
            let messageModel = {
                statusMessage: "successully posted job details link!",
                statusCode: 0,
            };
            return messageModel;
        } catch (error) {
            console.log(
                "[QuickCareerService] postQuickCareerJobLink: error occured: ",
                error
            );
            Logger.error(
                "[QuickCareerService] postQuickCareerJobLink: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while posting job details link!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

     async getQuickCareerJobLink(user: User) {
            try {
                console.log("[QuickCareerService] get job link details api service started");
                Logger.info("[QuickCareerService] get job link details api service started");
                let jobLinkDetails: [] = [];
                const quickCareerJobLinkCollection = db.dbConnector.db("InterviewSmasher").collection("quickCareerJobLink");
                const response = await quickCareerJobLinkCollection.find({
                    "user.email": user.email
                }).toArray();
                if (response && response.length > 0) {
                    jobLinkDetails = response;
                }
                console.log("[QuickCareerService] get job link details api fetching completed");
                Logger.info("[QuickCareerService] get job link details api fetching completed");
                return jobLinkDetails;
            } catch (error) {
                console.log(
                    "[QuickCareerService] getQuickCareerJobLink: error occured: ",
                    error
                );
                Logger.error(
                    "[QuickCareerService] getQuickCareerJobLink: error occured: ",
                    error
                );
                let messageModel = {
                    statusMessage: "Error while reading job link details!",
                    statusCode: -1,
                };
                throw messageModel;
            }
        }

}

const quickCareerService = new QuickCareerService();
export { quickCareerService };