import SubscriptionInfo from "./SubscribtionInfo.model";

export default class User{
    public username!: string;
    public email!: string;
    public userId!: string;
    public profilePhotoURL?: string;
    public firstName?: string;
    public lastName?: string;
    public phoneNumber?: number;
    public password!: string;
    public profilePicURL?: string;
    public githubProfileURL?: string;
    public linkedInProfileURL?: string;
    public portfolioWebsiteURL?: string;
    public subscriptionInfo!: SubscriptionInfo;
}