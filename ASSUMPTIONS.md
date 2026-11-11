# Assumptions

## 1. Student Identity

No login or authentication system is implemented because the assignment explicitly uses the `X-Student-Id` request header to identify a student.

The frontend asks the student to provide their Student ID and sends it with relevant API requests.

## 2. Student ID Format

The system treats Student ID as a string.

The backend does not enforce a specific Student ID format because the assignment only requires the ID to be supplied through the `X-Student-Id` header.

## 3. Hold Duration

A newly created hold is valid for 600 seconds by default.

The duration can be configured through the `HOLD_DURATION_SECONDS` configuration value.

## 4. Hold Expiration

Expired HELD records are changed to the `EXPIRED` status.

A background service periodically checks for expired holds and releases their seats.

## 5. One Active Hold Per Student

A student can have only one active `HELD` hold at a time across the system.

This prevents the same student from holding multiple seats simultaneously.

## 6. One Confirmed Admission Per Student

A student can be admitted to only one class.

Once a student's hold is confirmed, the student cannot create another hold for any class.

Therefore, a student can have at most one confirmed admission across the system.

## 7. Seat Availability

A seat is considered occupied when it is either:

- HELD
- CONFIRMED

Therefore:

`heldSeats + confirmedSeats <= totalSeats`

must always remain true.

## 8. Concurrency

Seat allocation is protected using PostgreSQL transaction and row-level locking.

The class row is locked before checking the current number of held and confirmed seats.

This ensures that simultaneous hold requests cannot allocate more seats than the class capacity.

## 9. Payment

No real payment gateway is integrated.

Confirming a hold simulates successful payment and changes the hold status from `HELD` to `CONFIRMED`.

## 10. Data Persistence

PostgreSQL is used as the persistent database.

Class and hold data remain available after application restart.

## 11. Time Handling

The backend stores and compares timestamps using UTC (`DateTime.UtcNow`).

The hold expiration time is calculated from the backend's current UTC time.

## 12. API Error Handling

The API returns appropriate HTTP status codes for common situations.

For example:

- `400 Bad Request` for invalid or missing input
- `404 Not Found` when a class or hold does not exist
- `403 Forbidden` when a student attempts to modify another student's hold
- `409 Conflict` when a seat is unavailable or a business rule prevents the operation
- `500 Internal Server Error` for unexpected server errors

## 13. Frontend Scope

The frontend focuses on functionality rather than visual polish.

It provides the required workflows for:

- Viewing classes
- Viewing seat availability
- Creating a hold
- Viewing a student's holds
- Confirming a hold
- Cancelling a hold