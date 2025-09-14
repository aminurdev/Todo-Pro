import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to <span className="text-primary">Todo Pro</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your tasks, stay productive, and organize your day with ease.
        </p>
        <Button asChild size="lg">
          <Link to="/app/todos">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
