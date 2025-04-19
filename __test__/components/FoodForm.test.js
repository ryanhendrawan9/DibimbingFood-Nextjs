import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FoodForm from "../../components/FoodForm";

// Mock framer-motion to simplify testing
jest.mock("framer-motion", () => ({
  motion: {
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe("FoodForm Component", () => {
  const mockInitialData = {
    name: "Test Food",
    description: "Test Description",
    imageUrl: "https://example.com/image.jpg",
    ingredients: ["item1", "item2"],
  };

  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with initial data correctly", () => {
    render(<FoodForm initialData={mockInitialData} onSubmit={mockOnSubmit} />);

    expect(screen.getByDisplayValue("Test Food")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Description")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("https://example.com/image.jpg")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("item1, item2")).toBeInTheDocument();
  });

  it("renders with empty form when no initial data is provided", () => {
    render(<FoodForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/Food Name/i)).toHaveValue("");
    expect(screen.getByLabelText(/Description/i)).toHaveValue("");
    expect(screen.getByLabelText(/Image URL/i)).toHaveValue("");
    expect(screen.getByLabelText(/Ingredients/i)).toHaveValue("");
  });

  it("calls onSubmit with correct data when form is submitted", async () => {
    render(<FoodForm initialData={mockInitialData} onSubmit={mockOnSubmit} />);

    // Edit form fields
    const nameInput = screen.getByLabelText(/Food Name/i);
    userEvent.clear(nameInput);
    userEvent.type(nameInput, "Updated Food Name");

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        ...mockInitialData,
        name: "Updated Food Name",
        ingredients: ["item1", "item2"], // Ingredients are processed from the string
      });
    });
  });

  it("processes ingredients with empty spaces and commas correctly", async () => {
    render(<FoodForm initialData={mockInitialData} onSubmit={mockOnSubmit} />);

    // Edit ingredients field with various comma formats and spaces
    const ingredientsInput = screen.getByLabelText(/Ingredients/i);
    userEvent.clear(ingredientsInput);
    userEvent.type(
      ingredientsInput,
      " garlic, , onion,tomato , potato,,carrot "
    );

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          ingredients: ["garlic", "onion", "tomato", "potato", "carrot"],
        })
      );
    });
  });

  it("shows loading state during submission", async () => {
    render(
      <FoodForm
        initialData={mockInitialData}
        onSubmit={() => new Promise((resolve) => setTimeout(resolve, 100))}
        buttonText="Submit"
      />
    );

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    // Check loading state
    await waitFor(() => {
      expect(screen.getByText("Processing...")).toBeInTheDocument();
    });
  });

  it("shows error message when onSubmit throws an error", async () => {
    const mockError = new Error("Submission failed");
    const failingSubmit = jest.fn().mockRejectedValue(mockError);

    render(<FoodForm initialData={mockInitialData} onSubmit={failingSubmit} />);

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /Submit/i });
    fireEvent.click(submitButton);

    // Check error message
    await waitFor(() => {
      expect(screen.getByText("Submission failed")).toBeInTheDocument();
    });
  });

  it("applies dark mode styles when darkMode prop is true", () => {
    render(
      <FoodForm
        initialData={mockInitialData}
        onSubmit={mockOnSubmit}
        darkMode={true}
      />
    );

    // Check if dark mode class is applied to the form
    const form = screen.getByRole("form");
    expect(form).toHaveClass("space-y-6");

    // Check for dark mode specific class
    const formInputs = screen.getAllByRole("textbox");
    formInputs.forEach((input) => {
      expect(input).toHaveClass("bg-gray-800/70");
    });
  });

  it("handles user input changes correctly", () => {
    render(<FoodForm onSubmit={mockOnSubmit} />);

    // Test each input field
    const nameInput = screen.getByLabelText(/Food Name/i);
    userEvent.type(nameInput, "New Food");
    expect(nameInput).toHaveValue("New Food");

    const descriptionInput = screen.getByLabelText(/Description/i);
    userEvent.type(descriptionInput, "New Description");
    expect(descriptionInput).toHaveValue("New Description");

    const imageInput = screen.getByLabelText(/Image URL/i);
    userEvent.type(imageInput, "https://example.com/new.jpg");
    expect(imageInput).toHaveValue("https://example.com/new.jpg");

    const ingredientsInput = screen.getByLabelText(/Ingredients/i);
    userEvent.type(ingredientsInput, "apple,banana");
    expect(ingredientsInput).toHaveValue("apple,banana");
  });

  it("displays custom button text when provided", () => {
    render(
      <FoodForm
        initialData={mockInitialData}
        onSubmit={mockOnSubmit}
        buttonText="Custom Button Text"
      />
    );

    expect(
      screen.getByRole("button", { name: "Custom Button Text" })
    ).toBeInTheDocument();
  });

  it("disables form when disabled prop is true", () => {
    render(
      <FoodForm
        initialData={mockInitialData}
        onSubmit={mockOnSubmit}
        disabled={true}
      />
    );

    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });

    const submitButton = screen.getByRole("button");
    expect(submitButton).toBeDisabled();
  });
});
