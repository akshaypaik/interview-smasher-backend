import TopicCompletionModel from "src/models/DBCollectionSchemaModel/TopicCompletion.model";
import { db } from "../../db";

class TopicsService {
    public async getTopicByTopicName(topicName: string | null | undefined) {
        try {
            console.log(`[TopicsService] get course detail service started for courseId: ${topicName}`);
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
            console.log("[TopicsService] get course detail api fetching completed");
            return courseDetails;
        } catch (error) {
            console.log(
                "[TopicsService] getCourseDetailsByCourseId: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while reading course by id!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }

    public async updateTopicCompletion(topicDetails: TopicCompletionModel) {
        try {
            console.log(`[TopicsService] updating topic completion for topic: ${JSON.stringify(topicDetails)}`);
            const topicCompletionCollection = db.dbConnector.db("InterviewSmasher").collection("topicCompletion");
            const response = await topicCompletionCollection.updateOne(
                {
                    topicId: topicDetails.topicId,
                    "user.email": topicDetails.user.email
                },
                {
                    $set: {
                        isCompleted: topicDetails.isCompleted,
                    },
                }
            )
            let messageModel = {
                statusMessage:
                    "Successfully updated topic completion!",
                statusCode: 0,
            };
            console.log("[TopicsService] updating topic completion for topic completed");
            return {
                "status": "success",
                messageModel
            };
        } catch (error) {
            console.log(
                "[TopicsService] updateTopicCompletion: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while updating topic completion!",
                statusCode: -1,
            };
            throw {
                "status": "success",
                messageModel
            };;
        }
    }
}

const topicsService = new TopicsService();
export { topicsService };