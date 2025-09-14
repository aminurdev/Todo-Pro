import { Link } from "react-router";
import LoginForm from "../components/forms/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen  flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          <LoginForm />

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
          <a
            href="#"
            className="underline hover:text-foreground transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
