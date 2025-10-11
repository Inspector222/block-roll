import { create } from "zustand";

interface showSidebarProps {
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
}

export const useShowSidebar = create<showSidebarProps>((set) => ({
  showSidebar: false,
  setShowSidebar: (value) => set({ showSidebar: value }),
}));
