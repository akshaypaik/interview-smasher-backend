import amqp from "amqplib"

class MessageBrokerQ {

    private connection;
    private channel;
    private exchange = "user_notifications";
    private routing_key = "fav_companies";

    constructor() { }

    async init() {
        try {
            this.connection = await amqp.connect("amqp://localhost");
            this.channel = await this.connection.createChannel();

            await this.channel.assertExchange(this.exchange, "direct", { durable: true });
            await this.channel.assertQueue(`${this.exchange}_queue`, { durable: true });

            await this.channel.bindQueue(`${this.exchange}_queue`, this.exchange, this.routing_key);
            
            // this.channel.publish(this.exchange, this.routing_key, Buffer.from(JSON.stringify(message)));

            console.log("Message broker connection established.");

        } catch (error) {
            console.log(`Error while connecting to message broker. Error: ${error}`)
        }
    }

    async publishMessage(message: any) {
        await this.channel.publish(this.exchange, this.routing_key, Buffer.from(JSON.stringify(message)));
        console.log(`Message broker published successfully for exchange: ${this.exchange}, routing key: ${this.routing_key} and
            message: ${JSON.stringify(message)}`);
    }

}

const messageBrokerQ = new MessageBrokerQ();
export { messageBrokerQ };