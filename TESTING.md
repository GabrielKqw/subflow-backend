# API Testing Guide

## Authentication Endpoints

### 1. Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password@123",
    "name": "John Doe"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER"
    },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password@123"
  }'
```

### 3. Refresh Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token"
  }'
```

### 4. Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer your-access-token"
```

### 5. Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer your-access-token"
```

## Admin User (Seed)

```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

---

## Plans Endpoints

### 1. List All Plans

```bash
curl -X GET http://localhost:3000/api/plans
```

### 2. List Active Plans Only

```bash
curl -X GET http://localhost:3000/api/plans?activeOnly=true
```

### 3. Get Plan by ID

```bash
curl -X GET http://localhost:3000/api/plans/1
```

### 4. Create New Plan (Admin)

```bash
curl -X POST http://localhost:3000/api/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-token" \
  -d '{
    "name": "Premium Plus",
    "description": "Premium plan with extra features",
    "price": 99.90,
    "durationDays": 30,
    "features": ["Feature 1", "Feature 2", "Feature 3"]
  }'
```

### 5. Update Plan (Admin)

```bash
curl -X PUT http://localhost:3000/api/plans/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-token" \
  -d '{
    "price": 79.90,
    "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]
  }'
```

### 6. Toggle Plan Active Status (Admin)

```bash
curl -X PATCH http://localhost:3000/api/plans/1/toggle \
  -H "Authorization: Bearer admin-token"
```

### 7. Delete Plan (Admin)

```bash
curl -X DELETE http://localhost:3000/api/plans/1 \
  -H "Authorization: Bearer admin-token"
```

**Note:** Plans with active subscriptions cannot be deleted, only deactivated.

---

## Validation Rules

### Password Requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Email:
- Valid email format

### Name:
- Minimum 2 characters
