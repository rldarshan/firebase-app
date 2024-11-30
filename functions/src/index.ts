// import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import { countrt_list } from "./country_list";

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://nextjs-dashboard-eight-pi-25.vercel.app",
];

admin.initializeApp();
const db = admin.firestore();

app.use((req, res, next) => {
  const origin = req.headers.origin as string;

  if (!allowedOrigins.includes(origin)) {
    if (req.url != "/hello") {
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

const collectionRef = db.collection("user_data");

// Example API route
app.get("/hello", (req, res) => {
  logger.log("\n\n ========    This is the /hello api logger    =======\n\n");
  res.status(200).json({ message: "Hello from Firebase Functions!" });
});

// CREATE: Add a new user
app.post("/add_user_data", async (req, res) => {
  try {
    const data = req.body;
    await collectionRef.add(data);
    logger.log("\n\n ========    This is the '/add_user_data' api logger    =======\n\n", data);
    res.status(200).json({ message: "User added successfully." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      logger.log("\n\n ========    Error in '/add_user_data' api logger    =======\n\n",error.message);
  } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

// READ: Get all users
app.get("/get_country_list", async (req, res) => {
  try {
    logger.log("\n\n ========    This is the '/get_country_list' api logger    =======\n\n");
    res.status(200).json(countrt_list);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      logger.log("\n\n ========    Error in '/get_country_list' api logger    =======\n\n",error.message);
  } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

// READ: Get all users
app.get("/get_all_users", async (req, res) => {
  try {
    const snapshot = await collectionRef.get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    logger.log("\n\n ========    This is the '/get_all_users' api logger    =======\n\n");
    res.status(200).json(items);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      logger.log("\n\n ========    Error in '/get_all_users' api logger    =======\n\n",error.message);
  } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

// READ: Get a single user by ID
app.get("/get_user/:id", async (req, res) => {
  try {
    const docId = req.params.id;
    const doc = await collectionRef.doc(docId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "user not found." });
    }
    logger.log(`\n\n ========    This is the '/get_user/${docId}' api logger    =======\n\n`, { id: doc.id, ...doc.data() });
    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    if (error instanceof Error) {
        logger.log("\n\n ========    Error in '/get_user' api logger    =======\n\n",error.message);
        return res.status(500).json({ error: error.message });
    } else {
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

// UPDATE: Update a user by ID
app.put("/update_user_data/:id", async (req, res) => {
  try {
    const docId = req.params.id;
    const data = req.body;
    await collectionRef.doc(docId).update(data);
    logger.log(`\n\n ========     '/update_user_data/${docId}' api logger    =======\n\n`, data);
    res.status(200).json({ message: "user updated successfully." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      logger.log("\n\n ========    Error in '/update_user_data' api logger    =======\n\n",error.message);
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

// DELETE: Delete a user by ID
app.delete("/delete_user_data/:id", async (req, res) => {
  try {
    const docId = req.params.id;
    await collectionRef.doc(docId).delete();
    logger.log(`\n\n ========     '/delete_user_data/${docId}' api logger    =======\n\n`);
    res.status(200).json({ message: "user deleted successfully." });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      logger.log("\n\n ========    Error in '/delete_user_data' api logger    =======\n\n",error.message);
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);
