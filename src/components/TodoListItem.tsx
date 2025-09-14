import type { Todo } from "@/types/todo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Flag,
  MoreHorizontal,
  Trash2,
  Edit,
  CheckCircle2,
  Circle,
  PlayCircle,
} from "lucide-react";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TodoListItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Todo["status"]) => void;
}

const priorityColors = {
  low: "bg-blue-50 text-blue-700 border-blue-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  high: "bg-red-50 text-red-700 border-red-200",
};

const statusIcons = {
  todo: Circle,
  in_progress: PlayCircle,
  done: CheckCircle2,
};

const statusColors = {
  todo: "text-gray-500",
  in_progress: "text-orange-500",
  done: "text-green-500",
};

export function TodoListItem({
  todo,
  onEdit,
  onDelete,
  onStatusChange,
}: TodoListItemProps) {
  const StatusIcon = statusIcons[todo.status];

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM dd, yyyy");
  };

  const isDueSoon =
    todo.dueDate &&
    (isToday(new Date(todo.dueDate)) ||
      (isPast(new Date(todo.dueDate)) && todo.status !== "done"));

  return (
    <Card className="group hover:shadow-md transition-all duration-200 bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <button
            onClick={() => {
              const nextStatus =
                todo.status === "todo"
                  ? "in_progress"
                  : todo.status === "in_progress"
                  ? "done"
                  : "todo";
              onStatusChange(todo.id, nextStatus);
            }}
            className={cn(
              "mt-1 hover:scale-110 transition-transform",
              statusColors[todo.status]
            )}
          >
            <StatusIcon className="h-5 w-5" />
          </button>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-semibold text-card-foreground text-balance leading-tight",
                    todo.status === "done" &&
                      "line-through text-muted-foreground"
                  )}
                >
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className="text-sm text-muted-foreground mt-1 text-pretty line-clamp-2">
                    {todo.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 ml-2"
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
                    onClick={() => onDelete(todo.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Badges and Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge
                variant="outline"
                className={priorityColors[todo.priority]}
              >
                <Flag className="h-3 w-3 mr-1" />
                {todo.priority}
              </Badge>

              {todo.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                {todo.dueDate && (
                  <div
                    className={cn(
                      "flex items-center gap-1",
                      isDueSoon && "text-red-600 font-medium"
                    )}
                  >
                    <Calendar className="h-3 w-3" />
                    <span>{formatDueDate(new Date(todo.dueDate))}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    Created {format(new Date(todo.createdAt), "MMM dd")}
                  </span>
                </div>
              </div>

              {/* Avatar for assignee (placeholder) */}
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {todo.title.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
