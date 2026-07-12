/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "../products/product-card";

// Mock the cart store
vi.mock("@/store/use-cart-store", () => ({
  useCartStore: vi.fn(() => ({
    addItem: vi.fn(),
  })),
}));

// Mock Next.js Image
vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string; fill?: boolean; className?: string; sizes?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={props.src} alt={props.alt} className={props.className} />
  ),
}));

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("ProductCard", () => {
  const mockProduct = {
    id: "1",
    name: "Sorvete de Morango",
    slug: "sorvete-de-morango",
    description: "Delicioso sorvete de morango artesanal",
    price: 15.99,
    stock: 10,
    available: true,
    featured: false,
    promotion: false,
    categoryId: "cat-1",
    images: [{ id: "img-1", url: "/test-image.jpg", alt: "Sorvete", sortOrder: 0 }],
    category: { id: "cat-1", name: "Sorvete", slug: "sorvete" },
    customizations: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders product name", () => {
    render(<ProductCard product={mockProduct as never} />);
    expect(screen.getByText("Sorvete de Morango")).toBeTruthy();
  });

  it("renders product price", () => {
    render(<ProductCard product={mockProduct as never} />);
    expect(screen.getByText(/15/)).toBeTruthy();
  });

  it("renders category badge", () => {
    render(<ProductCard product={mockProduct as never} />);
    expect(screen.getByText("Sorvete")).toBeTruthy();
  });

  it("links to product detail page", () => {
    render(<ProductCard product={mockProduct as never} />);
    const link = screen.getByText("Sorvete de Morango").closest("a");
    expect(link?.getAttribute("href")).toBe("/catalog/sorvete-de-morango");
  });

  it("shows promotion badge when product is on promotion", () => {
    const promotionProduct = { ...mockProduct, promotion: true };
    render(<ProductCard product={promotionProduct as never} />);
    expect(screen.getByText("Promoção")).toBeTruthy();
  });

  it("shows featured badge when product is featured", () => {
    const featuredProduct = { ...mockProduct, featured: true };
    render(<ProductCard product={featuredProduct as never} />);
    expect(screen.getByText("Destaque")).toBeTruthy();
  });

  it("disables add to cart when product is unavailable", () => {
    const unavailableProduct = { ...mockProduct, available: false };
    render(<ProductCard product={unavailableProduct as never} />);
    const button = screen.getByRole("button");
    expect(button.getAttribute("disabled")).toBe("");
  });

  it("shows low stock warning", () => {
    const lowStockProduct = { ...mockProduct, stock: 3 };
    render(<ProductCard product={lowStockProduct as never} />);
    expect(screen.getByText(/Últimas 3 unidades/)).toBeTruthy();
  });
});
