import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CORS (temporary open for deployment)
app.use(cors());

// OR stricter (after deployment)
// app.use(cors({
//   origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
//   credentials: true
// }));

app.use(express.json());

// ✅ Root route (important for Render health check)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Use dynamic port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
