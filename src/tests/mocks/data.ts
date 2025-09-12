import type { UserProfile } from "../../types/user";

export const mockUsers: UserProfile[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",

    preferences: {
      theme: "dark",
    },
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "john.doe@example.com",
    name: "John Doe",
    preferences: {
      theme: "light",
    },
    createdAt: "2023-02-15T00:00:00Z",
    updatedAt: "2023-02-15T00:00:00Z",
  },
];
