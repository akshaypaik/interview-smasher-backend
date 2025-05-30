import { Response, Request } from "express";
import { quickCareerService } from "../../services/quick-career-service/QuickCareerService";

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
            const userDetails: any = {
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

    public async deleteQuickCareerJobLink(req: Request, res: Response) {
        try {
            const jobLinkDetails = req?.body;
            const response = await quickCareerService.deleteQuickCareerJobLink(jobLinkDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

    public async updateQuickCareerJobLinkDetails(req: Request, res: Response) {
        try {
            const jobLinkDetails = req?.body;
            const response = await quickCareerService.updateQuickCareerJobLinkDetails(jobLinkDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

}

const quickCareerController = new QuickCareerController();
export { quickCareerController };