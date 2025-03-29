import { db } from "../../db";

class TopicsService {
    public async getTopicByTopicName(topicName: string | null | undefined) {
        try {
            console.log(`[CoursesService] get course detail service started for courseId: ${topicName}`);
            let courseDetails: [] = [];
            const coursesInfoCollection = db.dbConnector.db("InterviewSmasher").collection("topicsInfo");
            const response = await coursesInfoCollection.aggregate([
                {
                    $match: { "topicName": topicName } // Find the document containing the topic
                }
            ]).toArray();
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
}

const topicsService = new TopicsService();
export { topicsService };