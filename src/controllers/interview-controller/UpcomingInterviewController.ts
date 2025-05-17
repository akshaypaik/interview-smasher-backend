import { Response, Request } from "express";
import User from "../../models/DBCollectionSchemaModel/User.model";
import { upcomingInterviewService } from "../../services/interview-service/UpcomingInterviewService";

class UpcomingInterviewController {
    public async getUpcomingInterviews(req: Request, res: Response) {
        try {
            const userEmail: any = req?.query?.email ? req?.query?.email : "";
            const useDetails: User = {
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