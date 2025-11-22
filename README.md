# Infinibay Frontend

Web interface for Infinibay, a virtualization management platform designed for simplicity.

## Overview

This repository contains the web UI for Infinibay, built with Next.js and React. It provides an intuitive interface for managing virtual machines, departments, user access, and system configuration.

**Important:** This is a component of the Infinibay system and is not intended to be installed standalone. The frontend runs as part of a containerized infrastructure orchestrated by LXD.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **State Management:** Redux Toolkit + Apollo Client cache
- **API Client:** Apollo Client 3 (GraphQL)
- **Styling:** TailwindCSS 3
- **Real-time:** Socket.io client for WebSocket events
- **Code Generation:** GraphQL Code Generator

## Installation

Infinibay frontend is deployed automatically as part of the complete system. Choose your installation method:

### Production Installation (Recommended)
Use the automated installer for Ubuntu 22.04+ systems:
```bash
git clone https://github.com/Infinibay/installer
cd installer
./setup.sh
```

See the [installer repository](https://github.com/Infinibay/installer) for full documentation.

### LXD-based Deployment (Alternative)
For simplified deployment using LXD containers:
```bash
git clone https://github.com/Infinibay/lxd
cd lxd
./setup.sh
./run.sh
```

See the [lxd repository](https://github.com/Infinibay/lxd) for LXD-based deployment and usage.

## Development

For developers contributing to the frontend:

### Prerequisites
- Node.js 20+
- Backend API running (http://localhost:4000)

### Local Setup
```bash
npm install
cp .env.example .env.local
# Edit .env.local with backend URL

# Start development server
npm run dev
```

The app will be available at http://localhost:3000

### Key Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run codegen` - Generate GraphQL hooks from operations (run after backend schema changes)
- `npm test` - Run test suite
- `npm run lint` - Check code style

### GraphQL Operations

GraphQL operations are defined in `.graphql` files and code-generated into typed hooks:

1. Define operations in `src/gql/queries/*.graphql` or `src/gql/mutations/*.graphql`
2. Run `npm run codegen` to generate TypeScript hooks
3. Import generated hooks from `@/gql/hooks`

**Example:**
```typescript
import { useGetVirtualMachinesQuery } from '@/gql/hooks';

const { data, loading } = useGetVirtualMachinesQuery();
```

See [frontend/CLAUDE.md](./CLAUDE.md) for architecture details and development patterns.

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── gql/              # GraphQL operations & generated hooks
│   ├── hooks/            # Custom React hooks
│   ├── redux/            # Redux store & slices
│   └── utils/            # Utility functions
├── public/               # Static assets
└── tailwind.config.js    # TailwindCSS configuration
```

## Features

- **VM Management:** Create, configure, and control virtual machines
- **Department Organization:** Multi-tenancy with department-based access control
- **User Management:** Role-based permissions (admin, user)
- **Firewall Configuration:** Service presets and custom rules
- **Real-time Updates:** WebSocket integration for live VM status
- **Template System:** Pre-configured OS templates for quick deployment

## License

[Your License]

## Links

- [Infinibay Website](https://infinibay.com)
- [Installer Repository](https://github.com/Infinibay/installer)
- [LXD Development Repository](https://github.com/Infinibay/lxd)
- [Backend Repository](https://github.com/Infinibay/backend)
