import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());

// Use cookie-parser middleware before any middleware that relies on cookies
app.use(cookieParser());

// Debugging middleware
app.use((req, res, next) => {
  console.log("Cookies:", req.cookies);
  next();
});

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/auth", authRoute);
app.use("/user", userRoute);

app.listen(process.env.PORT, () => {
  console.log("Server is Running...");
});
