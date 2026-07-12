import { create } from "zustand";

interface UIStore {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  searchQuery: string;
  setCartOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  searchQuery: "",
  setCartOpen: (isCartOpen) => set({ isCartOpen }),
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
