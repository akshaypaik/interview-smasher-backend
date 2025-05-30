import express from "express";
import { preparationController } from "../controllers/preparation-controller/PreparationController";
import { AppBaseURL } from "src/shared/enums/AppBaseURL.enum";
import { RoutesBaseURLs } from "src/shared/enums/RoutesURL.enum";

const PreparationRoutes = express.Router();

const preparationBaseURL = `${AppBaseURL.APP_BASE_URL}/${RoutesBaseURLs.PREPARATION}`;

PreparationRoutes.get(`${preparationBaseURL}/getDSATopSixtyProblems`, preparationController.getDSATopSixtyProblems);

export default PreparationRoutes;