import express from "express";
import { topicsController } from "../controllers/topics-controller/TopicsController";
import { AppBaseURL } from "src/shared/enums/AppBaseURL.enum";
import { RoutesBaseURLs } from "src/shared/enums/RoutesURL.enum";

const TopicsRoutes = express.Router();

const topicsBaseURL = `${AppBaseURL.APP_BASE_URL}/${RoutesBaseURLs.TOPICS}`;

TopicsRoutes.get(`${topicsBaseURL}/getTopicByTopicName`, topicsController.getTopicByTopicName);

export default TopicsRoutes;