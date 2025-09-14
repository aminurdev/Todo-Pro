import { useState, useEffect, useCallback, useMemo } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import type {
  Todo,
  TodoFilters,
  TodoStatus,
  SortBy,
  SortOrder,
  NewTodo,
  FetchTodosParams,
} from "@/types/todo";
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  clearTodosError,
} from "@/store/slices/todoSlice";
import { TodoColumn } from "@/components/TodoColumn";
import { TodoFilters as TodoFiltersComponent } from "@/components/TodoFilters";
import { AddTodoDialog } from "@/components/AddTodoDialog";
import { EditTodoDialog } from "@/components/EditTodoDialog";
import { TodoListItem } from "@/components/TodoListItem";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List } from "lucide-react";
import { SimplePagination } from "@/components/SimplePagination";
import { useAppDispatch, useAppSelector } from "@/hooks";

export default function TodoApp() {
  const dispatch = useAppDispatch();
  const { data, isLoading, isPending, error } = useAppSelector(
    (state) => state.todos
  );

  const { items: todos, page, totalItems, totalPages } = data;

  // Server-side parameters
  const [params, setParams] = useState<FetchTodosParams>({
    page,
    itemsPerPage: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // UI state
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addDialogStatus, setAddDialogStatus] = useState<TodoStatus>("todo");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Fetch todos when params change
  const fetchTodosWithParams = useCallback(() => {
    dispatch(fetchTodos(params));
  }, [dispatch, params]);

  useEffect(() => {
    fetchTodosWithParams();
  }, [fetchTodosWithParams]);

  useEffect(() => {
    return () => {
      dispatch(clearTodosError());
    };
  }, [dispatch]);

  // Group todos by status (server already provides filtered/sorted data)
  const todosByStatus = useMemo(() => {
    const grouped = {
      todo: [] as Todo[],
      in_progress: [] as Todo[],
      done: [] as Todo[],
    };

    // Defensive programming - ensure todos is an array
    if (todos.length > 0) {
      todos.forEach((todo) => {
        if (todo && todo.status && grouped[todo.status]) {
          grouped[todo.status].push(todo);
        }
      });
    }

    return grouped;
  }, [todos]);

  // Server-side parameter handlers
  const handleFiltersChange = useCallback((filters: TodoFilters) => {
    setParams((prev) => ({
      ...prev,
      page: 1, // Reset to first page
      search: filters.search,
      status: filters.status,
      priority: filters.priority,
    }));
  }, []);

  const handleSortChange = useCallback(
    (sortBy: SortBy, sortOrder: SortOrder) => {
      setParams((prev) => ({
        ...prev,
        page: 1, // Reset to first page
        sortBy,
        sortOrder,
      }));
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setParams({
      page: 1,
      itemsPerPage: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { destination, source, draggableId } = result;

      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const newStatus = destination.droppableId as TodoStatus;

      // Update todo status
      await dispatch(updateTodo({ id: draggableId, status: newStatus }));
      // Refresh data to get updated todos from server
      fetchTodosWithParams();
    },
    [dispatch, fetchTodosWithParams]
  );

  const handleAddTodo = useCallback(
    async (todoData: Omit<Todo, "id" | "createdAt" | "updatedAt">) => {
      const newTodo: NewTodo = {
        title: todoData.title,
        description: todoData.description,
        status: todoData.status,
        priority: todoData.priority,
        tags: todoData.tags,
        dueDate: todoData.dueDate ? new Date(todoData.dueDate) : undefined,
      };

      await dispatch(addTodo(newTodo));
      // Refresh data to get updated todos from server
      fetchTodosWithParams();
    },
    [dispatch, fetchTodosWithParams]
  );

  const handleEditTodo = useCallback((todo: Todo) => {
    setEditingTodo(todo);
    setShowEditDialog(true);
  }, []);

  const handleUpdateTodo = useCallback(
    async (updatedTodo: Todo) => {
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
      );
      // Refresh data to get updated todos from server
      fetchTodosWithParams();
    },
    [dispatch, fetchTodosWithParams]
  );

  const handleDeleteTodo = useCallback(
    async (id: string) => {
      await dispatch(deleteTodo(id));
      // Refresh data to get updated todos from server
      fetchTodosWithParams();
    },
    [dispatch, fetchTodosWithParams]
  );

  const handleStatusChange = useCallback(
    async (id: string, status: TodoStatus) => {
      await dispatch(updateTodo({ id, status }));
      // Refresh data to get updated todos from server
      fetchTodosWithParams();
    },
    [dispatch, fetchTodosWithParams]
  );

  const handleAddTodoToColumn = useCallback((status: TodoStatus) => {
    setAddDialogStatus(status);
    setShowAddDialog(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">
              Todo Pro
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your tasks efficiently with drag & drop
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "kanban" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("kanban")}
                className="px-3"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={() => setShowAddDialog(true)} disabled={isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Add Todo
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <TodoFiltersComponent
            filters={{
              search: params.search,
              status: params.status,
              priority: params.priority,
            }}
            sortBy={params.sortBy || "createdAt"}
            sortOrder={params.sortOrder || "desc"}
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
          />
        </div>
        {/* Status summary */}
        <div className="mb-4 p-3 bg-muted/30 rounded-lg border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-4">
              <span>To Do: {todosByStatus.todo.length} items</span>
              <span>In Progress: {todosByStatus.in_progress.length} items</span>
              <span>Done: {todosByStatus.done.length} items</span>
            </div>
            <div className="text-xs">Total: {todos.length ?? 0} todos</div>
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading todos...</div>
          </div>
        ) : viewMode === "kanban" ? (
          <div>
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TodoColumn
                  status="todo"
                  todos={todosByStatus.todo}
                  onEdit={handleEditTodo}
                  onDelete={handleDeleteTodo}
                  onStatusChange={handleStatusChange}
                  onAddTodo={handleAddTodoToColumn}
                />

                <TodoColumn
                  status="in_progress"
                  todos={todosByStatus.in_progress}
                  onEdit={handleEditTodo}
                  onDelete={handleDeleteTodo}
                  onStatusChange={handleStatusChange}
                  onAddTodo={handleAddTodoToColumn}
                />

                <TodoColumn
                  status="done"
                  todos={todosByStatus.done}
                  onEdit={handleEditTodo}
                  onDelete={handleDeleteTodo}
                  onStatusChange={handleStatusChange}
                  onAddTodo={handleAddTodoToColumn}
                />
              </div>
            </DragDropContext>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {todos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground text-lg mb-2">
                    No todos found
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {params.search || params.status || params.priority
                      ? "Try adjusting your filters or search terms"
                      : "Create your first todo to get started"}
                  </p>
                </div>
              ) : (
                todos.map((todo) => (
                  <TodoListItem
                    key={todo.id}
                    todo={todo}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>

            <SimplePagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        <AddTodoDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onAddTodo={handleAddTodo}
          initialStatus={addDialogStatus}
        />

        <EditTodoDialog
          todo={editingTodo}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onEditTodo={handleUpdateTodo}
        />
      </div>
    </div>
  );
}
