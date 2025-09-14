import { HttpResponse } from "msw";

export function withAuthorization(request: Request) {
  if (!request.headers.get("Authorization")) {
    throw HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export function generateMockToken(): string {
  return "mock-jwt-token-" + Date.now();
}
