import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import type { RootState } from "../store/store";
import LoginForm from "../components/forms/LoginForm";

export default function Login() {
  const { token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white shadow rounded">
        <LoginForm />
        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
