import { AmqpConnectionManager, connect } from "amqp-connection-manager"
import { environmentVariables } from "src/configurations/EnvironmentVariables";
import { messageQConnectionVariables } from "src/shared/constants/MessageQConstants/MessageQConnectionVariables";

export class MessageQConnector {
    public Context: AmqpConnectionManager | undefined;
    private readonly ConnectionType: string;

    constructor(type: string) {
        const connectionUrl = environmentVariables.MQ_URL;
        this.ConnectionType = type;
        this.Context = connect([connectionUrl], {
            connectionOptions: {
                clientProperties: {
                    connection_name: `InterviewSmasher_${type}`
                }
            },
            findServers: () => connectionUrl
        });
        this.setListeners();
    }

    private setListeners() {
        const { ConnectionType } = this;
        if (!this.Context) {
            console.log("Initial connection to message broker failed. No messages will be received from publishers");
            return;
        }
        this.Context.on(messageQConnectionVariables.CONNECT, function () {
            console.log(`${ConnectionType} connection is established`);
        });
        this.Context.on(messageQConnectionVariables.DISCONNECT, function (error) {
            console.error(`RabbitMQ server disconnected for ${ConnectionType}, Error: ${JSON.stringify(error)}`);
        });
        this.Context.on(messageQConnectionVariables.ERROR, function (error) {
            console.error(`Error while connecting RabbitMQ server for ${ConnectionType}, Error: ${JSON.stringify(error)}`);
        });
        this.Context.on(messageQConnectionVariables.CLOSE, function (error) {
            console.error(`Connection to RabbitMQ server closed for ${ConnectionType}, Error: ${JSON.stringify(error)}`);
        });
        this.Context.on(messageQConnectionVariables.BLOCKED, function (error) {
            console.error(`Connection to RabbitMQ server is blocked for ${ConnectionType}, Error: ${JSON.stringify(error)}`);
        });
        this.Context.on(messageQConnectionVariables.UNBLOCKED, function () {
            console.error(`Connection to RabbitMQ server has been unblocked for ${ConnectionType}`);
        });
    }
}