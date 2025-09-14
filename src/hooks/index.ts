import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { setTheme, type Theme } from "@/store/slices/uiSlice";
import type { AppDispatch, RootState } from "@/store/store";

// Use instead of plain `useDispatch`
export const useAppDispatch: () => AppDispatch = useDispatch;

// Use instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const selectTheme = (state: RootState) => state.ui.theme;

export function useTheme() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector(selectTheme);

  const changeTheme = (newTheme: Theme) => {
    dispatch(setTheme(newTheme));
  };

  return { theme, setTheme: changeTheme };
}
