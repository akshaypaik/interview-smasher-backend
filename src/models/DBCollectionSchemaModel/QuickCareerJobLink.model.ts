import User from "./User.model";

export default interface QuickCareerJobLink {
    company: string;
    jobRole: string;
    jobLocation: string;
    jobID: string;
    jobLink: string;
    jobStatus: string;
    user: User
}