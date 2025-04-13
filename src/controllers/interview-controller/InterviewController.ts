import { Response, Request } from "express";
import HttpStatus from "http-status-codes";
import { interviewService } from "../../services/interview-service/InterviewService";
import User from "src/models/DBCollectionSchemaModel/User.model";

class InterviewController {
    public async getInterviewCompaniesSearchResult(req: Request, res: Response) {
        try {
            const searchQuery = req?.query?.searchQuery ? req?.query?.searchQuery?.toString() : "";
            const email = req?.query?.email ? req?.query?.email?.toString() : "";
            if(email === "" || email === "undefined"){
                res.status(500).send("Email is not valid");
            }
            const page = req?.query?.page ? Number(req?.query?.page) : 1;
            const limit = req?.query?.limit ? Number(req?.query?.limit) : 12;
            const response = await interviewService.getInterviewCompaniesSearchResult(searchQuery, email, page, limit);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }


    public async getInterviewCompaniesSearchResultsForQuickFilter(req: Request, res: Response) {
        try {
            const searchQuery = req?.query?.searchQuery ? req?.query?.searchQuery?.toString() : "";
            const email = req?.query?.email ? req?.query?.email?.toString() : "";
            const quickFilter =  req?.query?.quickFilter ? req?.query?.quickFilter?.toString() : "";
            if(email === "" || email === "undefined"){
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

}

const interviewController = new InterviewController();
export { interviewController };