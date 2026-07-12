import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/store/use-cart-store";

// Clear the store before each test
beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe("Cart Store", () => {
  const mockItem = {
    productId: "prod-1",
    name: "Sorvete de Morango",
    price: 15.99,
    image: "/test.jpg",
  };

  it("adds item to cart", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe("prod-1");
    expect(items[0].quantity).toBe(1);
  });

  it("increments quantity when adding same item", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);
    addItem(mockItem);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("removes item from cart", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);

    const { removeItem } = useCartStore.getState();
    removeItem("prod-1");

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it("updates item quantity", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);

    const { updateQuantity } = useCartStore.getState();
    updateQuantity("prod-1", 5);

    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(5);
  });

  it("removes item when quantity is 0", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);

    const { updateQuantity } = useCartStore.getState();
    updateQuantity("prod-1", 0);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it("clears cart", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);
    addItem({ ...mockItem, productId: "prod-2" });

    const { clearCart } = useCartStore.getState();
    clearCart();

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it("calculates total", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);
    addItem({ ...mockItem, productId: "prod-2", price: 10 });

    const { getTotal } = useCartStore.getState();
    expect(getTotal()).toBeCloseTo(25.99, 2);
  });

  it("calculates item count", () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);
    addItem(mockItem);
    addItem({ ...mockItem, productId: "prod-2" });

    const { getItemCount } = useCartStore.getState();
    expect(getItemCount()).toBe(3);
  });
});
