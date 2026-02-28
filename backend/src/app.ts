import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes";

const app: Application = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("CrossTable API is running...");
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
