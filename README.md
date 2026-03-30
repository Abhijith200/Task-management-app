# Todo - Modern Task Management Dashboard

A premium, feature-rich Task Management application built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, and **shadcn/ui**. This application features a professional dark-mode enabled dashboard, real-time task CRUD operations, and a fully responsive layout.

![Dashboard Preview](file:///Users/abhijith/.gemini/antigravity/brain/05f87ffd-51b4-41b1-9b94-0aff480e3e4e/dashboard_screenshot.png)

## 🚀 Key Features

- **Mock Authentication**: Secure login flow with persistent sessions via `localStorage`.
- **Comprehensive Task CRUD**: Create, Edit, Delete, and Update task statuses.
- **Advanced Filtering & Sorting**: Filter by Status/Priority and sort by Due Date or Title.
- **Pagination**: Optimized data handling with 8 items per page.
- **Premium UI/UX**:
  - **Collapsible Sidebar**: Maximize screen space on desktop.
  - **Mobile Drawer**: Fully responsive slide-out menu.
  - **Profile Editing**: Direct profile customization from the dashboard.
  - **Dark Mode**: System-aware theme switching.
- **Robust State Management**: Custom hooks for clean, reusable task logic.

## 🛠 Setup Steps

### 1. Prerequisites
- Node.js 18.x or later
- npm or yarn

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd simple-todo
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Mock Credentials
Use any password to log in:
- **Email**: `user@example.com`
- **Password**: `password` (any string works)

## 🏗 Folder Structure

```text
simple-todo/
├── src/
│   ├── app/                # Next.js App Router (Layouts, Pages, Styles)
│   │   ├── dashboard/      # Protected Dashboard & Task views
│   │   ├── login/          # Authentication page
│   │   └── globals.css     # Tailwind CSS v4 & shadcn theme
│   ├── components/
│   │   ├── auth/           # Login & Profile Modal components
│   │   ├── tasks/          # Task Table & CRUD Modal
│   │   └── ui/             # shadcn/ui shared components
│   ├── context/            # AuthContext for session management
│   ├── hooks/              # useTasks for stateful CRUD logic
│   ├── types/              # TypeScript interfaces (Task, User, etc.)
│   └── lib/                # Utility functions (cn, etc.)
├── public/                 # Static assets (logos, icons)
├── src/hooks/__tests__/    # Vitest unit tests
└── vitest.config.ts        # Testing configuration
```

## 🎨 Design Decisions

- **Tailwind CSS v4**: Utilized the latest Tailwind architecture for a streamlined, configuration-less theme system using `@theme` in CSS.
- **shadcn/ui**: Leveraged high-quality, accessible components for a consistent design language.
- **Glassmorphism**: Applied subtle backdrop-blurs and thin borders (`ring-1`) for a modern, layered appearance.
- **Protection Layer**: Implemented a `ProtectedRoute` component that handles all auth logic in one place, ensuring a secure-by-default dashboard experience.
- **Local Persistence**: Chose `localStorage` for the mock environment to ensure user data survives page refreshes without needing a backend.

## 🧪 Testing

The project includes unit tests for core hooks using Vitest:
```bash
npm test
```
