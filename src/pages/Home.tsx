import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Navbar } from "../components/layout";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  addTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
} from "../store/slices/todoSlice";

const Home = () => {
  return (
    <div>
      <Navbar />
      <TodoPage />
    </div>
  );
};

export default Home;

// --- Zod schema for form ---
const todoSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().optional(),
});

type TodoFormValues = z.infer<typeof todoSchema>;

const TodoPage = () => {
  const dispatch = useAppDispatch();
  const {
    items: todos,
    isLoading,
    error,
  } = useAppSelector((state) => state.todo);

  const [editingId, setEditingId] = useState<string | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      status: "todo",
      priority: "medium",
    },
  });

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  // Handle form submit
  const onSubmit = (data: TodoFormValues) => {
    if (editingId) {
      dispatch(updateTodo({ id: editingId, ...data }));
      setEditingId(null);
    } else {
      dispatch(addTodo(data));
    }
    reset();
  };

  // Edit existing todo
  const handleEdit = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      reset({
        title: todo.title,
        description: todo.description,
        status: todo.status as "todo" | "in_progress" | "done",
        priority: todo.priority as "low" | "medium" | "high",
        dueDate: todo.dueDate ?? "",
      });
      setEditingId(id);
    }
  };

  // Delete todo
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      dispatch(deleteTodo(id));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Todo Management</h1>

      {/* --- Form --- */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border p-4 rounded-lg shadow"
      >
        <input
          type="text"
          placeholder="Title"
          {...register("title")}
          className="w-full p-2 border rounded"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}

        <textarea
          placeholder="Description"
          {...register("description")}
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-4">
          <select {...register("status")} className="p-2 border rounded">
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select {...register("priority")} className="p-2 border rounded">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            {...register("dueDate")}
            className="p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Todo" : "Add Todo"}
        </button>
      </form>

      {/* --- Todos List --- */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Todos</h2>

        {isLoading && <p>Loading todos...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && todos.length === 0 && <p>No todos found.</p>}

        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="border p-3 rounded flex justify-between items-start"
            >
              <div>
                <h3 className="font-medium">
                  {todo.title}{" "}
                  <span className="text-sm text-gray-500">({todo.status})</span>
                </h3>
                {todo.description && (
                  <p className="text-sm text-gray-700">{todo.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  Priority: {todo.priority ?? "medium"}
                  {todo.dueDate && ` | Due: ${todo.dueDate}`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(todo.id)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
