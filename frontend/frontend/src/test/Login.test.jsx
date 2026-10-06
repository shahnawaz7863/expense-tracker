import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi } from "vitest";

import Login from "../pages/Login";
import { AuthContext } from "../context/AuthContext";

describe("Login Component", () => {
  test("renders login form correctly", () => {
    const loginMock = vi.fn();

    render(
      <AuthContext.Provider value={{ login: loginMock }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(
      screen.getByRole("heading", { name: "Welcome Back" })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter your email")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Login" })
    ).toBeInTheDocument();
  });

  test("allows user to enter email and password", async () => {
    const user = userEvent.setup();
    const loginMock = vi.fn();

    render(
      <AuthContext.Provider value={{ login: loginMock }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const emailInput =
      screen.getByPlaceholderText("Enter your email");

    const passwordInput =
      screen.getByPlaceholderText("Enter your password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "123456");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("123456");
  });
});