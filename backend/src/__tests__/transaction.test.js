import request from "supertest";
import app from "../app.js";

describe("Transaction API", () => {
  test("POST /api/transactions should reject unauthenticated request", async () => {
    const response = await request(app)
      .post("/api/transactions")
      .send({
        amount: 500,
        type: "Expense",
        category: "Food",
        account: "507f1f77bcf86cd799439011",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("GET /api/transactions should reject unauthenticated request", async () => {
    const response = await request(app)
      .get("/api/transactions");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});