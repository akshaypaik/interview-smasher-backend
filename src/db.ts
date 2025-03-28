import mongodb, { ConnectOptions, MongoClient } from "mongodb";
import { app } from "./app";
import { environmentVariables } from "./configurations/EnvironmentVariables";

let port: number = environmentVariables.APPLICATION_PORT;

class DBConnector {
  dbConnector!: any;

  async initializeDB() {
    if (typeof port == "undefined" || port == null) {
      port = 3000;
    }

    try {
      const mongodbClient = await MongoClient.connect(environmentVariables.DB_URL);
      console.log("DB connection established successfully!");
      this.dbConnector = mongodbClient;
      app.listen(port);
      console.log("App listening to port: ", port);
    } catch (error) {
      console.log("DB error occured while connecting to db: ", { error });
      process.exit(1);
    }
  }
}

const db = new DBConnector();
export { db };
