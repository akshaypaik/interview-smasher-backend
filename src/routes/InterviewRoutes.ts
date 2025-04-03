import express from "express";
import { interviewController } from "../controllers/interview-controller/InterviewController";
import { AppBaseURL } from "src/shared/enums/AppBaseURL.enum";
import { RoutesBaseURLs } from "src/shared/enums/RoutesURL.enum";

const InterviewRoutes = express.Router();

const interviewBaseURL = `${AppBaseURL.APP_BASE_URL}/${RoutesBaseURLs.INTERVIEW}`;

InterviewRoutes.get(`${interviewBaseURL}/getInterviewCompaniesSearchResults`, interviewController.getInterviewCompaniesSearchResult);

InterviewRoutes.post(`${interviewBaseURL}/postFavoriteCompany`, interviewController.postFavoriteCompany);

InterviewRoutes.get(`${interviewBaseURL}/getFavoriteCompanies`, interviewController.getFavoriteCompanies);

InterviewRoutes.post(`${interviewBaseURL}/removeFavoriteCompany`, interviewController.removeFavoriteCompany);

export default InterviewRoutes;