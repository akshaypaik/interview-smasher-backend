import express from "express";
import { quickCareerController } from "../controllers/quick-career-controller/QuickCareerController";
import { AppBaseURL } from "src/shared/enums/AppBaseURL.enum";
import { RoutesBaseURLs } from "src/shared/enums/RoutesURL.enum";

const QuickCareerRoutes = express.Router();

const quickCareerBaseURL = `${AppBaseURL.APP_BASE_URL}/${RoutesBaseURLs.QUICK_CAREER}`;

QuickCareerRoutes.post(`${quickCareerBaseURL}/postQuickCareerJobLink`, quickCareerController.postQuickCareerJobLink);

export default QuickCareerRoutes;