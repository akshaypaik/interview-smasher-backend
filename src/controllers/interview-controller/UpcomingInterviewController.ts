import { Response, Request } from "express";
import { upcomingInterviewService } from "../../services/interview-service/UpcomingInterviewService";

class UpcomingInterviewController {
    public async getUpcomingInterviews(req: Request, res: Response) {
        try {
            const userEmail: any = req?.query?.email ? req?.query?.email : "";
            const useDetails: any = {
                email: userEmail,
                userId: "",
                username: "",
                password: ""
            }
            const response = await upcomingInterviewService.getUpcomingInterviews(useDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }
}

const upcomingInterviewController = new UpcomingInterviewController();
export { upcomingInterviewController };