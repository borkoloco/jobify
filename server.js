import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

// import { validateTest } from "./middleware/validationMiddleware.js";

//router
import jobRouter from "./routes/jobRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

//public
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

//middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

//esto para el manejo de las carpetas una vez que este en prod

const port = process.env.PORT || 5100;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static(path.resolve(__dirname, "./public")));
app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

// app.post("/api/v1/test", validateTest, (req, res) => {
//   const { name } = req.body;
//   res.json({ msg: `hello ${name}` });
// });

//PARA TESTEAR EL PROXY
app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});

// app.post("/", (req, res) => {
//   console.log(req);
//   res.json({ message: "Data Received", data: req.body });
// });
app.use("/api/v1/jobs", authenticateUser, jobRouter);

app.use("/api/v1/users", authenticateUser, userRouter);

// app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/auth", authRouter);

// //GET ALL JOBS
// app.get("/api/v1/jobs", getAllJobs);

// //CREATE JOB
// app.post("/api/v1/jobs", createJob);

// // GET SINGLE JOB

// app.get("/api/v1/jobs/:id", getJob);

// // EDIT JOB

// app.patch("/api/v1/jobs/:id", updateJob);

// // DELETE JOB

// app.delete("/api/v1/jobs/:id", deleteJob);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

app.use(errorHandlerMiddleware);

//error middleware...diferencia con 404? 404 es cuando no se encuentra...
//el ottro es cuando al request se da pero hay algo mal que puede ser un typo o algo provocado, un throw

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(5100, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
