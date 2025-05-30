import { SubscriptionPlans } from "./SubscriptionPlans";

export default interface SubscriptionInfo {

    isSubscribed: boolean;
    subscriptionPlan: SubscriptionPlans;
    subscribedOn: string;

}