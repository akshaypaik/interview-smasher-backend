import { Response, Request } from "express";
import { interviewService } from "../../services/interview-service/InterviewService";
import User from "src/models/DBCollectionSchemaModel/User.model";
import { rateLimiter } from "../../auth/rate-limiter";
import { sanitizeInput } from "../../auth/sanitize";

class InterviewController {
    public async getInterviewCompaniesSearchResult(req: Request, res: Response) {
        try {

            // check rate limit
            const userDetails = {
                email: req?.query?.email ? req?.query?.email?.toString() : "default"
            }
            const isValidReq = await rateLimiter.checkRateLimiter(userDetails, res);
            if (!isValidReq) {
                res.status(429).send({
                    message: "Too many request. please try again after some time!"
                });
            }

            const searchQuery = req?.query?.searchQuery ? req?.query?.searchQuery?.toString() : "";
            const sanitizedSearchQuery =  sanitizeInput.sanitizeAlphanumeric(searchQuery);
            const email = req?.query?.email ? req?.query?.email?.toString() : "";
            if (email === "" || email === "undefined") {
                res.status(500).send("Email is not valid");
            }
            const page = req?.query?.page ? Number(req?.query?.page) : 1;
            const limit = req?.query?.limit ? Number(req?.query?.limit) : 12;
            const response = await interviewService.getInterviewCompaniesSearchResult(sanitizedSearchQuery, email, page, limit);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }


    public async getInterviewCompaniesSearchResultsForQuickFilter(req: Request, res: Response) {
        try {
            const searchQuery = req?.query?.searchQuery ? req?.query?.searchQuery?.toString() : "";
            const email = req?.query?.email ? req?.query?.email?.toString() : "";
            const quickFilter = req?.query?.quickFilter ? req?.query?.quickFilter?.toString() : "";
            if (email === "" || email === "undefined") {
                res.status(500).send("Email is not valid");
            }
            const page = req?.query?.page ? Number(req?.query?.page) : 1;
            const limit = req?.query?.limit ? Number(req?.query?.limit) : 12;
            const response = await interviewService.getInterviewCompaniesSearchResultsForQuickFilter(searchQuery, email, page, limit, quickFilter);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

    public async postFavoriteCompany(req: Request, res: Response) {
        try {
            const favCompanyDetails = req?.body;
            const response = await interviewService.postFavoriteCompany(favCompanyDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

    public async getFavoriteCompanies(req: Request, res: Response) {
        try {
            const userEmail: any = req?.query?.email ? req?.query?.email : "";
            const useDetails: User = {
                email: userEmail,
                username: "",
                password: ""
            }
            const response = await interviewService.getFavoriteCompanies(useDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

    public async removeFavoriteCompany(req: Request, res: Response) {
        try {
            const favCompanyDetails = req?.body;
            const response = await interviewService.removeFavoriteCompany(favCompanyDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

    public async postAppliedCompany(req: Request, res: Response) {
        try {
            const appliedCompanyDetails = req?.body;
            const response = await interviewService.postAppliedCompany(appliedCompanyDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

    public async getAppliedCompanies(req: Request, res: Response) {
        try {
            const userEmail: any = req?.query?.email ? req?.query?.email : "";
            const useDetails: User = {
                email: userEmail,
                username: "",
                password: ""
            }
            const response = await interviewService.getAppliedCompanies(useDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

    public async removeAppliedCompany(req: Request, res: Response) {
        try {
            const appliedCompanyDetails = req?.body;
            const response = await interviewService.removeAppliedCompany(appliedCompanyDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

}

const interviewController = new InterviewController();
export { interviewController };