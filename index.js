import express from "express";
import url from "./config/mongo.js";
import cors from "cors";
import userRouter from "./routes/user.js";
import admin from 'firebase-admin';
import Order from './models/Order.js'
<<<<<<< HEAD
import serviceAccount from './service.json' assert { type: 'json' };
import cron from "node-cron";
import { sendNoti } from "./middlewares/send_notification.js";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
=======
import cron from "node-cron";
import { sendNoti } from "./middlewares/send_notification.js";
import dotenv from 'dotenv';

dotenv.config({ path: "./config.env" });
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert({
    ...serviceAccount,
    private_key: serviceAccount.private_key.replace(/\\n/g, '\n'),  // Escape karakterlerini düzelt
  }),
>>>>>>> 42e1283 (latext fixes)
});
const app = express();
const port = process.env.PORT || "3000";

app.set("port", port);
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));



app.use("/user", userRouter);


app.listen(port, () => {
  console.log("Listening on port: " + port);
<<<<<<< HEAD
=======

>>>>>>> 42e1283 (latext fixes)
});

// 4 saatte bir çalışacak cron job
cron.schedule("0 */4 * * *", async () => {
  console.log("4 saatte bir çalışan görev başladı.");
  getOrders()

});
async function getOrders() {
  var ordersWithUsers = await Order.getUsersWithRecentOrders();
  console.log(ordersWithUsers)
  for (let index = 0; index < ordersWithUsers.length; index++) {
    const user = ordersWithUsers[index];
    await sendNoti("Your credits have been renewed", "Come and create your new orders", user.pushToken)
  }

}

