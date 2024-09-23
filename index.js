import express from "express";
import url from "./config/mongo.js";
import cors from "cors";
import userRouter from "./routes/user.js";
import admin from 'firebase-admin';
import serviceAccount from './service.json' assert { type: 'json' };

const app = express();
const port = process.env.PORT || "3000";

app.set("port", port);
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));



app.use("/user", userRouter);


app.listen(port, () => {
  console.log("Listening on port: " + port);
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

