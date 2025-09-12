import { http, delay, HttpResponse } from "msw";

export const handlers = [
  http.post("/auth/register", async ({ request }) => {
    const body = await request.clone().json();
    await delay(1000);

    const mockUser = {
      id: "user-" + Date.now(),
      name: body.name,
      email: body.email,
    };

    const mockToken = "mock-jwt-token-" + Date.now();

    return HttpResponse.json(
      {
        user: mockUser,
        token: mockToken,
      },
      { status: 200 }
    );
  }),

  http.post("/auth/login", async ({ request }) => {
    const body = await request.clone().json();
    await delay(1000);

    const mockUser = {
      id: "user-" + Date.now(),
      name: "John Doe",
      email: body.email,
    };

    const mockToken = "Bearer mock-jwt-token-" + Date.now();

    return HttpResponse.json(
      {
        user: mockUser,
        token: mockToken,
      },
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
];
