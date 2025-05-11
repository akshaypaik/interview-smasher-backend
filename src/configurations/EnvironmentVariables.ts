import { get } from "env-var";
import Logger from "../logs/Logger";
import dotenv from "dotenv";

class EnvironmentVariables {
  DB_URL!: string;
  APPLICATION_PORT!: number;
  JWT_SECRET_KEY!: string;
  LOG_DIRECTORY!: string;
  MONGO_DB_USER!: string;
  MONGO_DB_PASSWORD!: string;
  MONGO_APP_NAME!: string;
  REDIS_URL!: string;

  constructor(){
    this.loadEnvironmentVariables();
  }


  public async init() {
    dotenv.config();
    console.log("[Environment Variables] loading started");
    Logger.info("[Environment Variables] loading started");
    this.APPLICATION_PORT = get("APPLICATION_PORT")
      .default("3000")
      .asIntPositive();
    this.JWT_SECRET_KEY = get("JWT_SECRET_KEY")
      .default("sampledefaultnotforproduction")
      .asString();
    this.LOG_DIRECTORY = get("LOG_DIRECTORY")
      .default("")
      .asString();
    this.MONGO_DB_USER = get("MONGO_DB_USER")
      .default("")
      .asString();
    this.MONGO_DB_PASSWORD = get("MONGO_DB_PASSWORD")
      .default("")
      .asString();
    this.MONGO_APP_NAME = get("MONGO_APP_NAME")
      .default("")
      .asString();
    this.DB_URL = get("DB_CONNECTION_STRING")
      .default(
        `mongodb+srv://${this.MONGO_DB_USER}:${encodeURIComponent(this.MONGO_DB_PASSWORD)}@interviewsmasher.tvihtlh.mongodb.net/?retryWrites=true&w=majority&appName=${this.MONGO_APP_NAME}`
      )
      .asString();
    console.log("DB_URL: ", this.DB_URL);
    this.REDIS_URL = get("REDIS_URL")
      .default("")
      .asString();
    console.log("REDIS_URL: ", this.REDIS_URL);
    console.log("[Environment Variables] loading completed successfully");
    Logger.info("[Environment Variables] loading completed successfully");
  }

  public async loadEnvironmentVariables() {
    await this.init();
  }
}

const environmentVariables = new EnvironmentVariables();
export { environmentVariables };
