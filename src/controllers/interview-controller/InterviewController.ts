import { Response, Request } from "express";
import HttpStatus from "http-status-codes";
import { interviewService } from "../../services/interview-service/InterviewService";
import User from "src/models/DBCollectionSchemaModel/User.model";

class InterviewController {
    public async getInterviewCompaniesSearchResult(req: Request, res: Response) {
        try {
            const searchQuery = req?.query?.searchQuery ? req?.query?.searchQuery?.toString() : "";
            const response = await interviewService.getInterviewCompaniesSearchResult(searchQuery);
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
                username: ""
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