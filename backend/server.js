import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ✅ Import routes
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
// ✅ Import model for seeding
import Product from "./models/Product.js";

dotenv.config();

const app = express();

// ✅ CORS (frontend + local)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL,
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
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

// ✅ AUTO SEED FUNCTION (runs only if DB empty)
const seedProducts = async () => {
  const count = await Product.countDocuments();

  if (count === 0) {
    console.log("🌱 Seeding initial food menu...");

    await Product.insertMany([
      // --- veg ---
      {
        name: "Paneer Butter Masala",
        price: 250,
        description: "Rich and creamy curry made with paneer, spices, onions, tomatoes, cashews, and butter.",
        category: "veg",
        imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500",
        stock: 50,
        rating: 4.8
      },
      {
        name: "Dal Makhani",
        price: 220,
        description: "Classic North Indian dish made with whole black lentils, butter, and cream simmered to perfection.",
        category: "veg",
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500",
        stock: 40,
        rating: 4.7
      },
      {
        name: "Kadai Paneer",
        price: 240,
        description: "Spicy, warming, flavorful, and super delicious dish made by cooking paneer and bell peppers.",
        category: "veg",
        imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500",
        stock: 35,
        rating: 4.6
      },
      {
        name: "Mix Veg Curry",
        price: 210,
        description: "A mixture of vegetables like potatoes, carrots, peas, and beans cooked in an onion-tomato gravy.",
        category: "veg",
        imageUrl: "https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=500",
        stock: 30,
        rating: 4.4
      },
      {
        name: "Malai Kofta",
        price: 260,
        description: "Fried dumpling balls made of mashed potatoes and paneer, served with a creamy cashew gravy.",
        category: "veg",
        imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500",
        stock: 25,
        rating: 4.9
      },
      // --- Non-Veg ---
      {
        name: "Butter Chicken",
        price: 320,
        description: "Tender chicken cooked in a mildly spiced tomato and butter sauce. A worldwide favorite.",
        category: "Non-Veg",
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500",
        stock: 45,
        rating: 4.9
      },
      {
        name: "Chicken Tikka Masala",
        price: 310,
        description: "Roasted marinated chicken chunks in a spiced curry sauce.",
        category: "Non-Veg",
        imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500",
        stock: 50,
        rating: 4.8
      },
      {
        name: "Mutton Rogan Josh",
        price: 420,
        description: "A robust, spicy, and fragrant lamb curry originating from Kashmir.",
        category: "Non-Veg",
        imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500",
        stock: 20,
        rating: 4.7
      },
      {
        name: "Kadai Chicken",
        price: 290,
        description: "Chicken cooked with tomatoes, onions, and bell peppers in a traditional Indian wok.",
        category: "Non-Veg",
        imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500",
        stock: 35,
        rating: 4.5
      },
      {
        name: "Andhra Chicken Curry",
        price: 280,
        description: "Spicy, aromatic, and fiery chicken curry made in traditional Andhra style.",
        category: "Non-Veg",
        imageUrl: "https://spoonsofflavor.com/wp-content/uploads/2021/04/Andhra-Chicken-Curry.jpg",
        stock: 30,
        rating: 4.6
      },
      // --- Biryani ---
      {
        name: "Hyderabadi Chicken Dum Biryani",
        price: 350,
        description: "Classic Hyderabadi style slow-cooked chicken layered with aromatic basmati rice.",
        category: "Biryani",
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500",
        stock: 60,
        rating: 4.9
      },
      {
        name: "Mutton Dum Biryani",
        price: 450,
        description: "Succulent pieces of mutton marinated in spices and cooked with fragrant rice.",
        category: "Biryani",
        imageUrl: "https://sinfullyspicy.com/wp-content/uploads/2023/12/1200-by-1200-images-2.jpg",
        stock: 40,
        rating: 4.8
      },
      {
        name: "Paneer Tikka Biryani",
        price: 290,
        description: "Vegetarian delight featuring marinated paneer tikka layered with spiced rice.",
        category: "Biryani",
        imageUrl: "https://orders.popskitchen.in/storage/2024/09/image-285.png",
        stock: 30,
        rating: 4.6
      },
      {
        name: "Egg Dum Biryani",
        price: 250,
        description: "Flavorful basmati rice cooked with boiled eggs and aromatic spices.",
        category: "Biryani",
        imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500",
        stock: 25,
        rating: 4.5
      },
      {
        name: "Special Prawns Biryani",
        price: 499,
        description: "Fresh prawns marinated in coastal spices, slow-cooked with basmati rice.",
        category: "Biryani",
        imageUrl: "https://images.slurrp.com/prod/recipe_images/transcribe/main%20course/Prawn-Biryani.webp",
        stock: 15,
        rating: 4.7
      },
      // --- Seafood ---
      {
        name: "Goan Fish Curry",
        price: 380,
        description: "Tangy and spicy fish curry made with coconut milk and Goan spices.",
        category: "Seafood",
        imageUrl: "https://static.wixstatic.com/media/798804_a6039d082e724801a10a74fe1bdebefc~mv2.jpg/v1/fill/w_568,h_426,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/798804_a6039d082e724801a10a74fe1bdebefc~mv2.jpg",
        stock: 20,
        rating: 4.8
      },
      {
        name: "Prawns Rava Fry",
        price: 420,
        description: "Crispy fried prawns coated in semolina and regional spices.",
        category: "Seafood",
        imageUrl: "https://images.unsplash.com/photo-1559742811-822873691df8?w=500",
        stock: 25,
        rating: 4.7
      },
      {
        name: "Garlic Butter Prawns",
        price: 450,
        description: "Juicy prawns tossed in rich garlic butter and fresh herbs.",
        category: "Seafood",
        imageUrl: "https://headbangerskitchen.com/wp-content/uploads/2023/01/BGPRAWNS-Vertical.jpg",
        stock: 30,
        rating: 4.9
      },
      {
        name: "Apollo Fish",
        price: 360,
        description: "Boneless fish fillets fried and tossed in a spicy, punchy yogurt-based sauce.",
        category: "Seafood",
        imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/12/apollo-fish-recipe.jpg",
        stock: 20,
        rating: 4.6
      },
      // --- Fast Food ---
      {
        name: "Margherita Pizza",
        price: 299,
        description: "Classic delight with 100% real mozzarella cheese and fresh basil.",
        category: "Fast Food",
        imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
        stock: 50,
        rating: 4.7
      },
      {
        name: "Paneer Tikka Burger",
        price: 179,
        description: "Spicy paneer tikka patty layered with fresh veggies and mint mayo.",
        category: "Fast Food",
        imageUrl: "https://jeyporedukaan.in/wp-content/uploads/2022/09/images-21.jpeg",
        stock: 45,
        rating: 4.5
      },
      {
        name: "Classic Chicken Burger",
        price: 199,
        description: "Juicy grilled chicken patty with fresh lettuce, tomatoes, and garlic mayo.",
        category: "Fast Food",
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500",
        stock: 60,
        rating: 4.6
      },
      {
        name: "Peri Peri French Fries",
        price: 149,
        description: "Crispy golden fries tossed in a fiery peri peri seasoning.",
        category: "Fast Food",
        imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500",
        stock: 100,
        rating: 4.8
      },
      {
        name: "Chicken Roll",
        price: 160,
        description: "Flaky paratha wrapped around spicy chicken tikka pieces and onions.",
        category: "Fast Food",
        imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2024/02/chicken-kathi-roll-chicken-frankie.jpg",
        stock: 40,
        rating: 4.4
      },
      // --- Tiffins ---
      {
        name: "Idli Sambar",
        price: 80,
        description: "Soft steamed rice cakes served with flavorful lentil soup and coconut chutney.",
        category: "Tiffins",
        imageUrl: "https://vaya.in/recipes/wp-content/uploads/2018/02/Idli-and-Sambar-1.jpg",
        stock: 80,
        rating: 4.7
      },
      {
        name: "Medu Vada",
        price: 70,
        description: "Crispy, deep-fried lentil donuts served with hot sambar and chutney.",
        category: "Tiffins",
        imageUrl: "https://c.ndtvimg.com/2023-09/u113o4r_medu-vada_625x300_06_September_23.jpg",
        stock: 60,
        rating: 4.6
      },
      {
        name: "Upma",
        price: 65,
        description: "Savory semolina porridge cooked with vegetables and tempered with mustard seeds.",
        category: "Tiffins",
        imageUrl: "https://www.maggi.in/sites/default/files/srh_recipes/5f1439c480c484bacc2fcc13ac018173.jpg",
        stock: 50,
        rating: 4.3
      },
      {
        name: "Ghee Pongal",
        price: 90,
        description: "Comforting dish made with rice, yellow moong dal, black pepper, and generous amounts of ghee.",
        category: "Tiffins",
        imageUrl: "https://www.vegrecipesofindia.com/wp-content/uploads/2016/04/pongal-recipe-1.jpg",
        stock: 45,
        rating: 4.8
      },
      // --- South Indian ---
      {
        name: "Masala Dosa",
        price: 120,
        description: "Crispy crepe made from rice and lentils, filled with spiced potato curry.",
        category: "South Indian",
        imageUrl: "https://myfoodstory.com/wp-content/uploads/2025/08/Mysore-Masala-Dosa-Recipe-3.jpg",
        stock: 100,
        rating: 4.9
      },
      {
        name: "Mysore Masala Dosa",
        price: 140,
        description: "Crispy dosa smeared with a spicy red garlic chutney and stuffed with potato masala.",
        category: "South Indian",
        imageUrl: "https://palatesdesire.com/wp-content/uploads/2022/09/Mysore-masala-dosa-recipe@palates-desire.jpg",
        stock: 50,
        rating: 4.8
      },
      {
        name: "Onion Uttapam",
        price: 110,
        description: "Thick, soft savory pancake topped with finely chopped onions and green chilies.",
        category: "South Indian",
        imageUrl: "https://images.slurrp.com/prod/recipe_images/transcribe/breakfast/Bajra-onion-uttapam.webp",
        stock: 40,
        rating: 4.5
      },
      {
        name: "Rava Dosa",
        price: 130,
        description: "Thin, crispy dosa made with semolina, rice flour, and seasoned with cumin and ginger.",
        category: "South Indian",
        imageUrl: "https://www.vegrecipesofindia.com/wp-content/uploads/2018/09/rava-dosa-recipe-1.jpg",
        stock: 35,
        rating: 4.6
      },
      {
        name: "Bisi Bele Bath",
        price: 150,
        description: "Traditional Karnataka dish prepared with rice, lentils, vegetables, and aromatic spices.",
        category: "South Indian",
        imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500",
        stock: 30,
        rating: 4.7
      },
      // --- Chinese ---
      {
        name: "Veg Hakka Noodles",
        price: 180,
        description: "Wok-tossed noodles with crunchy vegetables and a splash of soy sauce.",
        category: "Chinese",
        imageUrl: "https://images.unsplash.com/photo-1645696301019-35adcc18fc21?w=500",
        stock: 60,
        rating: 4.6
      },
      {
        name: "Chicken Fried Rice",
        price: 220,
        description: "Classic wok-fried rice tossed with tender chicken pieces, egg, and spring onions.",
        category: "Chinese",
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500",
        stock: 55,
        rating: 4.7
      },
      {
        name: "Veg Manchurian (Gravy)",
        price: 200,
        description: "Deep-fried mixed vegetable dumplings tossed in a spicy soy and garlic gravy.",
        category: "Chinese",
        imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/veg-manchurian.jpg",
        stock: 45,
        rating: 4.8
      },
      {
        name: "Chilli Chicken (Dry)",
        price: 260,
        description: "Spicy and tangy Indo-Chinese style dry chili chicken, perfect as a starter.",
        category: "Chinese",
        imageUrl: "https://www.chilitochoc.com/wp-content/uploads/2026/01/chicken-chili-dry-featured.jpg",
        stock: 45,
        rating: 4.9
      },
      {
        name: "Schezwan Noodles",
        price: 190,
        description: "Fiery, spicy, and garlicky noodles tossed in homemade Schezwan sauce.",
        category: "Chinese",
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500",
        stock: 40,
        rating: 4.5
      },
      // --- Starters & Snacks ---
      {
        name: "Chicken 65",
        price: 240,
        description: "Spicy, deep-fried chicken bites tossed with curry leaves and red chilies.",
        category: "Starters & Snacks",
        imageUrl: "https://recipe52.com/wp-content/uploads/2022/02/chicken-65-fb-1-of-1-1.jpg",
        stock: 50,
        rating: 4.8
      },
      {
        name: "Paneer 65",
        price: 220,
        description: "Crispy fried cottage cheese cubes tossed in a spicy, tangy yogurt sauce.",
        category: "Starters & Snacks",
        imageUrl: "https://static.toiimg.com/thumb/75490988.cms?imgsize=1561658&width=800&height=800",
        stock: 45,
        rating: 4.6
      },
      {
        name: "Veg Spring Rolls",
        price: 180,
        description: "Crispy, golden-fried wrappers filled with a savory mix of stir-fried vegetables.",
        category: "Starters & Snacks",
        imageUrl: "https://www.cubesnjuliennes.com/wp-content/uploads/2021/01/Spring-Roll-Recipe.jpg",
        stock: 35,
        rating: 4.7
      },
      {
        name: "Steamed Veg Momos",
        price: 150,
        description: "Delicious steamed dumplings stuffed with finely minced vegetables and herbs.",
        category: "Starters & Snacks",
        imageUrl: "https://www.mygingergarlickitchen.com/wp-content/uploads/2024/02/veg-momos-recipe-5.jpg",
        stock: 40,
        rating: 4.8
      },
      {
        name: "Crispy Chilli Corn",
        price: 170,
        description: "Batter-fried sweet corn kernels tossed with onions, peppers, and Chinese sauces.",
        category: "Starters & Snacks",
        imageUrl: "https://i.ytimg.com/vi/HdNzWbLQ7B8/maxresdefault.jpg",
        stock: 30,
        rating: 4.5
      },
      // --- Desserts ---
      {
        name: "Chocolate Lava Cake",
        price: 160,
        description: "Warm, fudgy chocolate cake with a molten, gooey chocolate center.",
        category: "Desserts",
        imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500",
        stock: 30,
        rating: 4.9
      },
      {
        name: "Gulab Jamun",
        price: 110,
        description: "Soft, deep-fried milk solid balls soaked in a fragrant rose and cardamom syrup.",
        category: "Desserts",
        imageUrl: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/11/gulab-jamun.jpg",
        stock: 40,
        rating: 4.8
      },
      {
        name: "Rasmalai",
        price: 140,
        description: "Soft cottage cheese dumplings soaked in sweetened, saffron-infused thickened milk.",
        category: "Desserts",
        imageUrl: "https://www.cookwithmanali.com/wp-content/uploads/2014/07/Rasmalai-Recipe-500x500.jpg",
        stock: 25,
        rating: 4.9
      },
      {
        name: "Mango Cheesecake",
        price: 220,
        description: "Creamy, rich baked cheesecake layered with fresh seasonal mango puree.",
        category: "Desserts",
        imageUrl: "https://takestwoeggs.com/wp-content/uploads/2021/08/No-Bake-Mango-Cheesecake-Takestwoeggs-Final-sq.jpg",
        stock: 15,
        rating: 4.6
      },
      // --- Drinks ---
      {
        name: "Virgin Mojito",
        price: 120,
        description: "Refreshing mocktail made with fresh mint leaves, lemon juice, and sparkling water.",
        category: "Drinks",
        imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500",
        stock: 50,
        rating: 4.7
      },
      {
        name: "Cold Coffee",
        price: 140,
        description: "Classic chilled blend of rich espresso, milk, and vanilla ice cream.",
        category: "Drinks",
        imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500",
        stock: 60,
        rating: 4.8
      },
      {
        name: "Mango Lassi",
        price: 130,
        description: "Sweet, creamy traditional yogurt drink blended with ripe mangoes.",
        category: "Drinks",
        imageUrl: "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_auto,w_1500,ar_3:2/k%2FPhoto%2FRecipes%2F2024-08-mango-lassi%2Fmango-lassi-013",
        stock: 45,
        rating: 4.9
      },
      {
        name: "Fresh Lime Soda",
        price: 80,
        description: "Revitalizing sweet and salty fizzy drink flavored with freshly squeezed lime juice.",
        category: "Drinks",
        imageUrl: "https://www.acouplecooks.com/wp-content/uploads/2021/12/Lemon-Soda-004.jpg",
        stock: 80,
        rating: 4.5
      },
      // --- Combo & Offers ---
      {
        name: "Chicken Biryani Combo",
        price: 499,
        description: "Includes Hyderabadi Chicken Biryani, Chicken 65, Raita, Salan, and a soft drink.",
        category: "Combo & Offers",
        imageUrl: "https://party.manis.in/cdn/shop/files/ChickenBiryaniBucketCombos_ec55aa6d-77ae-4a64-9e19-d90b589bd31c.jpg?v=1739788022",
        stock: 20,
        rating: 4.9
      },
      {
        name: "Veg Maharaja Thali",
        price: 399,
        description: "A grand feast featuring Paneer Butter Masala, Dal Makhani, Mix Veg, Rice, Roti, and Gulab Jamun.",
        category: "Combo & Offers",
        imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500",
        stock: 25,
        rating: 4.8
      },
      {
        name: "Chinese Mini Meal",
        price: 299,
        description: "Veg Hakka Noodles or Fried Rice served with Veg Manchurian Gravy and a Coke.",
        category: "Combo & Offers",
        imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500",
        stock: 30,
        rating: 4.7
      }
    ]);

    console.log("✅ Menu seeded!");
  } else {
    console.log("📦 Menu already exists, skipping seed.");
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
