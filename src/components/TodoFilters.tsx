import {
  type TodoFilters as Filters,
  type TodoPriority,
  type TodoStatus,
  type SortBy,
  type SortOrder,
} from "@/types/todo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search, X, Filter, SortAsc, SortDesc } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface TodoFiltersProps {
  filters: Filters;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onFiltersChange: (filters: Filters) => void;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

export function TodoFilters({
  filters,
  sortBy,
  sortOrder,
  onFiltersChange,
  onSortChange,
  onClearFilters,
  isLoading = false,
}: TodoFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value !== undefined &&
      value !== "" &&
      (Array.isArray(value) ? value.length > 0 : true)
  );

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-card-foreground">Filters & Search</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-1" />
            {isLoading ? "Loading..." : "Clear"}
          </Button>
        )}
      </div>

      <div className="flex gap-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search todos..."
            value={filters.search || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        {/* Status and Priority Filters */}
        <Select
          value={filters.status || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value === "all" ? undefined : (value as TodoStatus),
            })
          }
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.priority || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              priority: value === "all" ? undefined : (value as TodoPriority),
            })
          }
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as SortBy, sortOrder)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc")
            }
            className="px-3"
            disabled={isLoading}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>{" "}
      </div>
    </div>
  );
}
