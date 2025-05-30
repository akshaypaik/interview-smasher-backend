import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import HttpStatus from "http-status-codes";
import session from "express-session";
import bodyParser from "body-parser";
import { default as connectMongoDBSession } from "connect-mongodb-session";
import { environmentVariables } from "./configurations/EnvironmentVariables";
import { db } from "./db";
import CoursesRoutes from "./routes/CoursesRoutes";
import TopicsRoutes from "./routes/TopicsRoutes";
import InterviewRoutes from "./routes/InterviewRoutes";
import UserRoutes from "./routes/UserRuotes";
import Logger from "./logs/Logger";
import helmet from "helmet";
import path from "path";
import QuickCareerRoutes from "./routes/QuickCareerRoutes";
import { redisClient } from "./redis/redisClient";
import { messageBrokerQ } from "./message-broker/MessageBrokerQ";
import PreparationRoutes from "./routes/PreparationRoutes";

const app = express();

//Load environment variables
// environmentVariables.loadEnvironmentVariables();

// cors
app.use(cors({ origin: "http://localhost:5173" }));

// Helmet to secure response headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Body Parser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the uploads directory
app.use('/uploads', express.static(path.resolve('./uploads')));

// Catch JSON error
function checkErrors(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof SyntaxError && err.message.indexOf("JSON")) {
        const errorMSG: Error = new Error("Not a valid JSON body");
        res.statusCode = HttpStatus.BAD_REQUEST;
        res.json(errorMSG);
    }
}
app.use(checkErrors);

//Catch errors
process.on("uncaughtException", function (err) {
    console.log("[App] Uncaught Exception occured: ", err);
    Logger.error("[App] Uncaught Exception occured: ", err);
});
process.on("unhandledRejection", function (reason, p) {
    console.log("[App] Possibly unhandled rejection at: ", {
        rejectedPromise: JSON.stringify(p),
        Reason: JSON.stringify(reason),
    });
    Logger.error("[App] Possibly unhandled rejection at: ", {
        rejectedPromise: JSON.stringify(p),
        Reason: JSON.stringify(reason),
    });
});

// Session
const MongoDBStore = connectMongoDBSession(session);
let sessionOptions = session({
    secret: "interview smasher is amazing and awesome",
    store: new MongoDBStore({
        uri: environmentVariables.DB_URL,
        collection: "sessions-new",
    }),
    saveUninitialized: false,
    resave: false,
    proxy: true,
    name: "StockPlaceCookieName",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
    },
});
app.use(sessionOptions);

// OLD CORS
// const allowedOrigins = [
//     "*"
// ];
// app.use(
//     cors({
//         credentials: true,
//         origin: allowedOrigins,
//         methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//         optionsSuccessStatus: 204
//     })
// );

// app.use((req, res, next) => {
//     const origin = req.headers.origin ? req.headers.origin : "";
//     if (allowedOrigins.includes(origin)) {
//         res.header('Access-Control-Allow-Origin', origin);
//     }
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin');
//     res.header('cross-origin-resource-policy', 'cross-origin');
//     next();
// });

// Initialize DB
db.initializeDB();

//Message Broker
messageBrokerQ.init();

// Redis
redisClient.init();

// Routes
app.use(CoursesRoutes);
app.use(TopicsRoutes);
app.use(InterviewRoutes);
app.use(UserRoutes);
app.use(QuickCareerRoutes);
app.use(PreparationRoutes);

export { app };
