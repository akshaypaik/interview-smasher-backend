import express from "express";
import { coursesController } from "../controllers/courses-controller/CoursesController";
import { AppBaseURL } from "src/shared/enums/AppBaseURL.enum";
import { RoutesBaseURLs } from "src/shared/enums/RoutesURL.enum";

const CoursesRoutes = express.Router();

const coursesBaseURL = `${AppBaseURL.APP_BASE_URL}/${RoutesBaseURLs.COURSES}`;

CoursesRoutes.get(`${coursesBaseURL}/getAllCourses`, coursesController.getAllCourses);

CoursesRoutes.post(`${coursesBaseURL}/postCourse`, coursesController.postCourse);

CoursesRoutes.get(`${coursesBaseURL}/getCourseDetailsByCourseId`, coursesController.getCourseDetailsByCourseId);

CoursesRoutes.get(`${coursesBaseURL}/getCourseCompletionStatus`, coursesController.getCourseCompletionStatus);

export default CoursesRoutes;