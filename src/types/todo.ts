export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  tags?: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type NewTodo = Omit<Todo, "id" | "createdAt" | "updatedAt">;
export type UpdateTodo = Partial<Todo> & { id: string };
