import 'dotenv/config'
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// router import
import userrouter from "./routes/user.router.js";

//router declearation
app.use("/api/v1/users", userrouter)


export {app}