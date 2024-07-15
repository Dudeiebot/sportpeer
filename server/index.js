import express from "express";
import "dotenv/config";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";

const app = express();
app.use(express.json());

app.use("/auth", authRoute);
app.use("/user", userRoute);

app.listen(process.env.PORT, () => {
  console.log("Server is Running...");
});
