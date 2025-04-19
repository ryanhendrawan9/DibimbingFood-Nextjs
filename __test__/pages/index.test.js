import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../../pages/index";
import { getToken } from "../../utils/auth";

// Mock the router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the auth util
jest.mock("../../utils/auth", () => ({
  getToken: jest.fn(),
}));

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders loading state correctly", () => {
    getToken.mockReturnValue("test-token");

    render(<Home />);

    // Check if loading text and elements are displayed
    expect(screen.getByText("Dibimbing Food")).toBeInTheDocument();
    expect(screen.getByText("Discover delicious recipes")).toBeInTheDocument();
    expect(
      screen.getByText("Redirecting you to tasty experiences...")
    ).toBeInTheDocument();
  });

  it("redirects to foods page if user is logged in", () => {
    getToken.mockReturnValue("test-token");
    const mockPush = jest.fn();

    jest.spyOn(require("next/router"), "useRouter").mockImplementation(() => ({
      push: mockPush,
    }));

    render(<Home />);

    // Fast-forward timer
    jest.advanceTimersByTime(1500);

    // Check if router.push was called with /foods
    expect(mockPush).toHaveBeenCalledWith("/foods");
  });

  it("redirects to login page if user is not logged in", () => {
    getToken.mockReturnValue(null);
    const mockPush = jest.fn();

    jest.spyOn(require("next/router"), "useRouter").mockImplementation(() => ({
      push: mockPush,
    }));

    render(<Home />);

    // Fast-forward timer
    jest.advanceTimersByTime(1500);

    // Check if router.push was called with /login
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
