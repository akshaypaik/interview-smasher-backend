import express from "express";
import { interviewController } from "../controllers/interview-controller/InterviewController";
import { AppBaseURL } from "src/shared/enums/AppBaseURL.enum";
import { RoutesBaseURLs } from "src/shared/enums/RoutesURL.enum";

const InterviewRoutes = express.Router();

const interviewBaseURL = `${AppBaseURL.APP_BASE_URL}/${RoutesBaseURLs.INTERVIEW}`;

InterviewRoutes.get(`${interviewBaseURL}/getInterviewCompaniesSearchResults`, interviewController.getInterviewCompaniesSearchResult);

export default InterviewRoutes;