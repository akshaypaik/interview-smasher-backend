import User from "src/models/DBCollectionSchemaModel/User.model";
import { db } from "../../db";
import Logger from "../../logs/Logger";

class InterviewService {
    async getInterviewCompaniesSearchResult(searchQuery: string, email: string, page: number = 1, limit: number = 12) {
        try {
            console.log(`[InterviewService] get search result for company: ${searchQuery}`);
            Logger.info(`[InterviewService] get search result for company: ${searchQuery}`);
            let searchResults: any[] = [];
            const companiesCollection = db.dbConnector.db("InterviewSmasher").collection("companies");
            const favCompaniesCollection = db.dbConnector.db("InterviewSmasher").collection("favoriteCompanies");

            // Calculate the number of documents to skip
            const skip = (page - 1) * limit;

            const response = await companiesCollection.find({
                $or: [
                    { name: { $regex: searchQuery, $options: "i" } },
                    { displayName: { $regex: searchQuery, $options: "i" } }
                ]
            })
                .skip(skip) // Skip documents for pagination
                .limit(limit) // Limit the number of documents
                .toArray();

            if (response && response.length > 0) {
                // Check if each company is marked as favorite
                for (const company of response) {
                    const isFavorite = await favCompaniesCollection.findOne({ companyId: company.companyId,
                        "user.email":  email
                     });
                    searchResults.push({
                        ...company,
                        isFavoriteCompany: !!isFavorite, // Set isFavorite to true if a match is found, otherwise false
                    });
                }
            }
            console.log(`[InterviewService] get search result for company: ${searchQuery} fetching completed`);
            Logger.info(`[InterviewService] get search result for company: ${searchQuery} fetching completed`);
            return searchResults;
        } catch (error) {
            console.log(
                "[InterviewService] getInterviewCompaniesSearchResult: error occured: ",
                error
            );
            Logger.error(
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

    async postFavoriteCompany(favCompanyDetails: any) {
        try {
            console.log(`[InterviewService] posting fav company details: ${favCompanyDetails}`);
            Logger.info(`[InterviewService] posting fav company details: ${favCompanyDetails}`);
            const favCompaniesCollection = db.dbConnector.db("InterviewSmasher").collection("favoriteCompanies");
            await favCompaniesCollection.insertOne(favCompanyDetails);
            console.log(`[InterviewService] posting fav company details completed`);
            Logger.info(`[InterviewService] posting fav company details completed`);
            let messageModel = {
                statusMessage: "successully posted favorite company!",
                statusCode: 0,
            };
            return messageModel;
        } catch (error) {
            console.log(
                "[InterviewService] postFavoriteCompany: error occured: ",
                error
            );
            Logger.error(
                "[InterviewService] postFavoriteCompany: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while posting company!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

    async getFavoriteCompanies(user: User) {
        try {
            console.log("[InterviewService] get favorite companies api service started");
            Logger.info("[InterviewService] get favorite companies api service started");
            let favCompaniesDetails: [] = [];
            const favCompaniesCollection = db.dbConnector.db("InterviewSmasher").collection("favoriteCompanies");
            const response = await favCompaniesCollection.find({
                "user.email": user.email
            }).toArray();
            if (response && response.length > 0) {
                favCompaniesDetails = response;
            }
            console.log("[InterviewService] get favorite companies api fetching completed");
            Logger.info("[InterviewService] get favorite companies api fetching completed");
            return favCompaniesDetails;
        } catch (error) {
            console.log(
                "[InterviewService] getFavoriteCompanies: error occured: ",
                error
            );
            Logger.error(
                "[InterviewService] getFavoriteCompanies: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while getting favorite companies!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

    async removeFavoriteCompany(favCompanyDetails: any) {
        try {
            console.log("[InterviewService] remove favorite companies api service started");
            Logger.info("[InterviewService] remove favorite companies api service started");
            let favCompaniesDetails: [] = [];
            const favCompaniesCollection = db.dbConnector.db("InterviewSmasher").collection("favoriteCompanies");
            const response = await favCompaniesCollection.deleteOne({
                companyId: favCompanyDetails.companyId,
                "user.email": favCompanyDetails.user.email
            });
            if (response && response.length > 0) {
                favCompaniesDetails = response;
            }
            if (response.deletedCount === 1) {
                console.log("[InterviewService] favorite company successfully removed");
                Logger.info("[InterviewService] favorite company successfully removed");
            }
            console.log("[InterviewService] remove favorite companies api fetching completed");
            Logger.info("[InterviewService] remove favorite companies api fetching completed");
            return {
                statusMessage: "Successfully removed favorite company!",
                statusCode: 0,
            };
        } catch (error) {
            console.log(
                "[InterviewService] removeFavoriteCompany: error occured: ",
                error
            );
            Logger.error(
                "[InterviewService] removeFavoriteCompany: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while removing favorite company!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

}

const interviewService = new InterviewService();
export { interviewService };