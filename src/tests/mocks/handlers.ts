import { http, delay, HttpResponse } from "msw";
import type { Todo, TodoPriority, TodoStatus } from "../../types/todo";
import { mockTodos, mockUsers } from "./data";
import type { User } from "../../types/auth";

const todos: Todo[] = [...mockTodos];
const users: User[] = [...mockUsers];

function withAuthorization(request: Request) {
  if (!request.headers.get("Authorization")) {
    throw HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export const handlers = [
  // --- AUTH HANDLERS --- //
  http.get("/auth/user", async ({ request }) => {
    withAuthorization(request);
    await delay(300);

    const mockUser = users[0];

    const mockToken = "mock-jwt-token-" + Date.now();

    return HttpResponse.json(
      { user: mockUser, token: `Bearer ${mockToken}` },
      { status: 200 }
    );
  }),

  http.post("/auth/register", async ({ request }) => {
    const body = await request.clone().json();
    await delay(1000);
    const { name, email, password } = body;

    if (!(name || email || password)) {
      return HttpResponse.json(
        { message: "Missing required fields Name, Email & Password" },
        { status: 401 }
      );
    }
    if (users.find((u) => u.email === body.email)) {
      return HttpResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    const newUser: User = {
      id: "u" + (users.length + 1),
      name,
      email,
    };

    users.push(newUser);

    const mockToken = "mock-jwt-token-" + Date.now();

    return HttpResponse.json(
      { user: newUser, token: mockToken },
      { status: 200 }
    );
  }),

  http.post("/auth/login", async ({ request }) => {
    const body = await request.clone().json();
    await delay(1000);
    const { email, password } = body;

    if (!(email || password)) {
      return HttpResponse.json(
        { message: "Email and password are required" },
        { status: 401 }
      );
    }

    const user = users.find((u) => u.email === email);
    if (!user) {
      return HttpResponse.json(
        {
          message:
            "Invalid credentials - try {email: 'john.doe@example.com', password: '123456'}",
        },
        { status: 401 }
      );
    }

    const mockToken = "mock-jwt-token-" + Date.now();

    return HttpResponse.json(
      { user, token: `Bearer ${mockToken}` },
      { status: 200 }
    );
  }),

  http.post("/auth/logout", async ({ request }) => {
    withAuthorization(request);
    await delay(500);

    return HttpResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  }),

  // --- TODOS HANDLERS --- //

  // GET /todos
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
    const sortBy = url.searchParams.get("sortBy") || "createdAt"; // createdAt | dueDate | priority
    const sortOrder = url.searchParams.get("sortOrder") || "desc"; // asc | desc

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

  // POST /todos
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

  // PATCH /todos/:id
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

  // DELETE /todos/:id
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
