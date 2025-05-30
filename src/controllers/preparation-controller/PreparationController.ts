import { Response, Request } from "express";
import { preparationService } from "../../services/preparation-service/PreparationService";

class PreparationController {

    public async getDSATopSixtyProblems(req: Request, res: Response) {
        try {
            const response = await preparationService.getDSATopSixtyProblems();
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

}

const preparationController = new PreparationController();
export { preparationController }