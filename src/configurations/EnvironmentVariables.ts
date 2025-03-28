import { get } from "env-var";

class EnvironmentVariables {
  DB_URL!: string;
  APPLICATION_PORT!: number;
  JWT_SECRET_KEY!: string;

  public init() {
    console.log("[Environment Variables] loading started");
    this.DB_URL = get("DB_CONNECTION_STRING")
      .default(
        `mongodb+srv://akshaykrishnadaspai:immortal%401995@interviewsmasher.tvihtlh.mongodb.net/?retryWrites=true&w=majority&appName=InterviewSmasher`
      )
      .asString();
    this.APPLICATION_PORT = get("APPLICATION_PORT")
      .default("3000")
      .asIntPositive();
    this.JWT_SECRET_KEY = get("JWT_SECRET_KEY")
      .default("buddygroisawesomeandakshaypaiisalsoawesome")
      .asString();
    console.log("[Environment Variables] loading completed successfully");
  }
}

const environmentVariables = new EnvironmentVariables();
export { environmentVariables };
