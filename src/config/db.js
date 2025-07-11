import { neon } from '@neondatabase/serverless';


import "dotenv/config";

// creates a SQL connection using our DB URL
export const sql = neon(process.env.DATABASE_URL);


export async function initDB() {
  // Import the SQL connection


  // Test the connection
  try {
    await sql`CREATE TABLE IF NOT EXISTS food_inventory (
              id SERIAL PRIMARY KEY,
              user_id VARCHAR(255) NOT NULL,
              food_name VARCHAR(255) NOT NULL,
              category VARCHAR(255) NOT NULL,
              expiry_date DATE NOT NULL,
              quantity INT NOT NULL,
              amount DECIMAL(10,2) NOT NULL,
              store VARCHAR(255) NOT NULL,
              created_at DATE NOT NULL  DEFAULT CURRENT_DATE
          )
          
          `;

    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error initialising DB :", error);
    process.exit(1); // Exit the process if DB connection fails
  }
}
  