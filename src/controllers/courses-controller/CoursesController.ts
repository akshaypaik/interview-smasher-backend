import { Response, Request } from "express";
import HttpStatus from "http-status-codes";
import { coursesService } from "../../services/courses-service/CoursesService";

class CoursesController {
    public async getAllCourses(req: Request, res: Response) {
        try {
            const response = await coursesService.getAllCourses();
            res.header("Access-Control-Allow-Origin", "http://localhost:5173");
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    }

    public async postCourse(req: Request, res: Response) {
        const courseDetails = req.body;
        try {
            const result = await coursesService.postCourse(courseDetails);
            res.statusCode = HttpStatus.OK;
            let messageModel = {
                statusMessage: "Successfully inserted course!",
                statusCode: 0,
            };
            return res.send(messageModel);
        } catch (error) {
            let messageModel = {
                statusMessage: "Failed to insert course!",
                statusCode: -1,
            };
            res.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            return res.send(messageModel);
        }
    }
}

const coursesController = new CoursesController();
export { coursesController };