import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Flag,
  MoreHorizontal,
  Trash2,
  Edit,
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import type { Todo } from "@/types/todo";
import { Link } from "react-router";

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onStatusChange: (id: string, status: Todo["status"]) => void;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
};

const statusColors = {
  todo: "bg-gray-100 text-gray-800 border-gray-200",
  in_progress: "bg-orange-100 text-orange-800 border-orange-200",
  done: "bg-green-100 text-green-800 border-green-200",
};

export function TodoCard({ todo, onEdit, onDelete }: TodoCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow duration-200 bg-card border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground text-balance leading-tight hover:underline cursor-pointer">
              <Link to={`/app/todos/${todo.id}`}>{todo.title}</Link>
            </h3>
            {todo.description && (
              <p className="text-sm text-muted-foreground mt-1 text-pretty">
                {todo.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(todo)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(todo)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className={statusColors[todo.status]}>
            {todo.status.replace("_", " ")}
          </Badge>
          <Badge variant="outline" className={priorityColors[todo.priority]}>
            <Flag className="h-3 w-3 mr-1" />
            {todo.priority}
          </Badge>
        </div>

        {todo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {todo.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {todo.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(todo.dueDate, "MMM dd")}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{format(todo.createdAt, "MMM dd")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
