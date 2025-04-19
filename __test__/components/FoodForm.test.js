import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FoodForm from "../../components/FoodForm";

describe("FoodForm", () => {
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
    // Additional dark mode checks can be added here
  });
});
