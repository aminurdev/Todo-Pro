// 📁 src/mocks/handlers/todo.handlers.ts
import { http, delay, HttpResponse } from "msw";
import { mockTodos } from "../data";
import type { Todo, TodoPriority, TodoStatus } from "@/types/todo";

const todos: Todo[] = [...mockTodos];

function withAuthorization(request: Request) {
  if (!request.headers.get("Authorization")) {
    throw HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export const todoHandlers = [
  http.get("/todos", async ({ request }) => {
    withAuthorization(request);
    await delay(300);

    const url = new URL(request.url);

    // Pagination
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const itemsPerPage = parseInt(
      url.searchParams.get("items-per-page") || "10",
      10
    );

    // Filters
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const status = url.searchParams.get("status") as TodoStatus | null;
    const priority = url.searchParams.get("priority") as TodoPriority | null;

    // Sorting
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    // Start with all todos
    let results = [...todos];

    // Apply search
    if (search) {
      results = results.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          (t.description?.toLowerCase().includes(search) ?? false) ||
          t.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    // Apply status filter
    if (status) {
      results = results.filter((t) => t.status === status);
    }

    // Apply priority filter
    if (priority) {
      results = results.filter((t) => t.priority === priority);
    }

    // Apply sorting
    results.sort((a, b) => {
      let compare = 0;

      if (sortBy === "createdAt") {
        compare =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "dueDate") {
        compare =
          (a.dueDate ? new Date(a.dueDate).getTime() : 0) -
          (b.dueDate ? new Date(b.dueDate).getTime() : 0);
      } else if (sortBy === "priority") {
        const priorityOrder: Record<TodoPriority, number> = {
          low: 1,
          medium: 2,
          high: 3,
        };
        compare = priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      return sortOrder === "asc" ? compare : -compare;
    });

    // Pagination
    const startIndex = (page - 1) * itemsPerPage;
    const paginated = results.slice(startIndex, startIndex + itemsPerPage);

    return HttpResponse.json(
      {
        items: paginated,
        total: results.length,
        page,
        itemsPerPage,
      },
      { status: 200 }
    );
  }),

  http.get<{ id: string }>("/todos/:id", async ({ params, request }) => {
    withAuthorization(request);

    const { id } = params;
    await delay(1200);

    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      return HttpResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return HttpResponse.json(todo, { status: 200 });
  }),

  http.post("/todos", async ({ request }) => {
    withAuthorization(request);

    const body = await request.clone().json();
    await delay(1200);

    const newTodo: Todo = {
      id: String(Date.now()),
      title: body.title,
      description: body.description ?? "",
      status: body.status ?? "todo",
      priority: body.priority ?? "medium",
      tags: body.tags ?? [],
      dueDate: body.dueDate ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos.unshift(newTodo);

    return HttpResponse.json(newTodo, { status: 201 });
  }),

  http.patch<{ id: string }>("/todos/:id", async ({ params, request }) => {
    withAuthorization(request);

    const body = await request.clone().json();
    const { id } = params;
    await delay(1200);

    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return HttpResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    todos[index] = {
      ...todos[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(todos[index], { status: 200 });
  }),

  http.delete<{ id: string }>("/todos/:id", async ({ params }) => {
    const { id } = params;
    await delay(1200);
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return HttpResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    todos.splice(index, 1);

    return HttpResponse.json({ id }, { status: 200 });
  }),
];
