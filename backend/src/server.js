import express from "express";
import cors from "cors";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js";
import notificationRoute from "./routes/notification.route.js";

const app = express();

connectDB();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/comments", commentRoute);

//General error handling
app.use((err, req, res, next) => {
	console.error("Unhandled error", err);
	res.status(500).json({ error: err.message || "Internal Server Error" });
});

app.listen(ENV.PORT, () => {
	console.log(`Server is running on port ${ENV.PORT}`);
});
