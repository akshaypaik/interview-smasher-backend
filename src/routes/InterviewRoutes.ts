import express from "express";
import { interviewController } from "../controllers/interview-controller/InterviewController";
import { AppBaseURL } from "src/shared/enums/AppBaseURL.enum";
import { RoutesBaseURLs } from "src/shared/enums/RoutesURL.enum";
import { upcomingInterviewController } from "../controllers/interview-controller/UpcomingInterviewController";

const InterviewRoutes = express.Router();

const interviewBaseURL = `${AppBaseURL.APP_BASE_URL}/${RoutesBaseURLs.INTERVIEW}`;

InterviewRoutes.get(`${interviewBaseURL}/getInterviewCompaniesSearchResults`, interviewController.getInterviewCompaniesSearchResult);

InterviewRoutes.get(`${interviewBaseURL}/getInterviewCompaniesSearchResultsForQuickFilter`, interviewController.getInterviewCompaniesSearchResultsForQuickFilter);

InterviewRoutes.post(`${interviewBaseURL}/postFavoriteCompany`, interviewController.postFavoriteCompany);

InterviewRoutes.get(`${interviewBaseURL}/getFavoriteCompanies`, interviewController.getFavoriteCompanies);

InterviewRoutes.post(`${interviewBaseURL}/removeFavoriteCompany`, interviewController.removeFavoriteCompany);

InterviewRoutes.post(`${interviewBaseURL}/postAppliedCompany`, interviewController.postAppliedCompany);

InterviewRoutes.get(`${interviewBaseURL}/getAppliedCompanies`, interviewController.getAppliedCompanies);

InterviewRoutes.post(`${interviewBaseURL}/removeAppliedCompany`, interviewController.removeAppliedCompany);

InterviewRoutes.get(`${interviewBaseURL}/getUpcomingInterviews`, upcomingInterviewController.getUpcomingInterviews);

export default InterviewRoutes;