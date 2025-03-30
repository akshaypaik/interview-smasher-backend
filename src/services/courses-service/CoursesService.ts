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

    async getCourseDetailsByCourseId(courseId: number) {
        try {
            console.log(`[CoursesService] get course detail service started for courseId: ${courseId}`);
            let courseDetails: [] = [];
            const coursesInfoCollection = db.dbConnector.db("InterviewSmasher").collection("courseInfo");
            const response = await coursesInfoCollection.findOne({ courseId: courseId });
            if (response) {
                courseDetails = response;
            }
            console.log("[CoursesService] get course detail api fetching completed");
            return courseDetails;
        } catch (error) {
            console.log(
                "[CoursesService] getCourseDetailsByCourseId: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while reading course by id!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

    public async getCourseCompletionStatus(courseId: number | null | undefined) {
        try {
            console.log(`[TopicsService] get course completion status api started for courseId: ${courseId}`);
            let courseCompletionStatus = {
                status: {},
                data: []
            };
            const topicCompletionCollection = db.dbConnector.db("InterviewSmasher").collection("topicCompletion");
            const response = await topicCompletionCollection.find({ courseId }).toArray();
            if (response) {
                courseCompletionStatus.status = response.reduce((acc, item) => {
                   acc.totalTopics += 1;
                   item.isCompleted ? acc.completedTopics += 1 : null;
                   return acc;
                }, { totalTopics: 0, completedTopics: 0 });
                courseCompletionStatus.data = response;
            }
            console.log("[TopicsService] get course completion status api fetching completed");
            return courseCompletionStatus;
        } catch (error) {
            console.log(
                "[TopicsService] getCourseCompletionStatus: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while getting course completion status!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }
}

const coursesService = new CoursesService();
export { coursesService };