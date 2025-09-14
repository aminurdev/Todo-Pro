// types/todo.ts
export type TodoStatus = "todo" | "in_progress" | "done";
export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  tags: string[];
  dueDate?: string; // keep as string for JSON
  createdAt: string;
  updatedAt: string;
}

export interface FetchTodosParams {
  page?: number;
  itemsPerPage?: number;
  search?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface TodoFilters {
  status?: TodoStatus;
  priority?: TodoPriority;
  search?: string;
  tags?: string[];
}

export type SortBy = "createdAt" | "dueDate" | "priority" | "title";
export type SortOrder = "asc" | "desc";

export interface NewTodo {
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  tags: string[];
  dueDate?: Date;
}

export interface UpdateTodo {
  id: string;
  title?: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  tags?: string[];
  dueDate?: Date;
}
