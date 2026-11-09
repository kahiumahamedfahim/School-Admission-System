# AI Usage

## Overview

AI tools were used as a development assistance tool during the implementation of this assignment.

The final implementation, code integration, testing, debugging, and architectural decisions were reviewed and verified manually.

## Areas Where AI Assistance Was Used

### 1. Project Structure

AI assistance was used to help organize the application into a layered structure:

- Controllers
- Services
- Repositories
- Entity/Models
- DTOs
- Database configuration
- Automated tests

### 2. Backend Development

AI assistance was used for:

- Generating and refining initial code structures
- ASP.NET Core Web API patterns
- Entity Framework Core configuration
- Repository and Unit of Work patterns
- DTO design
- HTTP status code handling
- Error handling

### 3. Concurrency and Seat Allocation

AI assistance was used to reason about the seat allocation concurrency problem and possible PostgreSQL-based locking strategies.

The final implementation uses database transactions and row-level locking to ensure that:

`heldSeats + confirmedSeats <= totalSeats`

remains true during concurrent hold requests.

A dedicated automated concurrency test was implemented to verify this behavior.

### 4. Hold Expiration

AI assistance was used to design and review the hold expiration workflow.

The application includes:

- Configurable hold duration
- Expiration status handling
- Background expiration processing
- Automated expiration testing

### 5. Testing and Debugging

AI assistance was used to help identify and troubleshoot implementation issues during development.

Tests were created for:

- Class creation
- Class listing
- Hold creation
- Hold retrieval
- Hold confirmation
- Hold cancellation
- Full class handling
- Duplicate active hold handling
- Hold expiration
- Student-specific hold retrieval
- Concurrent hold requests

### 6. Documentation

AI assistance was used to help organize project documentation, including this file and `ASSUMPTIONS.md`.

## Human Verification

AI-generated suggestions were not treated as automatically correct.

The implementation was manually reviewed and integrated into the project. The application was built and tested locally, and database migrations and API behavior were verified during development.

The developer remains responsible for the final code, architecture, configuration, testing, and submitted solution.