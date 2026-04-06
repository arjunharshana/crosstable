import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes";
import tournamentRoutes from "./routes/tournamentRoutes";
import activityRoutes from "./routes/activityRoutes";

const app: Application = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://crosstable.app",
      "https://www.crosstable.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/activity", activityRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("CrossTable API is running...");
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
