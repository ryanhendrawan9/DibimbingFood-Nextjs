// __tests__/components/Navbar.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "../../components/Navbar";
import { logout } from "../../utils/auth";

// Mock useRouter
const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock logout function
jest.mock("../../utils/auth", () => ({
  logout: jest.fn(),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders navigation bar correctly", () => {
    render(<Navbar />);

    expect(screen.getByText("Dibimbing Food")).toBeInTheDocument();
    expect(screen.getByText("Add New Food")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("shows notification when adding new food", () => {
    render(<Navbar />);

    fireEvent.click(screen.getByText("Add New Food"));

    expect(screen.getByText("Creating new food item!")).toBeInTheDocument();
  });

  it("handles logout and redirects", () => {
    render(<Navbar />);

    fireEvent.click(screen.getByText("Logout"));

    expect(screen.getByText("Logging out successfully!")).toBeInTheDocument();

    // Fast-forward timers
    jest.advanceTimersByTime(1000);

    expect(logout).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
