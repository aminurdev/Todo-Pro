export interface UserProfile {
  id: string;
  email: string;
  name: string;
  preferences: {
    theme: "light" | "dark";
  };
  createdAt: string;
  updatedAt: string;
}
