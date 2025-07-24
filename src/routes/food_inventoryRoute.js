import express from "express";


import { createInventoryItem, deleteInventoryItem, getInventoryByUserId, getInventorySummaryByUserId, updateInventoryItem } from "../controllers/food_inventoryController.js"; // Adjust the path as necessary

const router = express.Router();



router.get("/summary/:userId", getInventorySummaryByUserId); 

router.put("/:id", updateInventoryItem); 

router.get("/:userId", getInventoryByUserId);

router.post("/", createInventoryItem);

router.delete("/:id", deleteInventoryItem);




export default router;