import request from "supertest";
import app from "../app.js";

describe("Auth API", () => {
  test("GET /api/auth/me should reject unauthenticated request", async () => {
    const response = await request(app)
      .get("/api/auth/me");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

test("POST /api/auth/register should reject invalid email", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test User",
      email: "invalid-email",
      password: "123456",
    });

  expect(response.statusCode).toBe(400);
  expect(response.body.success).toBe(false);
});