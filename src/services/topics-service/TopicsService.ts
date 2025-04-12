import TopicCompletionModel from "src/models/DBCollectionSchemaModel/TopicCompletion.model";
import { db } from "../../db";
import Logger from "../../logs/Logger";

class TopicsService {
    public async getTopicByTopicName(topicName: string | null | undefined) {
        try {
            console.log(`[TopicsService] get topic detail by topic name service started for courseId: ${topicName}`);
            Logger.info(`[TopicsService] get topic detail by topic name service started for courseId: ${topicName}`);
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
            console.log("[TopicsService] get topic detail by topic name api fetching completed");
            Logger.info("[TopicsService] get topic detail by topic name api fetching completed");
            return courseDetails;
        } catch (error) {
            console.log(
                "[TopicsService] getTopicByTopicName: error occured: ",
                error
            );
            Logger.error(
                "[TopicsService] getTopicByTopicName: error occured: ",
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
            Logger.info(`[TopicsService] updating topic completion for topic: ${JSON.stringify(topicDetails)}`);
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
            Logger.info("[TopicsService] updating topic completion for topic completed");
            return {
                "status": "success",
                messageModel
            };
        } catch (error) {
            console.log(
                "[TopicsService] updateTopicCompletion: error occured: ",
                error
            );
            Logger.error(
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

    public async getTopicCompletionStatus(topicId: number | null | undefined) {
        try {
            console.log(`[TopicsService] get topic completion status api started for topicId: ${topicId}`);
            Logger.info(`[TopicsService] get topic completion status api started for topicId: ${topicId}`);
            let courseDetails: [] = [];
            const topicCompletionCollection = db.dbConnector.db("InterviewSmasher").collection("topicCompletion");
            const response = await topicCompletionCollection.findOne({ topicId });
            if (response) {
                courseDetails = response;
            }
            console.log("[TopicsService] get topic completion status api fetching completed");
            Logger.info("[TopicsService] get topic completion status api fetching completed");
            return courseDetails;
        } catch (error) {
            console.log(
                "[TopicsService] getTopicCompletionStatus: error occured: ",
                error
            );
            Logger.error(
                "[TopicsService] getTopicCompletionStatus: error occured: ",
                error
            );
            let messageModel = {
                statusMessage: "Error while getting topic completion status!",
                statusCode: -1,
            };
            throw messageModel;
        }
    }
}

const topicsService = new TopicsService();
export { topicsService };