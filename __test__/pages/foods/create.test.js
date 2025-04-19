// __tests__/pages/foods/create.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateFoodPage from "../../../pages/foods/create";
import { createFood } from "../../../utils/api";

// Mock modules
jest.mock("../../../utils/api", () => ({
  createFood: jest.fn(),
}));

jest.mock("../../../utils/auth", () => ({
  useAuth: () => ({
    getToken: jest.fn().mockReturnValue("test-token"),
  }),
}));

// Mock router
const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    main: ({ children, ...props }) => <main {...props}>{children}</main>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock FoodForm
jest.mock("../../../components/FoodForm", () => {
  return function MockFoodForm({ onSubmit, buttonText, disabled }) {
    return (
      <div data-testid="mock-food-form">
        <button
          onClick={() =>
            onSubmit({ name: "New Food", description: "Description" })
          }
          disabled={disabled}
        >
          {buttonText || "Submit"}
        </button>
      </div>
    );
  };
});

describe("Create Food Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders create food page correctly", () => {
    render(<CreateFoodPage />);

    expect(screen.getByText("Create New Food")).toBeInTheDocument();
    expect(screen.getByTestId("mock-food-form")).toBeInTheDocument();
  });

  it("handles navigation back to foods list", () => {
    render(<CreateFoodPage />);

    fireEvent.click(screen.getByText("Back to Foods"));

    expect(mockPush).toHaveBeenCalledWith("/foods");
  });

  it("submits form data and redirects on success", async () => {
    createFood.mockResolvedValueOnce({ message: "Food created successfully" });

    render(<CreateFoodPage />);

    // Submit the form
    fireEvent.click(screen.getByText("Create Food"));

    expect(createFood).toHaveBeenCalledWith({
      name: "New Food",
      description: "Description",
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/foods");
    });
  });

  it("shows error message on form submission failure", async () => {
    createFood.mockRejectedValueOnce(new Error("Failed to create food"));

    render(<CreateFoodPage />);

    // Submit the form
    fireEvent.click(screen.getByText("Create Food"));

    await waitFor(() => {
      expect(screen.getByText("Failed to create food")).toBeInTheDocument();
    });
  });
});
