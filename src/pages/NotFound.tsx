import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">
          Page not found
        </h2>
        <p className="text-gray-600 mt-2 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Button asChild>
          {" "}
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
