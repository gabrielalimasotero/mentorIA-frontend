# Build and Setup Instructions

This document provides step-by-step instructions for setting up and running the MentorIA frontend project locally.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (version 18 or higher recommended)
- pnpm (version 9.3.0 or higher)
- Git

## Installation Steps

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd mentorIA-frontend
   ```

2. Install dependencies using pnpm:
   ```bash
   pnpm install
   ```

## Running the Application

### Development Mode

To run the application in development mode with hot-reload:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Build

To create a production build:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

## Available Scripts

- `pnpm dev` - Starts the development server
- `pnpm build` - Creates a production build
- `pnpm start` - Runs the production server
- `pnpm lint` - Runs ESLint to check code quality
- `pnpm format` - Checks code formatting using Prettier
- `pnpm format:write` - Automatically fixes code formatting issues

## Environment Setup

The project uses Next.js and requires certain environment variables to be set up. Create a `.env.local` file in the root directory with the following variables:

```env
# Add any required environment variables here
# Example:
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Project Structure

Key directories and their purposes:

- `/app` - Next.js application routes and pages
- `/components` - Reusable React components
- `/lib` - Utility functions and shared logic
- `/public` - Static assets

## Common Issues and Solutions

### Port Already in Use

If port 3000 is already in use, you can start the development server on a different port:

```bash
pnpm dev -p 3001
```

### Node Modules Issues

If you encounter issues with node modules, try cleaning the cache and reinstalling:

```bash
rm -rf node_modules
pnpm store prune
pnpm install
```

### Build Errors

If you encounter build errors:
1. Make sure all dependencies are properly installed
2. Clear the Next.js cache:
   ```bash
   rm -rf .next
   pnpm build
   ```

## Tech Stack

This project uses:
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Clerk for authentication
- Various UI components from Radix UI

## Performance Considerations

- The development server may take a few moments to start initially
- First build might take longer due to optimization processes
- Enable JavaScript in your browser as this is a React application 