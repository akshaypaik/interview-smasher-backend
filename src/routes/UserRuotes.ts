import express from "express";
import { AppBaseURL } from "src/shared/enums/AppBaseURL.enum";
import { RoutesBaseURLs } from "src/shared/enums/RoutesURL.enum";
import { userController } from "../controllers/user-controller/UserController";

const UserRoutes = express.Router();

const userBaseURL = `${AppBaseURL.APP_BASE_URL}/${RoutesBaseURLs.USER}`;

UserRoutes.get(`${userBaseURL}/validateJsonToken`, userController.validateJsonToken);

UserRoutes.post(`${userBaseURL}/registerUser`, userController.registerUser);

UserRoutes.post(`${userBaseURL}/loginUser`, userController.loginUser);

export default UserRoutes;