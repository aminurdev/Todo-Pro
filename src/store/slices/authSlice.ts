import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
} from "../../types/auth";

// --- State ---
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  userLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  userLoading: false,
  error: null,
};

// --- Thunks ---
// Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message || "Registration failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      return data; // { user, token }
    } catch {
      return rejectWithValue("Server error");
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      return data; // { user, token }
    } catch {
      return rejectWithValue("Server error");
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await fetch("/auth/logout", { method: "POST" });
  localStorage.removeItem("token");
  return null;
});

// Get current user
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found");

      const res = await fetch("/auth/user", {
        headers: { Authorization: token },
      });

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message || "Failed to fetch user");
      }

      const data = await res.json();
      return data; // { user, token }
    } catch {
      return rejectWithValue("Server error");
    }
  }
);

// --- Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoading = false;
      })

      // Get User
      .addCase(getUser.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(getUser.rejected, (state) => {
        state.userLoading = false;
      });
  },
});

// --- Exports ---
export const { clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
