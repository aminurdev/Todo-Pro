// src/features/todos/todoSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Todo, NewTodo, UpdateTodo } from "../../types/todo";

interface TodosState {
  items: Todo[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  isLoading: false,
  error: null,
};

// Fetch all todos
export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/todos", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }

      return (await response.json()) as Todo[];
    } catch {
      return rejectWithValue("Failed to fetch todos");
    }
  }
);

// Add new todo
export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (newTodo: NewTodo, { rejectWithValue }) => {
    try {
      const response = await fetch("/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }

      return (await response.json()) as Todo;
    } catch {
      return rejectWithValue("Failed to add todo");
    }
  }
);

// Update todo
export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (updatedTodo: UpdateTodo, { rejectWithValue }) => {
    try {
      const response = await fetch(`/todos/${updatedTodo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedTodo),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }

      return (await response.json()) as Todo;
    } catch {
      return rejectWithValue("Failed to update todo");
    }
  }
);

// Delete todo
export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }

      return id; // return deleted id for local state update
    } catch {
      return rejectWithValue("Failed to delete todo");
    }
  }
);

// --- Slice --- //
const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    clearTodosError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTodos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Add
      .addCase(addTodo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.isLoading = false;
        state.items.unshift(action.payload); // add new todo at top
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearTodosError } = todoSlice.actions;
export default todoSlice.reducer;
