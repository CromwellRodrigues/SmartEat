import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import food_inventoryRoute from "./routes/food_inventoryRoute.js";

import job from "./config/cron.js";
dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") job.start();

// Middlewares
app.use(cors({
  origin: ["http://localhost:3000", "https://smart-eat-frontend.vercel.app"],
  credentials: true
}));
app.use(rateLimiter); // Apply rate limiting middleware
app.use(express.json()); // Middleware to parse JSON bodies

app.use((req, res, next) => {
  console.log("We received a request!", req.method);
  next(); // Call the next middleware or route handler
});
const PORT = process.env.PORT || 5001;

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/food_inventory", food_inventoryRoute);
// app.use("/api/shopping_list", shopping_listRoute);

console.log("My port : ", process.env.PORT);

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });
