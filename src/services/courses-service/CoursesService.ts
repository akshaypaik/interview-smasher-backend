import { db } from "../../db";

class CoursesService {
    async getAllCourses() {
        try {
            console.log("[CoursesService] get all courses service started");
            let courseDetails: [] = [];
            const coursesCollection = db.dbConnector.db("InterviewSmasher").collection("courses");
            const response = await coursesCollection.find().toArray();
            if (response && response.length > 0) {
                courseDetails = response;
            }
            console.log("[CoursesService] get courses api fetching completed");
            return courseDetails;
        } catch (error) {
            console.log(
                "[CoursesService] getAllCourses: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while reading courses!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

    async postCourse(courseDetails) {
        try {
            console.log("[CoursesService] post course service started");
            const coursesCollection = db.dbConnector.db("InterviewSmasher").collection("courses");
            await coursesCollection.insertOne(courseDetails);
            console.log("[User Service] post course service api completed");
            return {
                statusMessage: "success!",
                statusCode: 0,
            };;
        } catch (error) {
            console.log(
                "[CoursesService] postCourse: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while inserting post course!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }
}

const coursesService = new CoursesService();
export { coursesService };