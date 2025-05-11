import User from "src/models/DBCollectionSchemaModel/User.model";
import { db } from "../../db";
import Logger from "../../logs/Logger";
import { redisClient } from "../../redis/redisClient";
import { redisUtils } from "../../redis/redisUtils";

class InterviewService {

    public redisClient = redisClient.client;
    public redisEntityFavCompanies = "favoriteCompanies";
    public redisEntitySearchResults = "searchResultsQuickCareer";

    async getInterviewCompaniesSearchResult(searchQuery: string, email: string, page: number = 1, limit: number = 12) {
        try {
            console.log(`[InterviewService] get search result for company: ${searchQuery}`);
            Logger.info(`[InterviewService] get search result for company: ${searchQuery}`);

            // Generate a unique cache key
            const cacheEntity = `${this.redisEntitySearchResults}:${email}`;
            const cacheKey = `${searchQuery}:${page}:${limit}`;

            // Check Redis for cached data
            const cachedData: any = await redisUtils.getEntry(cacheEntity, cacheKey);
            if (cachedData) {
                console.log(`[InterviewService] Returning cached data for: ${cacheEntity}${cacheKey}`);
                return JSON.parse(cachedData);
            }

            let searchResults: any[] = [];
            const companiesCollection = db.dbConnector.db("InterviewSmasher").collection("companies");
            const favCompaniesCollection = db.dbConnector.db("InterviewSmasher").collection("favoriteCompanies");
            const appliedCompaniesCollection = db.dbConnector.db("InterviewSmasher").collection("appliedCompanies");

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
                    const isFavorite = await favCompaniesCollection.findOne({
                        companyId: company.companyId,
                        "user.email": email
                    });
                    searchResults.push({
                        ...company,
                        isFavoriteCompany: !!isFavorite, // Set isFavorite to true if a match is found, otherwise false
                    });
                }

                // Check if each company is marked as applied
                for (const company of response) {
                    const isApplied = await appliedCompaniesCollection.findOne({
                        companyId: company.companyId,
                        "user.email": email
                    });
                    const index = isApplied ? searchResults.findIndex((item) => item.companyId === isApplied.companyId) : -1;
                    if (index != -1) {
                        searchResults[index].isApplied = true;
                    }
                }
            }

            redisUtils.setEntry(cacheEntity, cacheKey, JSON.stringify(searchResults));
            redisUtils.setExpiry(cacheEntity, cacheKey, 3600);

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

    async getInterviewCompaniesSearchResultsForQuickFilter(searchQuery: string, email: string, page: number = 1, limit: number = 12, quickFilter: string) {
        try {
            console.log(`[InterviewService] get search result for company: ${searchQuery} with quick filter: ${quickFilter}`);
            Logger.info(`[InterviewService] get search result for company: ${searchQuery} with quick filter: ${quickFilter}`);
            let searchResults: any[] = [];
            const companiesCollection = db.dbConnector.db("InterviewSmasher").collection("companies");
            const favCompaniesCollection = db.dbConnector.db("InterviewSmasher").collection("favoriteCompanies");
            const appliedCompaniesCollection = db.dbConnector.db("InterviewSmasher").collection("appliedCompanies");

            let dynamicCollection = db.dbConnector.db("InterviewSmasher").collection("companies");

            // Calculate the number of documents to skip
            const skip = (page - 1) * limit;

            const $or = [
                { name: { $regex: searchQuery.trim().toLocaleLowerCase(), $options: "i" } },
                { displayName: { $regex: searchQuery.trim().toLocaleLowerCase(), $options: "i" } }
            ]

            let query: any = {};
            let sort: any = {};

            if (quickFilter === "topRated") {
                query = { $or };
                sort = { "userRatings.rating": -1, "userRatings.userCount": -1 }; // Sort by rating (desc) and userCount (desc)
            }

            if (quickFilter === "productBased") {
                query = { isProductBased: true, $or }
            }

            if (quickFilter === "serviceBased") {
                query = { isProductBased: false, $or }
            }

            if (quickFilter === "appliedCompanies") {
                dynamicCollection = appliedCompaniesCollection;
                query = { isApplied: true, "user.email": email, $or }
            }

            const response = await dynamicCollection.find(query)
                .sort(sort)
                .skip(skip) // Skip documents for pagination
                .limit(limit) // Limit the number of documents
                .toArray();

            if (response && response.length > 0) {
                // Check if each company is marked as favorite
                for (const company of response) {
                    const isFavorite = await favCompaniesCollection.findOne({
                        companyId: company.companyId,
                        "user.email": email
                    });
                    searchResults.push({
                        ...company,
                        isFavoriteCompany: !!isFavorite, // Set isFavorite to true if a match is found, otherwise false
                    });
                }

                // Check if each company is marked as applied
                for (const company of response) {
                    const isApplied = await appliedCompaniesCollection.findOne({
                        companyId: company.companyId,
                        "user.email": email
                    });
                    const index = isApplied ? searchResults.findIndex((item) => item.companyId === isApplied.companyId) : -1;
                    if (index != -1) {
                        searchResults[index].isApplied = true;
                    }
                }
            }
            console.log(`[InterviewService] get search result for company: ${searchQuery}  with quick filter: ${quickFilter} fetching completed`);
            Logger.info(`[InterviewService] get search result for company: ${searchQuery}  with quick filter: ${quickFilter} fetching completed`);
            return searchResults;
        } catch (error) {
            console.log(
                "[InterviewService] getInterviewCompaniesSearchResultsForQuickFilter: error occured: ",
                error
            );
            Logger.error(
                "[InterviewService] getInterviewCompaniesSearchResultsForQuickFilter: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while getting companies with quick filter!",
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
            if (favCompanyDetails.isApplied) {
                delete favCompanyDetails.isApplied;
            }
            await favCompaniesCollection.insertOne(favCompanyDetails);

            // invalidate redis cache
            redisUtils.setExpiry(`${this.redisEntityFavCompanies}`, `${favCompanyDetails?.user?.email}`, 0);
            redisUtils.setExpiryToAllKeys(`${this.redisEntitySearchResults}:${favCompanyDetails?.user?.email}`, 0);

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

            // search redis for cached data
            const cachedData: any = await redisUtils.getEntry(`${this.redisEntityFavCompanies}`, `${user.email}`);
            if (cachedData?.length > 0) {
                return cachedData;
            }

            let favCompaniesDetails: any[] = [];
            const favCompaniesCollection = db.dbConnector.db("InterviewSmasher").collection("favoriteCompanies");
            const appliedCompaniesCollection = db.dbConnector.db("InterviewSmasher").collection("appliedCompanies");
            const response = await favCompaniesCollection.find({
                "user.email": user.email
            }).toArray();
            if (response && response.length > 0) {
                favCompaniesDetails = response;
            }

            // Check if each company is marked as applied
            for (const company of response) {
                const isApplied = await appliedCompaniesCollection.findOne({
                    companyId: company.companyId,
                    "user.email": user.email
                });
                const index = isApplied ? favCompaniesDetails.findIndex((item) => item.companyId === isApplied.companyId) : -1;
                if (index != -1) {
                    favCompaniesDetails[index].isApplied = true;
                }
            }

            redisUtils.setEntry(`${this.redisEntityFavCompanies}`, `${user.email}`, JSON.stringify(favCompaniesDetails));
            redisUtils.setExpiryToAllKeys(`${this.redisEntitySearchResults}:${user?.email}`, 0);

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

            // invalidate redis cache
            redisUtils.setExpiry(`${this.redisEntityFavCompanies}`, `${favCompanyDetails?.user?.email}`, 0);
            redisUtils.setExpiryToAllKeys(`${this.redisEntitySearchResults}:${favCompanyDetails?.user?.email}`, 0);

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

    async postAppliedCompany(appliedCompanyDetails: any) {
        try {
            console.log(`[InterviewService] posting applied company details: ${appliedCompanyDetails}`);
            Logger.info(`[InterviewService] posting applied company details: ${appliedCompanyDetails}`);
            const appliedCompaniesCollection = db.dbConnector.db("InterviewSmasher").collection("appliedCompanies");
            await appliedCompaniesCollection.insertOne(appliedCompanyDetails);
            console.log(`[InterviewService] posting applied company details completed`);
            Logger.info(`[InterviewService] posting applied company details completed`);
            let messageModel = {
                statusMessage: "successully posted applied company!",
                statusCode: 0,
            };

            redisUtils.setExpiry(`${this.redisEntityFavCompanies}`, `${appliedCompanyDetails?.user?.email}`, 0);
            redisUtils.setExpiryToAllKeys(`${this.redisEntitySearchResults}:${appliedCompanyDetails?.user?.email}`, 0);

            return messageModel;
        } catch (error) {
            console.log(
                "[InterviewService] postAppliedCompany: error occured: ",
                error
            );
            Logger.error(
                "[InterviewService] postAppliedCompany: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while posting applied company!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

    async getAppliedCompanies(user: User) {
        try {
            console.log("[InterviewService] get applied companies api service started");
            Logger.info("[InterviewService] get applied companies api service started");
            let appliedCompaniesDetails: [] = [];
            const appliedCompaniesCollection = db.dbConnector.db("InterviewSmasher").collection("appliedCompanies");
            const response = await appliedCompaniesCollection.find({
                "user.email": user.email
            }).toArray();
            if (response && response.length > 0) {
                appliedCompaniesDetails = response;
            }
            console.log("[InterviewService] get applied companies api fetching completed");
            Logger.info("[InterviewService] get applied companies api fetching completed");
            return appliedCompaniesDetails;
        } catch (error) {
            console.log(
                "[InterviewService] getAppliedCompanies: error occured: ",
                error
            );
            Logger.error(
                "[InterviewService] getAppliedCompanies: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while getting applied companies!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

    async removeAppliedCompany(appliedCompanyDetails: any) {
        try {
            console.log("[InterviewService] remove applied companies api service started");
            Logger.info("[InterviewService] remove applied companies api service started");
            let appliedCompaniesDetails: [] = [];
            const appliedCompaniesCollection = db.dbConnector.db("InterviewSmasher").collection("appliedCompanies");
            const response = await appliedCompaniesCollection.deleteOne({
                companyId: appliedCompanyDetails.companyId,
                "user.email": appliedCompanyDetails.user.email
            });
            if (response && response.length > 0) {
                appliedCompaniesDetails = response;
            }
            if (response.deletedCount === 1) {
                console.log("[InterviewService] applied company successfully removed");
                Logger.info("[InterviewService] applied company successfully removed");
            }
            
            redisUtils.setExpiry(`${this.redisEntityFavCompanies}`, `${appliedCompanyDetails?.user?.email}`, 0);
            redisUtils.setExpiryToAllKeys(`${this.redisEntitySearchResults}:${appliedCompanyDetails?.user?.email}`, 0);
            
            console.log("[InterviewService] remove applied companies api fetching completed");
            Logger.info("[InterviewService] remove applied companies api fetching completed");
            return {
                statusMessage: "Successfully removed applied company!",
                statusCode: 0,
            };
        } catch (error) {
            console.log(
                "[InterviewService] removeAppliedCompany: error occured: ",
                error
            );
            Logger.error(
                "[InterviewService] removeAppliedCompany: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while removing applied company!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

}

const interviewService = new InterviewService();
export { interviewService };