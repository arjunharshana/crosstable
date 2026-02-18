import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";
import app from "./app";

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
