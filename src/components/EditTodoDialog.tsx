import type React from "react";

import { useState, useEffect } from "react";
import type { Todo, TodoStatus, TodoPriority } from "@/types/todo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  X,
  Edit3,
  AlertCircle,
  Clock,
  Flag,
  Plus,
  Tag,
  Save,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface EditTodoDialogProps {
  todo: Todo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditTodo: (todo: Todo) => void;
}

const priorityConfig = {
  low: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Flag },
  medium: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Flag,
  },
  high: { color: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle },
};

const statusConfig = {
  todo: { color: "bg-gray-100 text-gray-800", label: "To Do" },
  in_progress: { color: "bg-blue-100 text-blue-800", label: "In Progress" },
  done: { color: "bg-green-100 text-green-800", label: "Done" },
};

export function EditTodoDialog({
  todo,
  open,
  onOpenChange,
  onEditTodo,
}: EditTodoDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TodoStatus>("todo");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Track original values for change detection
  const [originalValues, setOriginalValues] = useState<{
    title: string;
    description: string;
    status: TodoStatus;
    priority: TodoPriority;
    dueDate?: Date;
    tags: string[];
  } | null>(null);

  useEffect(() => {
    if (todo && open) {
      const values = {
        title: todo.title,
        description: todo.description || "",
        status: todo.status,
        priority: todo.priority,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        tags: [...todo.tags],
      };

      setTitle(values.title);
      setDescription(values.description);
      setStatus(values.status);
      setPriority(values.priority);
      setDueDate(values.dueDate);
      setTags(values.tags);
      setOriginalValues(values);
      setNewTag("");
      setTitleError("");
      setHasChanges(false);

      // Focus title input
      setTimeout(() => {
        const titleInput = document.getElementById("edit-title");
        titleInput?.focus();
      }, 100);
    }
  }, [todo, open]);

  // Check for changes
  useEffect(() => {
    if (!originalValues) return;

    const currentDueDate = dueDate?.toISOString() || "";
    const originalDueDate = originalValues.dueDate?.toISOString() || "";

    const changed =
      title !== originalValues.title ||
      description !== originalValues.description ||
      status !== originalValues.status ||
      priority !== originalValues.priority ||
      currentDueDate !== originalDueDate ||
      JSON.stringify(tags.sort()) !==
        JSON.stringify(originalValues.tags.sort());

    setHasChanges(changed);
  }, [title, description, status, priority, dueDate, tags, originalValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("Title is required");
      return;
    }

    if (trimmedTitle.length < 3) {
      setTitleError("Title must be at least 3 characters");
      return;
    }

    setTitleError("");
    setIsLoading(true);

    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedTodo: Todo = {
        ...todo,
        title: trimmedTitle,
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate?.toISOString(),
        tags: [...tags],
        updatedAt: new Date().toISOString(),
      };

      onEditTodo(updatedTodo);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const clearDueDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDueDate(undefined);
  };

  const isOverdue = dueDate && dueDate < new Date();
  const createdDate = todo?.createdAt ? new Date(todo.createdAt) : null;
  const updatedDate = todo?.updatedAt ? new Date(todo.updatedAt) : null;

  if (!todo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Edit3 className="h-5 w-5 text-primary" />
            Edit Todo
            {hasChanges && (
              <Badge variant="secondary" className="text-xs">
                Modified
              </Badge>
            )}
          </DialogTitle>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            {createdDate && (
              <p>
                Created {formatDistanceToNow(createdDate, { addSuffix: true })}
              </p>
            )}
            {updatedDate &&
              updatedDate.getTime() !== createdDate?.getTime() && (
                <p>
                  Last updated{" "}
                  {formatDistanceToNow(updatedDate, { addSuffix: true })}
                </p>
              )}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label
              htmlFor="edit-title"
              className="text-sm font-medium flex items-center gap-1"
            >
              Title
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              placeholder="What needs to be done?"
              className={`transition-all duration-200 ${
                titleError
                  ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                  : "focus:border-primary focus:ring-primary/20"
              }`}
              required
            />
            {titleError && (
              <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {titleError}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              rows={3}
              className="resize-none focus:border-primary focus:ring-primary/20 transition-all duration-200"
            />
          </div>

          {/* Status and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={status}
                onValueChange={(value: TodoStatus) => setStatus(value)}
              >
                <SelectTrigger className="focus:border-primary focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${config.color}`}
                        />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value: TodoPriority) => setPriority(value)}
              >
                <SelectTrigger className="focus:border-primary focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-3 w-3" />
                          <span className="capitalize">{key}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10 transition-all duration-200",
                    isOverdue
                      ? "border-red-300 text-red-700 bg-red-50"
                      : "hover:border-primary hover:bg-accent/50",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? (
                    <div className="flex items-center justify-between w-full">
                      <span>{format(dueDate, "PPP")}</span>
                      {isOverdue && (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  ) : (
                    "Pick a date (optional)"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 border-b flex items-center justify-between">
                  <span className="text-sm font-medium">Select due date</span>
                  {dueDate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearDueDate}
                      className="h-6 px-2"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {isOverdue && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                This date is overdue
              </p>
            )}
          </div>

          {/* Tags Management */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Tags ({tags.length})
            </Label>

            {/* Add Tag Input */}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new tag..."
                className="flex-1 focus:border-primary focus:ring-primary/20"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                disabled={!newTag.trim() || tags.includes(newTag.trim())}
                className="px-4"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Existing Tags */}
            {tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={`${tag}-${index}`}
                      variant="secondary"
                      className="text-xs transition-all duration-200 hover:bg-destructive/10 group"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive transition-colors group-hover:scale-110"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Click the × to remove tags
                </p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !hasChanges || isLoading}
              className="px-6 min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
