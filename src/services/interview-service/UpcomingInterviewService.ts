import Logger from "../../logs/Logger";
import { db } from "../../db";

class UpcomingInterviewService {

    public interviewScheduledStatus = "Interview Scheduled";

    public async getUpcomingInterviews(userDetails: any) {
        try {
            console.log("[UpcomingInterviewService] get upcoming interview api service started");
            Logger.info("[UpcomingInterviewService] get upcoming interview details api service started");

            let jobLinkDetails: any[] = [];

            const quickCareerJobLinkCollection = db.dbConnector.db("InterviewSmasher").collection("quickCareerJobLink");
            const companiesCollection = db.dbConnector.db("InterviewSmasher").collection("companies");
            const response = await quickCareerJobLinkCollection.find({
                "user.email": userDetails.email,
                jobStatus: this.interviewScheduledStatus
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
            console.log("[UpcomingInterviewService] get upcoming interview details api fetching completed");
            Logger.info("[UpcomingInterviewService] get upcoming interview details api fetching completed");

            return jobLinkDetails;
        } catch (error) {
            console.log(
                "[UpcomingInterviewService] getUpcomingInterviews: error occured: ",
                error
            );
            Logger.error(
                "[UpcomingInterviewService] getUpcomingInterviews: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while reading upcoming interview details!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

}

const upcomingInterviewService = new UpcomingInterviewService();
export { upcomingInterviewService };