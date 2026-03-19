# leedtech-backend

Backend service for managing students, their fee accounts, and one-time fee payments. Built with Spring Boot, PostgreSQL, JPA, validation, and OpenAPI (springdoc).

## What This Service Does
- Manages students (create, list, update, delete).
- Manages student fee accounts with balances and next due dates.
- Processes one-time payments, applies incentive discounts, updates balances, and records payment history.
- Enforces idempotency on payments to prevent duplicate charges.

## Tech Stack
- Spring Boot 3 + Spring Web
- Spring Data JPA + Hibernate
- PostgreSQL
- Validation (Jakarta)
- OpenAPI UI (springdoc)

## Requirements
- Java 17+
- Maven 3.9+
- PostgreSQL 13+

## Quick Start
1. Create a local database:
   ```sql
   CREATE DATABASE leadtech_payment;
   ```
2. Configure database credentials in `src/main/resources/application.properties` or via environment variables.
3. Run the app:
   ```bash
   ./mvnw spring-boot:run
   ```

By default Spring Boot serves on port `8080` unless you override `server.port`.

## Configuration
Defaults live in `src/main/resources/application.properties`:
- `spring.datasource.url=jdbc:postgresql://localhost:5432/leadtech_payment`
- `spring.datasource.username=postgres`
- `spring.datasource.password=password`
- `spring.jpa.hibernate.ddl-auto=update` (auto-creates/updates tables on startup)

Override with env vars as needed:
```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/leadtech_payment
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=password
```

## Domain Model
- `Student`  
  Identified by `studentNumber` (generated as `STU<timestamp>`). Stores name, email, and created timestamp.
- `StudentAccount`  
  One-to-one with `Student`. Tracks `balance`, `currency`, `nextDueDate`, and audit timestamps. Uses optimistic locking via `version`.
- `FeePayment`  
  Records a payment: amount, currency, previous/new balances, incentive rate/amount, total reduction, idempotency key, and payment date.

## API Overview
Base paths:
- `/api/v1/students`
- `/api/v1/accounts`
- `/api/v1/payments`

Key endpoints:
- `POST /api/v1/students` create student
- `GET /api/v1/students` list students (paginated)
- `GET /api/v1/students/{studentNumber}` get student
- `PUT /api/v1/students/{studentNumber}` update student
- `DELETE /api/v1/students/{studentNumber}` delete student
- `POST /api/v1/accounts` create account for an existing student
- `GET /api/v1/accounts` list accounts
- `GET /api/v1/accounts/{id}` get account
- `PUT /api/v1/accounts/{id}` update account
- `DELETE /api/v1/accounts/{id}` delete account
- `POST /api/v1/payments/one-time` process one-time fee payment

## Payment Logic (One-Time)
Processing a payment:
- Validates amount and currency.
- Enforces idempotency using `idempotencyKey` (unique in DB). If a matching payment exists, it is returned.
- Calculates incentive rate:
  - `< 100,000` => `1%`
  - `< 500,000` => `3%`
  - `>= 500,000` => `5%`
- Updates account balance and computes `nextDueDate = paymentDate + 90 days` (weekend adjusted).
- Persists a `FeePayment` record with previous and new balances.

## Error Handling
Global exception handling maps validation and domain errors to a consistent JSON error response (see `com.kudukin.store.exception`).

## API Docs
OpenAPI UI (springdoc) is typically available at:
- `http://localhost:8080/swagger-ui/index.html`

## Build & Test
```bash
./mvnw clean test
```

## Packaging
```bash
./mvnw clean package
```
The built jar will be in `target/`.
