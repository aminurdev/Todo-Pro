import { Link } from "react-router";
import RegisterForm from "../components/forms/RegisterForm";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join us today and get started in minutes
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          <RegisterForm />

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
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
