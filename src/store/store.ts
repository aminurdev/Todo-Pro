import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import todoSlice from "./slices/todoSlice";
import uiSlice from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    todos: todoSlice,
    ui: uiSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
