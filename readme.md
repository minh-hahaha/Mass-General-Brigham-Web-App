# Mass General Brigham Hospital Web App

A comprehensive healthcare management platform designed to streamline operations across multiple Mass General Brigham hospital locations. This full-stack web application provides intelligent navigation, service request management, employee directory services, and AI-powered assistance for healthcare staff and visitors.

## 📖 Manual

For detailed user instructions and system documentation, please refer to the **[MGB App Manual.pdf](MGB%20App%20Manual.pdf)** file in the root directory.

---

## 🏥 Overview

The Mass General Brigham Hospital Management System is a modern web application that serves multiple hospital locations including:
- **Chestnut Hill Healthcare Center**
- **Foxborough Healthcare Center** 
- **Brigham and Women's Faulkner Hospital**
- **Brigham and Women's Main Hospital**

The system provides an integrated platform for hospital navigation, service request management, employee directory access, and intelligent routing using advanced pathfinding algorithms.

## ✨ Key Features

### 🗺️ Intelligent Hospital Navigation
- **Multi-floor indoor navigation** with real-time pathfinding using multiple algorithms (BFS, DFS, Dijkstra, A*)
- **Interactive 3D hospital maps** with floor-by-floor navigation
- **Google Maps integration** for external location routing
- **Voice-guided directions** with text-to-speech capabilities
- **Parking lot integration** with hospital-specific parking guidance

### 📋 Service Request Management
- **Maintenance requests** for facility management
- **Medical device service requests** for equipment maintenance
- **Patient transport coordination** between hospital locations
- **Translation service requests** for patient communication
- **Sanitation service requests** for facility cleanliness
- **Request tracking and assignment** to appropriate staff members

### 👥 Employee & Directory Management
- **Comprehensive employee directory** with department and building information
- **Department search and filtering** by hospital location
- **Employee role-based access control** with admin privileges
- **CSV import/export functionality** for bulk data management

### 🤖 AI-Powered Assistance
- **Natural language processing** for intelligent request classification
- **Intent recognition** for automatic routing to appropriate services
- **Voice command support** for hands-free operation
- **Smart search functionality** across all hospital services

### 🔐 Security & Authentication
- **Auth0 integration** for secure user authentication
- **Role-based access control** for different user types
- **JWT token management** for secure API communication
- **Admin dashboard** for system management

## 🏗️ Architecture

This application follows a modern **monorepo architecture** with the following structure:

### Frontend (`apps/frontend/`)
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **React Router** for client-side navigation
- **Tailwind CSS** for modern, responsive styling
- **Google Maps API** integration for external navigation
- **Three.js** for 3D hospital visualization
- **React Bootstrap** for UI components

### Backend (`apps/backend/`)
- **Node.js** with Express.js for RESTful API development
- **TypeScript** for type safety and better development experience
- **Prisma ORM** for database operations with PostgreSQL
- **Multiple pathfinding algorithms** (BFS, DFS, Dijkstra, A*) for navigation
- **Google Cloud Text-to-Speech** integration for accessibility
- **Groq AI API** integration for natural language processing
- **JWT authentication** with OAuth2 bearer tokens

### Database (`packages/database/`)
- **PostgreSQL** for robust data storage
- **Prisma schema** defining hospital entities and relationships
- **Complex relational models** for employees, departments, service requests, and navigation nodes

### Shared Packages (`packages/`)
- **Common constants** and shared types
- **Database client** for consistent data access
- **Shared utilities** across frontend and backend

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **Git** for version control
- **Yarn** package manager (v4.7.0)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/minh-hahaha/Mass-General-Brigham-Web-App.git
   cd Mass-General-Brigham-Web-App
   ```

2. **Install dependencies**
  - Corepack should come installed with npm. If corepack is missing, run `npm 
    install --g corepack` to install corepack.
   ```bash
   corepack enable
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   yarn setup
   ```
   This creates the necessary `.env` files for local, WPI, and production environments.

4. **Configure PostgreSQL**
   - Ensure PostgreSQL is running locally
   - Default credentials: `postgres` / `postgres` / `postgres`
   - Update credentials in `.env` files as needed

5. **Initialize the database**
   ```bash
   yarn workspace database push
   ```

6. **Start the development server**
   ```bash
   yarn dev
   ```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 🛠️ Development Scripts

### Core Commands
- `yarn dev` - Start development environment (frontend + backend)
- `yarn install` - Install all dependencies
- `yarn lint` - Check code quality and formatting
- `yarn lint:fix` - Automatically fix linting issues
- `yarn test` - Run test suite

### Database Commands
- `yarn workspace database push` - Push schema changes to database
- `yarn workspace database generate` - Generate Prisma client
- `yarn workspace database studio` - Open Prisma Studio for database management

### Deployment
- `yarn docker` - Build and run Docker container locally
- `yarn deploy` - Deploy to AWS ECR (requires AWS configuration)

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with the following key entities:

### Core Entities
- **Employees** - Hospital staff with roles and departments
- **Departments** - Hospital departments organized by building
- **Buildings** - Hospital locations and facilities
- **Service Requests** - Various types of service requests
- **Nodes & Edges** - Navigation graph for pathfinding

### Service Request Types
- **Maintenance Requests** - Facility maintenance and repairs
- **Medical Device Requests** - Equipment service and delivery
- **Patient Transport** - Inter-hospital patient transportation
- **Translation Requests** - Language interpretation services
- **Sanitation Requests** - Facility cleaning and maintenance

## 🔧 API Endpoints

The backend provides RESTful APIs organized into logical modules:

### Navigation & Pathfinding
- `POST /api/findpath` - Calculate optimal routes using multiple algorithms
- `GET /api/node` - Retrieve navigation nodes
- `GET /api/edge` - Retrieve navigation edges

### Service Requests
- `GET /api/servicerequests` - List all service requests
- `POST /api/maintenancerequest` - Create maintenance requests
- `POST /api/medicaldevicerequest` - Create medical device requests
- `POST /api/patienttransport` - Create patient transport requests
- `POST /api/translationrequest` - Create translation requests
- `POST /api/sanitation` - Create sanitation requests

### Directory & Employee Management
- `GET /api/directory` - Retrieve department directory
- `GET /api/employee` - Employee management endpoints
- `GET /api/building` - Building information

### AI & Utilities
- `POST /api/classify` - AI-powered request classification
- `POST /api/tts` - Text-to-speech conversion
- `GET /api/recentorigins` - Recent navigation origins

## 🧪 Testing

The application includes comprehensive testing infrastructure:

- **Vitest** for fast unit and integration testing
- **Supertest** for API endpoint testing
- **Test coverage** for critical business logic
- **Automated linting** with ESLint and Prettier

## 🐳 Docker Deployment

The application is containerized for consistent deployment:

```bash
# Build and run locally
yarn docker

# Deploy to AWS
yarn deploy
```

## 🔒 Security Features

- **Auth0 authentication** with role-based access control
- **JWT token validation** for API security
- **Input validation** and sanitization
- **CORS configuration** for secure cross-origin requests
- **Environment-based configuration** for secure credential management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This application was developed by a team of software engineering students for CS3733 at WPI as part of a project in collaboration with Mass General Brigham.

