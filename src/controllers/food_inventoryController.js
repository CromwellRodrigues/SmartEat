import { sql } from "..//config/db.js";
import { initDB } from "../config/db.js";

export async function getInventoryByUserId(req, res) {
  try {
    const { userId } = req.params;

    console.log("Fetching inventory for user_id:", userId);

    const food_item = await sql`
            SELECT * FROM food_inventory WHERE user_id = ${userId} ORDER BY expiry_date ASC
          `;

    res.status(200).json(food_item);
  } catch (error) {
    console.error("Error fetching food inventory:", error);
    res
      .status(500)
      .json({ error: "Internal Error. Failed to fetch food inventory" });
  }
}

export async function createInventoryItem(req, res) {
  try {
    const {
      user_id,
      food_name,
      category,
      expiry_date,
      quantity,
      amount,
      store,
    } = req.body;

    // Insert the food item into the database
    await sql`
               INSERT INTO food_inventory (user_id, food_name, category, expiry_date, quantity, amount, store)
               VALUES (${user_id}, ${food_name}, ${category}, ${expiry_date}, ${quantity}, ${amount}, ${store})`;

    res.status(201).json({ message: "Food item added successfully!" });
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).json({ error: "Failed to add food item" });
  }
  //
}

export async function deleteInventoryItem(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res
        .status(400)
        .json({ error: "Invalid ID format. ID must be a number." });
    }
    console.log("typeof id:", typeof id);

    // Delete the food item from the database
    const result = await sql`
          DELETE FROM food_inventory 
          WHERE id = ${id}
            RETURNING *
          `;

    console.log("Delete result:", result);
    console.log("Result length:", result.length);

    if (result.length === 0) {
      console.log("No item found with id:", id);
      return res.status(404).json({ error: "Food item not found" });
    }

    console.log("Item deleted successfully:", result[0]);
    res
      .status(200)
      .json({ message: "Food item deleted successfully!", deleted: result[0] });
  } catch (error) {
    console.error("Error deleting food item:", error);
    res
      .status(500)
      .json({ error: "Internal server error. Failed to delete food item" });
  }
}

export async function getInventorySummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    console.log("Fetching summary for user_id:", userId);

    const summaryExpiry = await sql`
            SELECT COALESCE(COUNT(*), 0) AS total_expiry_soon
            FROM food_inventory 
            WHERE user_id = ${userId} 
            
            AND expiry_date <= CURRENT_DATE + INTERVAL '3 days'
        
          `;

          const summaryAmountExpiringSoon = await sql`
          SELECT COALESCE(SUM(CAST(amount AS NUMERIC)), 0) AS amount_expiring_soon
          FROM food_inventory 
          WHERE user_id = ${userId} 
         AND expiry_date <= CURRENT_DATE + INTERVAL '3 days'
        `;
        console.log(
          "summaryAmountExpiringSoon result:",
          summaryAmountExpiringSoon
        );
    
    const summaryOutOfStock = await sql`
          SELECT COALESCE(COUNT(*), 0) AS total_out_of_stock
          FROM food_inventory 
          WHERE user_id = ${userId} 
          AND quantity <= 1
        `;

    const summaryItems = await sql`
              SELECT COALESCE(COUNT(*), 0) AS total_items 
                  FROM food_inventory 
              WHERE user_id = ${userId} 
              
            `;
    const summaryAmount = await sql`
              SELECT COALESCE(SUM(amount), 0) AS total_amount 
              FROM food_inventory 
              WHERE user_id = ${userId} 
            `;
    
    

    console.log("summaryExpiry result:", summaryExpiry);
    console.log("summaryOutOfStock result:", summaryOutOfStock);
    console.log("summaryItems result:", summaryItems);
    console.log("summaryAmount result:", summaryAmount);
    console.log("summaryAmountExpiringSoon result:", summaryAmountExpiringSoon);

    const responseData = {
      total_expiring_soon: summaryExpiry[0]?.total_expiry_soon,
      amount_expiring_soon: summaryAmountExpiringSoon[0]?.amount_expiring_soon, // <-- ADD THIS
      total_out_of_stock: summaryOutOfStock[0]?.total_out_of_stock,
      total_items: summaryItems[0]?.total_items,
      total_amount: summaryAmount[0]?.total_amount,
    };

    res.status(200).json(responseData);
    console.log("Response summary data :", responseData);
  } catch (error) {
    console.error("Error fetching food inventory summary:", error);
    res.status(500).json({
      error: "Internal Error. Failed to fetch food inventory summary",
    });
  }
}
