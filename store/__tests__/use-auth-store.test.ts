/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "../use-auth-store";

// Clear the store before each test
beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });
});

describe("useAuthStore", () => {
  it("returns unauthenticated state initially", () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("sets user and marks as authenticated", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser({
        id: "user-1",
        email: "test@test.com",
        name: "Test User",
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe("test@test.com");
  });

  it("clears user on logout", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser({
        id: "user-1",
        email: "test@test.com",
      });
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("sets loading state", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("sets user to null marks as unauthenticated", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser({
        id: "user-1",
        email: "test@test.com",
      });
    });

    act(() => {
      result.current.setUser(null);
    });

    expect(result.current.isAuthenticated).toBe(false);
  });
});
