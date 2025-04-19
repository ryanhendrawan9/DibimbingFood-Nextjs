// __tests__/pages/foods/[id].test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FoodDetailPage from "../../../pages/foods/[id]";
import { getFoodById, updateFood, deleteFood } from "../../../utils/api";

// Mock modules
jest.mock("../../../utils/api", () => ({
  getFoodById: jest.fn(),
  updateFood: jest.fn(),
  deleteFood: jest.fn(),
}));

jest.mock("../../../utils/auth", () => ({
  useAuth: () => ({
    getToken: jest.fn().mockReturnValue("test-token"),
  }),
}));

// Mock router with push method that can be spied on
const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
    query: { id: "1" },
  }),
}));

// Mock window.confirm
window.confirm = jest.fn();

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
  });

  it("renders loading state initially", () => {
    render(<FoodDetailPage />);

    expect(screen.getByText("Loading food details...")).toBeInTheDocument();
  });

  it("fetches and displays food data", async () => {
    getFoodById.mockResolvedValueOnce({ data: mockFood });

    render(<FoodDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Food")).toBeInTheDocument();
    });

    expect(getFoodById).toHaveBeenCalledWith("1");
  });

  it("updates food data", async () => {
    updateFood.mockResolvedValueOnce({
      data: { ...mockFood, name: "Updated Food" },
    });

    render(<FoodDetailPage initialFood={mockFood} />);

    // Submit the form
    fireEvent.click(screen.getByText("Update Food"));

    expect(updateFood).toHaveBeenCalledWith("1", {
      ...mockFood,
      name: "Updated Food",
    });

    await waitFor(() => {
      expect(
        screen.getByText("Food updated successfully!")
      ).toBeInTheDocument();
    });
  });

  it("deletes food and redirects after confirmation", async () => {
    window.confirm.mockReturnValueOnce(true);
    deleteFood.mockResolvedValueOnce({});

    render(<FoodDetailPage initialFood={mockFood} />);

    // Click delete button
    fireEvent.click(screen.getByText("Delete Food"));

    expect(window.confirm).toHaveBeenCalled();
    expect(deleteFood).toHaveBeenCalledWith("1");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/foods");
    });
  });
});
