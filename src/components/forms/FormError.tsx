import { TriangleAlert } from "lucide-react";

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;
  return (
    <div className="bg-destructive/15 px-4 py-2 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <TriangleAlert className="h-6 w-6" />
      <p className="text-sm">{message}</p>
    </div>
  );
};
