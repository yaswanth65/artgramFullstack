Artgram backend (Express + TypeScript)

Quick start

1. Copy .env.example to .env and set MONGO_URI and JWT_SECRET.
2. cd server
3. npm install
4. npm run dev

Default API base: http://localhost:5000/api

Frontend integration

- Set your frontend API base (e.g., VITE_API_URL) to the backend base (http://localhost:5000/api).
- Endpoints:
  - POST /api/auth/register {name,email,password,role,branchId}
  - POST /api/auth/login {email,password} -> {token,user}
  - PUT /api/auth/profile (protected) -> update user profile
  - GET /api/branches
  - GET /api/orders (admin: all, user: own)
  - POST /api/orders create order
  - POST /api/orders/:id/tracking add tracking update
  - GET /api/bookings
  - POST /api/bookings

If you want, I can update the frontend `DataContext` to call these endpoints next.
