import { Response, Request } from "express";
import { quickCareerService } from "../../services/quick-career-service/QuickCareerService";
import User from "../../models/DBCollectionSchemaModel/User.model";

class QuickCareerController {

    public async postQuickCareerJobLink(req: Request, res: Response) {
        try {
            const jobLinkDetails = req?.body;
            const response = await quickCareerService.postQuickCareerJobLink(jobLinkDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

    public async getQuickCareerJobLink(req: Request, res: Response) {
        try {
            const userEmail: any = req?.query?.email ? req?.query?.email : "";
            const userDetails: User = {
                email: userEmail,
                userId: "",
                username: "",
                password: ""
            }
            const response = await quickCareerService.getQuickCareerJobLink(userDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

    public async updateStatusJobLink(req: Request, res: Response) {
        try {
            const jobLinkDetails = req?.body;
            const response = await quickCareerService.updateStatusJobLink(jobLinkDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

}

const quickCareerController = new QuickCareerController();
export { quickCareerController };