import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const sampleProducts = [
  // Electronics
  {
    name: "Smartphone Pro Max 5G",
    price: 65999,
    description: "Latest 5G smartphone with 120Hz AMOLED display, 108MP camera, and all-day battery.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    stock: 45
  },
  {
    name: "Ultra-Thin Gaming Laptop",
    price: 125000,
    description: "High-performance laptop featuring RTX 4060, 16GB RAM, and 1TB NVMe SSD.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
    stock: 20
  },
  {
    name: "Wireless Noise-Cancelling Earbuds",
    price: 4999,
    description: "True wireless earbuds with active noise cancellation and 24-hour playback.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
    stock: 150
  },
  {
    name: "4K Ultra HD Smart TV",
    price: 42000,
    description: "55-inch 4K Smart LED TV with built-in streaming apps and Dolby Vision.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500",
    stock: 12
  },
  {
    name: "Mechanical Gaming Keyboard",
    price: 3500,
    description: "RGB backlit mechanical keyboard with blue switches for tactile feedback.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500",
    stock: 85
  },
  {
    name: "Wireless Gaming Mouse",
    price: 2100,
    description: "Ergonomic gaming mouse with 10000 DPI optical sensor and 6 programmable buttons.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    stock: 120
  },
  {
    name: "20000mAh Power Bank",
    price: 1800,
    description: "Fast-charging portable power bank with dual USB outputs.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500",
    stock: 200
  },
  {
    name: "Smart Fitness Band",
    price: 2999,
    description: "Heart rate and SpO2 monitor with 14-day battery life and AMOLED display.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=500",
    stock: 90
  },
  {
    name: "Bluetooth Portable Speaker",
    price: 2500,
    description: "IPX7 waterproof portable speaker with extra bass and 12-hour playtime.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    stock: 60
  },
  {
    name: "1TB External Hard Drive",
    price: 4500,
    description: "USB 3.0 external hard drive for fast data transfer and secure backups.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=500",
    stock: 40
  },
  
  // Clothing
  {
    name: "Men's Cotton Polo T-Shirt",
    price: 799,
    description: "Comfortable and breathable regular fit polo t-shirt.",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500",
    stock: 300
  },
  {
    name: "Slim Fit Blue Jeans",
    price: 1499,
    description: "Stretchable slim fit denim jeans for everyday wear.",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
    stock: 150
  },
  {
    name: "Women's Floral Maxi Dress",
    price: 1299,
    description: "Beautiful floral print maxi dress perfect for summer outings.",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500",
    stock: 80
  },
  {
    name: "Classic Leather Jacket",
    price: 3499,
    description: "Premium faux leather jacket with a modern biker style.",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    stock: 35
  },
  {
    name: "Traditional Silk Saree",
    price: 4500,
    description: "Authentic banarasi silk saree with intricate zari work.",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
    stock: 25
  },
  {
    name: "Men's Formal Shirt",
    price: 999,
    description: "Solid cotton formal shirt for office and business wear.",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500",
    stock: 120
  },
  {
    name: "Winter Hoodie Sweatshirt",
    price: 1199,
    description: "Warm fleece-lined hoodie with front kangaroo pockets.",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    stock: 200
  },
  {
    name: "Women's Kurta Set",
    price: 1599,
    description: "Embroidered straight kurta with matching palazzo pants.",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500",
    stock: 60
  },
  {
    name: "Running Sports Shoes",
    price: 2499,
    description: "Lightweight sports shoes with memory foam insoles.",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    stock: 90
  },
  {
    name: "Unisex Cotton Socks (Pack of 3)",
    price: 399,
    description: "Breathable ankle-length cotton socks.",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=500",
    stock: 120
  },

  // Home & Kitchen
  {
    name: "Non-Stick Cookware Set",
    price: 2200,
    description: "3-piece non-stick cookware set including fry pan, kadai, and tawa.",
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=500",
    stock: 45
  },
  {
    name: "Stainless Steel Water Bottle",
    price: 650,
    description: "1-liter vacuum insulated stainless steel water flask.",
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
    stock: 300
  },
  {
    name: "Mixer Grinder 750W",
    price: 3500,
    description: "Heavy-duty 750W mixer grinder with 3 stainless steel jars.",
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500",
    stock: 25
  },
  {
    name: "Cotton Double Bedsheet",
    price: 1200,
    description: "100% cotton double bedsheet with 2 pillow covers.",
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1536882240095-0379873feb4e?w=500",
    stock: 80
  },
  {
    name: "Electric Water Kettle",
    price: 999,
    description: "1.5L electric kettle with auto shut-off feature.",
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500",
    stock: 110
  },
  {
    name: "Coffee Mug Set (6 Pieces)",
    price: 499,
    description: "Elegant ceramic coffee mugs for your daily brew.",
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500",
    stock: 60
  },
  {
    name: "Air Purifier",
    price: 9500,
    description: "HEPA air purifier for removing 99.9% of allergens and dust.",
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500",
    stock: 15
  },
  {
    name: "Microwave Oven 20L",
    price: 6500,
    description: "20-liter solo microwave oven with easy dial controls.",
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500",
    stock: 10
  },
  {
    name: "Orthopedic Memory Foam Pillow",
    price: 899,
    description: "Contoured memory foam pillow for neck and back pain relief.",
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500",
    stock: 75
  },
  {
    name: "Wooden Wall Shelf",
    price: 1500,
    description: "Modern floating wooden wall shelf for living room decor.",
    category: "Home & Kitchen",
    imageUrl: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=500",
    stock: 40
  },

  // Accessories & Beauty
  {
    name: "Aviator Sunglasses",
    price: 1299,
    description: "UV400 polarized aviator sunglasses for men and women.",
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
    stock: 120
  },
  {
    name: "Genuine Leather Wallet",
    price: 899,
    description: "Classic brown leather bifold wallet with RFID blocking.",
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    stock: 150
  },
  {
    name: "Laptop Backpack",
    price: 1899,
    description: "Water-resistant travel backpack fitting up to 15.6-inch laptops.",
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    stock: 95
  },
  {
    name: "Analog Wrist Watch",
    price: 2199,
    description: "Premium analog watch with stainless steel strap.",
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    stock: 65
  },
  {
    name: "Women's Tote Bag",
    price: 1599,
    description: "Spacious PU leather tote bag for everyday use.",
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
    stock: 50
  },
  {
    name: "Luxury Perfume 100ml",
    price: 2500,
    description: "Long-lasting Eau De Parfum with woody and citrus notes.",
    category: "Beauty",
    imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500",
    stock: 40
  },
  {
    name: "Matte Liquid Lipstick",
    price: 499,
    description: "Smudge-proof matte liquid lipstick lasting up to 12 hours.",
    category: "Beauty",
    imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500",
    stock: 200
  },
  {
    name: "Vitamin C Face Wash",
    price: 349,
    description: "Gentle foaming face wash for glowing and clear skin.",
    category: "Beauty",
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500",
    stock: 180
  },
  {
    name: "Hydrating Body Lotion",
    price: 450,
    description: "Deep moisture body lotion enriched with cocoa butter.",
    category: "Beauty",
    imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500",
    stock: 110
  },
  {
    name: "Hair Smoothing Serum",
    price: 550,
    description: "Frizz-control hair serum with argan oil extracts.",
    category: "Beauty",
    imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500",
    stock: 90
  },

  // Sports, Books & Hobbies
  {
    name: "Anti-Slip Yoga Mat",
    price: 799,
    description: "6mm thick TPE yoga mat with alignment lines.",
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
    stock: 75
  },
  {
    name: "Adjustable Dumbbells Set",
    price: 3500,
    description: "20kg adjustable PVC dumbbell set for home workouts.",
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500",
    stock: 30
  },
  {
    name: "Cricket Bat (Kashmir Willow)",
    price: 1800,
    description: "Full-size Kashmir willow cricket bat with a comfortable grip.",
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=500",
    stock: 40
  },
  {
    name: "Sci-Fi Bestseller Book",
    price: 399,
    description: "Award-winning science fiction novel paperback edition.",
    category: "Books",
    imageUrl: "https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=500",
    stock: 150
  },
  {
    name: "Self-Help Motivation Book",
    price: 299,
    description: "#1 New York Times bestseller for personal growth.",
    category: "Books",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
    stock: 200
  },
  {
    name: "Professional Sketchbook",
    price: 250,
    description: "A4 size, 140gsm thick paper sketchbook for artists.",
    category: "Hobbies",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500",
    stock: 85
  },
  {
    name: "Watercolor Paint Set",
    price: 650,
    description: "24 vibrant watercolor tubes with 2 blending brushes.",
    category: "Hobbies",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
    stock: 60
  },
  {
    name: "Acoustic Guitar",
    price: 4500,
    description: "38-inch acoustic guitar with spruce top and rich tone.",
    category: "Hobbies",
    imageUrl: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500",
    stock: 15
  },
  {
    name: "Classic Board Game",
    price: 899,
    description: "Family strategy board game for 2-6 players.",
    category: "Hobbies",
   imageUrl: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=500",
    stock: 45
  },
  {
    name: "1000 Piece Jigsaw Puzzle",
    price: 599,
    description: "High-quality landscape jigsaw puzzle for adults.",
    category: "Hobbies",
    imageUrl: "https://images.unsplash.com/photo-1578377375762-cbcc98d68af0?w=500",
    stock: 55
  }
];


const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    await Product.deleteMany();
    await Product.insertMany(sampleProducts);

    console.log("✅ Products inserted successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error Seeding Data:", err);
    process.exit(1);
  }
};

seedDB();
