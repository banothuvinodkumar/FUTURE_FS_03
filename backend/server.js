import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ✅ Import routes
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// ✅ Import model for seeding
import Product from "./models/Product.js";

dotenv.config();

const app = express();

// ✅ CORS (frontend + local)
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

// ✅ Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// ✅ AUTO SEED FUNCTION (runs only if DB empty)
const seedProducts = async () => {
  const count = await Product.countDocuments();

  if (count === 0) {
    console.log("🌱 Seeding initial products...");

    await Product.insertMany([
      {
        name: "Electric Water Kettle",
        price: 999,
        description: "Fast boiling kettle",
        category: "Home & Kitchen",
        imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500",
        stock: 20
      },
      {
        name: "Orthopedic Memory Foam Pillow",
        price: 899,
        description: "Comfortable pillow for neck support",
        category: "Home & Kitchen",
        imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500",
        stock: 30
      }
    ]);

    console.log("✅ Products seeded!");
  } else {
    console.log("📦 Products already exist, skipping seed.");
  }
};

// ✅ Connect DB + start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    await seedProducts(); // 🔥 auto insert if empty

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });
