# Manual Testing Guide

## Prerequisites
1. Start the server: `npm start` or `node dist/index.js`
2. Ensure MongoDB is running and connected
3. Ensure environment variables are set in `.env`

## Test 1: Email Service
1. Open browser/Postman and make a POST request to:
   ```
   http://localhost:10000/api/auth/forgot-password
   Content-Type: application/json
   
   {
     "email": "arjun.sharma@example.com"
   }
   ```
2. Expected response: `{"message": "If an account with that email exists, a password reset code has been sent."}`
3. Check email inbox (including spam folder) for email with code **8888**

## Test 2: Password Reset Flow
1. Send reset code (Test 1)
2. Verify code with POST request to:
   ```
   http://localhost:10000/api/auth/verify-reset-code
   Content-Type: application/json
   
   {
     "email": "arjun.sharma@example.com",
     "code": "8888"
   }
   ```
3. Expected response: `{"message": "Reset code verified successfully", "verified": true}`
4. Reset password with POST request to:
   ```
   http://localhost:10000/api/auth/reset-password
   Content-Type: application/json
   
   {
     "email": "arjun.sharma@example.com",
     "code": "8888",
     "newPassword": "newpassword123",
     "oldPassword": "password123"
   }
   ```
5. Expected response: `{"message": "Password reset successfully. You can now login with your new password."}`
6. Test login with new password

## Test 3: Session Seat Management
1. Login as admin:
   ```
   POST http://localhost:10000/api/auth/login
   {
     "email": "admin@artgram.com",
     "password": "password123"
   }
   ```
2. Create a session:
   ```
   POST http://localhost:10000/api/sessions
   Authorization: Bearer <token>
   
   {
     "branchId": "<actual-branch-id>",
     "date": "2025-01-20",
     "activity": "slime",
     "time": "10:00",
     "totalSeats": 10,
     "type": "Slime Play Session",
     "ageGroup": "3+"
   }
   ```
3. Create a booking to simulate booked seats:
   ```
   POST http://localhost:10000/api/bookings
   Authorization: Bearer <token>
   
   {
     "sessionId": "<session-id>",
     "seats": 3,
     "packageType": "base"
   }
   ```
4. Update session to reduce total seats:
   ```
   PUT http://localhost:10000/api/sessions/<session-id>
   Authorization: Bearer <token>
   
   {
     "totalSeats": 5
   }
   ```
5. Expected result: Session should show `2/5 available` (5 total - 3 booked = 2 available)

## Test 4: Frontend Integration
1. Start frontend: `npm run dev` (from project root)
2. Navigate to login page
3. Click "Forgot your password?"
4. Test the complete flow:
   - Enter email: `arjun.sharma@example.com`
   - Enter code: `8888`
   - Set new password
5. Verify the UI matches the login page aesthetics

## Test 5: Invalid Operations
1. Try to reduce seats below booked count - should fail with appropriate error
2. Try to verify with wrong code (9999) - should fail
3. Try to reset password with wrong code - should fail

## Expected Results
- ✅ Email service sends emails successfully
- ✅ Password reset flow works end-to-end
- ✅ Session seat calculations are accurate
- ✅ Frontend UI matches login page design
- ✅ Invalid operations are properly rejected
- ✅ User data is preserved during password reset

## Troubleshooting
- If emails don't arrive, check spam folder
- If server won't start, check MongoDB connection
- If tests fail, check console logs for detailed error messages
- Ensure all environment variables are properly set
