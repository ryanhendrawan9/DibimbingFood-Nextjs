// __tests__/pages/foods/create.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateFoodPage from "../../../pages/foods/create";
import { createFood } from "../../../utils/api";

// Mock modules
jest.mock("../../../utils/api", () => ({
  createFood: jest.fn(),
}));

// Mock getToken with an explicit mock function so we can verify it's called
const mockGetToken = jest.fn();
jest.mock("../../../utils/auth", () => ({
  useAuth: () => ({
    getToken: mockGetToken,
  }),
}));

// Mock router
const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Navbar component
jest.mock("../../../components/Navbar", () => {
  return function MockNavbar() {
    return <div data-testid="mock-navbar">Navbar</div>;
  };
});

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }) => (
      <div className={className} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
    button: ({ children, onClick, className, ...props }) => (
      <button
        onClick={onClick}
        className={className}
        data-testid="motion-button"
        {...props}
      >
        {children}
      </button>
    ),
    main: ({ children, className, ...props }) => (
      <main className={className} data-testid="motion-main" {...props}>
        {children}
      </main>
    ),
    h1: ({ children, className, ...props }) => (
      <h1 className={className} data-testid="motion-h1" {...props}>
        {children}
      </h1>
    ),
  },
}));

// Mock FoodForm with a component that explicitly logs the props
let foodFormProps = {};
jest.mock("../../../components/FoodForm", () => {
  return function MockFoodForm(props) {
    // Save the props for examination
    foodFormProps = props;

    return (
      <div data-testid="mock-food-form">
        <div data-testid="dark-mode-value">
          {props.darkMode ? "true" : "false"}
        </div>
        <button
          onClick={() =>
            props.onSubmit({ name: "New Food", description: "Description" })
          }
          disabled={props.disabled}
          data-testid="submit-button"
        >
          {props.buttonText || "Submit"}
        </button>
      </div>
    );
  };
});

describe("Create Food Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    foodFormProps = {};
    mockGetToken.mockReturnValue("test-token");
  });

  it("renders create food page correctly", () => {
    render(<CreateFoodPage />);

    expect(screen.getByText("Create New Food")).toBeInTheDocument();
    expect(screen.getByTestId("mock-food-form")).toBeInTheDocument();

    // Explicitly check the darkMode prop value
    expect(screen.getByTestId("dark-mode-value").textContent).toBe("true");
    expect(foodFormProps.darkMode).toBe(true);
  });

  it("handles navigation back to foods list", () => {
    render(<CreateFoodPage />);

    fireEvent.click(screen.getByText("Back to Foods"));

    expect(mockPush).toHaveBeenCalledWith("/foods");
  });

  it("submits form data and redirects on success", async () => {
    createFood.mockResolvedValueOnce({ message: "Food created successfully" });

    render(<CreateFoodPage />);

    // Get initial state
    expect(foodFormProps.disabled).toBe(false);

    // Submit the form
    fireEvent.click(screen.getByTestId("submit-button"));

    // Verify the loading state while submitting
    expect(foodFormProps.disabled).toBe(true);
    expect(foodFormProps.buttonText).toBe("Creating...");

    // Explicitly verify token was fetched
    expect(mockGetToken).toHaveBeenCalled();

    // Verify API call
    expect(createFood).toHaveBeenCalledWith({
      name: "New Food",
      description: "Description",
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/foods");
    });

    // After successful submission, button should not be in loading state
    await waitFor(() => {
      expect(foodFormProps.disabled).toBe(false);
    });
  });

  it("shows error message on form submission failure with specific error message", async () => {
    const errorMessage = "API validation failed";
    // Mock with specific error message
    createFood.mockRejectedValueOnce({ message: errorMessage });

    const { rerender } = render(<CreateFoodPage />);

    // Submit the form
    fireEvent.click(screen.getByTestId("submit-button"));

    // Check that setIsSubmitting(true) was called
    expect(foodFormProps.disabled).toBe(true);
    expect(foodFormProps.buttonText).toBe("Creating...");

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Force a rerender to see updated props
    rerender(<CreateFoodPage />);

    // Verify the button is no longer in loading state
    expect(foodFormProps.disabled).toBe(false);
    expect(foodFormProps.buttonText).toBe("Create Food");
  });

  it("shows error message on form submission failure with generic error", async () => {
    // Mock with generic error (no message)
    createFood.mockRejectedValueOnce(new Error());

    const { rerender } = render(<CreateFoodPage />);

    // Submit the form
    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText("Failed to create food")).toBeInTheDocument();
    });

    // Force a rerender to see updated props
    rerender(<CreateFoodPage />);

    // Verify the button is no longer in loading state
    expect(foodFormProps.disabled).toBe(false);
    expect(foodFormProps.buttonText).toBe("Create Food");
  });

  // Direct test to cover try/catch/finally completely
  it("directly tests the handleCreate function with all cases", async () => {
    // We'll extract and call the handleCreate function directly

    // Success case
    createFood.mockResolvedValueOnce({});

    const { container } = render(<CreateFoodPage />);
    const handleCreate = foodFormProps.onSubmit;

    // Call the function directly
    await handleCreate({ name: "Direct Test", description: "Testing" });

    expect(mockGetToken).toHaveBeenCalled();
    expect(createFood).toHaveBeenCalledWith({
      name: "Direct Test",
      description: "Testing",
    });
    expect(mockPush).toHaveBeenCalledWith("/foods");

    // Error case with message
    jest.clearAllMocks();
    createFood.mockRejectedValueOnce({ message: "Custom error" });

    // Call again with error
    await handleCreate({ name: "Error Test", description: "Testing" });

    expect(mockGetToken).toHaveBeenCalled();
    expect(createFood).toHaveBeenCalledWith({
      name: "Error Test",
      description: "Testing",
    });
    expect(screen.getByText("Custom error")).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled(); // Should not redirect on error

    // Error case without message
    jest.clearAllMocks();
    createFood.mockRejectedValueOnce(new Error());

    // Call again with generic error
    await handleCreate({ name: "Generic Error Test", description: "Testing" });

    expect(mockGetToken).toHaveBeenCalled();
    expect(createFood).toHaveBeenCalledWith({
      name: "Generic Error Test",
      description: "Testing",
    });
    expect(screen.getByText("Failed to create food")).toBeInTheDocument();
  });

  // Specific test for line 67 - darkMode prop
  it("explicitly verifies the darkMode prop is passed as true", () => {
    render(<CreateFoodPage />);

    // This explicitly checks line 67
    expect(foodFormProps.darkMode).toBe(true);
  });
});
