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
            let jobLinkDetails: any[] = [];
            const quickCareerJobLinkCollection = db.dbConnector.db("InterviewSmasher").collection("quickCareerJobLink");
            const companiesCollection = db.dbConnector.db("InterviewSmasher").collection("companies");
            const response = await quickCareerJobLinkCollection.find({
                "user.email": user.email
            }).toArray();
            if (response && response.length > 0) {
                jobLinkDetails = response;
            }
            if (jobLinkDetails?.length > 0) {
                for (let jobEntry of jobLinkDetails) {
                    const response = await companiesCollection.findOne({
                        displayName: jobEntry.company
                    });
                    jobEntry['companyIconURL'] = response?.companyIconURL ? response.companyIconURL : undefined;
                }
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

    async updateStatusApplied(jobLinkDetails: QuickCareerJobLink) {
        try {
            console.log(`[QuickCareerService] updating job details link as applied: ${jobLinkDetails}`);
            Logger.info(`[QuickCareerService] updating job details link as applied: ${jobLinkDetails}`);
            const quickCareerJobLinkCollection = db.dbConnector.db("InterviewSmasher").collection("quickCareerJobLink");
            await quickCareerJobLinkCollection.updateOne(
                {
                    company: jobLinkDetails.company,
                    jobID: jobLinkDetails.jobID,
                    "user.email": jobLinkDetails.user.email
                },
                {
                    $set: {
                        jobStatus: "Applied"
                    }
                }
            );
            console.log(`[QuickCareerService] updating job details link as applied completed`);
            Logger.info(`[QuickCareerService] updating job details link as applied completed`);
            let messageModel = {
                statusMessage: "successully updated job details link as applied!",
                statusCode: 0,
            };
            return messageModel;
        } catch (error) {
            console.log(
                "[QuickCareerService] updateStatusApplied: error occured: ",
                error
            );
            Logger.error(
                "[QuickCareerService] updateStatusApplied: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error updating job details link as applied!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

}

const quickCareerService = new QuickCareerService();
export { quickCareerService };