// __tests__/pages/foods/index.test.js
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import FoodsPage from "../../../pages/foods/index";
import { getFoods } from "../../../utils/api";
import { useRouter } from "next/router";

// Mock modules
jest.mock("../../../utils/api", () => ({
  getFoods: jest.fn(),
}));

// Mock router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock token getter with different return values for testing
const mockGetToken = jest.fn();
jest.mock("../../../utils/auth", () => ({
  useAuth: () => ({
    getToken: mockGetToken,
  }),
}));

// Mock Navbar component
jest.mock("../../../components/Navbar", () => {
  return function MockNavbar() {
    return <div data-testid="mock-navbar">Navbar</div>;
  };
});

// Mock Head component
jest.mock("next/head", () => {
  return function MockHead({ children }) {
    return <div data-testid="mock-head">{children}</div>;
  };
});

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    button: ({ children, className, onClick, disabled, ...props }) => (
      <button
        className={className}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    ),
    p: ({ children, className, ...props }) => (
      <p className={className} {...props}>
        {children}
      </p>
    ),
    input: ({ className, ...props }) => (
      <input className={className} {...props} />
    ),
    main: ({ children, className, ...props }) => (
      <main className={className} {...props}>
        {children}
      </main>
    ),
    h1: ({ children, className, ...props }) => (
      <h1 className={className} {...props}>
        {children}
      </h1>
    ),
    svg: ({ className, ...props }) => <svg className={className} {...props} />,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock FoodCard component
jest.mock("../../../components/FoodCard", () => {
  return function MockFoodCard({ food }) {
    return <div data-testid={`food-card-${food.id}`}>{food.name}</div>;
  };
});

describe("Foods List Page", () => {
  const mockFoods = [
    { id: 1, name: "Food 1", description: "Description 1" },
    { id: 2, name: "Food 2", description: "Description 2" },
  ];

  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    useRouter.mockReturnValue({
      push: mockPush,
    });

    // Default to returning a valid token
    mockGetToken.mockReturnValue("test-token");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("displays foods from initialFoods", () => {
    render(<FoodsPage initialFoods={mockFoods} />);

    expect(screen.getByText("Food 1")).toBeInTheDocument();
    expect(screen.getByText("Food 2")).toBeInTheDocument();
  });

  it("fetches foods when initialFoods is not provided", async () => {
    getFoods.mockResolvedValueOnce({ data: mockFoods });

    render(<FoodsPage />);

    // Should show loading initially
    expect(screen.getByText("Loading delicious foods...")).toBeInTheDocument();

    // Then should show foods
    await waitFor(() => {
      expect(screen.getByText("Food 1")).toBeInTheDocument();
      expect(screen.getByText("Food 2")).toBeInTheDocument();
    });

    // Should have called getFoods
    expect(getFoods).toHaveBeenCalledTimes(1);
  });

  it("redirects to login if no token is present", async () => {
    // Mock getToken to return null (no token)
    mockGetToken.mockReturnValueOnce(null);

    render(<FoodsPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("handles error when fetching foods fails", async () => {
    // Mock getFoods to reject
    getFoods.mockRejectedValueOnce(new Error("API error"));

    render(<FoodsPage />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch foods")).toBeInTheDocument();
    });
  });

  it("filters foods based on search term", () => {
    render(<FoodsPage initialFoods={mockFoods} />);

    // Enter search term
    fireEvent.change(screen.getByPlaceholderText("Search foods..."), {
      target: { value: "Food 1" },
    });

    // Should filter
    expect(screen.getByText("Food 1")).toBeInTheDocument();
    expect(screen.queryByText("Food 2")).not.toBeInTheDocument();
  });

  it("refreshes food list successfully", async () => {
    // First render with initial foods
    getFoods.mockResolvedValueOnce({ data: mockFoods });

    render(<FoodsPage initialFoods={mockFoods} />);

    // Mock the refresh call
    const updatedMockFoods = [
      { id: 1, name: "Updated Food 1", description: "Updated Description 1" },
      { id: 2, name: "Updated Food 2", description: "Updated Description 2" },
    ];
    getFoods.mockResolvedValueOnce({ data: updatedMockFoods });

    // Click refresh button
    fireEvent.click(screen.getByText("Refresh"));

    // Check that it shows "Refreshing..." while in progress
    expect(screen.getByText("Refreshing...")).toBeInTheDocument();

    // Wait for refresh to complete
    await waitFor(() => {
      expect(
        screen.getByText("Foods refreshed successfully!")
      ).toBeInTheDocument();
    });

    // Check that the success message disappears after timeout
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Foods refreshed successfully!")
      ).not.toBeInTheDocument();
    });
  });

  it("handles error when refreshing foods", async () => {
    render(<FoodsPage initialFoods={mockFoods} />);

    // Mock the refresh call to fail
    getFoods.mockRejectedValueOnce(new Error("API error"));

    // Click refresh button
    fireEvent.click(screen.getByText("Refresh"));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Failed to refresh foods")).toBeInTheDocument();
    });
  });

  it("shows empty state when no foods match search", () => {
    render(<FoodsPage initialFoods={mockFoods} />);

    // Enter search term that doesn't match any food
    fireEvent.change(screen.getByPlaceholderText("Search foods..."), {
      target: { value: "nonexistent" },
    });

    // Should show no results message
    expect(screen.getByText("No foods match your search.")).toBeInTheDocument();
    expect(
      screen.getByText("Try a different search term.")
    ).toBeInTheDocument();
  });

  it("shows empty state when no foods available", () => {
    render(<FoodsPage initialFoods={[]} />);

    // Should show no foods message
    expect(screen.getByText("No foods found.")).toBeInTheDocument();
    expect(
      screen.getByText("Add some delicious foods to get started!")
    ).toBeInTheDocument();
  });

  // Test getServerSideProps
  describe("getServerSideProps", () => {
    it("returns initialFoods from API", async () => {
      // Import the actual function
      const { getServerSideProps } = require("../../../pages/foods/index");

      // Mock API response
      getFoods.mockResolvedValueOnce({ data: mockFoods });

      const result = await getServerSideProps();

      expect(result).toEqual({
        props: {
          initialFoods: mockFoods,
        },
      });
    });

    it("returns empty initialFoods on error", async () => {
      // Import the actual function
      const { getServerSideProps } = require("../../../pages/foods/index");

      // Mock API error
      getFoods.mockRejectedValueOnce(new Error("API error"));

      const result = await getServerSideProps();

      expect(result).toEqual({
        props: {
          initialFoods: [],
        },
      });
    });
  });
});
