import { http, delay, HttpResponse } from "msw";
import { mockUsers } from "../data";
import type { User } from "@/types/auth";

const users: User[] = [...mockUsers];

function withAuthorization(request: Request) {
  if (!request.headers.get("Authorization")) {
    throw HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export const authHandlers = [
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
];
