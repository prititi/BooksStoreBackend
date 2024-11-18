import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import bookRoutes from "./routes/booksRoutes";
import cartRoutes from "./routes/cartRoutes";
import userRoutes from "./routes/authRoutes";
import uploadRoutes from "./routes/uploadRoute";
import profileRoute from "./routes/profileRoutes";
import heroSlider from "./routes/heroSlider";
import adminRoutes from "./routes/adminRoutes";
import adminUserRoutes from "./routes/adminUserRoutes";
import reportRoutes from "./routes/reportRoutes";
import notificationRoutes from "./routes/notificationRoutes";

dotenv.config();

const app: Application = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser())

app.use("/api/books", bookRoutes);
app.use("/api/", uploadRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/users", profileRoute);
app.use("/api/hero-slider", heroSlider);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api", notificationRoutes);

connectDB().then(() => {
  const SERVERBACK = process.env.PORT || 8000;

  const server = app.listen(SERVERBACK, () => {
    console.log(`Server listening on port ${SERVERBACK}`);
  });

  server.on("error", (err) => {
    console.error("Error starting the server:", err);
  });
});
