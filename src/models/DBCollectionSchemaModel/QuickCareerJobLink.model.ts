import User from "./User.model";

export default interface QuickCareerJobLink {
    _id: string | number,
    company: string;
    jobRole: string;
    jobLocation: string;
    jobID: string;
    jobLink: string;
    jobStatus: string;
    user: User,
    createdOn: any
}