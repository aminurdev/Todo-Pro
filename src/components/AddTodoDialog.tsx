import type React from "react";

import { useState, useEffect } from "react";
import { type Todo, type TodoStatus, type TodoPriority } from "@/types/todo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/hooks";
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
import { CalendarIcon, X, Plus, AlertCircle, Clock, Flag } from "lucide-react";
import { format } from "date-fns";
import { mockTags } from "@/tests/mocks/data";

interface AddTodoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTodo: (todo: Omit<Todo, "id" | "createdAt" | "updatedAt">) => void;
  initialStatus?: TodoStatus;
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

export function AddTodoDialog({
  open,
  onOpenChange,
  onAddTodo,
  initialStatus = "todo",
}: AddTodoDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TodoStatus>(initialStatus);
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [titleError, setTitleError] = useState("");
  
  // Get isPending from Redux store instead of local state
  const isPending = useAppSelector((state) => state.todos.isPending);

  // Focus title input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const titleInput = document.getElementById("title");
        titleInput?.focus();
      }, 100);
    }
  }, [open]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setStatus(initialStatus);
        setPriority("medium");
        setSelectedTags([]);
        setDueDate(undefined);
        setTitleError("");
      }, 200);
    }
  }, [open, initialStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    try {
      await onAddTodo({
        title: trimmedTitle,
        description: description.trim() || undefined,
        status,
        priority,
        tags: selectedTags,
        dueDate: dueDate?.toISOString(),
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearDueDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDueDate(undefined);
  };

  const isOverdue = dueDate && dueDate < new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Plus className="h-5 w-5 text-primary" />
            Add New Todo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Title Field */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium flex items-center gap-1"
            >
              Title
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
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
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
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
                onValueChange={(value) => setStatus(value as TodoStatus)}
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
                onValueChange={(value) => setPriority(value as TodoPriority)}
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
                  className={`w-full justify-start text-left font-normal h-10 transition-all duration-200 ${
                    isOverdue
                      ? "border-red-300 text-red-700 bg-red-50"
                      : "hover:border-primary hover:bg-accent/50"
                  } ${dueDate ? "text-foreground" : "text-muted-foreground"}`}
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
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
            {isOverdue && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                This date is in the past
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Tags ({selectedTags.length} selected)
            </Label>
            <div className="flex flex-wrap gap-2">
              {mockTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <Badge
                    key={tag}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-accent hover:border-accent-foreground/20"
                    }`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    <span className="flex items-center gap-1">
                      {tag}
                      {isSelected && <X className="h-3 w-3" />}
                    </span>
                  </Badge>
                );
              })}
            </div>
            {selectedTags.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Click on selected tags to remove them
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || isPending}
              className="px-6 min-w-[100px]"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Adding...
                </div>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Todo
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
