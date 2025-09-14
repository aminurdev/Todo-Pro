// src/features/todos/todoSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  Todo,
  NewTodo,
  UpdateTodo,
  FetchTodosParams,
} from "../../types/todo";

interface ResData {
  items: Todo[];
  totalItems: number;
  totalPages: number;
  page: number;
}

interface TodosState {
  data: ResData;
  singleTodo: Todo | null;
  isLoading: boolean;
  isPending: boolean;
  isLoadingTodo: boolean;
  error: string | null;
  optimisticUpdates: {
    [todoId: string]: {
      originalTodo: Todo;
      updatedTodo: Todo;
      timestamp: number;
    };
  };
}

const initialState: TodosState = {
  data: {
    items: [],
    totalItems: 0,
    totalPages: 0,
    page: 1,
  },
  singleTodo: null,
  isLoading: false,
  isPending: false,
  isLoadingTodo: false,
  error: null,
  optimisticUpdates: {},
};

// Fetch all todos with filters
export const fetchTodos = createAsyncThunk<
  ResData,
  FetchTodosParams | undefined,
  { rejectValue: string }
>("todos/fetchTodos", async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();

    if (params?.page) query.set("page", String(params.page));
    if (params?.itemsPerPage)
      query.set("items-per-page", String(params.itemsPerPage));
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);
    if (params?.priority) query.set("priority", params.priority);
    if (params?.sortBy) query.set("sortBy", params.sortBy);
    if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

    const response = await fetch(`/todos?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token") ?? "",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      return rejectWithValue(error.message || "Failed to fetch todos");
    }

    const data = await response.json();

    // Transform the server response to match our ResData interface
    return {
      items: data.items || [],
      totalItems: data.total || 0,
      totalPages: Math.ceil((data.total || 0) / (data.itemsPerPage || 10)),
      page: data.page || 1,
    };
  } catch (error) {
    console.log(error);
    return rejectWithValue("Failed to fetch todos");
  }
});

// Fetch todo by id
export const fetchTodoById = createAsyncThunk<
  Todo,
  string,
  { rejectValue: string }
>("todos/fetchTodoById", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/todos/${id}`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token") ?? "",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to fetch todo");
    }

    return data as Todo;
  } catch {
    return rejectWithValue("Failed to fetch todo");
  }
});

// Add new todo
export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (newTodo: NewTodo, { rejectWithValue }) => {
    try {
      const response = await fetch("/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") ?? ("" as string),
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
          Authorization: localStorage.getItem("token") ?? ("" as string),
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
          Authorization: localStorage.getItem("token") ?? ("" as string),
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
    // Optimistic update for drag & drop
    optimisticUpdateTodo: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Todo> }>
    ) => {
      const { id, updates } = action.payload;
      const todoIndex = state.data.items.findIndex((todo) => todo.id === id);

      if (todoIndex !== -1) {
        const originalTodo = state.data.items[todoIndex];
        const updatedTodo = { ...originalTodo, ...updates };

        // Store the original for rollback
        state.optimisticUpdates[id] = {
          originalTodo,
          updatedTodo,
          timestamp: Date.now(),
        };

        // Apply the optimistic update
        state.data.items[todoIndex] = updatedTodo;
      }
    },
    // Rollback optimistic update on failure
    rollbackOptimisticUpdate: (state, action: PayloadAction<string>) => {
      const todoId = action.payload;
      const optimisticUpdate = state.optimisticUpdates[todoId];

      if (optimisticUpdate) {
        const todoIndex = state.data.items.findIndex(
          (todo) => todo.id === todoId
        );
        if (todoIndex !== -1) {
          state.data.items[todoIndex] = optimisticUpdate.originalTodo;
        }
        delete state.optimisticUpdates[todoId];
      }
    },
    // Clear optimistic update on success
    clearOptimisticUpdate: (state, action: PayloadAction<string>) => {
      const todoId = action.payload;
      delete state.optimisticUpdates[todoId];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTodos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchTodos.fulfilled,
        (state, action: PayloadAction<ResData>) => {
          state.isLoading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Add
      .addCase(addTodo.pending, (state) => {
        state.isPending = true;
      })
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.isPending = false;
        state.data.items.unshift(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateTodo.pending, (state) => {
        state.isPending = true;
      })
      .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.isPending = false;
        const index = state.data.items.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.data.items[index] = action.payload;
          // Clear optimistic update on success
          delete state.optimisticUpdates[action.payload.id];
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;

        // Rollback optimistic updates for failed request
        // We need to extract the todo ID from the action meta if available
        const rejectedAction = action as { meta?: { arg?: { id?: string } } };
        if (rejectedAction.meta?.arg?.id) {
          const todoId = rejectedAction.meta.arg.id;
          const optimisticUpdate = state.optimisticUpdates[todoId];
          if (optimisticUpdate) {
            const todoIndex = state.data.items.findIndex(
              (todo) => todo.id === todoId
            );
            if (todoIndex !== -1) {
              state.data.items[todoIndex] = optimisticUpdate.originalTodo;
            }
            delete state.optimisticUpdates[todoId];
          }
        }
      })

      // Delete
      .addCase(deleteTodo.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.isPending = false;
        state.data.items = state.data.items.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTodoById.pending, (state) => {
        state.isLoadingTodo = true;
        state.error = null;
      })
      .addCase(
        fetchTodoById.fulfilled,
        (state, action: PayloadAction<Todo>) => {
          state.isLoadingTodo = false;
          state.singleTodo = action.payload;
        }
      )
      .addCase(fetchTodoById.rejected, (state, action) => {
        state.isLoadingTodo = false;
        state.error = action.payload as string;
        state.singleTodo = null;
      });
  },
});

export const {
  clearTodosError,
  optimisticUpdateTodo,
  rollbackOptimisticUpdate,
  clearOptimisticUpdate,
} = todoSlice.actions;
export default todoSlice.reducer;
