import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark" | "system";

interface UIState {
  theme: Theme;
}

const STORAGE_KEY = "vite-ui-theme";

const getInitialTheme = (): Theme => {
  if (typeof localStorage === "undefined") return "system";
  return (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
};

const initialState: UIState = {
  theme: getInitialTheme(),
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem(STORAGE_KEY, action.payload);
      applyTheme(action.payload);
    },
  },
});

function applyTheme(theme: Theme) {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

// Run once on init
applyTheme(initialState.theme);

export const { setTheme } = uiSlice.actions;
export default uiSlice.reducer;
