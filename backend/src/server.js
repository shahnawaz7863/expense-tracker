import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";
import cron from "node-cron";
import { processRecurringTransactions } from "./utils/recurringTransactions.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    cron.schedule("0 0 * * *", async () => {
      console.log("Running recurring transaction processor...");
      await processRecurringTransactions();
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();