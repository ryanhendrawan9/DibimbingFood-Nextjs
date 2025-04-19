import React from "react";
import { render, screen } from "@testing-library/react";
import FoodCard from "../../components/FoodCard";

describe("FoodCard", () => {
  const mockFood = {
    id: "1",
    name: "Test Food",
    description: "This is a test food",
    imageUrl: "https://example.com/image.jpg",
    ingredients: ["ingredient1", "ingredient2", "ingredient3", "ingredient4"],
  };

  it("renders food name correctly", () => {
    render(<FoodCard food={mockFood} />);
    expect(screen.getByText("Test Food")).toBeInTheDocument();
  });

  it("renders food description correctly", () => {
    render(<FoodCard food={mockFood} />);
    expect(screen.getByText("This is a test food")).toBeInTheDocument();
  });

  it("renders ingredients correctly", () => {
    render(<FoodCard food={mockFood} />);
    expect(screen.getByText("ingredient1")).toBeInTheDocument();
    expect(screen.getByText("ingredient2")).toBeInTheDocument();
    expect(screen.getByText("ingredient3")).toBeInTheDocument();
    expect(screen.getByText("+1 more")).toBeInTheDocument(); // Tests the "more" indicator
  });

  it('displays "No Image" when imageUrl is not provided', () => {
    const foodWithoutImage = { ...mockFood, imageUrl: "" };
    render(<FoodCard food={foodWithoutImage} />);
    expect(screen.getByText("No Image")).toBeInTheDocument();
  });

  it("renders food without ingredients correctly", () => {
    const foodWithoutIngredients = { ...mockFood, ingredients: [] };
    render(<FoodCard food={foodWithoutIngredients} />);
    expect(screen.getByText("Test Food")).toBeInTheDocument();
    expect(screen.getByText("This is a test food")).toBeInTheDocument();
  });

  it('displays "No description available" when description is not provided', () => {
    const foodWithoutDescription = { ...mockFood, description: "" };
    render(<FoodCard food={foodWithoutDescription} />);
    expect(screen.getByText("No description available")).toBeInTheDocument();
  });
});
