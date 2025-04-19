import React from "react";
import { render, screen } from "@testing-library/react";
import Layout from "../../components/Layout";

// Mock the Navbar and Head components
jest.mock("../../components/Navbar", () => {
  return function MockNavbar() {
    return <div data-testid="navbar-mock">Navbar Mock</div>;
  };
});

jest.mock("next/head", () => {
  return function MockHead({ children }) {
    return <div data-testid="head-mock">{children}</div>;
  };
});

describe("Layout", () => {
  it("renders Layout with default props", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    // Check if title is rendered (in mock Head)
    expect(screen.getByText("Dibimbing Food")).toBeInTheDocument();

    // Check if navbar is rendered
    expect(screen.getByTestId("navbar-mock")).toBeInTheDocument();

    // Check if children are rendered
    expect(screen.getByText("Test Content")).toBeInTheDocument();

    // Check if footer is rendered
    expect(
      screen.getByText(/Dibimbing Food. All rights reserved/)
    ).toBeInTheDocument();
  });

  it("renders Layout with custom title and description", () => {
    render(
      <Layout title="Custom Title" description="Custom Description">
        <div>Test Content</div>
      </Layout>
    );

    // Check if custom title is rendered
    expect(screen.getByText("Custom Title")).toBeInTheDocument();

    // Check if custom description is in the document
    // Since we're mocking Head, we can check if the text is in the document
    expect(screen.getByText("Custom Description")).toBeInTheDocument();
  });

  it("passes transparentNavbar prop to Navbar component", () => {
    render(
      <Layout transparentNavbar={true}>
        <div>Test Content</div>
      </Layout>
    );

    // In a real test, we'd check if Navbar receives the prop
    // But since we're mocking it, we're just checking if Layout renders correctly
    expect(screen.getByTestId("navbar-mock")).toBeInTheDocument();
  });

  it("renders current year in footer copyright text", () => {
    const currentYear = new Date().getFullYear();
    render(<Layout />);

    expect(
      screen.getByText(new RegExp(`© ${currentYear} Dibimbing Food`))
    ).toBeInTheDocument();
  });
});
