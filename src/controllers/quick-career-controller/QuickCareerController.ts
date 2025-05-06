import { Response, Request } from "express";
import { quickCareerService } from "../../services/quick-career-service/QuickCareerService";

class QuickCareerController {

    public async postQuickCareerJobLink(req: Request, res: Response) {
        try {
            const favCompanyDetails = req?.body;
            const response = await quickCareerService.postQuickCareerJobLink(favCompanyDetails);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }
}

const quickCareerController = new QuickCareerController();
export { quickCareerController };