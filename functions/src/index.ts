// import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import * as express from "express";

const app = express();
const allowedOrigins = [
    "http://localhost:3000",
    "https://nextjs-dashboard-eight-pi-25.vercel.app",
];

app.use((req, res, next) => {
    const origin = req.headers.origin as string;

    if (!allowedOrigins.includes(origin)) {
        if (req.url != '/hello') {
            console.log("===== blocked origin 2 =====", req.headers.origin, req.url);

            res.status(403).send("CORS policy: Access from this origin is blocked.");
            return;
        }
    }

    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});
app.use(express.json());

// Example API route
app.get("/hello", (req, res) => {
    logger.log("\n\n ========    This is the /hello api logger    =======\n\n");
    res.status(200).json({ message: "Hello from Firebase Functions!" });
});

app.get("/add_user", (req, res) => {
    logger.log("\n\n ========    This is the /add_user api logger    =======\n\n");
    res.status(200).json({ message: "This is 'add_user' Firebase Functions!" });
});
// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);
