import { Response, Request } from "express";
import HttpStatus from "http-status-codes";
import { interviewService } from "../../services/interview-service/InterviewService";

class InterviewController {
    public async getInterviewCompaniesSearchResult(req: Request, res: Response) {
        try {
            const searchQuery = req?.query?.searchQuery ? req?.query?.searchQuery?.toString() : "";
            const response = await interviewService.getInterviewCompaniesSearchResult(searchQuery);
            res.header("Access-Control-Allow-Origin", "http://localhost:5173");
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

}

const interviewController = new InterviewController();
export { interviewController };