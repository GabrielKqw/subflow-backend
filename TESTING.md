# 🧪 Testando a API

## Endpoints Disponíveis

### 1. Registrar Usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password@123",
    "name": "John Doe"
  }'
```

**Resposta:**
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
    "refreshToken": "seu-refresh-token"
  }'
```

### 4. Obter Dados do Usuário

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer seu-access-token"
```

### 5. Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer seu-access-token"
```

## Usuário Admin (Seed)

```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

## Validações

### Password deve ter:
- Mínimo 8 caracteres
- 1 letra maiúscula
- 1 letra minúscula
- 1 número

### Email:
- Formato válido de email

### Nome:
- Mínimo 2 caracteres

