import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CORS (allow your frontend + local dev)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
       "https://ecommarce-bzyg.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());

// ✅ Root route (Render health check)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Example: attach your routes here
// import productRoutes from "./routes/productRoutes.js";
// import authRoutes from "./routes/authRoutes.js";

// app.use("/api/products", productRoutes);
// app.use("/api/auth", authRoutes);

// ✅ Dynamic port (required for Render)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
