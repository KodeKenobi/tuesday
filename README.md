# Tuesday - Ticket Management MVP

A simple, elegant ticket management system built with Next.js, TypeScript, and Prisma.

## 🎯 Features

### Authentication

- User and Client login/signup
- Role-based access control
- JWT token authentication

### User Dashboard

- View all tickets with filtering by status
- Create new tickets
- Update ticket status
- Manage client relationships

### Client Portal

- View assigned tickets
- Mark tickets as complete
- Request revisions
- Simple, focused interface

### Ticket Management

- 5 status workflow: Backlog → In Progress → Client Review → Complete/Revisions
- Minimal ticket fields: Title, Client, Status
- Status transitions with role-based permissions

### Client Management

- Create client records
- Optional invitation system
- Client profile management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd tuesday
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
- **Authentication**: JWT tokens with bcrypt
- **Icons**: Lucide React

### Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── workload/          # User workload view
│   ├── tickets/           # Tickets management
│   ├── clients/           # Client management
│   └── client/            # Client portal
├── components/            # Reusable components
├── contexts/              # React contexts
├── lib/                   # Utility functions
└── middleware.ts          # Authentication middleware
```

## 🎨 Design System

### Color Palette

- **Background**: #121212 (Dark)
- **Surface**: #1E1E1E (Cards/Panels)
- **Primary**: #6366F1 (Indigo)
- **Secondary**: #F472B6 (Pink)
- **Text**: #FFFFFF (Primary), #B3B3B3 (Secondary)

### Status Colors

- **Backlog**: Gray (#6B7280)
- **In Progress**: Blue (#3B82F6)
- **Revisions**: Yellow (#FACC15)
- **Client Review**: Purple (#8B5CF6)
- **Complete**: Green (#22C55E)

## 🔐 Authentication

### User Roles

- **USER**: Agency/Editor with full access
- **CLIENT**: Client with limited access to assigned tickets

### API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/tickets` - List tickets
- `POST /api/tickets` - Create ticket
- `PATCH /api/tickets/:id` - Update ticket status
- `GET /api/clients` - List clients
- `POST /api/clients` - Create client

## 📋 Ticket Workflow

1. **Backlog** - New tickets start here
2. **In Progress** - Work has begun
3. **Client Review** - Ready for client feedback
4. **Complete** - Client approved
5. **Revisions** - Client requested changes

### Status Transitions

- Users can move tickets between any status
- Clients can only mark tickets as Complete or request Revisions
- Automatic filtering based on user role

## 🎯 MVP Goals

This MVP demonstrates:

- ✅ Clean authentication system
- ✅ Role-based permissions
- ✅ Simple ticket workflow
- ✅ Client portal functionality
- ✅ Modern, dark UI design
- ✅ Responsive layout
- ✅ TypeScript implementation
- ✅ Database integration

## 🚧 Development

### Database Schema

The system uses Prisma with SQLite for simplicity:

- **User**: Authentication and role management
- **Client**: Client records and invitation status
- **Ticket**: Core ticket data with relationships

### Key Components

- `AuthContext`: Global authentication state
- `DashboardLayout`: Main navigation and layout
- Status management with role-based permissions
- Responsive design with mobile support

## 📝 Notes

This is a test project designed to evaluate:

- Code structure and organization
- UI/UX implementation
- Basic CRUD operations
- Role-based access control
- State management
- API design

The system intentionally keeps features minimal to focus on core functionality and clean implementation.

🧪 Test the Login
You can now test the login functionality without any React errors:
For User Dashboard:
Email: test@example.com
Password: password123
For Client Dashboard:
Email: client@example.com
Password: password123
