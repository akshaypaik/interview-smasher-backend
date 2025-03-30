import { Response, Request } from "express";
import HttpStatus from "http-status-codes";
import { topicsService } from "../../services/topics-service/TopicsService";

class TopicsController {
    public async getTopicByTopicName(req: Request, res: Response) {
        try {
            const topicName = req?.query?.topicName?.toString();
            const response = await topicsService.getTopicByTopicName(topicName);
            res.header("Access-Control-Allow-Origin", "*");
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

    public async updateTopicCompletion(req: Request, res: Response) {
        try {
            const topicDetails = req?.body;
            const response = await topicsService.updateTopicCompletion(topicDetails);
            res.header("Access-Control-Allow-Origin", "*");
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }
}

const topicsController = new TopicsController();
export { topicsController };