import express from "express";
import { quickCareerController } from "../controllers/quick-career-controller/QuickCareerController";
import { AppBaseURL } from "src/shared/enums/AppBaseURL.enum";
import { RoutesBaseURLs } from "src/shared/enums/RoutesURL.enum";

const QuickCareerRoutes = express.Router();

const quickCareerBaseURL = `${AppBaseURL.APP_BASE_URL}/${RoutesBaseURLs.QUICK_CAREER}`;

QuickCareerRoutes.post(`${quickCareerBaseURL}/postQuickCareerJobLink`, quickCareerController.postQuickCareerJobLink);

QuickCareerRoutes.get(`${quickCareerBaseURL}/getQuickCareerJobLink`, quickCareerController.getQuickCareerJobLink);

QuickCareerRoutes.put(`${quickCareerBaseURL}/updateStatusJobLink`, quickCareerController.updateStatusJobLink);

QuickCareerRoutes.post(`${quickCareerBaseURL}/deleteQuickCareerJobLink`, quickCareerController.deleteQuickCareerJobLink);

QuickCareerRoutes.put(`${quickCareerBaseURL}/updateQuickCareerJobLinkDetails`, quickCareerController.updateQuickCareerJobLinkDetails);

export default QuickCareerRoutes;