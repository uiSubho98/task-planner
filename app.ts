import express from "express";
import cors from "cors";
import userRouter from "./src/routes/user.routes";
import taskRouter from "./src/routes/task.routes";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
// app.use(cookieParser());

// routes declaration
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// // Error handling middleware
// app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
//   errorHandler(err, req, res, next);
// });

app.use("/api/v1/users", userRouter);
app.use("/api/v1/task", taskRouter);

export { app };
// https://localhost:8000/api/v1/users/register
