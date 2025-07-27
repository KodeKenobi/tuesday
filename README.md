# ClickDown - Ticket Management MVP

A simple, elegant ticket management system built with Next.js, TypeScript, and Prisma. This MVP is designed to test basic CRUD capabilities, user role handling, simple status workflows, clean UI design, and developer understanding of permissions and flows.

## 🎯 Core Features (Nothing More)

- ✅ **Dashboard** - View all tickets with filtering
- ✅ **Tickets** - Minimal fields (Title, Client, Status only)
- ✅ **5 Simple Statuses** - Backlog, In Progress, Revisions, Client Review, Complete
- ✅ **Client Portal** - Login and ticket management for clients
- ✅ **User Authentication** - Simple email/password with role-based access

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd ClickDown
```

2. Install dependencies

```bash
npm install
```

3. Set up the database

```bash
npx prisma db push
```

4. Start the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Database**: SQLite with Prisma ORM
- **Authentication**: Cookie-based sessions
- **Icons**: Lucide React

### Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── tickets/       # Ticket management
│   │   └── clients/       # Client management
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── workload/          # User workload view
│   ├── tickets/           # Tickets management
│   ├── clients/           # Client management
│   └── client/            # Client portal
├── components/            # Reusable components
├── contexts/              # React contexts
└── lib/                   # Utility functions
```

## 🎨 Design System

### Color Palette

- **Background**: Dark theme with glass morphism
- **Primary**: Indigo (#6366F1)
- **Secondary**: Purple (#8B5CF6)
- **Status Colors**:
  - **Backlog**: Gray (#6B7280)
  - **In Progress**: Blue (#3B82F6)
  - **Revisions**: Yellow (#FACC15)
  - **Client Review**: Purple (#8B5CF6)
  - **Complete**: Green (#22C55E)

## 🔐 Authentication

### User Roles

- **USER**: Agency/Editor with full access to create and manage tickets
- **CLIENT**: Client with limited access to assigned tickets only

### API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/tickets` - List tickets (filtered by role)
- `POST /api/tickets` - Create ticket
- `PATCH /api/tickets/:id` - Update ticket status
- `GET /api/clients` - List clients
- `POST /api/clients` - Create client

## 📋 Ticket Workflow

### Ticket Fields

- **Title** (required)
- **Client** (optional, must be invited)
- **Status** (defaults to Backlog)

### Status Transitions

1. **Backlog** → **In Progress**
2. **In Progress** → **Client Review**
3. **Client Review** → **Complete** or **Revisions** (set by client)
4. **Revisions** → **In Progress**
5. **In Progress** → **Complete** (if no client assigned)

### Role-Based Permissions

- **Users** can move tickets between any status
- **Clients** can only mark tickets as Complete or request Revisions when in Client Review status
- **Clients** cannot edit or delete tickets

## 🎯 Page Descriptions

### Dashboard (User)

- Shows all tickets in column view (Title, Status, Client)
- Quick "Create Ticket" button
- Filter by status
- No metrics, no notifications

### Workload (User)

- Shows tickets assigned to the current user or created by them
- List view by status
- Filter by status
- No additional widgets

### Tickets (User)

- Grid/list view of all tickets
- Create new tickets
- Update ticket status
- Assign tickets to invited clients

### Clients (User)

- Manage client records (Name, Email)
- Optional invitation system
- Non-invited clients exist for filtering only

### Client Portal

- Login screen for clients
- View only tickets assigned to their company
- Mark tickets as Complete or request Revisions
- Cannot edit or delete tickets

## 🎯 MVP Goals

This MVP demonstrates:

- ✅ Clean authentication system with role-based access
- ✅ Simple ticket workflow with 5 statuses
- ✅ Client portal functionality
- ✅ Modern, dark UI design inspired by ClickUp
- ✅ Responsive layout
- ✅ TypeScript implementation
- ✅ Database integration with Prisma

## 🚧 Development

### Database Schema

The system uses Prisma with SQLite:

- **User**: Authentication and role management
- **Client**: Client records and invitation status
- **Ticket**: Core ticket data with relationships

### Key Components

- **DashboardLayout**: Main layout with sidebar navigation
- **CreateTicketModal**: Modal for creating new tickets
- **TicketDetailModal**: Modal for viewing ticket details
- **KanbanBoard**: Drag-and-drop ticket management
- **AuthContext**: Global authentication state

## 📝 Notes

- This is intentionally a "dirt simple" MVP for testing purposes
- No complex features like descriptions, comments, attachments, or activity logs
- Focus is on clean code structure and basic CRUD operations
- UI design follows modern dark theme patterns
- All authentication is cookie-based for simplicity

## 🎯 Acceptance Criteria

- ✅ Clean login system with User and Client roles
- ✅ User dashboard showing tickets
- ✅ Ability to create tickets with just title, client, and status
- ✅ Ability to create clients
- ✅ Client dashboard to see their tickets
- ✅ Clients can mark tickets Complete or Needs Revisions
- ✅ 5 statuses with basic transitions
- ✅ No metrics, no notifications
