import Logger from "../../logs/Logger";
import { db } from "../../db";

class PreparationService {

    async getDSATopSixtyProblems() {

        try {
            console.log("[PreparationService] get dsa top sixty problems api service started");

            let dsaProblemsDetails: any[] = [];
            const preparationCollection = db.dbConnector.db("InterviewSmasher").collection("dsaTopSixtyProblems");
            const response = await preparationCollection.find().toArray();
            if (response && response.length > 0) {
                dsaProblemsDetails = response;
            }

            console.log("[PreparationService] get dsa top sixty problems api service completed");
            return dsaProblemsDetails;
        } catch (error) {
            console.log(
                "[PreparationService] postQuickCareerJobLink: error occured: ",
                error
            );
            Logger.error(
                "[PreparationService] postQuickCareerJobLink: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while reading dsa top sixty problems details!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }
}

const preparationService = new PreparationService();
export { preparationService };