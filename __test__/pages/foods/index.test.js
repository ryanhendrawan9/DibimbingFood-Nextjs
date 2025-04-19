// __tests__/pages/foods/index.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FoodsPage from "../../../pages/foods/index";
import { getFoods } from "../../../utils/api";

// Mock modules
jest.mock("../../../utils/api", () => ({
  getFoods: jest.fn(),
}));

jest.mock("../../../utils/auth", () => ({
  useAuth: () => ({
    getToken: jest.fn().mockReturnValue("test-token"),
  }),
}));

// Mock Head component
jest.mock("next/head", () => {
  return function MockHead({ children }) {
    return <div data-testid="mock-head">{children}</div>;
  };
});

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    input: (props) => <input {...props} />,
    main: ({ children, ...props }) => <main {...props}>{children}</main>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    svg: (props) => <svg {...props} />,
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

  beforeEach(() => {
    jest.clearAllMocks();
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

  it("refreshes food list", async () => {
    getFoods.mockResolvedValueOnce({ data: mockFoods });

    render(<FoodsPage initialFoods={mockFoods} />);

    // Click refresh button
    fireEvent.click(screen.getByText("Refresh"));

    expect(getFoods).toHaveBeenCalled();

    await waitFor(() => {
      expect(
        screen.getByText("Foods refreshed successfully!")
      ).toBeInTheDocument();
    });
  });
});
