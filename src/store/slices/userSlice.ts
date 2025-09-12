import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile } from "../../types/user";

interface UserState {
  profile: UserProfile | null;
  preferences: {
    theme: "light" | "dark";
    language: string;
  };
}

const initialState: UserState = {
  profile: null,
  preferences: {
    theme: "light",
    language: "en",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.preferences.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.preferences.language = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
});

export const {
  setProfile,
  updateProfile,
  setTheme,
  setLanguage,
  clearProfile,
} = userSlice.actions;
export default userSlice.reducer;
