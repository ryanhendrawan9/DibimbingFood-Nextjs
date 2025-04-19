import React from "react";
import { render } from "@testing-library/react";
import MyApp from "../../pages/_app";

// Mock Head component
jest.mock("next/head", () => {
  return function MockHead({ children }) {
    return <div data-testid="mock-head">{children}</div>;
  };
});

describe("MyApp component", () => {
  it("renders without crashing", () => {
    const Component = () => <div>Test Component</div>;
    const pageProps = {};

    const { container } = render(
      <MyApp Component={Component} pageProps={pageProps} />
    );

    // Check if the component renders
    expect(container).toBeInTheDocument();
    // Check if our test component is rendered inside MyApp
    expect(container.textContent).toContain("Test Component");
  });

  it("renders Head with correct meta tags", () => {
    const Component = () => <div>Test Component</div>;
    const pageProps = {};

    const { getByTestId } = render(
      <MyApp Component={Component} pageProps={pageProps} />
    );

    const head = getByTestId("mock-head");
    expect(head.textContent).toContain("Dibimbing Food");
    expect(head.textContent).toContain("A food application built with Next.js");
  });
});
