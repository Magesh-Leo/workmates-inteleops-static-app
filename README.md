# Overview

Workmates IntelliOps is a professional L1 ticket automation platform designed to streamline Level 1 support operations. The application provides centralized management of support tickets across multiple platforms (Jira, ServiceNow, Zoho) with automated routing, escalation, and resolution capabilities. Built as a full-stack web application, it features a React frontend with professional Workmates branding (blue and orange color scheme) and an Express.js backend with PostgreSQL database integration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite build system
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with Workmates IntelliOps branding (blue and orange color scheme)
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Design System**: Component-based architecture with reusable UI components

The frontend follows a modular structure with separate pages for different functional areas (dashboard, tickets, automation, integrations, platforms, accounts, users). The UI uses an enterprise-friendly design with a sidebar navigation and consistent color scheme. The dashboard includes comprehensive business provisions covering SLA tracking, compliance management, financial insights, risk assessment, client portfolio management, sharing/export capabilities, and detailed service capability showcases including server management, AWS cloud services, network operations, DevOps automation, and security compliance tasks that IntelliOps can resolve automatically or with minimal human intervention.

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API endpoints following resource-based patterns
- **Middleware**: Custom logging middleware for API request tracking
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Storage Layer**: Abstracted storage interface for database operations
- **Development Setup**: Vite integration for hot module replacement in development

The backend implements a clean separation of concerns with routes, storage abstraction, and proper error handling. The storage interface provides a contract for database operations across different entity types.

## Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Design**: Relational model with proper foreign key relationships
- **Migration Management**: Drizzle Kit for schema migrations
- **Connection**: Neon Database serverless PostgreSQL integration
- **Validation**: Zod schemas for runtime type validation

The database schema includes tables for users, platforms, integrations, tickets, automation rules, and managed accounts with proper relationships and constraints.

## Authentication & Authorization
- **User Management**: Role-based access control (admin, agent, client)
- **Session Handling**: Express session management with PostgreSQL session store
- **Security**: Password hashing and secure session configuration

## UI/UX Design Patterns
- **Layout**: Fixed sidebar with main content area
- **Navigation**: Hierarchical menu structure with clear sections
- **Responsive Design**: Mobile-friendly components with proper breakpoints
- **Loading States**: Skeleton components and loading indicators
- **Forms**: React Hook Form with Zod validation
- **Modals**: Dialog-based workflows for data entry

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database access layer
- **Drizzle Kit**: Database migration and introspection tools

## Frontend Libraries
- **Radix UI**: Headless UI component primitives for accessibility
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing
- **React Hook Form**: Form handling with validation
- **Zod**: Runtime type validation and schema definition
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with Autoprefixer

## Platform Integrations
- **Jira**: Issue tracking platform integration
- **ServiceNow**: IT service management platform
- **Zoho**: Business application suite
- **Generic API**: Flexible integration framework for additional platforms

The application is designed to integrate with multiple ticketing platforms through a unified API interface, allowing for consistent automation and management across different vendor solutions.
