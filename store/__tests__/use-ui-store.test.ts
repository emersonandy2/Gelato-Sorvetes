/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useUIStore } from "../use-ui-store";

// Clear the store before each test
beforeEach(() => {
  useUIStore.setState({
    isCartOpen: false,
    isMobileMenuOpen: false,
    searchQuery: "",
  });
});

describe("useUIStore", () => {
  it("returns default state", () => {
    const { result } = renderHook(() => useUIStore());
    expect(result.current.isCartOpen).toBe(false);
    expect(result.current.isMobileMenuOpen).toBe(false);
    expect(result.current.searchQuery).toBe("");
  });

  it("toggles cart open state", () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.setCartOpen(true);
    });

    expect(result.current.isCartOpen).toBe(true);

    act(() => {
      result.current.setCartOpen(false);
    });

    expect(result.current.isCartOpen).toBe(false);
  });

  it("toggles mobile menu state", () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.setMobileMenuOpen(true);
    });

    expect(result.current.isMobileMenuOpen).toBe(true);

    act(() => {
      result.current.setMobileMenuOpen(false);
    });

    expect(result.current.isMobileMenuOpen).toBe(false);
  });

  it("updates search query", () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.setSearchQuery("sorvete");
    });

    expect(result.current.searchQuery).toBe("sorvete");
  });
});
