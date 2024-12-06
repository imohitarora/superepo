# Project Monorepo

## Overview

This is a Turborepo monorepo setup containing two main applications:

- `web`: A Next.js frontend application
- `api`: A NestJS backend application

## Prerequisites

- Node.js (recommended version: 18.x or later)
- pnpm (Package manager)

## Setup

### Initial Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

## Development

### Running the Project

To run both web and API applications simultaneously:

```bash
pnpm run dev
```

### Adding shadcn/ui Components

To add a new shadcn/ui component to the web project:

```bash
pnpm dlx shadcn-ui@latest add <component-name> -c ./apps/web
```

## Project Structure

- `/apps/web`: Next.js frontend application
- `/apps/api`: NestJS backend application
- `turbo.json`: Turborepo configuration

## Recommended VS Code Extensions

- ESLint
- Prettier
- TypeScript

## Scripts

- `pnpm run dev`: Start development servers for web and API
- `pnpm run build`: Build all applications
- `pnpm run lint`: Run linters across the project
- `pnpm run test`: Run tests for all applications

## Environment Variables

Create `.env` files in respective app directories for environment-specific configurations.
