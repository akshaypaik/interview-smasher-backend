import { db } from "../../db";

class InterviewService {
    async getInterviewCompaniesSearchResult(searchQuery: string) {
        try {
            console.log(`[InterviewService] get search result for company: ${searchQuery}`);
            let searchResults: [] = [];
            const companiesCollection = db.dbConnector.db("InterviewSmasher").collection("companies");
            const response = await companiesCollection.find({
                $or: [
                    { name: { $regex: searchQuery, $options: "i" } },
                    { displayName: { $regex: searchQuery, $options: "i" } }
                ]
            }).toArray();
            if (response && response.length > 0) {
                searchResults = response;
            }
            console.log(`[InterviewService] get search result for company: ${searchQuery} fetching completed`);
            return searchResults;
        } catch (error) {
            console.log(
                "[InterviewService] getInterviewCompaniesSearchResult: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while getting companies!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

}

const interviewService = new InterviewService();
export { interviewService };