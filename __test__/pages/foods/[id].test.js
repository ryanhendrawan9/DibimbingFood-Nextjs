// __tests__/pages/foods/[id].test.js
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import FoodDetailPage from "../../../pages/foods/[id]";
import { getFoodById, updateFood, deleteFood } from "../../../utils/api";

// Mock modules
jest.mock("../../../utils/api", () => ({
  getFoodById: jest.fn(),
  updateFood: jest.fn(),
  deleteFood: jest.fn(),
}));

// Mock token getter with different return values for testing
const mockGetToken = jest.fn();
jest.mock("../../../utils/auth", () => ({
  useAuth: () => ({
    getToken: mockGetToken,
  }),
}));

// Mock router with push method that can be spied on
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  query: { id: "1" },
};
jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

// Mock Navbar component
jest.mock("../../../components/Navbar", () => {
  return function MockNavbar() {
    return <div data-testid="mock-navbar">Navbar</div>;
  };
});

// Mock window.confirm
window.confirm = jest.fn();

// Mock setTimeout
jest.useFakeTimers();

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
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} data-testid="mock-image" />,
}));

// Mock FoodForm component
jest.mock("../../../components/FoodForm", () => {
  return function MockFoodForm({ initialData, onSubmit, buttonText }) {
    return (
      <div data-testid="mock-food-form">
        <p>Form for: {initialData?.name || "No data"}</p>
        <button
          onClick={() => onSubmit({ ...initialData, name: "Updated Food" })}
          data-testid="form-submit-button"
        >
          {buttonText || "Submit"}
        </button>
      </div>
    );
  };
});

describe("Food Detail Page", () => {
  const mockFood = {
    id: 1,
    name: "Test Food",
    description: "This is a test food",
    imageUrl: "test.jpg",
    ingredients: ["ingredient1", "ingredient2"],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default to returning a valid token
    mockGetToken.mockReturnValue("test-token");
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("renders loading state initially when no initialFood is provided", () => {
    render(<FoodDetailPage />);

    expect(screen.getByText("Loading food details...")).toBeInTheDocument();
  });

  it("fetches and displays food data when initialFood is not provided", async () => {
    getFoodById.mockResolvedValueOnce({ data: mockFood });

    render(<FoodDetailPage />);

    // Should show loading initially
    expect(screen.getByText("Loading food details...")).toBeInTheDocument();

    // Then should show food data
    await waitFor(() => {
      expect(screen.getByText("Test Food")).toBeInTheDocument();
    });

    expect(getFoodById).toHaveBeenCalledWith("1");
  });

  it("redirects to login if no token is present", async () => {
    // Mock getToken to return null (no token)
    mockGetToken.mockReturnValueOnce(null);

    render(<FoodDetailPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("handles error when fetching food fails", async () => {
    // Mock getFoodById to reject
    getFoodById.mockRejectedValueOnce(new Error("API error"));

    render(<FoodDetailPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to fetch food details")
      ).toBeInTheDocument();
    });
  });

  it("displays food not found when data is not available", async () => {
    // Mock getFoodById to return null data
    getFoodById.mockResolvedValueOnce({ data: null });

    render(<FoodDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Food not found.")).toBeInTheDocument();
    });
  });

  it("renders food data immediately when initialFood is provided", () => {
    render(<FoodDetailPage initialFood={mockFood} />);

    // Should show food data immediately, not loading
    expect(screen.getByText("Test Food")).toBeInTheDocument();
    expect(
      screen.queryByText("Loading food details...")
    ).not.toBeInTheDocument();
  });

  it("displays the food image when imageUrl is provided", () => {
    render(<FoodDetailPage initialFood={mockFood} />);

    const image = screen.getByTestId("mock-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "test.jpg");
    expect(image).toHaveAttribute("alt", "Test Food");
  });

  it("updates food data successfully", async () => {
    updateFood.mockResolvedValueOnce({
      data: { ...mockFood, name: "Updated Food" },
    });

    render(<FoodDetailPage initialFood={mockFood} />);

    // Submit the form
    fireEvent.click(screen.getByTestId("form-submit-button"));

    expect(updateFood).toHaveBeenCalledWith("1", {
      ...mockFood,
      name: "Updated Food",
    });

    await waitFor(() => {
      expect(
        screen.getByText("Food updated successfully!")
      ).toBeInTheDocument();
    });

    // Check that the success message disappears after timeout
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Food updated successfully!")
      ).not.toBeInTheDocument();
    });
  });

  it("handles error when updating food", async () => {
    // Mock updateFood to reject with specific error message
    const errorMessage = "Update failed due to server error";
    updateFood.mockRejectedValueOnce({ message: errorMessage });

    render(<FoodDetailPage initialFood={mockFood} />);

    // Submit the form
    fireEvent.click(screen.getByTestId("form-submit-button"));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("handles error when updating food without specific message", async () => {
    // Mock updateFood to reject without specific error message
    updateFood.mockRejectedValueOnce(new Error());

    render(<FoodDetailPage initialFood={mockFood} />);

    // Submit the form
    fireEvent.click(screen.getByTestId("form-submit-button"));

    await waitFor(() => {
      expect(screen.getByText("Failed to update food")).toBeInTheDocument();
    });
  });

  it("does not delete food when confirmation is cancelled", async () => {
    window.confirm.mockReturnValueOnce(false);

    render(<FoodDetailPage initialFood={mockFood} />);

    // Click delete button
    fireEvent.click(screen.getByText("Delete Food"));

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this food?"
    );
    expect(deleteFood).not.toHaveBeenCalled();
  });

  it("deletes food and redirects after confirmation", async () => {
    window.confirm.mockReturnValueOnce(true);
    deleteFood.mockResolvedValueOnce({});

    render(<FoodDetailPage initialFood={mockFood} />);

    // Click delete button
    fireEvent.click(screen.getByText("Delete Food"));

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this food?"
    );
    expect(deleteFood).toHaveBeenCalledWith("1");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/foods");
    });
  });

  it("handles error when deleting food", async () => {
    window.confirm.mockReturnValueOnce(true);
    // Mock deleteFood to reject with specific error message
    const errorMessage = "Delete failed due to server error";
    deleteFood.mockRejectedValueOnce({ message: errorMessage });

    render(<FoodDetailPage initialFood={mockFood} />);

    // Click delete button
    fireEvent.click(screen.getByText("Delete Food"));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("handles error when deleting food without specific message", async () => {
    window.confirm.mockReturnValueOnce(true);
    // Mock deleteFood to reject without specific error message
    deleteFood.mockRejectedValueOnce(new Error());

    render(<FoodDetailPage initialFood={mockFood} />);

    // Click delete button
    fireEvent.click(screen.getByText("Delete Food"));

    await waitFor(() => {
      expect(screen.getByText("Failed to delete food")).toBeInTheDocument();
    });
  });

  it("navigates back to foods list when back button is clicked", () => {
    render(<FoodDetailPage initialFood={mockFood} />);

    // Click back button
    fireEvent.click(screen.getByText("Back to Foods"));

    expect(mockPush).toHaveBeenCalledWith("/foods");
  });

  // Test getServerSideProps
  describe("getServerSideProps", () => {
    it("returns initialFood from API", async () => {
      // Import the actual function
      const { getServerSideProps } = require("../../../pages/foods/[id]");

      // Mock API response
      getFoodById.mockResolvedValueOnce({ data: mockFood });

      const context = {
        params: { id: "1" },
      };

      const result = await getServerSideProps(context);

      expect(result).toEqual({
        props: {
          initialFood: mockFood,
        },
      });
    });

    it("returns null initialFood on error", async () => {
      // Import the actual function
      const { getServerSideProps } = require("../../../pages/foods/[id]");

      // Mock API error
      getFoodById.mockRejectedValueOnce(new Error("API error"));

      const context = {
        params: { id: "1" },
      };

      const result = await getServerSideProps(context);

      expect(result).toEqual({
        props: {
          initialFood: null,
        },
      });
    });
  });
});
