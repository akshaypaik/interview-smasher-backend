import User from "./User.model";

export default class TopicCompletionModel{
    public courseId!: number;
    public topicId!: number;
    public isCompleted!: boolean;
    public module!: string;
    public topicName!: string;
    public user!: User;
}