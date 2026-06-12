# Sell Your Car API

A polished NestJS portfolio project that demonstrates practical backend development skills: secure session authentication, SQLite-backed persistence, TypeORM migrations, request validation, and an admin approval workflow for car reports.

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## Why this project stands out

This repository highlights backend capabilities that matter in real-world applications:

- Session-based authentication and protected routes
- TypeORM entity modeling with SQLite persistence
- Database migrations and CLI-based schema evolution
- Request validation and clean API responses
- A complete report flow from submission to approval

## What this project does

The API currently supports:

- Session-based authentication for users
- CRUD endpoints for users and reports
- Car price estimate queries based on make, model, year, mileage, and location
- Admin approval flow for reports
- SQLite-backed persistence with TypeORM migrations

## Tech stack

- NestJS 11
- TypeScript 5.7
- TypeORM 1.0
- better-sqlite3 12.10
- Express Session
- class-validator + class-transformer
- Jest + Nest Testing Utilities
- pnpm

## Portfolio highlights

This project is a strong example of how to:

- building a REST API with a clean controller/service/module structure
- handling authentication and session state in a real backend flow
- applying validation and DTOs for safer request handling
- managing schema changes through TypeORM migrations
- creating documentation that is easy for reviewers and collaborators to understand

## Quick start

This project is ready to run locally for development or testing with minimal setup.

1. Install dependencies
   ```bash
   pnpm install
   ```
2. Create local environment files for development and testing:
   ```bash
   .env.development
   .env.test
   ```
   Example values:
   ```env
   COOKIE_KEY=super-secret-session-key
   DB_NAME=db.sqlite (development)
   ```
3. Start the development server
   ```bash
   pnpm start:dev
   ```
4. Generate migrations (required on a fresh database)
   ```bash
   pnpm typeorm migration:generate migrations/your-migration-name -d data-source.js
   ```
5. Run migrations (required on a fresh database)
   ```bash
   pnpm typeorm migration:run
   ```

> The development configuration in `ormconfig.js` uses SQLite (`db.sqlite`). The test configuration uses `test.sqlite`.

## TypeORM database and migrations

The project already contains one migration file in `migrations/1781268155806-initial-schema.js`.

### Useful CLI commands

```bash
pnpm typeorm migration:run
pnpm typeorm migration:show
pnpm typeorm migration:revert
```

To generate a new migration after changing entities:

```bash
pnpm typeorm migration:generate migrations/your-migration-name -d data-source.js
```

## Current API routes

### 1) Root health check

```http
GET /
```

Example:

```bash
curl http://localhost:3000/
```

Expected response:

```json
"Hello World!"
```

---

### 2) Create a user account

```http
POST /auth/signup
```

Sample JSON body:

```json
{
  "name": "Ava Carter",
  "email": "ava@example.com",
  "password": "StrongPass!23",
  "isAdmin": false
}
```

Example:

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Ava Carter","email":"ava@example.com","password":"StrongPass!23","isAdmin":false}'
```

---

### 3) Sign in

```http
POST /auth/signin
```

Sample JSON body:

```json
{
  "email": "ava@example.com",
  "password": "StrongPass!23"
}
```

Example:

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"ava@example.com","password":"StrongPass!23"}'
```

---

### 4) Fetch the current logged-in user profile

```http
GET /auth/profile
```

Use the session cookie returned by the sign-in/signup request.

Example:

```bash
curl http://localhost:3000/auth/profile \
  -b "connect.sid=<session-cookie>"
```

---

### 5) Sign out

```http
POST /auth/signout
```

Example:

```bash
curl -X POST http://localhost:3000/auth/signout \
  -b "connect.sid=<session-cookie>"
```

---

### 6) List all users

```http
GET /auth
```

Example:

```bash
curl http://localhost:3000/auth
```

---

### 7) Get one user by id

```http
GET /auth/:id
```

Example:

```bash
curl http://localhost:3000/auth/1
```

---

### 8) Update a user

```http
PATCH /auth/:id
```

Sample JSON body:

```json
{
  "name": "Ava Carter Updated",
  "isAdmin": true
}
```

Example:

```bash
curl -X PATCH http://localhost:3000/auth/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Ava Carter Updated","isAdmin":true}'
```

---

### 9) Delete a user

```http
DELETE /auth/:id
```

Example:

```bash
curl -X DELETE http://localhost:3000/auth/1
```

---

### 10) Create a car report

```http
POST /reports
```

Sample JSON body:

```json
{
  "make": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "mileage": 31000,
  "price": 16500,
  "latitude": 40.7128,
  "longitude": -74.006
}
```

Example:

```bash
curl -X POST http://localhost:3000/reports \
  -H "Content-Type: application/json" \
  -b "connect.sid=<session-cookie>" \
  -d '{"make":"Toyota","model":"Corolla","year":2020,"mileage":31000,"price":16500,"latitude":40.7128,"longitude":-74.006}'
```

---

### 11) List all reports

```http
GET /reports
```

Example:

```bash
curl http://localhost:3000/reports
```

---

### 12) Estimate a car price from matching reports

```http
GET /reports/estimate?make=Toyota&model=Corolla&year=2020&mileage=31000&latitude=40.7128&longitude=-74.006
```

Example:

```bash
curl "http://localhost:3000/reports/estimate?make=Toyota&model=Corolla&year=2020&mileage=31000&latitude=40.7128&longitude=-74.006"
```

---

### 13) Get one report by id

```http
GET /reports/:id
```

Example:

```bash
curl http://localhost:3000/reports/1
```

---

### 14) Approve or reject a report (admin only)

```http
PATCH /reports/:id
```

Sample JSON body:

```json
{
  "approved": true
}
```

Example:

```bash
curl -X PATCH http://localhost:3000/reports/1 \
  -H "Content-Type: application/json" \
  -b "connect.sid=<admin-session-cookie>" \
  -d '{"approved":true}'
```

---

### 15) Delete a report

```http
DELETE /reports/:id
```

Example:

```bash
curl -X DELETE http://localhost:3000/reports/1 \
  -b "connect.sid=<session-cookie>"
```

## Notes

- The session cookie is created during `POST /auth/signup` and `POST /auth/signin`.
- Admin-only routes are protected in the code and should be used with an admin account.
- SQLite database files are created in the project root as `db.sqlite` (development) and `test.sqlite` (tests).

## License

MIT
