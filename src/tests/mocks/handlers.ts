import { http, delay, HttpResponse } from "msw";
import type { Todo } from "../../types/todo";
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

  http.post("/auth/logout", async () => {
    await delay(500);
    return HttpResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  }),

  // --- TODOS HANDLERS --- //

  // GET /todos
  http.get("/todos", async () => {
    await delay(1200);
    return HttpResponse.json(todos, { status: 200 });
  }),

  // POST /todos
  http.post("/todos", async ({ request }) => {
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
  http.patch("/todos/:id", async ({ params, request }) => {
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
  http.delete("/todos/:id", async ({ params }) => {
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
