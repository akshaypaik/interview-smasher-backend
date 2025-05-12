import amqp from "amqplib"

class MessageBrokerQ {

    private connection;
    private channel;
    private exchange = "events";
    private exchangeType = "topic";

    constructor() { }

    async init() {
        try {
            this.connection = await amqp.connect("amqp://localhost");
            this.channel = await this.connection.createChannel();

            await this.channel.assertExchange(this.exchange, this.exchangeType, { durable: true });

            console.log("Message broker connection established.");

        } catch (error) {
            console.log(`Error while connecting to message broker. Error: ${error}`)
        }
    }

    async publishMessage(routingKey: string, message: any) {
        await this.channel.publish(this.exchange, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log(`Message broker published successfully for exchange: ${this.exchange}, routing key: ${routingKey} and
            message: ${JSON.stringify(message)}`);
    }

}

const messageBrokerQ = new MessageBrokerQ();
export { messageBrokerQ };