import type { Todo, TodoStatus } from "@/types/todo";
import { TodoCard } from "./TodoCard";
import { TodoCardSkeleton } from "./TodoCardSkeleton";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TodoColumnProps {
  status: TodoStatus;
  todos: Todo[];
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
  onAddTodo: (status: TodoStatus) => void;
  isPending?: boolean;
  isLoading?: boolean;
}

const statusConfig = {
  todo: {
    title: "To Do",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    bgColor: "bg-gray-50",
  },
  in_progress: {
    title: "In Progress",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    bgColor: "bg-orange-50",
  },
  done: {
    title: "Done",
    color: "bg-green-100 text-green-800 border-green-200",
    bgColor: "bg-green-50",
  },
};

export function TodoColumn({
  status,
  todos,
  onEdit,
  onDelete,
  onStatusChange,
  onAddTodo,
  isPending = false,
  isLoading = false,
}: TodoColumnProps) {
  const config = statusConfig[status];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-card border">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-card-foreground">{config.title}</h2>
          <Badge variant="outline" className={config.color}>
            {todos.length}
          </Badge>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onAddTodo(status)}
          className="h-8 w-8 p-0"
          disabled={isPending || isLoading}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Droppable droppableId={status} type="TASK">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-3 p-2 rounded-lg transition-all duration-200 ${
              snapshot.isDraggingOver
                ? `${config.bgColor} border-2 border-dashed border-primary/30`
                : "border-2 border-transparent"
            } min-h-[200px]`}
          >
            {isLoading ? (
              // Show skeleton loading during data fetch
              Array.from({ length: 3 }, (_, index) => (
                <TodoCardSkeleton key={`skeleton-${status}-${index}`} />
              ))
            ) : (
              todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-all duration-200 ${
                        snapshot.isDragging
                          ? "rotate-1 scale-105 shadow-lg z-50 opacity-90"
                          : "hover:shadow-md"
                      } ${isPending ? "opacity-50 pointer-events-none" : ""}`}
                      style={{
                        ...provided.draggableProps.style,
                        ...(snapshot.isDragging && { pointerEvents: "none" }),
                      }}
                    >
                      <TodoCard
                        todo={todo}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onStatusChange={onStatusChange}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}

            {!isLoading && todos.length === 0 && (
              <div
                className={`flex flex-col items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed rounded-lg transition-all duration-200 ${
                  snapshot.isDraggingOver
                    ? "border-primary/50 bg-primary/5 text-primary"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className="text-center">
                  <div className="font-medium">
                    {snapshot.isDraggingOver ? "Drop here" : "No todos yet"}
                  </div>
                  <div className="text-xs mt-1 opacity-70">
                    {snapshot.isDraggingOver
                      ? "Release to move"
                      : "Drag todos here or click + to add"}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
