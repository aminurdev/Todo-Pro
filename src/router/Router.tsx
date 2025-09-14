import { createBrowserRouter } from "react-router";

// Pages
import Todos from "../pages/Todos";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import { AuthLayout, RootLayout } from "@/components/layout";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "@/pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "/app/todos",
        element: (
          <ProtectedRoute>
            <Todos />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
]);

export default router;
