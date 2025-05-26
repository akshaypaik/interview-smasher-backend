import { ChannelWrapper } from "amqp-connection-manager";
import { MessageQConnector } from "./MessageQConnector";
import { MULTITYPE } from "../shared/constants/MessageQConstants/Multitype";
import { Message } from "amqplib";
import { messageQConnectionVariables } from "src/shared/constants/MessageQConstants/MessageQConnectionVariables";

class MessageQ {

    public readonly MessageQConnectorPublisher: MessageQConnector;
    public readonly MessageQConnectorConsumer: MessageQConnector;
    MessageQChannelConsumer?: ChannelWrapper;
    MessageQChannelPublisher?: ChannelWrapper;

    constructor() {
        console.log("Message Broker init");
        this.MessageQConnectorPublisher = new MessageQConnector("publisher");
        this.MessageQConnectorConsumer = new MessageQConnector("consumer");
    }

    async init() {
        await this.setUpRX();
        await this.setUpTX();
    }

    private async setUpRX() {
        const self = this;
        const preFetchValue = 100;
        if (!this.MessageQConnectorConsumer.Context) {
            console.log("Initial connection to message broker failed, No messages will be received from publishers");
            return;
        }
        this.MessageQChannelConsumer = this.MessageQConnectorConsumer.Context.createChannel({
            json: true,
            async setup(channel: MULTITYPE) {
                Promise.all([
                    channel.prefetch(preFetchValue),
                    channel.assertExcahnge("events", "topic", { durable: true }),
                    channel.assertExcahnge("collected", "topic", { durable: true }),
                    channel.assertQueue("InterviewSmasherQueue", { durable: true }),
                    channel.bindQueue("InterviewSmasherQueue", "events", "event.notification.favCompany"),
                    channel.consume("InterviewSmasherQueue", self.onEvent.bind(self))
                ])
            }
        })
    }

    private async setUpTX() {
        if (!this.MessageQConnectorPublisher.Context) {
            console.log("Initial connection to message broker failed, No messages will published");
            return;
        }
        this.MessageQChannelPublisher = this.MessageQConnectorPublisher.Context.createChannel({
            json: true,
            async setup(channel: MULTITYPE) {
                Promise.all([]);
            }
        });
        this.MessageQChannelPublisher.on(messageQConnectionVariables.CONNECT, () => console.log("Channel Publisher connected!"));
        this.MessageQChannelPublisher.on(messageQConnectionVariables.CLOSE, () => console.log("Channel Publisher closed by .close() code call!"));
        this.MessageQChannelPublisher.on(messageQConnectionVariables.ERROR, (error: Error) => console.log("Channel Publisher disconnected! Error: ", error));
    }

    private async onEvent(data: Message) {
        
    }


}