# Quote App

A React application that demonstrates authentication and asynchronous API calls using React, TypeScript, Material UI, and JSON Server.

## Features

- Authentication with httpOnly cookies
- Protected routes
- Public and private API endpoints
- Long-running API requests with AbortController
- Modal interfaces
- Responsive design with Material UI

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the Application

Start both the development server and the JSON server:

```bash
npm run start
```

This will start:

- The React application on [http://localhost:3000](http://localhost:3000)
- The JSON server on [http://localhost:3001](http://localhost:3001)

### Login Credentials

Use the following credentials to log in:

- Email: aleksei@example.com
- Password: lkJlkn8hj

## Project Structure

```
quote-app/
├── db.json           # Mock database
├── server.js         # JSON server with custom routes
├── src/
│   ├── components/   # Reusable components
│   ├── contexts/     # React contexts
│   ├── pages/        # Page components
│   ├── services/     # API services
│   ├── types/        # TypeScript types
│   ├── App.tsx       # Main App component
│   └── main.tsx      # Entry point
├── package.json
└── vite.config.ts    # Vite configuration
```

## Testing Approach

The application could be tested with the following approaches:

1. **Unit Tests**: Testing individual components and functions.

   - Testing components with React Testing Library
   - Testing API services with mock axios responses

2. **Integration Tests**: Testing interactions between components.

   - Testing authentication flow
   - Testing protected routes

3. **E2E Tests**: Testing the entire application flow.

   - Using Cypress to simulate user interactions

4. **API Mock Testing**: Testing the application with mock API responses.
   - Using tools like MSW (Mock Service Worker)

## Git Branching Strategy

A simple git branching strategy:

- `main`: Production-ready code
- `develop`: Main development branch
- Feature branches (e.g., `feature/login-page`): for new features
- Bugfix branches (e.g., `bugfix/auth-issue`): for bug fixes
- Release branches (e.g., `release/1.0.0`): for preparing releases

Example workflow:

1. Create a feature branch from `develop`
2. Implement and test the feature
3. Merge back to `develop`
4. Create a release branch when ready
5. Test the release
6. Merge to `main` and tag with version number
