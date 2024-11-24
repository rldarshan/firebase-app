/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import * as express from "express";
// import * as cors from "cors";

const app = express();

// Middleware
// app.use(cors({ origin: true })); // Allow cross-origin requests
// app.use(cors({ origin: ['http://localhost:3000', 'https://nextjs-dashboard-eight-pi-25.vercel.app'] }));  //  CORS filtering not working this way

const allowedOrigins = [
  "http://localhost:3000",
  "https://nextjs-dashboard-eight-pi-25.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin as string;
  
  if (!allowedOrigins.includes(origin)) {
    console.log("===== blocked origin =====", req.headers.origin);
    
    res.status(403).send("CORS policy: Access from this origin is blocked.");
    return;
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

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);
