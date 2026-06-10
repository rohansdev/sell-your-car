# Sell Your Car API

A polished [NestJS](https://nestjs.com/) backend API App for:
- User authentication.
- Get estimated price for cars based on make, model, year & mileage.
- Submit car sold reports.
- Admin approves the submitted reports.

This project is an example of a modern TypeScript API.

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## Overview
This project showcases a small but practical backend service built with [NestJS](https://nestjs.com/), [TypeScript](https://www.typescriptlang.org/), TypeORM, and SQLite. It includes session-based authentication, validation, structured error handling, and a simple reports workflow.

## Key Features
- User registration, sign-in, sign-out, and profile access
- Session-based authentication with route protection
- Custom current-user interception and response serialization
- CRUD-style report endpoints for the car-report workflow
- Input validation and clean exception handling
- Logging middleware for development visibility

## Tech Stack
- NestJS 11
- TypeScript 5.7
- TypeORM 1.0
- better-sqlite3 12.10
- Express Session
- class-validator + class-transformer
- Jest + Nest Testing Utilities
- ESLint + Prettier
- pnpm

## Getting Started
1. Install dependencies:
   pnpm install
2. Create or update your environment file if needed:
   DB_NAME=db.sqlite
3. Start the development server:
   pnpm start

## Useful Commands
- Development mode: pnpm start
- Watch mode: pnpm start:dev
- Production build: pnpm build
- Test suite: pnpm test
- End-to-end tests: pnpm test:e2e

## API Highlights
- POST /auth/signup — create a new user
- POST /auth/signin — sign in and create a session
- GET /auth/profile — fetch the authenticated profile
- POST /auth/signout — clear the session
- GET /reports — list reports
- POST /reports — create a report
- GET /reports/:id — fetch one report
- PATCH /reports/:id — update a report
- DELETE /reports/:id — remove a report

## Deployment Notes
This project is ready to run on any Node.js hosting platform that supports a SQLite-backed NestJS service. In production, set DB_NAME to a writable SQLite path and start the compiled app with pnpm start:prod.

## Official Resources
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeORM Documentation](https://typeorm.io/)

## License
Yes — MIT is a sensible choice for this repository.

It is a permissive, widely recognized open-source license that works well for public portfolio projects because it allows others to view, learn from, and reuse the code with minimal restrictions. The included LICENSE file matches this choice.

## Contact
Rohan Sehgal
