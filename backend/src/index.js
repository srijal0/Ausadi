import express from "express";
import bodyParser from "body-parser";
import { db } from "./database/index.js";
import { userRouter, authRouter } from "./route/index.js";
import dotenv from "dotenv";
import { authenticateToken } from "./middleware/token-middleware.js";
import router from "./route/uploadRoutes.js";
import { createUploadsFolder } from "./security/helper.js";
import cors from "cors";
import { medicineRouter } from "./route/medicineRoutes.js";
import { stockRouter } from "./route/stockRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT || 4000;
app.use(bodyParser.json());
app.use("/api/stock", stockRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/medicines", medicineRouter);
app.use("/api/file", router);
createUploadsFolder();
app.listen(4000, function () {
  console.log("project running on port 4000");
  db();
});