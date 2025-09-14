import { Outlet } from "react-router";
import Navbar from "./Navbar";

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
};

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <Outlet />
      </main>
    </div>
  );
};
