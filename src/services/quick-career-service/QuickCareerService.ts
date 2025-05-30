import Logger from "../../logs/Logger";
import { db } from "../../db";
import QuickCareerJobLink from "../../models/DBCollectionSchemaModel/QuickCareerJobLink.model";
import User from "../../models/DBCollectionSchemaModel/User.model";
import { redisClient } from "../../redis/redisClient";
import { redisUtils } from "../../redis/redisUtils";
import { helperService } from "../../shared/helper";
import { ObjectId } from "mongodb";
import moment from 'moment';

class QuickCareerService {

    // redis
    public redisClient = redisClient.client;
    public redisEntity = "quickCareerJobLink";

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

            // invalidate redis cache
            redisUtils.setExpiry(`${this.redisEntity}`, `${jobLinkDetails?.user?.email}`, 0);

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

            console.log(`[QuickCareerService] checking redis cache for job link details data for email: ${user.email}`);
            Logger.info(`[QuickCareerService] checking redis cache for job link details data for email: ${user.email}`);

            // search redis for cached data
            const cachedData: any = await redisUtils.getEntry(`${this.redisEntity}`, `${user.email}`);
            if (cachedData?.length > 0) {
                return cachedData;
            }

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
                    jobEntry['companyId'] = response?.companyId ? response.companyId : undefined;
                }
            }
            console.log("[QuickCareerService] get job link details api fetching completed");
            Logger.info("[QuickCareerService] get job link details api fetching completed");

            redisUtils.setEntry(`${this.redisEntity}`, `${user.email}`, JSON.stringify(jobLinkDetails));

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

    async updateStatusJobLink(jobLinkDetails: QuickCareerJobLink) {
        try {
            console.log(`[QuickCareerService] updating job details link: ${jobLinkDetails}`);
            Logger.info(`[QuickCareerService] updating job details link: ${jobLinkDetails}`);
            const quickCareerJobLinkCollection = db.dbConnector.db("InterviewSmasher").collection("quickCareerJobLink");


            if (jobLinkDetails?.jobStatus === "Application Rejected") {
                const averageApplicationResponseTimeCollection = db.dbConnector.db("InterviewSmasher").collection("averageApplicationResponseTime");
                const date1 = moment.utc(jobLinkDetails?.createdOn);
                const date2 = moment.utc(helperService.getUTCTimeNow());
                const applicationResponseTime = date2.diff(date1, 'days');
                const responseTimeObj = {
                    ...jobLinkDetails,
                    applicationAppliedOn: jobLinkDetails?.createdOn,
                    applicationRejectedOn: helperService.getUTCTimeNow(),
                    applicationResponseTime: applicationResponseTime
                }
                await averageApplicationResponseTimeCollection.insertOne(responseTimeObj);
            }

            let rowDate: any;
            if (jobLinkDetails?.jobStatus === "Interview Scheduled") {
                rowDate = jobLinkDetails?.createdOn;
            } else {
                rowDate = helperService.getUTCTimeNow();
            }

            if (jobLinkDetails?.jobStatus === "Applied") {
                console.log(`[QuickCareerService] updating applied company entry in appliedCompanies collection for: 
                    ${JSON.stringify(jobLinkDetails)}`)
                const appliedCompaniesCollection = db.dbConnector.db("InterviewSmasher").collection("appliedCompanies");
                const companiesCollection = db.dbConnector.db("InterviewSmasher").collection("companies");
                const companyDetails = await companiesCollection.findOne({
                    companyId: jobLinkDetails?.companyId
                })
                const updatedCompanyDetails = {
                    ...companyDetails,
                    isApplied: true,
                    user: jobLinkDetails?.user
                }
                await appliedCompaniesCollection.insertOne(updatedCompanyDetails);
            } else {
                const appliedCompaniesCollection = db.dbConnector.db("InterviewSmasher").collection("appliedCompanies");
                const response = await appliedCompaniesCollection.findOne({
                    companyId: jobLinkDetails?.companyId,
                    "user.email": jobLinkDetails?.user.email
                });
                if (response && response?.companyId) {
                    const response = await appliedCompaniesCollection.deleteOne({
                        companyId: jobLinkDetails.companyId,
                        "user.email": jobLinkDetails.user.email
                    });
                    console.log("[QuickCareerService] deleted already applied company from appliedCompanies collection: ",
                        response);
                }
            }

            await quickCareerJobLinkCollection.updateOne(
                {
                    company: jobLinkDetails.company,
                    jobID: jobLinkDetails.jobID,
                    "user.email": jobLinkDetails.user.email
                },
                {
                    $set: {
                        jobStatus: jobLinkDetails.jobStatus,
                        createdOn: rowDate
                    }
                }
            );

            // invalidate redis cache
            redisUtils.setExpiry(`${this.redisEntity}`, `${jobLinkDetails?.user?.email}`, 0);

            console.log(`[QuickCareerService] updating job details link completed`);
            Logger.info(`[QuickCareerService] updating job details link completed`);
            let messageModel = {
                statusMessage: "successully updated job details link!",
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
                statusMessage: "Error updating job details link!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

    async deleteQuickCareerJobLink(jobLinkDetails: QuickCareerJobLink) {
        try {
            console.log(`[QuickCareerService] deleting job details career link: ${jobLinkDetails}`);
            Logger.info(`[QuickCareerService] deleting job details career link: ${jobLinkDetails}`);
            const quickCareerJobLinkCollection = db.dbConnector.db("InterviewSmasher").collection("quickCareerJobLink");
            await quickCareerJobLinkCollection.deleteOne({
                _id: new ObjectId(jobLinkDetails._id),
            });
            console.log(`[QuickCareerService] deleting job details career link completed`);
            Logger.info(`[QuickCareerService] deleting job details career link completed`);
            let messageModel = {
                statusMessage: "successully deleted job details career link!",
                statusCode: 0,
            };

            // invalidate redis cache
            redisUtils.setExpiry(`${this.redisEntity}`, `${jobLinkDetails?.user?.email}`, 0);

            return messageModel;
        } catch (error) {
            console.log(
                "[QuickCareerService] deleteQuickCareerJobLink: error occured: ",
                error
            );
            Logger.error(
                "[QuickCareerService] deleteQuickCareerJobLink: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while deleting job details career link!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

    async updateQuickCareerJobLinkDetails(jobLinkDetails: QuickCareerJobLink) {
        try {
            console.log(`[QuickCareerService] updating job details link for entire row: ${jobLinkDetails}`);
            Logger.info(`[QuickCareerService] updating job details link for entire row: ${jobLinkDetails}`);
            const quickCareerJobLinkCollection = db.dbConnector.db("InterviewSmasher").collection("quickCareerJobLink");

            const { _id, ...fieldsToUpdate } = jobLinkDetails;

            await quickCareerJobLinkCollection.updateOne(
                {
                    company: jobLinkDetails.company,
                    _id: new ObjectId(jobLinkDetails._id),
                    "user.email": jobLinkDetails.user.email
                },
                {
                    $set: {
                        ...fieldsToUpdate,
                    }
                }
            );

            // invalidate redis cache
            redisUtils.setExpiry(`${this.redisEntity}`, `${jobLinkDetails?.user?.email}`, 0);

            console.log(`[QuickCareerService] updating job details link for entire row completed`);
            Logger.info(`[QuickCareerService] updating job details link for entire row completed`);
            let messageModel = {
                statusMessage: "successully updated job details link for entire row!",
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
                statusMessage: "Error updating job details link for entire row!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

}

const quickCareerService = new QuickCareerService();
export { quickCareerService };