# TodoPro - Advanced Todo Management SPA

![TodoPro](https://img.shields.io/badge/Status-Complete-brightgreen)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4+-blue)

A modern, feature-rich todo management application built with React 18, TypeScript, and Redux Toolkit. This SPA provides comprehensive todo management with advanced features like filtering, sorting, drag-and-drop, dark mode, and full authentication.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [State Management](#-state-management)
- [Architecture Decisions](#-architecture-decisions)
- [Challenges](#-challenges)

## ✨ Features

### 🔐 Authentication

- **User Registration** with validation
- **User Login** with JWT token simulation
- **Token Persistence** across browser sessions
- **Token Expiry Simulation** with automatic logout
- **Protected Routes** with automatic redirect
- **Password Visibility Toggle**

### 📝 Todo Management

- **Full CRUD Operations**: Create, Read, Update, Delete todos
- **Rich Todo Fields**:
  - Title (required)
  - Description (optional)
  - Status: `todo` | `in_progress` | `done`
  - Priority: `low` | `medium` | `high`
  - Tags: Multiple selectable tags
  - Due Date: Calendar picker with validation
- **Drag & Drop**: Reorder todos with visual feedback
- **Bulk Operations**: Select multiple todos for batch actions

### 🔍 Advanced Filtering & Search

- **Real-time Search**: Search across title, description, and tags
- **Status Filtering**: Filter by todo status
- **Priority Filtering**: Filter by priority level
- **Multi-criteria Sorting**: Sort by created date, due date, priority, or title
- **Sort Direction**: Ascending or descending order
- **Combined Filters**: Use multiple filters simultaneously

### 📄 Pagination & Performance

- **Smart Pagination**: 10 items per page with navigation
- **Optimistic Updates**: Instant UI feedback for better UX
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: Graceful error recovery

### 🎨 User Experience

- **Responsive Design**: Mobile-first approach
- **Dark Mode Toggle**: System preference detection + manual toggle
- **Toast Notifications**: Success/error feedback
- **Confirmation Dialogs**: Prevent accidental deletions
- **Empty States**: Helpful messages when no data
- **Accessibility**: Full keyboard navigation and screen reader support

### 🔧 Developer Experience

- **Type Safety**: Full TypeScript coverage
- **Runtime Validation**: Zod schemas for authentication forms and API responses
- **Comprehensive Testing**: Unit and integration tests
- **Mock API**: MSW for realistic development experience
- **Hot Reload**: Instant feedback during development

## 🛠️ Tech Stack

### Core

- **React 18+** - UI framework with concurrent features
- **TypeScript 5+** - Type safety and developer experience
- **Vite** - Fast build tool and development server

### State Management

- **Redux Toolkit** - State management with slices
- **RTK Query** - Data fetching and caching (alternative implementation available)
- **Redux Persist** - State persistence across sessions

### Routing & Forms

- **React Router v7** - Client-side routing with protected routes
- **React Hook Form** - Performant forms with minimal re-renders
- **Zod** - Runtime validation and type inference
- **@hookform/resolvers** - Integration between RHF and Zod

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **Lucide React** - Beautiful, customizable icons
- **@hello-pangea/dnd** - Drag and drop functionality
- **Sonner** - Toast notifications

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** 9+ or **yarn** 1.22+

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd todo-pro
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

### Default Test Credentials

```javascript
// Use these credentials to login:
Email: john.doe@example.com
Password: any password (6+ characters)

// Or register a new account
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── forms/           # Form components (Login, Register, etc.)
│   ├── layout/          # Layout components (Navbar, Layout)
│   └── ui/              # Base UI components (Button, Input, etc.)
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── pages/               # Page components
├── router/              # Routing configuration
├── store/               # Redux store and slices
│   └── slices/         # Redux Toolkit slices
├── tests/               # Test files and utilities
│   ├── mocks/          # MSW mock handlers
│   └── utils/          # MSW utilities
├── types/               # TypeScript type definitions
└── utils/               # Utility functions and schemas
    └── schemas/        # Zod validation schemas
```

## 🌐 API Documentation

### Authentication Endpoints

#### POST `/auth/register`

```typescript
// Request
{
  name: string;
  email: string;
  password: string;
}

// Response
{
  user: {
    id: string;
    name: string;
    email: string;
  }
  token: string;
}
```

#### POST `/auth/login`

```typescript
// Request
{
  email: string;
  password: string;
}

// Response
{
  user: {
    id: string;
    name: string;
    email: string;
  }
  token: string;
}
```

#### GET `/auth/user`

```typescript
// Headers: Authorization: Bearer <token>

// Response
{
  user: {
    id: string;
    name: string;
    email: string;
  }
  token: string;
}
```

### Todo Endpoints

#### GET `/todos`

```typescript
// Query Parameters
{
  page?: number;
  'items-per-page'?: number;
  search?: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Response
{
  items: Todo[];
  total: number;
  page: number;
  itemsPerPage: number;
}
```

#### POST `/todos`

```typescript
// Request
{
  title: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  tags?: string[];
  dueDate?: string; // ISO date string
}

// Response: Todo
```

#### PATCH `/todos/:id`

```typescript
// Request: Partial<Todo>
// Response: Todo
```

#### DELETE `/todos/:id`

```typescript
// Response: { id: string }
```

## 🗂️ State Management

### Redux Store Structure

```typescript
type RootState = {
  auth: {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
  };
  todos: {
    data: {
      items: Todo[];
      totalItems: number;
      totalPages: number;
      page: number;
    };
    isLoading: boolean;
    isPending: boolean;
    error: string | null;
  };
  ui: {
    theme: "light" | "dark" | "system";
  };
};
```

### Key Features

- **Normalized State**: Efficient data structure for todos
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Graceful error recovery
- **Loading States**: Granular loading indicators
- **Persistence**: Auth state persisted across sessions

## 🏗️ Architecture Decisions

### 1. **Redux Toolkit over Context API**

**Decision**: Use Redux Toolkit for state management

**Reasoning**:

- Complex state interactions between auth and todos
- Predictable state updates
- Excellent TypeScript support
- error handling

**Trade-off**: Slightly more boilerplate vs Context API

### 2. **MSW over json-server**

**Decision**: Use Mock Service Worker for API mocking

**Reasoning**:

- Works in both browser and Node.js (tests)
- More realistic network behavior
- Better error simulation
- No separate server process needed
- Excellent developer experience

**Trade-off**: Initial setup complexity vs json-server simplicity

### 3. **React Hook Form + Zod**

**Decision**: Use React Hook Form with Zod validation

**Reasoning**:

- Excellent performance (minimal re-renders)
- Type-safe validation with Zod
- Runtime type checking
- Great developer experience
- Flexible validation strategies

**Trade-off**: Learning curve vs simpler form libraries

### 4. **Tailwind CSS over CSS Modules**

**Decision**: Use Tailwind CSS for styling

**Reasoning**:

- Rapid development
- Consistent design system
- Built-in responsive design
- Excellent dark mode support
- Great developer experience with IntelliSense

**Trade-off**: Bundle size vs CSS Modules modularity

### 5. **Component Architecture**

**Decision**: Feature-based component organization

**Reasoning**:

- Clear separation of concerns
- Reusable UI components
- Easy to test and maintain
- Scalable architecture

## 🎯 Challenges

I am new to working with mock API servers and testing. While I have managed to overcome the challenges of setting up and using a mock API, I have not yet succeeded in implementing testing for this project.

In the future, I will try to implement testing in `test` branch.
