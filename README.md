# turborepo monorepo with Next.js 15 + NestJS 11 + shadcn

This template is for creating a comprehensive Enterprise level app using Next.js 15 (frontend) and NestJS 11 (backend).
Use database of your choice (MySQL, PostgreSQL, etc.) and configure it in the app.

## Usage

1. Clone the repository

```bash
git clone https://github.com/mohitarora/superepo.git
```

2. Setup Environment Variables
```
Copy .env.example to .env in both apps/api and apps/web
```

3. Install dependencies

```bash
pnpm install
```

4. Start the app

```bash
pnpm dev
```

5. Visit http://localhost:3000

6. Visit http://localhost:4000/api/docs

If you need to install new packages, you can add to the respective app folder:

```bash
pnpm add <package-name>
```

## Adding shadcn components

To add shadcn components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/ui/button"
```

## Functionality

- Create New user from Register page
- Login to app using credentials from Login page
- Go to Settings page and invite a new user
- Copy the invitation URL and register the user (either in another browser or in incognito mode)
- Login using new user credentials from Login page

- NOTE: Now you have successfully created an admin user as well as a regular user.

## Features

**Core Architecture**
- Next.js 15 with Turbopack
- Monorepo setup using Turborepo
- Shared ESLint/TypeScript configs

**Functionality**
- Authentication (NextAuth.js)
- Form validation with Zod + react-hook-form
- Data visualization with Recharts


## Packages 

- Next.js 15
- NestJS 11
- shadcn/ui
- next-auth
- passport
- TypeORM