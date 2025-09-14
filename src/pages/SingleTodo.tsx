// src/pages/SingleTodo.tsx
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchTodoById, updateTodo } from "@/store/slices/todoSlice";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { EditTodoDialog } from "@/components/EditTodoDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit3,
  Calendar,
  Clock,
  Flag,
  AlertCircle,
  Tag,
  RefreshCw,
  CheckCircle2,
  Circle,
  PlayCircle,
} from "lucide-react";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import type { Todo } from "@/types/todo";
import { cn } from "@/lib/utils";

const priorityConfig = {
  low: {
    color:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    icon: Flag,
    label: "Low Priority",
  },
  medium: {
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
    icon: Flag,
    label: "Medium Priority",
  },
  high: {
    color:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    icon: AlertCircle,
    label: "High Priority",
  },
};

const statusConfig = {
  todo: {
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    icon: Circle,
    label: "To Do",
  },
  in_progress: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    icon: PlayCircle,
    label: "In Progress",
  },
  done: {
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    icon: CheckCircle2,
    label: "Done",
  },
};

// Loading skeleton component
const TodoSkeleton = () => (
  <div className="max-w-4xl mx-auto p-4 sm:p-6">
    <div className="mb-6">
      <Skeleton className="h-8 w-20 mb-4" />
    </div>
    <Card>
      <CardHeader className="pb-4">
        <Skeleton className="h-8 w-3/4 mb-2" />
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-full" />
      </CardContent>
    </Card>
  </div>
);

export const SingleTodo = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { singleTodo, isLoadingTodo, error, isPending } = useAppSelector(
    (state) => state.todos
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchTodoById(id));
    }
  }, [dispatch, id]);

  const handleEditTodo = async (updatedTodo: Todo) => {
    try {
      await dispatch(
        updateTodo({
          id: updatedTodo.id,
          title: updatedTodo.title,
          description: updatedTodo.description,
          status: updatedTodo.status,
          priority: updatedTodo.priority,
          tags: updatedTodo.tags,
          dueDate: updatedTodo.dueDate
            ? new Date(updatedTodo.dueDate)
            : undefined,
        })
      ).unwrap();

      // Refresh the single todo to get the latest data
      if (id) {
        dispatch(fetchTodoById(id));
      }
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleRetry = () => {
    if (id) {
      dispatch(fetchTodoById(id));
    }
  };

  if (isLoadingTodo) {
    return <TodoSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <Button variant="ghost" className="mb-6 -ml-2" asChild>
          <Link to="/app/todos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Todos
          </Link>
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Todo</h2>
            <p className="text-muted-foreground text-center mb-4 max-w-md">
              {error}
            </p>
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!singleTodo) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <Button variant="ghost" className="mb-6 -ml-2" asChild>
          <Link to="/app/todos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Todos
          </Link>
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Circle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Todo Not Found</h2>
            <p className="text-muted-foreground text-center mb-4">
              The todo you're looking for doesn't exist or may have been
              deleted.
            </p>

            <Button variant="outline" asChild>
              <Link to="/app/todos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Todos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dueDate = singleTodo.dueDate ? new Date(singleTodo.dueDate) : null;
  const isOverdue = dueDate && isAfter(new Date(), dueDate);
  const createdDate = new Date(singleTodo.createdAt);
  const updatedDate = new Date(singleTodo.updatedAt);
  const PriorityIcon = priorityConfig[singleTodo.priority].icon;
  const StatusIcon = statusConfig[singleTodo.status].icon;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="-ml-2 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link to="/app/todos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Todos
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          {/* Title and Status/Priority Badges */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-3 break-words">
                {singleTodo.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant="secondary"
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1",
                    statusConfig[singleTodo.status].color
                  )}
                >
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig[singleTodo.status].label}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1",
                    priorityConfig[singleTodo.priority].color
                  )}
                >
                  <PriorityIcon className="h-3 w-3" />
                  {priorityConfig[singleTodo.priority].label}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:flex-col">
              <Button
                onClick={() => setIsEditDialogOpen(true)}
                className="flex-1 sm:flex-none"
                disabled={isPending}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          {/* Description */}
          {singleTodo.description && (
            <div className="mt-4">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {singleTodo.description}
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Due Date Section */}
          {dueDate && (
            <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/20">
              <div
                className={cn(
                  "p-2 rounded-full",
                  isOverdue
                    ? "bg-red-100 text-red-600 dark:bg-red-900/20"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/20"
                )}
              >
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Due Date</span>
                  {isOverdue && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                </div>
                <p
                  className={cn(
                    "text-sm",
                    isOverdue
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                  )}
                >
                  {format(dueDate, "PPP")} (
                  {formatDistanceToNow(dueDate, { addSuffix: true })})
                </p>
              </div>
            </div>
          )}

          {/* Tags Section */}
          {singleTodo.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {singleTodo.tags.map((tag, index) => (
                  <Badge
                    key={`${tag}-${index}`}
                    variant="secondary"
                    className="text-xs px-2.5 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Metadata Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900/20">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="font-medium text-foreground">Created</span>
                <p className="text-muted-foreground">
                  {format(createdDate, "PPp")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(createdDate, { addSuffix: true })}
                </p>
              </div>
            </div>

            {updatedDate.getTime() !== createdDate.getTime() && (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    Last Updated
                  </span>
                  <p className="text-muted-foreground">
                    {format(updatedDate, "PPp")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(updatedDate, { addSuffix: true })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditTodoDialog
        todo={singleTodo}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onEditTodo={handleEditTodo}
      />
    </div>
  );
};
