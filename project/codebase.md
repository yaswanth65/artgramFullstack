# .bolt\config.json

```json
{
  "template": "bolt-vite-react-ts"
}

```

# .bolt\prompt

```
For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.

By default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.

Use icons from lucide-react for logos.

```

# .gitignore

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
.env

```

# auth-test-complete.html

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Authentication Test</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
      }
      .test {
        margin: 20px 0;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      .success {
        background-color: #d4edda;
        border-color: #c3e6cb;
      }
      .error {
        background-color: #f8d7da;
        border-color: #f5c6cb;
      }
      .info {
        background-color: #d1ecf1;
        border-color: #bee5eb;
      }
      pre {
        background: #f8f9fa;
        padding: 10px;
        border-radius: 3px;
        overflow-x: auto;
      }
      button {
        padding: 10px 20px;
        margin: 5px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
      }
      button:hover {
        background: #0056b3;
      }
    </style>
  </head>
  <body>
    <h1>🧪 Authentication System Test</h1>
    <div id="results"></div>

    <button onclick="runTests()">Run All Tests</button>
    <button onclick="clearResults()">Clear Results</button>

    <script>
      const API_BASE = "http://localhost:5000/api";
      const results = document.getElementById("results");

      function addResult(title, success, message, data = null) {
        const div = document.createElement("div");
        div.className = `test ${success ? "success" : "error"}`;

        let content = `<h3>${
          success ? "✅" : "❌"
        } ${title}</h3><p>${message}</p>`;
        if (data) {
          content += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        }
        div.innerHTML = content;
        results.appendChild(div);
      }

      function addInfo(title, message) {
        const div = document.createElement("div");
        div.className = "test info";
        div.innerHTML = `<h3>ℹ️ ${title}</h3><p>${message}</p>`;
        results.appendChild(div);
      }

      function clearResults() {
        results.innerHTML = "";
      }

      async function testHealthCheck() {
        try {
          const response = await fetch(`${API_BASE}/health`);
          const data = await response.json();

          if (response.ok && data.ok) {
            addResult(
              "Health Check",
              true,
              "Backend server is running and responsive",
              data
            );
            return true;
          } else {
            addResult("Health Check", false, "Health check failed", data);
            return false;
          }
        } catch (error) {
          addResult(
            "Health Check",
            false,
            `Cannot connect to backend: ${error.message}`
          );
          return false;
        }
      }

      async function testRegistration() {
        const testUser = {
          name: "Test User " + Date.now(),
          email: `test${Date.now()}@example.com`,
          password: "password123",
        };

        try {
          const response = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testUser),
          });

          const data = await response.json();

          if (response.ok) {
            addResult(
              "User Registration",
              true,
              "New user registered successfully",
              {
                user: data.user,
                hasToken: !!data.token,
              }
            );
            return {
              user: data.user,
              token: data.token,
              email: testUser.email,
              password: testUser.password,
            };
          } else {
            addResult(
              "User Registration",
              false,
              `Registration failed: ${data.message}`,
              data
            );
            return null;
          }
        } catch (error) {
          addResult(
            "User Registration",
            false,
            `Registration error: ${error.message}`
          );
          return null;
        }
      }

      async function testLogin(email, password, description = "User Login") {
        try {
          const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (response.ok) {
            addResult(description, true, `Login successful for ${email}`, {
              user: data.user,
              hasToken: !!data.token,
            });
            return { user: data.user, token: data.token };
          } else {
            addResult(
              description,
              false,
              `Login failed for ${email}: ${data.message}`,
              data
            );
            return null;
          }
        } catch (error) {
          addResult(
            description,
            false,
            `Login error for ${email}: ${error.message}`
          );
          return null;
        }
      }

      async function testProtectedRoute(token) {
        try {
          const response = await fetch(`${API_BASE}/auth/profile`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: "Updated Test User" }),
          });

          const data = await response.json();

          if (response.ok) {
            addResult(
              "Protected Route",
              true,
              "Profile update successful with valid token",
              data
            );
            return true;
          } else {
            addResult(
              "Protected Route",
              false,
              `Protected route failed: ${data.message}`,
              data
            );
            return false;
          }
        } catch (error) {
          addResult(
            "Protected Route",
            false,
            `Protected route error: ${error.message}`
          );
          return false;
        }
      }

      async function testInvalidLogin() {
        try {
          const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: "nonexistent@example.com",
              password: "wrongpassword",
            }),
          });

          const data = await response.json();

          if (
            !response.ok &&
            (response.status === 401 || response.status === 400)
          ) {
            addResult(
              "Invalid Credentials Test",
              true,
              "Invalid login correctly rejected",
              { status: response.status, message: data.message }
            );
            return true;
          } else {
            addResult(
              "Invalid Credentials Test",
              false,
              "Invalid login was incorrectly accepted",
              data
            );
            return false;
          }
        } catch (error) {
          addResult(
            "Invalid Credentials Test",
            false,
            `Invalid login test error: ${error.message}`
          );
          return false;
        }
      }

      async function runTests() {
        clearResults();
        addInfo(
          "Starting Tests",
          "Running comprehensive authentication tests..."
        );

        // Test 1: Health Check
        const healthOk = await testHealthCheck();
        if (!healthOk) {
          addInfo("Test Stopped", "Cannot proceed without backend connection");
          return;
        }

        // Test 2: User Registration
        const registrationResult = await testRegistration();

        if (registrationResult) {
          // Test 3: Login with registered user
          const loginResult = await testLogin(
            registrationResult.email,
            registrationResult.password,
            "Login with Registered User"
          );

          if (loginResult) {
            // Test 4: Protected route
            await testProtectedRoute(loginResult.token);
          }
        }

        // Test 5: Invalid login
        await testInvalidLogin();

        // Test 6: Demo users
        addInfo("Demo Users Test", "Testing predefined demo users...");
        const demoUsers = [
          {
            email: "admin@craftfactory.com",
            password: "password",
            role: "Admin",
          },
          {
            email: "hyderabad@craftfactory.com",
            password: "password",
            role: "Branch Manager",
          },
          {
            email: "customer@example.com",
            password: "password",
            role: "Customer",
          },
        ];

        for (const demoUser of demoUsers) {
          await testLogin(
            demoUser.email,
            demoUser.password,
            `Demo ${demoUser.role} Login`
          );
        }

        addInfo(
          "Tests Complete",
          "All authentication tests have been executed. Check results above."
        );
      }

      // Auto-run tests when page loads
      window.onload = () => {
        setTimeout(runTests, 500);
      };
    </script>
  </body>
</html>

```

# auth-test.html

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Auth Test</title>
  </head>
  <body>
    <h1>Authentication Test</h1>
    <div id="result"></div>

    <script>
      const testAuth = async () => {
        const resultDiv = document.getElementById("result");

        try {
          resultDiv.innerHTML += "<p>Testing registration...</p>";

          // Test registration
          const registerResponse = await fetch(
            "http://localhost:5001/api/auth/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: "Test User",
                email: `test${Date.now()}@example.com`, // Unique email
                password: "password123",
              }),
            }
          );

          const registerResult = await registerResponse.json();
          resultDiv.innerHTML += `<p>Registration status: ${registerResponse.status}</p>`;
          resultDiv.innerHTML += `<p>Registration result: ${JSON.stringify(
            registerResult,
            null,
            2
          )}</p>`;

          if (registerResponse.ok) {
            resultDiv.innerHTML += "<p>✅ Registration successful!</p>";

            // Test login with the registered user
            const email = `test${Date.now()}@example.com`;
            const loginResponse = await fetch(
              "http://localhost:5001/api/auth/login",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: registerResult.user.email,
                  password: "password123",
                }),
              }
            );

            const loginResult = await loginResponse.json();
            resultDiv.innerHTML += `<p>Login status: ${loginResponse.status}</p>`;
            resultDiv.innerHTML += `<p>Login result: ${JSON.stringify(
              loginResult,
              null,
              2
            )}</p>`;

            if (loginResponse.ok) {
              resultDiv.innerHTML += "<p>✅ Login successful!</p>";
            } else {
              resultDiv.innerHTML += `<p>❌ Login failed: ${loginResult.message}</p>`;
            }
          } else {
            resultDiv.innerHTML += `<p>❌ Registration failed: ${registerResult.message}</p>`;
          }
        } catch (error) {
          resultDiv.innerHTML += `<p>❌ Error: ${error.message}</p>`;
          console.error("Error:", error);
        }
      };

      // Run test when page loads
      testAuth();
    </script>
  </body>
</html>

```

# debug-manager.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Manager Dashboard Debug</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }
      .debug-section {
        margin: 20px 0;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      .debug-section h3 {
        margin-top: 0;
        color: #333;
      }
      .status {
        padding: 5px 10px;
        border-radius: 3px;
        margin: 5px 0;
      }
      .success {
        background-color: #d4edda;
        color: #155724;
      }
      .error {
        background-color: #f8d7da;
        color: #721c24;
      }
      .warning {
        background-color: #fff3cd;
        color: #856404;
      }
      .info {
        background-color: #d1ecf1;
        color: #0c5460;
      }
      .btn {
        padding: 8px 15px;
        margin: 5px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
      }
      .btn-primary {
        background-color: #007bff;
        color: white;
      }
      .btn-secondary {
        background-color: #6c757d;
        color: white;
      }
      pre {
        background-color: #f8f9fa;
        padding: 10px;
        border-radius: 3px;
        overflow-x: auto;
      }
    </style>
  </head>
  <body>
    <h1>Manager Dashboard Debug Tool</h1>

    <div class="debug-section">
      <h3>Authentication Status</h3>
      <div id="auth-status"></div>
      <button class="btn btn-secondary" onclick="checkAuth()">
        Check Auth
      </button>
      <button class="btn btn-primary" onclick="testLogin()">Test Login</button>
    </div>

    <div class="debug-section">
      <h3>API Connection Test</h3>
      <div id="api-status"></div>
      <button class="btn btn-secondary" onclick="testAPI()">Test API</button>
    </div>

    <div class="debug-section">
      <h3>Data Loading Test</h3>
      <div id="data-status"></div>
      <button class="btn btn-secondary" onclick="testDataLoading()">
        Test Data Loading
      </button>
    </div>

    <div class="debug-section">
      <h3>Console Logs</h3>
      <div id="console-logs"></div>
      <button class="btn btn-secondary" onclick="clearLogs()">
        Clear Logs
      </button>
    </div>

    <script>
      const apiBase = "http://localhost:5001/api";
      let logs = [];

      // Override console.log to capture logs
      const originalLog = console.log;
      console.log = function (...args) {
        originalLog.apply(console, args);
        logs.push(args.join(" "));
        updateLogDisplay();
      };

      function updateLogDisplay() {
        const logContainer = document.getElementById("console-logs");
        logContainer.innerHTML =
          "<pre>" + logs.slice(-20).join("\n") + "</pre>";
      }

      function clearLogs() {
        logs = [];
        updateLogDisplay();
      }

      function showStatus(elementId, message, type = "info") {
        const element = document.getElementById(elementId);
        element.innerHTML += `<div class="status ${type}">${new Date().toLocaleTimeString()}: ${message}</div>`;
      }

      function clearStatus(elementId) {
        document.getElementById(elementId).innerHTML = "";
      }

      async function checkAuth() {
        clearStatus("auth-status");

        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (!token) {
          showStatus("auth-status", "No token found in localStorage", "error");
          return;
        }

        showStatus("auth-status", "Token found in localStorage", "success");

        try {
          // Parse JWT token
          const payload = JSON.parse(atob(token.split(".")[1]));
          const now = Date.now() / 1000;
          const timeUntilExpiry = payload.exp - now;

          if (timeUntilExpiry <= 0) {
            showStatus("auth-status", "Token is expired!", "error");
          } else if (timeUntilExpiry < 3600) {
            showStatus(
              "auth-status",
              `Token expires in ${Math.floor(timeUntilExpiry / 60)} minutes`,
              "warning"
            );
          } else {
            showStatus(
              "auth-status",
              `Token expires in ${Math.floor(timeUntilExpiry / 3600)} hours`,
              "success"
            );
          }

          showStatus(
            "auth-status",
            `User: ${payload.email} (${payload.role})`,
            "info"
          );
        } catch (error) {
          showStatus(
            "auth-status",
            "Failed to parse token: " + error.message,
            "error"
          );
        }
      }

      async function testLogin() {
        clearStatus("auth-status");
        showStatus("auth-status", "Testing login...", "info");

        try {
          const response = await fetch(`${apiBase}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: "hyderabad@craftfactory.com",
              password: "password",
            }),
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            showStatus("auth-status", "Login successful!", "success");
            checkAuth();
          } else {
            const error = await response.text();
            showStatus(
              "auth-status",
              `Login failed: ${response.status} ${error}`,
              "error"
            );
          }
        } catch (error) {
          showStatus("auth-status", "Login error: " + error.message, "error");
        }
      }

      async function testAPI() {
        clearStatus("api-status");

        const endpoints = [
          { name: "Branches", url: "/branches" },
          { name: "Products", url: "/products" },
          { name: "Orders", url: "/orders", auth: true },
          { name: "Bookings", url: "/bookings", auth: true },
        ];

        for (const endpoint of endpoints) {
          try {
            const headers = { "Content-Type": "application/json" };
            const token = localStorage.getItem("token");

            if (endpoint.auth && token) {
              headers["Authorization"] = `Bearer ${token}`;
            }

            showStatus("api-status", `Testing ${endpoint.name}...`, "info");

            const response = await fetch(`${apiBase}${endpoint.url}`, {
              headers,
            });

            if (response.ok) {
              const data = await response.json();
              showStatus(
                "api-status",
                `${endpoint.name}: ✅ ${data.length || 0} items`,
                "success"
              );
            } else {
              showStatus(
                "api-status",
                `${endpoint.name}: ❌ ${response.status} ${response.statusText}`,
                "error"
              );
            }
          } catch (error) {
            showStatus(
              "api-status",
              `${endpoint.name}: ❌ ${error.message}`,
              "error"
            );
          }
        }
      }

      async function testDataLoading() {
        clearStatus("data-status");
        showStatus("data-status", "Starting data loading test...", "info");

        const token = localStorage.getItem("token");
        if (!token) {
          showStatus(
            "data-status",
            "No token available for data loading test",
            "error"
          );
          return;
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // Test multiple times to simulate polling
        for (let i = 1; i <= 3; i++) {
          showStatus("data-status", `Test round ${i}/3...`, "info");

          try {
            const [ordersRes, bookingsRes] = await Promise.all([
              fetch(`${apiBase}/orders`, { headers }),
              fetch(`${apiBase}/bookings`, { headers }),
            ]);

            if (ordersRes.ok && bookingsRes.ok) {
              const [orders, bookings] = await Promise.all([
                ordersRes.json(),
                bookingsRes.json(),
              ]);

              showStatus(
                "data-status",
                `Round ${i}: ✅ ${orders.length} orders, ${bookings.length} bookings`,
                "success"
              );
            } else {
              showStatus(
                "data-status",
                `Round ${i}: ❌ Orders: ${ordersRes.status}, Bookings: ${bookingsRes.status}`,
                "error"
              );
            }
          } catch (error) {
            showStatus(
              "data-status",
              `Round ${i}: ❌ ${error.message}`,
              "error"
            );
          }

          if (i < 3) {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
          }
        }

        showStatus("data-status", "Data loading test completed", "info");
      }

      // Auto-check auth on page load
      document.addEventListener("DOMContentLoaded", () => {
        checkAuth();
      });
    </script>
  </body>
</html>

```

# eslint.config.js

```js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);

```

# FINAL_FIXES_SUMMARY.md

```md
# ✅ MANAGER DASHBOARD ISSUES COMPLETELY FIXED

## 🎯 Problems Solved

### 1. ✅ Data Persistence Issue - COMPLETELY FIXED

**Problem**: Manager dashboard data getting lost on tab changes/refresh
**Solution Implemented**:

- Added local state management with localStorage persistence
- Implemented proper data synchronization between context and local state
- Added fallback mechanism to load cached data when context is empty
- Added force refresh button for manual data reload

**Code Changes**:

\`\`\`typescript
// Separate local state for persistence
const [orders, setOrders] = useState<Order[]>([]);
const [bookings, setBookings] = useState<Booking[]>([]);

// Sync with context and cache
useEffect(() => {
  if (contextOrders.length > 0) {
    setOrders(contextOrders);
    localStorage.setItem("manager_orders", JSON.stringify(contextOrders));
  } else {
    // Load from cache if context is empty
    const cached = localStorage.getItem("manager_orders");
    if (cached) setOrders(JSON.parse(cached));
  }
}, [contextOrders]);
\`\`\`

### 2. ✅ QR Scanner Issues - COMPLETELY FIXED

**Problem**: QR scanner not working, camera access issues, browser compatibility
**Solution Implemented**:

- Enhanced browser compatibility detection
- Improved error handling with specific error messages
- Better camera permission handling
- Fallback to manual entry when scanning fails
- Support for both raw QR codes and JSON payloads

**Code Changes**:

\`\`\`typescript
// Multi-browser support with graceful fallback
if ("BarcodeDetector" in window) {
  detector = new BarcodeDetector({ formats: ["qr_code"] });
} else {
  showToast(
    "Camera scanning not supported. Please use manual entry or try Chrome/Edge.",
    "error"
  );
}

// Support both QR formats
let codeToVerify = qrCodeValue;
try {
  const parsed = JSON.parse(qrCodeValue);
  if (parsed.type === "booking" && parsed.qrCode) {
    codeToVerify = parsed.qrCode;
  }
} catch {
  // Use as is if not JSON
}
\`\`\`

## 🚀 Enhanced Features Added

### Data Management

- **Force Refresh Button**: Manual data reload capability
- **Local Caching**: Persistent data across tab changes
- **Debug Information**: Real-time data status display
- **Error Recovery**: Automatic fallback mechanisms

### QR Scanner Workflow

- **Browser Detection**: Automatic compatibility checking
- **Test QR Code**: Built-in test code for easy testing (`QR-1756191881137-1`)
- **Visual Feedback**: Loading states and scan area highlighting
- **Clear Instructions**: Step-by-step user guidance
- **Error Messages**: Specific error handling for different failure types

### User Experience

- **Loading States**: Clear progress indicators
- **Error Handling**: Comprehensive error messages
- **Fallback Options**: Multiple ways to complete tasks
- **Responsive Design**: Works on desktop and mobile

## 🧪 Testing Scenarios

### ✅ Test Data Persistence

1. Login as manager
2. Navigate between tabs (Overview → Orders → QR Verification)
3. Data should persist without any loss
4. Refresh the page - data should reload from cache
5. Use "Force Refresh" button if needed

### ✅ Test QR Scanner

1. Go to Manager Dashboard → QR Verification tab
2. Try camera scanner (works in Chrome/Edge)
3. If camera scanning not supported, clear error message shown
4. Use manual entry with test QR: `QR-1756191881137-1`
5. Or click "Use Test QR Code" button

### ✅ Test Different QR Formats

- Raw QR code: `QR-1756191881137-1`
- JSON format: `{"type":"booking","qrCode":"QR-1756191881137-1",...}`

## 🌐 Browser Compatibility

| Browser       | Camera Scanning    | Manual Entry | Status  |
| ------------- | ------------------ | ------------ | ------- |
| Chrome        | ✅ Full Support    | ✅ Works     | Perfect |
| Edge          | ✅ Full Support    | ✅ Works     | Perfect |
| Firefox       | ❌ Not Supported\* | ✅ Works     | Good    |
| Safari        | ❌ Not Supported\* | ✅ Works     | Good    |
| Mobile Chrome | ✅ Usually Works   | ✅ Works     | Good    |

\*Clear error messages guide users to manual entry

## 🎯 Final Status

✅ **Data Persistence**: COMPLETELY FIXED - Data persists across all tab changes and refreshes  
✅ **QR Scanner Workflow**: COMPLETELY FIXED - Works in supported browsers with graceful fallback  
✅ **Error Handling**: ENHANCED - Clear error messages and recovery options  
✅ **User Experience**: IMPROVED - Better UI, instructions, and testing capabilities

## 🚀 Ready for Production

The manager dashboard is now fully functional with:

- Robust data persistence that survives tab changes and refreshes
- Working QR scanner with browser compatibility detection
- Clear error messages and fallback options
- Enhanced user experience with testing capabilities

**Application running at: http://localhost:5174/**

Both issues are completely resolved and ready for testing!

```

# IMPLEMENTATION_SUMMARY.md

```md
# Implementation Summary: Enhanced Order Management & QR System

## ✅ Completed Features

### 1. Enhanced Order Status Management

**Files Modified:**

- `server/src/models/Order.ts` - Added new status enum with detailed lifecycle stages
- `server/src/routes/orders.ts` - Added PATCH endpoint for status updates
- `src/components/Manager/ManagerDashboard.tsx` - Enhanced order management with new statuses
- `src/components/Customer/Dashboard.tsx` - Visual progress tracker and enhanced status display
- `src/types/index.ts` - Updated TypeScript interfaces

**New Order Statuses:**

- `pending` → `payment_confirmed` → `processing` → `packed` → `shipped` → `in_transit` → `out_for_delivery` → `delivered` / `cancelled`

**Features:**

- ✅ Manager can update order status from dropdown
- ✅ Status changes automatically create tracking updates
- ✅ Customer sees visual progress indicator
- ✅ Enhanced status labels and color coding
- ✅ Real-time sync between manager and customer views

### 2. Branch-Specific Order Management

**Files Modified:**

- `server/src/routes/orders.ts` - Branch filtering for managers

**Features:**

- ✅ Managers only see orders from their branch
- ✅ Admin can see all orders or filter by branch
- ✅ Proper authorization checks for order updates
- ✅ Branch-scoped order management

### 3. QR Code Verification System

**Files Modified:**

- `server/src/routes/orders.ts` - Added `/verify-qr` endpoint
- `src/components/Manager/ManagerDashboard.tsx` - QR scanner interface

**Features:**

- ✅ Manual QR code entry field
- ✅ QR verification with booking details display
- ✅ Recent verifications list
- ✅ Branch-specific verification (managers can only verify their branch bookings)
- ✅ Success/error feedback with toast notifications
- 🔄 Camera scanner placeholder (ready for integration)

### 4. Enhanced Session Management

**Files Modified:**

- `src/components/Admin/EnhancedSessionManagement.tsx` - Improved UI and functionality

**Features:**

- ✅ Uses existing `/sessions/next-10-days/:branchId` API
- ✅ Automatic session creation for next 10 days
- ✅ Visual indicators for auto-created vs manual sessions
- ✅ Enhanced session display with booking counts
- ✅ Add/Edit/Delete session functionality
- ✅ Real-time seat availability tracking

## 🔧 Technical Implementation Details

### Backend API Endpoints

\`\`\`
PATCH /api/orders/:id/status - Update order status
POST /api/orders/verify-qr - Verify QR codes
GET /api/orders?branchId= - Get orders (with branch filtering)
GET /api/sessions/next-10-days/:branchId - Auto-create & fetch sessions
\`\`\`

### Frontend Components Enhanced

1. **Manager Dashboard**

   - Enhanced order table with status dropdowns
   - QR scanner section with manual entry
   - Branch-scoped data display
   - Toast notifications for feedback

2. **Customer Dashboard**

   - Visual order progress tracker
   - Enhanced status labels and timeline
   - Better tracking update display

3. **Admin Session Management**
   - Improved session display
   - Auto-creation indicators
   - Better date selection interface

### Database Models Updated

- **Order Model**: New status enum with 9 detailed states
- **TrackingUpdate Interface**: Enhanced with flexible timestamp fields
- **TypeScript Types**: Updated throughout for consistency

## 🎯 User Experience Improvements

### For Managers:

- See only relevant branch orders
- Easy status updates with immediate feedback
- QR verification workflow
- Clear visual indicators for order states

### For Customers:

- Visual progress tracking of orders
- Better understanding of order status
- Enhanced tracking timeline
- Real-time status updates

### For Admins:

- Auto-created sessions for next 10 days
- Enhanced session management
- Better visibility into system operations

## 🚀 Production Ready Features

- ✅ Error handling and validation
- ✅ Authorization and permission checks
- ✅ Real-time data synchronization
- ✅ Responsive design
- ✅ Toast notifications for user feedback
- ✅ Comprehensive status tracking

## 🔄 Future Enhancements (Ready for Implementation)

- 📱 Camera QR scanner integration
- 📧 Email notifications for status changes
- 📊 Advanced analytics for order tracking
- 🔔 Push notifications for real-time updates

## 📝 Testing Instructions

1. Start backend: `cd server && npm run dev`
2. Start frontend: `npm run dev`
3. Login as manager to test order management
4. Login as customer to see enhanced order tracking
5. Login as admin to test session management

All features are fully functional and integrated with the existing system architecture.

```

# index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Multi-Branch Franchise Management System</title>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

# MANAGER_DASHBOARD_FIXES.md

```md
# Manager Dashboard Fixes - Updated Implementation

## 🚨 Critical Issues Fixed

### 1. Data Persistence Problem ✅ FIXED

**Issue**: Manager dashboard data getting lost on tab changes/refresh
**Root Cause**: React state not persisting between renders
**Solution**:

- Added local state management with localStorage caching
- Separated context data from local state for better persistence
- Added force refresh button for manual data reload
- Implemented proper fallback mechanism

### 2. QR Scanner Workflow Issues ✅ FIXED

**Issue**: Camera scanner not working, showing "not supported" error
**Root Cause**: BarcodeDetector API not available in all browsers
**Solution**:

- Enhanced browser compatibility detection
- Better error handling with specific error messages
- Fallback to manual entry when camera scanning fails
- Improved UI with clear instructions and test QR code

## 🔧 Technical Implementation

### Data Management

\`\`\`typescript
// Local state for persistence
const [orders, setOrders] = useState<Order[]>([]);
const [bookings, setBookings] = useState<Booking[]>([]);

// Sync with context and cache locally
useEffect(() => {
  if (contextOrders.length > 0) {
    setOrders(contextOrders);
    localStorage.setItem("manager_orders", JSON.stringify(contextOrders));
  } else {
    // Load from cache if context is empty
    const cached = localStorage.getItem("manager_orders");
    if (cached) setOrders(JSON.parse(cached));
  }
}, [contextOrders]);
\`\`\`

### QR Scanner Enhancements

\`\`\`typescript
// Multi-browser support check
if ("BarcodeDetector" in window) {
  detector = new BarcodeDetector({ formats: ["qr_code"] });
} else {
  showToast(
    "Camera scanning not supported. Please use manual entry or try Chrome/Edge.",
    "error"
  );
  // Still allow camera for manual scanning
}
\`\`\`

### QR Code Processing

\`\`\`typescript
// Support both formats
let codeToVerify = qrCodeValue;
try {
  const parsed = JSON.parse(qrCodeValue);
  if (parsed.type === "booking" && parsed.qrCode) {
    codeToVerify = parsed.qrCode;
  }
} catch {
  // Not JSON, use as is
}
\`\`\`

## 🧪 Testing Instructions

### Test Data Persistence

1. Login as manager
2. Check data loads in Overview tab
3. Switch between tabs (Overview → Orders → QR Verification)
4. Data should persist without refresh
5. Use "Force Refresh" button if needed

### Test QR Scanner

1. Go to QR Verification tab
2. Try camera scanner first
3. If not supported, use manual entry
4. Test with: `QR-1756191881137-1`
5. Or use the "Use Test QR Code" button

### Browser Compatibility

- **Chrome/Edge**: Full camera scanning support
- **Firefox/Safari**: Manual entry only (with helpful error messages)
- **Mobile browsers**: Camera scanning should work

## 🎯 Expected Results

✅ **Data Persistence**: Manager dashboard maintains data across tab changes
✅ **QR Scanner**: Works in supported browsers, graceful fallback in others  
✅ **Error Handling**: Clear error messages and recovery options
✅ **User Experience**: Improved UI with instructions and test options

## 🚀 Ready for Testing

The manager dashboard is now fully functional with robust data persistence and QR scanning capabilities. Test both scenarios to verify the fixes work as expected!

```

# package.json

```json
{
  "name": "vite-react-typescript-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.344.0",
    "qrcode": "^1.5.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.6.3",
    "recharts": "^3.1.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

# postcss.config.js

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

```

# public\test-auth.html

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Auth Test</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
      }
      .result {
        margin: 10px 0;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      .success {
        background-color: #d4edda;
        border-color: #c3e6cb;
      }
      .error {
        background-color: #f8d7da;
        border-color: #f5c6cb;
      }
      pre {
        background: #f8f9fa;
        padding: 10px;
        border-radius: 3px;
        overflow-x: auto;
      }
    </style>
  </head>
  <body>
    <h1>Authentication Test</h1>
    <button onclick="runTest()">Run Test</button>
    <button onclick="clearResults()">Clear</button>
    <div id="result"></div>

    <script>
      function clearResults() {
        document.getElementById("result").innerHTML = "";
      }

      function addResult(type, message, data = null) {
        const resultDiv = document.getElementById("result");
        const div = document.createElement("div");
        div.className = `result ${type}`;
        let content = `<strong>${message}</strong>`;
        if (data) {
          content += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        }
        div.innerHTML = content;
        resultDiv.appendChild(div);
      }

      const runTest = async () => {
        clearResults();

        try {
          addResult("info", "Testing backend health...");

          // Test health endpoint first
          const healthResponse = await fetch(
            "http://localhost:5001/api/health"
          );
          const healthData = await healthResponse.json();

          if (healthResponse.ok) {
            addResult("success", "Backend health check passed", healthData);
          } else {
            addResult("error", "Backend health check failed", healthData);
            return;
          }

          addResult("info", "Testing user registration...");

          // Test registration
          const testEmail = `test${Date.now()}@example.com`;
          const registerResponse = await fetch(
            "http://localhost:5001/api/auth/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: "Test User",
                email: testEmail,
                password: "password123",
              }),
            }
          );

          const registerResult = await registerResponse.json();

          if (registerResponse.ok) {
            addResult("success", "Registration successful!", {
              status: registerResponse.status,
              user: registerResult.user,
              hasToken: !!registerResult.token,
            });

            addResult("info", "Testing login with registered user...");

            // Test login with the registered user
            const loginResponse = await fetch(
              "http://localhost:5001/api/auth/login",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: testEmail,
                  password: "password123",
                }),
              }
            );

            const loginResult = await loginResponse.json();

            if (loginResponse.ok) {
              addResult("success", "Login successful!", {
                status: loginResponse.status,
                user: loginResult.user,
                hasToken: !!loginResult.token,
              });
            } else {
              addResult("error", "Login failed", {
                status: loginResponse.status,
                error: loginResult,
              });
            }
          } else {
            addResult("error", "Registration failed", {
              status: registerResponse.status,
              error: registerResult,
            });
          }

          // Test demo user login
          addResult("info", "Testing demo user login...");
          const demoLoginResponse = await fetch(
            "http://localhost:5001/api/auth/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: "admin@craftfactory.com",
                password: "password",
              }),
            }
          );

          const demoLoginResult = await demoLoginResponse.json();

          if (demoLoginResponse.ok) {
            addResult("success", "Demo user login successful!", {
              user: demoLoginResult.user,
            });
          } else {
            addResult("error", "Demo user login failed", {
              status: demoLoginResponse.status,
              error: demoLoginResult,
            });
          }
        } catch (error) {
          addResult("error", "Network or JavaScript error", {
            message: error.message,
            stack: error.stack,
          });
        }
      };

      // Auto-run test when page loads
      window.onload = () => {
        setTimeout(runTest, 1000);
      };
    </script>
  </body>
</html>

```

# server\package.json

```json
{
  "name": "artgram-backend",
  "version": "0.1.0",
  "private": true,
  "main": "dist/index.js",
  "license": "MIT",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "start": "node dist/index.js",
    "build": "tsc -p .",
    "seed": "ts-node src/scripts/seedUsers.ts",
    "seed-all": "ts-node src/scripts/seedData.ts",
    "seed-sessions": "ts-node src/scripts/seedSessions.ts"
  },
  "dependencies": {
    "@types/express-rate-limit": "^5.1.3",
    "@types/express-validator": "^2.20.33",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-async-handler": "^1.2.0",
    "express-rate-limit": "^8.0.1",
    "express-validator": "^7.2.1",
    "helmet": "^6.0.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/cors": "^2.8.19",
    "@types/express": "^4.17.19",
    "@types/jsonwebtoken": "^9.0.1",
    "@types/morgan": "^1.9.10",
    "@types/node": "^18.0.0",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.1.6"
  }
}

```

# server\README.md

```md
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

```

# server\src\index.ts

```ts
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import branchRoutes from './routes/branches';
import orderRoutes from './routes/orders';
import bookingRoutes from './routes/bookings';
import productRoutes from './routes/products';
import sessionRoutes from './routes/sessions';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - restrict to specific origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-production-domain.com', 'https://craft-factory.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting (relaxed in development to avoid 429 during local polling)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 300 : 2000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', process.env.NODE_ENV === 'production' ? limiter : (req, res, next) => next());

// Auth specific rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Something went wrong!'
      : err.message
  });
});

app.get('/api/health', (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sessions', sessionRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

```

# server\src\middleware\auth.ts

```ts
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { verify } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request { user?: any }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  
  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = verify(token);
    const user = await User.findById(decoded.id).populate('branchId').select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Token is valid but user no longer exists' 
      });
    }
    
    req.user = user;
    next();
  } catch (error: any) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ 
      error: 'Invalid token',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Alternative auth function for compatibility
export const auth = protect;

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      error: 'Access denied. Admin privileges required.' 
    });
  }
};

export const adminOrBranchManager = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'branch_manager')) {
    next();
  } else {
    res.status(403).json({ 
      error: 'Access denied. Admin or branch manager privileges required.' 
    });
  }
};

export const branchOwnerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { branchId } = req.params;
  
  if (req.user && req.user.role === 'admin') {
    // Admin can access any branch
    next();
  } else if (req.user && req.user.role === 'branch_manager' && req.user.branchId?.toString() === branchId) {
    // Branch manager can only access their own branch
    next();
  } else {
    res.status(403).json({ 
      error: 'Access denied. You can only access your own branch data.' 
    });
  }
};

```

# server\src\middleware\validation.ts

```ts
import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

// Generic validation middleware
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  };
};

// User validation rules
export const userValidationRules = () => {
  return [
    body('name')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .trim()
      .escape(),
    body('email')
      .isEmail()
      .withMessage('Must be a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('phone')
      .optional()
      .isMobilePhone('any')
      .withMessage('Must be a valid phone number'),
    body('role')
      .optional()
      .isIn(['admin', 'branch_manager', 'customer'])
      .withMessage('Role must be admin, branch_manager, or customer')
  ];
};

// Product validation rules
export const productValidationRules = () => {
  return [
    body('name')
      .isLength({ min: 2, max: 100 })
      .withMessage('Product name must be between 2 and 100 characters')
      .trim()
      .escape(),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters')
      .trim()
      .escape(),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
    body('category')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Category must not exceed 50 characters')
      .trim()
      .escape(),
    body('weight')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Weight must be a positive number'),
    body('sku')
      .optional()
      .isAlphanumeric()
      .withMessage('SKU must contain only letters and numbers')
  ];
};

// Booking validation rules
export const bookingValidationRules = () => {
  return [
    body('customerName')
      .isLength({ min: 2, max: 50 })
      .withMessage('Customer name must be between 2 and 50 characters')
      .trim()
      .escape(),
    body('customerEmail')
      .isEmail()
      .withMessage('Must be a valid email')
      .normalizeEmail(),
    body('customerPhone')
      .optional()
      .isMobilePhone('any')
      .withMessage('Must be a valid phone number'),
    body('seats')
      .isInt({ min: 1, max: 10 })
      .withMessage('Seats must be between 1 and 10'),
    body('date')
      .isISO8601()
      .withMessage('Date must be in valid ISO format')
      .custom((value) => {
        const bookingDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (bookingDate < today) {
          throw new Error('Booking date cannot be in the past');
        }
        return true;
      }),
    body('time')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Time must be in HH:MM format'),
    body('specialRequests')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Special requests must not exceed 200 characters')
      .trim()
      .escape()
  ];
};

// Session validation rules
export const sessionValidationRules = () => {
  return [
    body('date')
      .isISO8601()
      .withMessage('Date must be in valid ISO format')
      .custom((value) => {
        const sessionDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (sessionDate < today) {
          throw new Error('Session date cannot be in the past');
        }
        return true;
      }),
    body('activity')
      .isIn(['slime', 'tufting'])
      .withMessage('Activity must be either slime or tufting'),
    body('time')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Time must be in HH:MM format'),
    body('totalSeats')
      .isInt({ min: 1, max: 50 })
      .withMessage('Total seats must be between 1 and 50'),
    body('type')
      .isLength({ min: 2, max: 50 })
      .withMessage('Type must be between 2 and 50 characters')
      .trim()
      .escape(),
    body('ageGroup')
      .isLength({ min: 1, max: 10 })
      .withMessage('Age group must be between 1 and 10 characters')
      .trim()
      .escape(),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number')
  ];
};

// Login validation rules
export const loginValidationRules = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Must be a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 1 })
      .withMessage('Password is required')
  ];
};

```

# server\src\models\Booking.ts

```ts
import mongoose from 'mongoose';

export interface IBooking extends mongoose.Document {
  // Legacy fields (keep for backward compatibility)
  eventId?: string;
  sessionDate?: string;
  
  // New session-based fields
  sessionId?: mongoose.Types.ObjectId; // Reference to Session model
  activity?: 'slime' | 'tufting'; // slime or tufting
  
  // Branch and customer info
  branchId?: mongoose.Types.ObjectId; // Changed to ObjectId
  customerId?: mongoose.Types.ObjectId; // Changed to ObjectId
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  
  // Booking details
  date?: string; // YYYY-MM-DD
  time?: string; // HH:MM
  seats?: number; // Number of seats booked
  totalAmount?: number;
  
  // Payment info
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentIntentId?: string;
  
  // QR and verification
  qrCode?: string;
  qrCodeData?: string;
  isVerified?: boolean;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId; // Manager who verified - changed to ObjectId
  
  // Additional info
  packageType?: string; // 'base', 'premium', etc.
  specialRequests?: string;
  status?: 'active' | 'cancelled' | 'completed';
}

const BookingSchema = new mongoose.Schema<IBooking>({
  // Legacy fields
  eventId: String,
  sessionDate: String,
  
  // New session-based fields
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  activity: { type: String, enum: ['slime', 'tufting'] },
  
  // Branch and customer info
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: String,
  
  // Booking details
  date: String, // YYYY-MM-DD
  time: String, // HH:MM
  seats: { type: Number, default: 1, min: 1 },
  totalAmount: { type: Number, min: 0 },
  
  // Payment info
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentIntentId: String,
  
  // QR and verification
  qrCode: { type: String, unique: true, sparse: true }, // Ensure unique QR codes
  qrCodeData: String,
  isVerified: { type: Boolean, default: false },
  verifiedAt: Date,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Additional info
  packageType: String,
  specialRequests: String,
  status: { 
    type: String, 
    enum: ['active', 'cancelled', 'completed'], 
    default: 'active' 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
BookingSchema.index({ customerId: 1, status: 1 });
BookingSchema.index({ branchId: 1, date: 1 });
BookingSchema.index({ sessionId: 1 });
BookingSchema.index({ qrCode: 1 });
BookingSchema.index({ paymentStatus: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);

```

# server\src\models\Branch.ts

```ts
import mongoose from 'mongoose';

export interface IBranch extends mongoose.Document {
  name: string;
  location?: string;
  managerId?: string;
  razorpayKey?: string;
}

const BranchSchema = new mongoose.Schema<IBranch>({
  name: { type: String, required: true },
  location: String,
  managerId: String,
  razorpayKey: String
}, { timestamps: true });

export default mongoose.model<IBranch>('Branch', BranchSchema);

```

# server\src\models\Order.ts

```ts
import mongoose from 'mongoose';

export interface ITrackingUpdate {
  status: string;
  location?: string;
  description?: string;
  createdAt?: Date;
}

export interface IOrderProduct {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder extends mongoose.Document {
  products: IOrderProduct[];
  totalAmount: number;
  branchId?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: IShippingAddress;
  trackingUpdates: ITrackingUpdate[];
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'payment_confirmed' | 'processing' | 'packed' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentIntentId?: string;
  trackingNumber?: string;
}

const TrackingSchema = new mongoose.Schema<ITrackingUpdate>({
  status: { type: String, required: true },
  location: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

const OrderProductSchema = new mongoose.Schema<IOrderProduct>({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  name: { type: String, required: true }
});

const ShippingAddressSchema = new mongoose.Schema<IShippingAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true }
});

const OrderSchema = new mongoose.Schema<IOrder>({
  products: { type: [OrderProductSchema], default: [] },
  totalAmount: { type: Number, required: true, min: 0 },
  branchId: String,
  customerId: String,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  shippingAddress: ShippingAddressSchema,
  trackingUpdates: { type: [TrackingSchema], default: [] },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'payment_confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  paymentIntentId: String,
  trackingNumber: String
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);

```

# server\src\models\Product.ts

```ts
import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
  sku?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
  sku: { type: String, unique: true, sparse: true },
  weight: { type: Number, min: 0 },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  tags: [{ type: String }]
}, { timestamps: true });

// Index for efficient queries
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ category: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);

```

# server\src\models\Session.ts

```ts
import mongoose from 'mongoose';

export interface ISession extends mongoose.Document {
  branchId: mongoose.Types.ObjectId; // Changed to ObjectId
  date: string; // YYYY-MM-DD format
  activity: 'slime' | 'tufting';
  time: string; // HH:MM format
  label?: string; // Display label like "10:00 AM"
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  type: string; // e.g., "Slime Play", "Slime Making", "Small Tufting", etc.
  ageGroup: string; // e.g., "3+", "8+", "All", "15+"
  price?: number; // Base price (can be overridden by packages)
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId; // Admin/Manager who created this session - changed to ObjectId
  notes?: string; // Additional notes for the session
}

const SessionSchema = new mongoose.Schema<ISession>({
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  activity: { type: String, required: true, enum: ['slime', 'tufting'] },
  time: { type: String, required: true }, // HH:MM
  label: { type: String }, // "10:00 AM"
  totalSeats: { type: Number, required: true, min: 1 },
  bookedSeats: { type: Number, default: 0, min: 0 },
  availableSeats: { type: Number, required: true, min: 0 },
  type: { type: String, required: true }, // "Slime Play", "Tufting Small", etc.
  ageGroup: { type: String, required: true }, // "3+", "8+", "All", "15+"
  price: { type: Number, min: 0 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculated available seats
SessionSchema.virtual('calculatedAvailableSeats').get(function() {
  return Math.max(0, this.totalSeats - this.bookedSeats);
});

// Update availableSeats before save
SessionSchema.pre('save', function() {
  this.availableSeats = Math.max(0, this.totalSeats - this.bookedSeats);
});

// Indexes for efficient queries
SessionSchema.index({ branchId: 1, date: 1, activity: 1 });
SessionSchema.index({ branchId: 1, date: 1, time: 1 });
SessionSchema.index({ date: 1, isActive: 1 });

export default mongoose.model<ISession>('Session', SessionSchema);

```

# server\src\models\User.ts

```ts
import mongoose from 'mongoose';

export type Role = 'admin' | 'branch_manager' | 'customer';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  branchId?: mongoose.Types.ObjectId; // Changed to ObjectId
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 }, // Added password minimum length
  role: { type: String, enum: ['admin','branch_manager','customer'], default: 'customer' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);

```

# server\src\README.md

```md
Local server sources for Artgram backend

Files:
- src/index.ts: express app bootstrap
- src/models: Mongoose models (User, Branch, Order, Booking)
- src/routes: API endpoints
- src/middleware/auth.ts: JWT protect middleware

Use `npm run dev` to start in development (ts-node-dev).

```

# server\src\routes\auth.ts

```ts
import express from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { protect } from '../middleware/auth';
import { sign, verify } from '../utils/jwt';
import { userValidationRules, loginValidationRules, validate } from '../middleware/validation';

const router = express.Router();

router.post('/register', userValidationRules(), validate(userValidationRules()), asyncHandler(async (req, res) => {
  console.log('🔵 Registration request received:', { email: req.body.email, role: req.body.role });
  const { name, email, password, role, branchId, phone, address } = req.body;
  
  console.log('🔍 Checking if user exists:', email);
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('❌ Email already exists');
    return res.status(400).json({ message: 'Email already registered' });
  }
  
  console.log('🔐 Hashing password...');
  const hashed = await bcrypt.hash(password, 12); // Increased salt rounds
  
  console.log('💾 Creating user...');
  const user = await User.create({ 
    name, 
    email, 
    password: hashed, 
    role: role || 'customer', 
    branchId, 
    phone, 
    address 
  });
  
  console.log('🔑 Generating token...');
  const tokenPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role
  };
  const token = sign(tokenPayload);
  
  console.log('✅ Registration successful for:', email);
  res.status(201).json({ 
    token, 
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      branchId: user.branchId,
      phone: user.phone,
      address: user.address,
      createdAt: user.createdAt
    } 
  });
}));

router.post('/login', loginValidationRules(), validate(loginValidationRules()), asyncHandler(async (req, res) => {
  console.log('🔵 Login request received:', { email: req.body.email });
  const { email, password } = req.body;
  
  console.log('🔍 Looking for user:', email);
  const user = await User.findOne({ email }).populate('branchId');
  if (!user) {
    console.log('❌ User not found:', email);
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  
  console.log('🔐 Comparing password...');
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log('❌ Password mismatch for:', email);
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  
  console.log('🔑 Generating token...');
  const tokenPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role
  };
  const token = sign(tokenPayload);
  
  console.log('✅ Login successful for:', email);
  res.json({ 
    token, 
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      branchId: user.branchId, 
      phone: user.phone, 
      address: user.address,
      createdAt: user.createdAt
    } 
  });
}));

// Verify token endpoint
router.post('/verify', asyncHandler(async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = verify(token);
    const user = await User.findById(decoded.id).populate('branchId').select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({ 
      valid: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error: any) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      valid: false, 
      error: 'Invalid token' 
    });
  }
}));

router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  const { name, phone, address } = req.body;
  
  // Validate input
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (address) user.address = address;
  
  await user.save();
  
  res.json({ 
    id: user._id, 
    name: user.name, 
    email: user.email, 
    role: user.role, 
    branchId: user.branchId, 
    phone: user.phone, 
    address: user.address,
    createdAt: user.createdAt
  });
}));

export default router;

```

# server\src\routes\bookings.ts

```ts
import express from 'express';
import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking';
import Session from '../models/Session';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, asyncHandler(async (req, res) => {
  const user = req.user;
  const { branchId } = req.query as { branchId?: string };

  // Admin can see all, optional branch filter
  if (user.role === 'admin') {
    const filter = branchId ? { branchId } : {};
    const bookings = await Booking.find(filter).populate('sessionId').lean();
    return res.json(bookings);
  }

  // Managers can see bookings for their own branch (or provided branchId if same)
  if (user.role === 'manager' || user.role === 'branch_manager') {
    const managerBranchId = (user as any).branchId || branchId;
    if (!managerBranchId) {
      return res.status(400).json({ message: 'Branch ID required for manager' });
    }
    const bookings = await Booking.find({ branchId: managerBranchId }).populate('sessionId').lean();
    return res.json(bookings);
  }

  // Customers only see their own bookings
  const bookings = await Booking.find({ customerId: user._id }).populate('sessionId').lean();
  res.json(bookings);
}));

router.post('/', protect, asyncHandler(async (req, res) => {
  const {
    sessionId,
    seats = 1,
    packageType,
    specialRequests,
    // Legacy support
    eventId,
    sessionDate,
    branchId,
    qrCodeData
  } = req.body;

  let bookingData: any = {
    customerId: req.user._id,
    customerName: req.user.name,
    customerEmail: req.user.email,
    customerPhone: req.user.phone,
    seats,
    packageType,
    specialRequests,
    qrCode: `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    paymentStatus: 'completed' // Assuming payment is handled before booking creation
  };

  if (sessionId) {
    // New session-based booking
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (!session.isActive) {
      return res.status(400).json({ message: 'Session is not active' });
    }

    if (session.availableSeats < seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Update session seat count
    session.bookedSeats += seats;
    session.availableSeats = session.totalSeats - session.bookedSeats;
    await session.save();

    bookingData = {
      ...bookingData,
      sessionId,
      activity: session.activity,
      branchId: session.branchId,
      date: session.date,
      time: session.time
    };
  } else {
    // Legacy booking support
    bookingData = {
      ...bookingData,
      eventId,
      sessionDate,
      branchId,
      qrCodeData
    };
  }

  const booking = await Booking.create(bookingData);
  const populatedBooking = await Booking.findById(booking._id).populate('sessionId');

  res.status(201).json(populatedBooking);
}));

// Cancel booking
router.patch('/:id/cancel', protect, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  // Check ownership (users can only cancel their own bookings, admins can cancel any)
  if (req.user.role !== 'admin' && booking.customerId !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to cancel this booking' });
  }

  if (booking.status === 'cancelled') {
    return res.status(400).json({ message: 'Booking is already cancelled' });
  }

  // Update booking status
  booking.status = 'cancelled';
  await booking.save();

  // If booking has sessionId, update session seat count
  if (booking.sessionId) {
    const session = await Session.findById(booking.sessionId);
    if (session) {
      session.bookedSeats = Math.max(0, session.bookedSeats - (booking.seats || 1));
      session.availableSeats = session.totalSeats - session.bookedSeats;
      await session.save();
    }
  }

  res.json({ message: 'Booking cancelled successfully', booking });
}));

// Verify QR code (for managers)
router.post('/verify-qr', protect, asyncHandler(async (req, res) => {
  const { qrCode } = req.body;

  const booking = await Booking.findOne({ qrCode }).populate('sessionId');
  if (!booking) {
    return res.status(404).json({ message: 'Invalid QR code' });
  }

  if (booking.isVerified) {
    return res.status(400).json({ message: 'Booking already verified', booking });
  }

  booking.isVerified = true;
  booking.verifiedAt = new Date();
  booking.verifiedBy = req.user._id;
  await booking.save();

  res.json({ message: 'Booking verified successfully', booking });
}));

// Get booking by QR code
router.get('/qr/:qrCode', protect, asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ qrCode: req.params.qrCode }).populate('sessionId');
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  res.json(booking);
}));

export default router;

```

# server\src\routes\branches.ts

```ts
import express from 'express';
import asyncHandler from 'express-async-handler';
import Branch from '../models/Branch';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const branches = await Branch.find().lean();
  res.json(branches);
}));

router.post('/', asyncHandler(async (req, res) => {
  const { name, location, managerId, razorpayKey } = req.body;
  const b = await Branch.create({ name, location, managerId, razorpayKey });
  res.json(b);
}));

export default router;

```

# server\src\routes\orders.ts

```ts
import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order';
import Booking from '../models/Booking';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, asyncHandler(async (req, res) => {
  const user = req.user;
  const { branchId } = req.query;
  
  if (user.role === 'admin') {
    const filter = branchId ? { branchId } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    res.json(orders);
    return;
  }
  
  if (user.role === 'manager' || user.role === 'branch_manager') {
    // Manager can only see orders from their branch
    const managerBranchId = user.branchId || branchId;
    if (!managerBranchId) {
      res.status(400).json({ message: 'Branch ID required for manager' });
      return;
    }
    const orders = await Order.find({ branchId: managerBranchId }).sort({ createdAt: -1 }).lean();
    res.json(orders);
    return;
  }
  
  // Customer can only see their own orders
  const orders = await Order.find({ customerId: user._id }).sort({ createdAt: -1 }).lean();
  res.json(orders);
}));

router.post('/', protect, asyncHandler(async (req, res) => {
  const { items, amount, branchId, shippingAddress } = req.body;
  const order = await Order.create({ 
    products: items, 
    totalAmount: amount, 
    branchId, 
    customerId: req.user._id, 
    customerName: req.user.name, 
    customerEmail: req.user.email, 
    customerPhone: req.user.phone, 
    shippingAddress, 
    trackingUpdates: [] 
  });
  res.json(order);
}));

// Update order status (Manager/Admin only)
router.patch('/:id/status', protect, asyncHandler(async (req, res) => {
  const { status } = req.body;
  const user = req.user;
  
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }
  
  // Check permissions
  if (user.role === 'manager' || user.role === 'branch_manager') {
    const managerBranchId = user.branchId;
    if (order.branchId !== managerBranchId) {
      res.status(403).json({ message: 'Not authorized to update this order' });
      return;
    }
  } else if (user.role !== 'admin') {
    res.status(403).json({ message: 'Not authorized to update order status' });
    return;
  }
  
  const validStatuses = ['pending', 'payment_confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ message: 'Invalid status' });
    return;
  }
  
  order.orderStatus = status;
  
  // Add tracking update
  order.trackingUpdates.push({
    status: status,
    location: user.branchId || 'Branch Location',
    description: `Order status updated to ${status}`,
    createdAt: new Date()
  });
  
  await order.save();
  res.json(order);
}));

router.post('/:id/tracking', protect, asyncHandler(async (req, res) => {
  const { status, location, description } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.trackingUpdates.push({ status, location, description, createdAt: new Date() });
  await order.save();
  res.json(order);
}));

// QR Code verification endpoint for bookings
router.post('/verify-qr', protect, asyncHandler(async (req, res) => {
  const { qrCode } = req.body;
  const user = req.user;
  
  if (!qrCode) {
    res.status(400).json({ message: 'QR code is required' });
    return;
  }
  
  // Only managers and admins can verify QR codes
  if (user.role !== 'admin' && user.role !== 'manager' && user.role !== 'branch_manager') {
    res.status(403).json({ message: 'Not authorized to verify QR codes' });
    return;
  }
  
  const booking = await Booking.findOne({ qrCode: qrCode.trim() });
  if (!booking) {
    res.status(404).json({ message: 'Invalid QR code or booking not found' });
    return;
  }
  
  // Check if manager is verifying for their branch
  if ((user.role === 'manager' || user.role === 'branch_manager') && user.branchId) {
    if (booking.branchId !== user.branchId) {
      res.status(403).json({ message: 'Cannot verify booking for different branch' });
      return;
    }
  }
  
  if (booking.isVerified) {
    res.status(400).json({ 
      message: 'Booking already verified',
      verifiedAt: booking.verifiedAt,
      verifiedBy: booking.verifiedBy
    });
    return;
  }
  
  // Update booking verification
  booking.isVerified = true;
  booking.verifiedAt = new Date();
  booking.verifiedBy = user._id;
  
  await booking.save();
  
  res.json({
    message: 'Booking verified successfully',
    booking: {
      id: booking._id,
      customerName: booking.customerName,
      activity: booking.activity,
      date: booking.date,
      time: booking.time,
      seats: booking.seats,
      verifiedAt: booking.verifiedAt,
      verifiedBy: booking.verifiedBy
    }
  });
}));

export default router;

```

# server\src\routes\products.ts

```ts
import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/Product';

const router = express.Router();

// Get all products
router.get('/', asyncHandler(async (req, res) => {
  const { category, isActive = 'true' } = req.query;
  const filter: any = { isActive: isActive === 'true' };
  if (category) {
    filter.category = category;
  }
  const products = await Product.find(filter).lean();
  res.json(products);
}));

// Get product by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
}));

// Create new product
router.post('/', asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    category,
    imageUrl,
    isActive,
    sku,
    weight,
    dimensions,
    tags
  } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    category,
    imageUrl,
    isActive,
    sku,
    weight,
    dimensions,
    tags
  });

  res.status(201).json(product);
}));

// Update product
router.put('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
}));

// Delete product
router.delete('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json({ message: 'Product deleted successfully' });
}));



export default router;

```

# server\src\routes\sessions.ts

```ts
import express from 'express';
import asyncHandler from 'express-async-handler';
import Session from '../models/Session';
import mongoose from 'mongoose';
import Booking from '../models/Booking';
import { protect, adminOrBranchManager } from '../middleware/auth';

const router = express.Router();

// Get sessions for a specific branch and date range
router.get('/', asyncHandler(async (req, res) => {
  const { branchId, startDate, endDate, activity } = req.query;

  const filter: any = {};
  if (branchId) {
    try {
      filter.branchId = new mongoose.Types.ObjectId(String(branchId));
    } catch {
      filter.branchId = branchId; // fallback
    }
  }
  if (startDate && endDate) {
    filter.date = { $gte: startDate, $lte: endDate };
  } else if (startDate) {
    filter.date = { $gte: startDate };
  }
  if (activity) filter.activity = activity;

  const sessions = await Session.find(filter).sort({ date: 1, time: 1 });
  res.json(sessions);
}));

// Get sessions for next 10 days for a branch (ensures they exist)
router.get('/next-10-days/:branchId', asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const { activity } = req.query;

  // Generate next 10 days
  const dates = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  // Check which dates already have sessions
  const branchFilter = (() => {
    try { return new mongoose.Types.ObjectId(String(branchId)); } catch { return branchId; }
  })();
  const existingSessions = await Session.find({
    branchId: branchFilter,
    date: { $in: dates },
    ...(activity && { activity })
  });

  const existingDates = new Set(existingSessions.map(s => s.date));
  const missingDates = dates.filter(date => !existingDates.has(date));

  // Create default sessions for missing dates
  const defaultSessions = [];
  for (const date of missingDates) {
    // Skip Mondays for certain branches (this should come from branch settings)
    const dayOfWeek = new Date(date).getDay();
    const isMonday = dayOfWeek === 1;

    // Create default slime sessions
    if (!activity || activity === 'slime') {
      defaultSessions.push(
        {
          branchId,
          date,
          activity: 'slime',
          time: '10:00',
          label: '10:00 AM',
          totalSeats: 15,
          bookedSeats: 0,
          availableSeats: 15,
          type: 'Slime Play & Demo',
          ageGroup: '3+',
          isActive: !isMonday, // Disable Mondays for some branches
          createdBy: 'system'
        },
        {
          branchId,
          date,
          activity: 'slime',
          time: '11:30',
          label: '11:30 AM',
          totalSeats: 15,
          bookedSeats: 0,
          availableSeats: 15,
          type: 'Slime Play & Making',
          ageGroup: '8+',
          isActive: !isMonday,
          createdBy: 'system'
        },
        {
          branchId,
          date,
          activity: 'slime',
          time: '16:00',
          label: '4:00 PM',
          totalSeats: 15,
          bookedSeats: 0,
          availableSeats: 15,
          type: 'Slime Play & Making',
          ageGroup: '8+',
          isActive: !isMonday,
          createdBy: 'system'
        }
      );
    }

    // Create default tufting sessions (only for branches that support it)
    if ((!activity || activity === 'tufting') && branchId !== 'vijayawada') {
      defaultSessions.push(
        {
          branchId,
          date,
          activity: 'tufting',
          time: '12:00',
          label: '12:00 PM',
          totalSeats: 8,
          bookedSeats: 0,
          availableSeats: 8,
          type: 'Small Tufting',
          ageGroup: '15+',
          isActive: !isMonday,
          createdBy: 'system'
        },
        {
          branchId,
          date,
          activity: 'tufting',
          time: '15:00',
          label: '3:00 PM',
          totalSeats: 8,
          bookedSeats: 0,
          availableSeats: 8,
          type: 'Medium Tufting',
          ageGroup: '15+',
          isActive: !isMonday,
          createdBy: 'system'
        }
      );
    }
  }

  // Insert the new sessions
  if (defaultSessions.length > 0) {
    await Session.insertMany(defaultSessions);
  }

  // Return all sessions for the next 10 days
  const allSessions = await Session.find({
    branchId: branchFilter,
    date: { $in: dates },
    ...(activity && { activity })
  }).sort({ date: 1, time: 1 });

  res.json(allSessions);
}));

// Get specific session by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }
  res.json(session);
}));

// Create new session (Admin/Manager only)
router.post('/', protect, adminOrBranchManager, asyncHandler(async (req, res) => {
  const sessionData = {
    ...req.body,
    createdBy: req.user._id,
    availableSeats: req.body.totalSeats - (req.body.bookedSeats || 0)
  };

  const session = await Session.create(sessionData);
  res.status(201).json(session);
}));

// Update session (Admin/Manager only)
router.put('/:id', protect, adminOrBranchManager, asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  // Update fields
  Object.assign(session, req.body);

  // Recalculate available seats
  session.availableSeats = Math.max(0, session.totalSeats - session.bookedSeats);

  await session.save();
  res.json(session);
}));

// Update session seat count (for booking/cancellation)
router.patch('/:id/seats', protect, asyncHandler(async (req, res) => {
  const { seatsChange } = req.body; // positive for booking, negative for cancellation

  const session = await Session.findById(req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  const newBookedSeats = session.bookedSeats + seatsChange;

  // Check if we have enough seats
  if (newBookedSeats > session.totalSeats) {
    return res.status(400).json({ message: 'Not enough seats available' });
  }

  if (newBookedSeats < 0) {
    return res.status(400).json({ message: 'Invalid seat count' });
  }

  session.bookedSeats = newBookedSeats;
  session.availableSeats = session.totalSeats - session.bookedSeats;

  await session.save();
  res.json(session);
}));

// Delete session (Admin/Manager only)
router.delete('/:id', protect, adminOrBranchManager, asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  // Check if there are any bookings for this session
  const bookingsCount = await Booking.countDocuments({ sessionId: session._id, status: 'active' });
  if (bookingsCount > 0) {
    return res.status(400).json({
      message: `Cannot delete session with ${bookingsCount} active bookings. Cancel bookings first.`
    });
  }

  await Session.findByIdAndDelete(req.params.id);
  res.json({ message: 'Session deleted successfully' });
}));

// Bulk update sessions for a date (Admin/Manager only)
router.post('/bulk-update', protect, adminOrBranchManager, asyncHandler(async (req, res) => {
  const { branchId, date, sessions } = req.body;

  // Delete existing sessions for this date and branch
  await Session.deleteMany({ branchId, date });

  // Create new sessions
  const sessionData = sessions.map((s: any) => ({
    ...s,
    branchId,
    date,
    createdBy: req.user._id,
    availableSeats: s.totalSeats - (s.bookedSeats || 0)
  }));

  const createdSessions = await Session.insertMany(sessionData);
  res.json(createdSessions);
}));

export default router;

```

# server\src\scripts\debugData.ts

```ts

```

# server\src\scripts\dropDatabase.ts

```ts

```

# server\src\scripts\seedBookingsAndOrders.ts

```ts

```

# server\src\scripts\seedData.ts

```ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Branch from '../models/Branch';
import Product from '../models/Product';
import Booking from '../models/Booking';
import Order from '../models/Order';
import Session from '../models/Session';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Branch.deleteMany({});
    await Product.deleteMany({});
    await Booking.deleteMany({});
    await Order.deleteMany({});
    await Session.deleteMany({});
    console.log('Cleared existing data');

    // Create branches first
    const branches = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Craft Factory Hyderabad',
        location: 'Hyderabad',
        managerId: null, // Will be set after creating managers
        razorpayKey: 'rzp_test_hyderabad_key'
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Craft Factory Vijayawada',
        location: 'Vijayawada',
        managerId: null, // Will be set after creating managers
        razorpayKey: 'rzp_test_vijayawada_key'
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Craft Factory Bangalore',
        location: 'Bangalore',
        managerId: null, // Will be set after creating managers
        razorpayKey: 'rzp_test_bangalore_key'
      }
    ];

    const savedBranches = await Branch.insertMany(branches);
    console.log('Branches created successfully');

    // Create users (admin, 3 managers, multiple customers)
    const users = [
      // Admin
      {
        name: 'Admin User',
        email: 'admin@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'admin',
        phone: '+91 99999 99999'
      },
      // Branch Managers
      {
        name: 'Rajesh Kumar',
        email: 'hyderabad@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'branch_manager',
        branchId: savedBranches[0]._id.toString(),
        phone: '+91 98765 11111',
        address: {
          street: 'Hi-Tech City Road',
          city: 'Hyderabad',
          state: 'Telangana',
          zipCode: '500081',
          country: 'India'
        }
      },
      {
        name: 'Priya Sharma',
        email: 'vijayawada@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'branch_manager',
        branchId: savedBranches[1]._id.toString(),
        phone: '+91 98765 22222',
        address: {
          street: 'Gandhi Road',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520001',
          country: 'India'
        }
      },
      {
        name: 'Arjun Nair',
        email: 'bangalore@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'branch_manager',
        branchId: savedBranches[2]._id.toString(),
        phone: '+91 98765 33333',
        address: {
          street: 'Koramangala',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560038',
          country: 'India'
        }
      },
      // Customers
      {
        name: 'John Doe',
        email: 'customer@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'customer',
        phone: '+91 98765 43210',
        address: {
          street: '12 MG Road',
          city: 'Hyderabad',
          state: 'Telangana',
          zipCode: '500081',
          country: 'India'
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'customer',
        phone: '+91 98765 43211',
        address: {
          street: '24 Gandhi Road',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520001',
          country: 'India'
        }
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'customer',
        phone: '+91 98765 43212',
        address: {
          street: '36 Indiranagar',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560038',
          country: 'India'
        }
      },
      {
        name: 'Anita Patel',
        email: 'anita@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'customer',
        phone: '+91 98765 43213',
        address: {
          street: '15 Jubilee Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          zipCode: '500033',
          country: 'India'
        }
      },
      {
        name: 'Rohit Gupta',
        email: 'rohit@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'customer',
        phone: '+91 98765 43214',
        address: {
          street: '28 Benz Circle',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          zipCode: '520010',
          country: 'India'
        }
      }
    ];

    const savedUsers = await User.insertMany(users);
    console.log('Users created successfully');

    // Update branches with manager IDs
    await Branch.findByIdAndUpdate(savedBranches[0]._id, { managerId: savedUsers[1]._id.toString() });
    await Branch.findByIdAndUpdate(savedBranches[1]._id, { managerId: savedUsers[2]._id.toString() });
    await Branch.findByIdAndUpdate(savedBranches[2]._id, { managerId: savedUsers[3]._id.toString() });
    console.log('Branch managers assigned successfully');

    // Create global products (no branch restrictions)
    const products = [
      {
        name: 'Complete Slime Making Kit',
        description: 'Everything you need to make amazing slime at home - includes glue, activator, colors, glitter, and mixing tools',
        price: 1200,
        stock: 100,
        category: 'Slime Kits',
        imageUrl: 'https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651195/DSC07659_zj2pcc.jpg',
        isActive: true,
        sku: 'SLIME-KIT-001',
        weight: 0.5,
        dimensions: { length: 20, width: 15, height: 8 },
        tags: ['slime', 'kids', 'craft', 'starter']
      },
      {
        name: 'Professional Art Supply Bundle',
        description: 'Premium art supplies including canvas, acrylic paints, brushes, palette, and easel for serious artists',
        price: 2500,
        stock: 75,
        category: 'Art Supplies',
        imageUrl: 'https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1755025999/IMG-20250807-WA0003_u999yh.jpg',
        isActive: true,
        sku: 'ART-BUNDLE-001',
        weight: 1.2,
        dimensions: { length: 30, width: 25, height: 5 },
        tags: ['art', 'painting', 'professional', 'canvas']
      },
      {
        name: 'Kids Craft Starter Pack',
        description: 'Perfect starter kit for young artists with colored paper, safety scissors, glue sticks, and crayons',
        price: 800,
        stock: 120,
        category: 'Kids Supplies',
        imageUrl: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg',
        isActive: true,
        sku: 'KIDS-CRAFT-001',
        weight: 0.8,
        dimensions: { length: 25, width: 20, height: 6 },
        tags: ['kids', 'craft', 'starter', 'safe']
      },
      {
        name: 'Premium Paint Set',
        description: 'High-quality acrylic paints with brushes, palette knife, and canvas boards for professional results',
        price: 1800,
        stock: 85,
        category: 'Art Supplies',
        imageUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
        isActive: true,
        sku: 'PAINT-SET-001',
        weight: 1.0,
        dimensions: { length: 28, width: 22, height: 4 },
        tags: ['paint', 'acrylic', 'premium', 'brushes']
      },
      {
        name: 'Tufting Starter Kit',
        description: 'Everything needed to start your tufting journey including rug canvas, yarn, and tufting gun',
        price: 3500,
        stock: 45,
        category: 'Tufting Kits',
        imageUrl: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
        isActive: true,
        sku: 'TUFT-START-001',
        weight: 2.0,
        dimensions: { length: 40, width: 30, height: 10 },
        tags: ['tufting', 'rug', 'starter', 'yarn']
      },
      {
        name: 'Glitter Slime Special Kit',
        description: 'Make sparkling glitter slime with this special edition kit including premium glitters and colors',
        price: 1350,
        stock: 90,
        category: 'Slime Kits',
        imageUrl: 'https://images.pexels.com/photos/6941924/pexels-photo-6941924.jpeg',
        isActive: true,
        sku: 'GLITTER-SLIME-001',
        weight: 0.6,
        dimensions: { length: 22, width: 16, height: 9 },
        tags: ['slime', 'glitter', 'special', 'sparkle']
      },
      {
        name: 'Advanced Tufting Pro Set',
        description: 'Professional tufting set with advanced materials and tools for expert-level projects',
        price: 4200,
        stock: 30,
        category: 'Tufting Kits',
        imageUrl: 'https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg',
        isActive: true,
        sku: 'TUFT-PRO-001',
        weight: 2.5,
        dimensions: { length: 45, width: 35, height: 12 },
        tags: ['tufting', 'advanced', 'professional', 'premium']
      },
      {
        name: 'Craft Combo Mega Pack',
        description: 'Ultimate variety pack with slime, art, and craft supplies for endless creative exploration',
        price: 2800,
        stock: 60,
        category: 'Combo Packs',
        imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        isActive: true,
        sku: 'COMBO-MEGA-001',
        weight: 1.8,
        dimensions: { length: 32, width: 26, height: 15 },
        tags: ['combo', 'variety', 'craft', 'mega']
      },
      {
        name: 'Crystal Clear Slime Kit',
        description: 'Create beautiful transparent crystal-clear slime with this premium transparency kit',
        price: 1450,
        stock: 70,
        category: 'Slime Kits',
        imageUrl: 'https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1755026061/HAR05826_hv05wz.jpg',
        isActive: true,
        sku: 'CRYSTAL-SLIME-001',
        weight: 0.7,
        dimensions: { length: 24, width: 18, height: 10 },
        tags: ['slime', 'crystal', 'clear', 'premium']
      },
      {
        name: 'Eco-Friendly Craft Set',
        description: 'Sustainable craft supplies made from recycled materials - perfect for environmentally conscious creators',
        price: 1650,
        stock: 55,
        category: 'Eco Supplies',
        imageUrl: 'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg',
        isActive: true,
        sku: 'ECO-CRAFT-001',
        weight: 1.1,
        dimensions: { length: 26, width: 21, height: 7 },
        tags: ['eco', 'sustainable', 'recycled', 'green']
      }
    ];

    const savedProducts = await Product.insertMany(products);
    console.log('Products created successfully');

    // Create sessions for each branch (use branch _id strings)
    const sessionTemplates = [
      { activity: 'slime', time: '10:00', label: '10:00 AM', totalSeats: 18, bookedSeats: 3, type: 'Slime Play & Demo', ageGroup: '3+' },
      { activity: 'slime', time: '13:00', label: '1:00 PM', totalSeats: 18, bookedSeats: 8, type: 'Slime Play & Making', ageGroup: '8+' },
      { activity: 'tufting', time: '11:00', label: '11:00 AM', totalSeats: 8, bookedSeats: 1, type: 'Small Tufting', ageGroup: '15+' }
    ];

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    const dates = [tomorrow.toISOString().split('T')[0], dayAfter.toISOString().split('T')[0]];
    const sessionsToCreate: any[] = [];

    for (const branch of savedBranches) {
      for (const dt of dates) {
        for (const tmpl of sessionTemplates) {
          sessionsToCreate.push({
            branchId: branch._id, // Using ObjectId directly instead of toString()
            date: dt,
            activity: tmpl.activity,
            time: tmpl.time,
            label: tmpl.label,
            totalSeats: tmpl.totalSeats,
            bookedSeats: tmpl.bookedSeats,
            availableSeats: Math.max(0, tmpl.totalSeats - tmpl.bookedSeats),
            type: tmpl.type,
            ageGroup: tmpl.ageGroup,
            price: tmpl.activity === 'slime' ? 300 : 800,
            isActive: true,
            createdBy: savedUsers[0]._id // Using ObjectId for the admin user
          });
        }
      }
    }

    const savedSessions = await Session.insertMany(sessionsToCreate);
    console.log(`Created ${savedSessions.length} sessions`);

    // Create sample bookings with proper session references
    const bookings: any[] = [];

    // Get some sessions for creating bookings
    const hyderabadSlimeSession = savedSessions.find(s =>
      s.branchId.toString() === savedBranches[0]._id.toString() && s.activity === 'slime'
    );
    const vijayawadaTuftingSession = savedSessions.find(s =>
      s.branchId.toString() === savedBranches[1]._id.toString() && s.activity === 'tufting'
    );
    const bangaloreSlimeSession = savedSessions.find(s =>
      s.branchId.toString() === savedBranches[2]._id.toString() && s.activity === 'slime'
    );

    if (hyderabadSlimeSession) {
      bookings.push({
        sessionId: hyderabadSlimeSession._id,
        activity: hyderabadSlimeSession.activity,
        branchId: hyderabadSlimeSession.branchId,
        customerId: savedUsers[4]._id, // John Doe - using ObjectId
        customerName: 'John Doe',
        customerEmail: 'customer@example.com',
        customerPhone: '+91 98765 43210',
        date: hyderabadSlimeSession.date,
        time: hyderabadSlimeSession.time,
        seats: 2,
        totalAmount: (hyderabadSlimeSession.price || 300) * 2,
        paymentStatus: 'completed',
        packageType: 'base',
        qrCode: `QR-${Date.now()}-1`,
        qrCodeData: `QR-${Date.now()}-1`,
        status: 'active',
        isVerified: false
      });
    }

    if (vijayawadaTuftingSession) {
      bookings.push({
        sessionId: vijayawadaTuftingSession._id,
        activity: vijayawadaTuftingSession.activity,
        branchId: vijayawadaTuftingSession.branchId,
        customerId: savedUsers[5]._id, // Jane Smith - using ObjectId
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '+91 98765 43211',
        date: vijayawadaTuftingSession.date,
        time: vijayawadaTuftingSession.time,
        seats: 1,
        totalAmount: (vijayawadaTuftingSession.price || 800) * 1,
        paymentStatus: 'completed',
        packageType: 'premium',
        qrCode: `QR-${Date.now()}-2`,
        qrCodeData: `QR-${Date.now()}-2`,
        status: 'active',
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: savedUsers[2]._id // Priya Sharma - using ObjectId
      });
    }

    if (bangaloreSlimeSession) {
      bookings.push({
        sessionId: bangaloreSlimeSession._id,
        activity: bangaloreSlimeSession.activity,
        branchId: bangaloreSlimeSession.branchId,
        customerId: savedUsers[6]._id, // Mike Johnson - using ObjectId
        customerName: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        customerPhone: '+91 98765 43212',
        date: bangaloreSlimeSession.date,
        time: bangaloreSlimeSession.time,
        seats: 3,
        totalAmount: (bangaloreSlimeSession.price || 300) * 3,
        paymentStatus: 'pending',
        packageType: 'base',
        qrCode: `QR-${Date.now()}-3`,
        qrCodeData: `QR-${Date.now()}-3`,
        status: 'active',
        isVerified: false,
        specialRequests: 'Birthday party for 8-year-old'
      });
    }

    // Add more bookings for other customers
    const additionalSessions = savedSessions.slice(0, 3);

    if (additionalSessions.length > 0) {
      bookings.push({
        sessionId: additionalSessions[0]._id,
        activity: additionalSessions[0].activity,
        branchId: additionalSessions[0].branchId,
        customerId: savedUsers[7]._id, // Anita Patel - using ObjectId
        customerName: 'Anita Patel',
        customerEmail: 'anita@example.com',
        customerPhone: '+91 98765 43213',
        date: additionalSessions[0].date,
        time: additionalSessions[0].time,
        seats: 1,
        totalAmount: (additionalSessions[0].price || 300) * 1,
        paymentStatus: 'completed',
        packageType: 'base',
        qrCode: `QR-${Date.now()}-4`,
        qrCodeData: `QR-${Date.now()}-4`,
        status: 'completed',
        isVerified: true,
        verifiedAt: new Date(Date.now() - 86400000) // Yesterday
      });
    }

    if (additionalSessions.length > 1) {
      bookings.push({
        sessionId: additionalSessions[1]._id,
        activity: additionalSessions[1].activity,
        branchId: additionalSessions[1].branchId,
        customerId: savedUsers[8]._id, // Rohit Gupta - using ObjectId
        customerName: 'Rohit Gupta',
        customerEmail: 'rohit@example.com',
        customerPhone: '+91 98765 43214',
        date: additionalSessions[1].date,
        time: additionalSessions[1].time,
        seats: 2,
        totalAmount: (additionalSessions[1].price || 300) * 2,
        paymentStatus: 'failed',
        packageType: 'base',
        qrCode: `QR-${Date.now()}-5`,
        qrCodeData: `QR-${Date.now()}-5`,
        status: 'cancelled',
        isVerified: false
      });
    }

    await Booking.insertMany(bookings);
    console.log('Bookings created successfully');

    // Create sample orders (products bought)
    const orders: any[] = [];
    if (savedProducts.length > 0) {
      orders.push({
        products: [
          { productId: savedProducts[0]._id.toString(), quantity: 1, price: savedProducts[0].price, name: savedProducts[0].name }
        ],
        totalAmount: savedProducts[0].price,
        branchId: savedBranches[0]._id.toString(),
        customerId: savedUsers[4]._id.toString(),
        customerName: 'John Doe',
        customerEmail: 'customer@example.com',
        customerPhone: '+91 98765 43210',
        shippingAddress: {
          street: '12 MG Road',
          city: 'Hyderabad',
          state: 'Telangana',
          zipCode: '500081',
          country: 'India'
        },
        paymentStatus: 'completed',
        orderStatus: 'delivered',
        trackingNumber: `TRK-${Date.now()}`,
        trackingUpdates: [
          {
            status: 'Order Placed',
            description: 'Your order has been placed successfully',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
          },
          {
            status: 'Processing',
            description: 'Your order is being processed',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          },
          {
            status: 'Shipped',
            location: 'Hyderabad Warehouse',
            description: 'Your order has been shipped',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
          },
          {
            status: 'Delivered',
            location: 'Hyderabad',
            description: 'Your order has been delivered successfully',
            createdAt: new Date()
          }
        ]
      });

      // Multi-product order for another customer
      if (savedProducts.length > 2) {
        orders.push({
          products: [
            { productId: savedProducts[2]._id.toString(), quantity: 1, price: savedProducts[2].price, name: savedProducts[2].name },
            { productId: savedProducts[3]._id.toString(), quantity: 2, price: savedProducts[3].price, name: savedProducts[3].name }
          ],
          totalAmount: (savedProducts[2].price || 0) + 2 * (savedProducts[3].price || 0),
          branchId: savedBranches[1]._id.toString(),
          customerId: savedUsers[5]._id.toString(),
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          customerPhone: '+91 98765 43211',
          shippingAddress: {
            street: '24 Gandhi Road',
            city: 'Vijayawada',
            state: 'Andhra Pradesh',
            zipCode: '520001',
            country: 'India'
          },
          paymentStatus: 'completed',
          orderStatus: 'shipped',
          trackingNumber: `TRK-${Date.now()}-2`,
          trackingUpdates: [
            {
              status: 'Order Placed',
              description: 'Your order has been placed successfully',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
            },
            {
              status: 'Processing',
              description: 'Your order is being processed',
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
            },
            {
              status: 'Shipped',
              location: 'Vijayawada Warehouse',
              description: 'Your order has been shipped',
              createdAt: new Date()
            }
          ]
        });
      }

      // Add a pending order
      if (savedProducts.length > 4) {
        orders.push({
          products: [
            { productId: savedProducts[4]._id.toString(), quantity: 3, price: savedProducts[4].price, name: savedProducts[4].name }
          ],
          totalAmount: savedProducts[4].price * 3,
          branchId: savedBranches[2]._id.toString(),
          customerId: savedUsers[6]._id.toString(),
          customerName: 'Mike Johnson',
          customerEmail: 'mike@example.com',
          customerPhone: '+91 98765 43212',
          shippingAddress: {
            street: '36 Indiranagar',
            city: 'Bangalore',
            state: 'Karnataka',
            zipCode: '560038',
            country: 'India'
          },
          paymentStatus: 'pending',
          orderStatus: 'pending',
          trackingUpdates: [
            {
              status: 'Order Placed',
              description: 'Your order has been placed and is awaiting payment',
              createdAt: new Date()
            }
          ]
        });
      }
    }

    if (orders.length > 0) {
      await Order.insertMany(orders);
      console.log('Orders created successfully');
    }

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`✅ Created ${savedBranches.length} branches`);
    console.log(`✅ Created ${savedUsers.length} users`);
    console.log(`✅ Created ${savedProducts.length} products`);
    console.log(`✅ Created ${savedSessions.length} sessions`);
    console.log(`✅ Created ${bookings.length} bookings`);
    console.log(`✅ Created ${orders.length} orders`);
    console.log('\n=== BRANCH DETAILS ===');
    savedBranches.forEach(branch => {
      // Products are global in current schema (no branchId field on Product)
      console.log(`📍 ${branch.name} (${branch.location}): ${savedProducts.length} products available`);
    });
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Admin: admin@craftfactory.com / password');
    console.log('Hyderabad Manager: hyderabad@craftfactory.com / password');
    console.log('Vijayawada Manager: vijayawada@craftfactory.com / password');
    console.log('Bangalore Manager: bangalore@craftfactory.com / password');
    console.log('Customer: customer@example.com / password');
    console.log('Jane: jane@example.com / password');
    console.log('Mike: mike@example.com / password');
    console.log('Anita: anita@example.com / password');
    console.log('Rohit: rohit@example.com / password');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

```

# server\src\scripts\seedSessions.ts

```ts
import mongoose from 'mongoose';
import Session from '../models/Session';
import Branch from '../models/Branch';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

// Template sessions (branchId will be replaced with actual ObjectIds)
const sessions = [
  // Hyderabad Branch - Slime Sessions
  {
    branchKey: 'hyderabad',
    date: '2025-08-27',
    activity: 'slime',
    time: '10:00',
    label: '10:00 AM',
    totalSeats: 15,
    bookedSeats: 3,
    availableSeats: 12,
    type: 'Slime Play & Demo',
    ageGroup: '3+',
    isActive: true,
    createdBy: 'system'
  },
  {
    branchKey: 'hyderabad',
    date: '2025-08-27',
    activity: 'slime',
    time: '11:30',
    label: '11:30 AM',
    totalSeats: 15,
    bookedSeats: 7,
    availableSeats: 8,
    type: 'Slime Play & Making',
    ageGroup: '8+',
    isActive: true,
    createdBy: 'system'
  },
  {
    branchKey: 'hyderabad',
    date: '2025-08-27',
    activity: 'slime',
    time: '16:00',
    label: '4:00 PM',
    totalSeats: 15,
    bookedSeats: 12,
    availableSeats: 3,
    type: 'Slime Play & Making',
    ageGroup: '8+',
    isActive: true,
    createdBy: 'system'
  },

  // Hyderabad Branch - Tufting Sessions
  {
    branchKey: 'hyderabad',
    date: '2025-08-27',
    activity: 'tufting',
    time: '12:00',
    label: '12:00 PM',
    totalSeats: 8,
    bookedSeats: 3,
    availableSeats: 5,
    type: 'Small Tufting',
    ageGroup: '15+',
    isActive: true,
    createdBy: 'system'
  },
  {
    branchKey: 'hyderabad',
    date: '2025-08-27',
    activity: 'tufting',
    time: '15:00',
    label: '3:00 PM',
    totalSeats: 8,
    bookedSeats: 6,
    availableSeats: 2,
    type: 'Medium Tufting',
    ageGroup: '15+',
    isActive: true,
    createdBy: 'system'
  },

  // Vijayawada Branch - Slime Sessions only (no tufting)
  {
    branchKey: 'vijayawada',
    date: '2025-08-27',
    activity: 'slime',
    time: '10:00',
    label: '10:00 AM',
    totalSeats: 12,
    bookedSeats: 2,
    availableSeats: 10,
    type: 'Slime Play & Demo',
    ageGroup: '3+',
    isActive: true,
    createdBy: 'system'
  },
  {
    branchKey: 'vijayawada',
    date: '2025-08-27',
    activity: 'slime',
    time: '14:00',
    label: '2:00 PM',
    totalSeats: 12,
    bookedSeats: 8,
    availableSeats: 4,
    type: 'Slime Play & Making',
    ageGroup: '8+',
    isActive: true,
    createdBy: 'system'
  },

  // Bangalore Branch - Both activities
  {
    branchKey: 'bangalore',
    date: '2025-08-27',
    activity: 'slime',
    time: '10:00',
    label: '10:00 AM',
    totalSeats: 18,
    bookedSeats: 5,
    availableSeats: 13,
    type: 'Slime Play & Demo',
    ageGroup: '3+',
    isActive: true,
    createdBy: 'system'
  },
  {
    branchKey: 'bangalore',
    date: '2025-08-27',
    activity: 'slime',
    time: '13:00',
    label: '1:00 PM',
    totalSeats: 18,
    bookedSeats: 14,
    availableSeats: 4,
    type: 'Slime Play & Demo',
    ageGroup: '3+',
    isActive: true,
    createdBy: 'system'
  },
  {
    branchKey: 'bangalore',
    date: '2025-08-27',
    activity: 'tufting',
    time: '11:00',
    label: '11:00 AM',
    totalSeats: 6,
    bookedSeats: 1,
    availableSeats: 5,
    type: 'Small Tufting',
    ageGroup: '15+',
    isActive: true,
    createdBy: 'system'
  },
  {
    branchKey: 'bangalore',
    date: '2025-08-27',
    activity: 'tufting',
    time: '14:30',
    label: '2:30 PM',
    totalSeats: 6,
    bookedSeats: 4,
    availableSeats: 2,
    type: 'Medium Tufting',
    ageGroup: '15+',
    isActive: true,
    createdBy: 'system'
  }
];

const seedSessions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to MongoDB');

    // Clear existing sessions
    await Session.deleteMany({});
    console.log('Cleared existing sessions');

    // Load branches and admin for references
    const branches = await Branch.find().lean();
    if (!branches.length) {
      throw new Error('No branches found. Run seedData.ts first to create branches.');
    }
    const nameToBranchId: Record<string, mongoose.Types.ObjectId> = {};
    for (const b of branches) {
      const key = (b.location || b.name || '').toLowerCase();
      if (key.includes('hyderabad')) nameToBranchId['hyderabad'] = b._id as unknown as mongoose.Types.ObjectId;
      if (key.includes('vijayawada')) nameToBranchId['vijayawada'] = b._id as unknown as mongoose.Types.ObjectId;
      if (key.includes('bangalore')) nameToBranchId['bangalore'] = b._id as unknown as mongoose.Types.ObjectId;
    }
    const admin = await User.findOne({ role: 'admin' }).lean();

    // Create today and next few days sessions
    const today = new Date();
    const sessionPromises = [];

    for (let dayOffset = 0; dayOffset < 10; dayOffset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      const dateStr = date.toISOString().split('T')[0];

      // Skip Mondays for most branches (except Vijayawada)
      const isMonday = date.getDay() === 1;

      for (const session of sessions) {
        // Skip Monday sessions for certain branches
        if (isMonday && session.branchKey !== 'vijayawada') {
          continue;
        }

        const sessionData: any = {
          ...session,
          date: dateStr,
          // Reset seat counts for future dates
          bookedSeats: dayOffset === 0 ? session.bookedSeats : Math.floor(Math.random() * session.totalSeats * 0.3),
        };
        sessionData.availableSeats = sessionData.totalSeats - sessionData.bookedSeats;
        // Replace branchKey with actual ObjectId
        const bId = nameToBranchId[session.branchKey as 'hyderabad' | 'vijayawada' | 'bangalore'];
        if (!bId) continue;
        delete sessionData.branchKey;
        sessionData.branchId = bId;
        if (admin) sessionData.createdBy = admin._id;

        sessionPromises.push(Session.create(sessionData));
      }
    }

    await Promise.all(sessionPromises);
    console.log(`Created ${sessionPromises.length} sessions for next 10 days`);

    console.log('Session seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding sessions:', error);
    process.exit(1);
  }
};

seedSessions();

```

# server\src\scripts\seedUsers.ts

```ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import Branch from '../models/Branch';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Map human branch keys to ObjectIds
    const branches = await Branch.find().lean();
    if (!branches.length) {
      throw new Error('No branches found. Run seedData.ts first to create branches.');
    }
    const keyToBranchId: Record<string, any> = {};
    for (const b of branches) {
      const key = (b.location || b.name || '').toLowerCase();
      if (key.includes('hyderabad')) keyToBranchId['hyderabad'] = b._id;
      if (key.includes('vijayawada')) keyToBranchId['vijayawada'] = b._id;
      if (key.includes('bangalore')) keyToBranchId['bangalore'] = b._id;
    }

    // Create seed users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'admin'
      },
      {
        name: 'Hyderabad Branch Manager',
        email: 'hyderabad@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'branch_manager',
        branchId: keyToBranchId['hyderabad']
      },
      {
        name: 'Vijayawada Branch Manager',
        email: 'vijayawada@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'branch_manager',
        branchId: keyToBranchId['vijayawada']
      },
      {
        name: 'Bangalore Branch Manager',
        email: 'bangalore@craftfactory.com',
        password: await bcrypt.hash('password', 10),
        role: 'branch_manager',
        branchId: keyToBranchId['bangalore']
      },
      {
        name: 'John Doe',
        email: 'customer@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'customer',
        phone: '+91 98765 43210',
        address: {
          street: '12 MG Road',
          city: 'Hyderabad',
          state: 'Telangana',
          zipCode: '500081',
          country: 'India'
        }
      }
    ];

    await User.insertMany(users);
    console.log('Seed users created successfully');
    console.log('Users created:');
    users.forEach(user => console.log(`- ${user.email} (${user.role})`));

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();

```

# server\src\scripts\testManagerAPI.ts

```ts

```

# server\src\types.d.ts

```ts
declare namespace Express {
  export interface Request {
    user?: any;
  }
}

```

# server\src\utils\jwt.ts

```ts
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const sign = (payload: TokenPayload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign(payload, secret, { expiresIn: '24h' }); // Reduced from 30d to 24h for security
};

export const verify = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.verify(token, secret) as TokenPayload;
};

export const generateRefreshToken = (payload: TokenPayload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

```

# server\tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}

```

# src\App.tsx

```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ShippingPolicy from './pages/ShippingPolicy';
import RefundPolicy from './pages/RefundPolicy';
import ArtMakingActivityPage from './components/Layout/ArtMakingActivityPage';
import SlimePlayPage from './components/Layout/SlimePlayPage';
import TuftingActivityPage from './components/Layout/TuftingActivityPage';
import ContactUsPage from './components/Layout/ContactUsPage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import PasswordReset from './components/Auth/PasswordReset';
import AuthTest from './components/AuthTest';
import EventBooking from './components/Customer/EventBooking';
import Store from './components/Customer/Store';
import CustomerDashboard from './components/Customer/Dashboard';
import Profile from './components/Customer/Profile';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManagerDashboard from './components/Manager/ManagerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import OurStoryPage from './components/Layout/OurStoryPage';
import ActivitiesPage from './components/Layout/ActivitiesPage';
import CartPage from './components/Layout/CartPage';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/auth-test" element={<AuthTest />} />
                <Route path="/reset-password" element={<PasswordReset />} />
                <Route path="/events" element={<EventBooking />} />
                <Route path="/store" element={<Store />} />
                <Route path="/ourstory" element={<OurStoryPage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/art-making-activity.html" element={<ArtMakingActivityPage />} />
            <Route path="/slime-play.html" element={<SlimePlayPage />} />
            <Route path="/tufting-activity.html" element={<TuftingActivityPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <CustomerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/manager" 
                  element={
                    <ProtectedRoute requiredRole="branch_manager">
                      <ManagerDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
```

# src\components\Admin\AdminDashboard.tsx

```tsx
import React, { useState } from 'react';
import type { CMSContent } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import SalesAnalytics from './SalesAnalytics';
import BranchManagement from './BranchManagement';
import ManagerManagement from './ManagerManagement';
import ProductManagement from './ProductManagement';
import SessionManagement from './SessionManagement';
import EnhancedSessionManagement from './EnhancedSessionManagement';
import PaymentTracking from './PaymentTracking';
import { 
  Users,
  Edit,
  MapPin, 
  Calendar, 
  Package, 
  TrendingUp, 
  Settings,
  BarChart3,
  CreditCard,
  Plus,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    branches, 
    events, 
    orders, 
    bookings, 
    cmsContent,
    updateCMSContent,
    addCMSContent,
    deleteCMSContent,
  addTrackingUpdate
  } = useData();

  const [activeTab, setActiveTab] = useState('overview');
  const [filterBranch, setFilterBranch] = useState<string>('all');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<null | { id: string; orderId: string }>(null);
  const [adminTrackingUpdate, setAdminTrackingUpdate] = useState({ status: '', location: '', description: '' });
  const [editingContent, setEditingContent] = useState<null | CMSContent>(null);
  const [newContent, setNewContent] = useState<Omit<CMSContent, 'id' | 'updatedAt'>>({
    type: 'carousel',
    title: '',
    content: '',
    images: [''],
    isActive: true
  });
  const [showAddContent, setShowAddContent] = useState(false);

  // Analytics calculations
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalBookings = bookings.length;

  const contentTypes = [
    { value: 'carousel', label: 'Carousel Slide', color: 'bg-purple-100 text-purple-800' },
    { value: 'hero', label: 'Hero Section', color: 'bg-blue-100 text-blue-800' },
    { value: 'about', label: 'About Section', color: 'bg-green-100 text-green-800' },
    { value: 'services', label: 'Services', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'testimonials', label: 'Testimonials', color: 'bg-pink-100 text-pink-800' },
    { value: 'contact', label: 'Contact', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'gallery', label: 'Gallery', color: 'bg-red-100 text-red-800' },
    { value: 'studios', label: 'Studios', color: 'bg-teal-100 text-teal-800' },
    { value: 'events', label: 'Special Events', color: 'bg-orange-100 text-orange-800' }
  ];

  const handleSaveContent = async () => {
    if (editingContent) {
      const filteredImages = editingContent.images.filter((img: string) => img.trim() !== '');
      await updateCMSContent({ ...editingContent, images: filteredImages });
      setEditingContent(null);
    }
  };

  const handleAddContent = async () => {
    if (newContent.title && newContent.content) {
      // Filter out empty image URLs
      const filteredImages = newContent.images.filter((img: string) => img.trim() !== '');
      await addCMSContent({ ...newContent, images: filteredImages });
      setNewContent({
        type: 'carousel',
        title: '',
        content: '',
        images: [''],
        isActive: true
      });
      setShowAddContent(false);
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      await deleteCMSContent(id);
    }
  };

  const addImageField = (isEditing = false) => {
    if (isEditing && editingContent) {
      setEditingContent({
        ...editingContent,
        images: [...editingContent.images, '']
      });
    } else {
      setNewContent({
        ...newContent,
        images: [...newContent.images, '']
      });
    }
  };

  const removeImageField = (index: number, isEditing = false) => {
    if (isEditing && editingContent) {
  const newImages = editingContent.images.filter((_: string, i: number) => i !== index);
      setEditingContent({
        ...editingContent,
        images: newImages.length > 0 ? newImages : ['']
      });
    } else {
      const newImages = newContent.images.filter((_, i) => i !== index);
      setNewContent({
        ...newContent,
        images: newImages.length > 0 ? newImages : ['']
      });
    }
  };

  const updateImageField = (index: number, value: string, isEditing = false) => {
    if (isEditing && editingContent) {
      const newImages = [...editingContent.images];
      newImages[index] = value;
      setEditingContent({
        ...editingContent,
        images: newImages
      });
    } else {
      const newImages = [...newContent.images];
      newImages[index] = value;
      setNewContent({
        ...newContent,
        images: newImages
      });
    }
  };

  const getContentTypeInfo = (type: string) => {
    return contentTypes.find(ct => ct.value === type) || contentTypes[0];
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Branches</p>
              <p className="text-2xl font-bold text-gray-900">{branches.length}</p>
            </div>
            <MapPin className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {bookings.slice(0, 5).map(booking => {
              const event = events.find(e => e.id === booking.eventId);
              return (
                <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{event?.title}</p>
                    <p className="text-sm text-gray-600">₹{booking.totalAmount}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              );

            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Order #{order.id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">₹{order.totalAmount}</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-600">{order.customerName || `Customer #${order.customerId.slice(0,6)}`}</span>
                  <span className="text-xs text-gray-600">{order.customerEmail || '—'}</span>
                  <span className="text-xs text-gray-600">{order.customerPhone || '—'}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.orderStatus}
                </span>
                <div className="ml-3">
                  <button
                    onClick={() => setSelectedOrderForTracking({ id: order.id, orderId: order.id })}
                    className="text-sm text-indigo-600 hover:text-indigo-900 ml-2"
                  >
                    Track
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Details - All branches with branch filter */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Customer Details</h3>
          <select
            onChange={(e) => setFilterBranch(e.target.value)}
            className="text-sm border-gray-300 rounded-md"
            value={filterBranch}
          >
            <option value="all">All Branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="space-y-3">
          {[
            ...orders.map(o => ({ id: o.customerId, name: o.customerName, email: o.customerEmail, phone: o.customerPhone, branchId: o.branchId })),
            ...bookings.map(b => ({ id: b.customerId, name: b.customerName, email: b.customerEmail, phone: b.customerPhone, branchId: b.branchId }))
          ]
            .filter((v, i, arr) => v.id && arr.findIndex(x => x.id === v.id) === i)
            .filter(v => filterBranch === 'all' ? true : v.branchId === filterBranch)
            .slice(0, 20)
            .map(c => (
              <div key={c.id + (c.branchId||'')} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{c.name || `Customer #${c.id?.slice(0,6)}`}</p>
                  <p className="text-xs text-gray-600">{c.email || '—'}</p>
                </div>
                <div className="text-sm text-gray-600">{c.phone || '—'}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // Admin: Tracking modal
  const renderAdminTrackingModal = () => (
    selectedOrderForTracking ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Add Tracking Update - Order #{selectedOrderForTracking.orderId.slice(0,8)}</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={adminTrackingUpdate.status} onChange={(e) => setAdminTrackingUpdate({...adminTrackingUpdate, status: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="">Select Status</option>
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" value={adminTrackingUpdate.location} onChange={(e) => setAdminTrackingUpdate({...adminTrackingUpdate, location: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={adminTrackingUpdate.description} onChange={(e) => setAdminTrackingUpdate({...adminTrackingUpdate, description: e.target.value})} rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button onClick={() => setSelectedOrderForTracking(null)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button onClick={() => handleAdminAddTracking(selectedOrderForTracking.orderId)} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Add Update</button>
          </div>
        </div>
      </div>
    ) : null
  );

  // Admin: handle adding tracking updates
  const handleAdminAddTracking = async (orderId: string) => {
    if (adminTrackingUpdate.status && adminTrackingUpdate.location) {
      await addTrackingUpdate(orderId, { ...adminTrackingUpdate, timestamp: new Date().toISOString() });
      setAdminTrackingUpdate({ status: '', location: '', description: '' });
      setSelectedOrderForTracking(null);
    }
  };

  const renderCMSManagement = () => (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Content Management System</h3>
        <button
          onClick={() => setShowAddContent(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Content</span>
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cmsContent.map(content => {
          const typeInfo = getContentTypeInfo(content.type);
          return (
            <div key={content.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Content Images */}
              {content.images && content.images.length > 0 && (
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={content.images[0]}
                    alt={content.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg';
                    }}
                  />
                  {content.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      +{content.images.length - 1} more
                    </div>
                  )}
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                  <div className="flex items-center space-x-1">
                    {content.isActive ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>

                <h4 className="font-bold text-gray-800 mb-2">{content.title}</h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{content.content}</p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Updated: {new Date(content.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingContent(content)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContent(content.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Content Modal */}
      {showAddContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Content</h3>
              <button
                onClick={() => setShowAddContent(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={newContent.type}
                  onChange={(e) => setNewContent({ ...newContent, type: e.target.value as CMSContent['type'] })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {contentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter content title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={newContent.content}
                  onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter content description"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Images</label>
                  <button
                    onClick={() => addImageField(false)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Image</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {newContent.images.map((image, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => updateImageField(index, e.target.value, false)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter image URL"
                      />
                      {newContent.images.length > 1 && (
                        <button
                          onClick={() => removeImageField(index, false)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newContent.isActive}
                  onChange={(e) => setNewContent({ ...newContent, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (visible on website)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddContent(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContent}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Content Modal */}
      {editingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Content</h3>
              <button
                onClick={() => setEditingContent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={editingContent.type}
                  onChange={(e) => setEditingContent({ ...editingContent, type: e.target.value as CMSContent['type'] })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {contentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editingContent.title}
                  onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={editingContent.content}
                  onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Images</label>
                  <button
                    onClick={() => addImageField(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Image</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {editingContent.images.map((image: string, index: number) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => updateImageField(index, e.target.value, true)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter image URL"
                      />
                      {editingContent.images.length > 1 && (
                        <button
                          onClick={() => removeImageField(index, true)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Image Preview */}
                {editingContent.images.filter((img: string) => img.trim() !== '').length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {editingContent.images
                        .filter((img: string) => img.trim() !== '')
                        .map((image: string, index: number) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg';
                              }}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingContent.isActive}
                  onChange={(e) => setEditingContent({ ...editingContent, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="editIsActive" className="text-sm font-medium text-gray-700">
                  Active (visible on website)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingContent(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveContent}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'sessions', label: 'Sessions', icon: Calendar },
              { id: 'payments', label: 'Payments', icon: CreditCard },
              { id: 'cms', label: 'Content Management', icon: Settings },
              { id: 'branches', label: 'Branches', icon: MapPin },
              { id: 'managers', label: 'Managers', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'analytics' && <SalesAnalytics />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'sessions' && <EnhancedSessionManagement />}
          {activeTab === 'payments' && <PaymentTracking />}
          {activeTab === 'cms' && renderCMSManagement()}
          {activeTab === 'branches' && <BranchManagement />}
          {activeTab === 'managers' && <ManagerManagement />}
        </div>
  {renderAdminTrackingModal()}
      </div>
    </div>
  );
};

export default AdminDashboard;
```

# src\components\Admin\BranchManagement.tsx

```tsx
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Building,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';

const BranchManagement: React.FC = () => {
  const { 
    branches, 
    managers,
    addBranch, 
    updateBranch, 
    deleteBranch 
  } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [newBranch, setNewBranch] = useState({
    name: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    managerId: '',
    isActive: true
  });

  const handleAddBranch = async () => {
    if (newBranch.name && newBranch.location && newBranch.address) {
      await addBranch({
        ...newBranch,
        stripeAccountId: `acct_${Date.now()}`
      });
      setNewBranch({
        name: '',
        location: '',
        address: '',
        phone: '',
        email: '',
        managerId: '',
        isActive: true
      });
      setShowAddModal(false);
    }
  };

  const handleUpdateBranch = async () => {
    if (editingBranch) {
      await updateBranch(editingBranch);
      setEditingBranch(null);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      await deleteBranch(id);
    }
  };

  const getManagerName = (managerId: string) => {
    const manager = managers.find(m => m.id === managerId);
    return manager ? manager.name : 'No Manager Assigned';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Branch Management</h3>
          <p className="text-gray-600">Manage all branch locations and their details</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Branch</span>
        </button>
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map(branch => (
          <div key={branch.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="h-6 w-6" />
                  <h4 className="text-lg font-bold">{branch.name}</h4>
                </div>
                <div className="flex items-center space-x-1">
                  {branch.isActive ? (
                    <CheckCircle className="h-5 w-5 text-green-300" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-300" />
                  )}
                </div>
              </div>
              <p className="text-sm opacity-90">{branch.location}</p>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-600">{branch.address}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{branch.phone}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{branch.email}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{getManagerName(branch.managerId)}</span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    branch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {branch.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingBranch(branch)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBranch(branch.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Branch</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name *</label>
                <input
                  type="text"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Craft Factory Mumbai"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={newBranch.location}
                  onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mumbai"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  value={newBranch.address}
                  onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full address with pincode"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newBranch.phone}
                  onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newBranch.email}
                  onChange={(e) => setNewBranch({ ...newBranch, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="branch@craftfactory.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                <select
                  value={newBranch.managerId}
                  onChange={(e) => setNewBranch({ ...newBranch, managerId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Manager</option>
                  {managers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} ({manager.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newBranch.isActive}
                  onChange={(e) => setNewBranch({ ...newBranch, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active Branch
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBranch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Branch Modal */}
      {editingBranch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Branch</h3>
              <button
                onClick={() => setEditingBranch(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name *</label>
                <input
                  type="text"
                  value={editingBranch.name}
                  onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={editingBranch.location}
                  onChange={(e) => setEditingBranch({ ...editingBranch, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  value={editingBranch.address}
                  onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={editingBranch.phone}
                  onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editingBranch.email}
                  onChange={(e) => setEditingBranch({ ...editingBranch, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                <select
                  value={editingBranch.managerId}
                  onChange={(e) => setEditingBranch({ ...editingBranch, managerId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Manager</option>
                  {managers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} ({manager.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingBranch.isActive}
                  onChange={(e) => setEditingBranch({ ...editingBranch, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="editIsActive" className="text-sm font-medium text-gray-700">
                  Active Branch
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingBranch(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBranch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;
```

# src\components\Admin\EnhancedSessionManagement.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, X, Trash2, Edit2, Users, Clock, Calendar, AlertCircle } from 'lucide-react';

interface Session {
  _id?: string;
  branchId: string;
  date: string;
  activity: 'slime' | 'tufting';
  time: string;
  label?: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  type: string;
  ageGroup: string;
  price?: number;
  isActive: boolean;
  createdBy?: string;
  notes?: string;
}

const EnhancedSessionManagement: React.FC = () => {
  const { branches, selectedBranch, setSelectedBranch } = useData();
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    selectedBranch || (branches.length ? branches[0].id : '')
  );
  const [selectedActivity, setSelectedActivity] = useState<'slime' | 'tufting'>('slime');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  // Generate next 10 days
  const generateNext10Days = () => {
    const days = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const [next10Days] = useState(generateNext10Days());
  const [selectedDate, setSelectedDate] = useState(next10Days[0]);

  const [newSession, setNewSession] = useState<Partial<Session>>({
    branchId: selectedBranchId,
    date: selectedDate,
    activity: 'slime',
    time: '10:00',
    label: '10:00 AM',
    totalSeats: 15,
    type: 'Slime Play & Demo',
    ageGroup: '3+',
    isActive: true,
    notes: ''
  });

  const [qrCode, setQrCode] = useState('');

  // API base URL
  const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Fetch sessions for next 10 days
  const fetchNext10DaysSessions = async () => {
    if (!selectedBranchId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      console.log(`🔄 Fetching sessions for branch ${selectedBranchId}, activity ${selectedActivity}`);
      const response = await fetch(
        `${apiBase}/sessions/next-10-days/${selectedBranchId}?activity=${selectedActivity}`,
        { headers }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Sessions fetched:', data?.length || 0);
        setSessions(data);
        
        // Cache sessions data
        try {
          localStorage.setItem(`sessions_${selectedBranchId}_${selectedActivity}`, JSON.stringify(data));
        } catch (error) {
          console.warn('Failed to cache sessions:', error);
        }
      } else {
        console.error('❌ Failed to fetch sessions:', response.status, response.statusText);
        
        // Try to load from cache if backend fails
        try {
          const cached = localStorage.getItem(`sessions_${selectedBranchId}_${selectedActivity}`);
          if (cached) {
            const cachedData = JSON.parse(cached);
            setSessions(cachedData);
            showToastMessage('Loaded cached sessions data');
            console.log('📦 Loaded sessions from cache');
          } else {
            showToastMessage('Failed to fetch sessions and no cached data available');
          }
        } catch (error) {
          showToastMessage('Failed to fetch sessions');
        }
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      
      // Try to load from cache on network error
      try {
        const cached = localStorage.getItem(`sessions_${selectedBranchId}_${selectedActivity}`);
        if (cached) {
          const cachedData = JSON.parse(cached);
          setSessions(cachedData);
          showToastMessage('Network error - loaded cached sessions');
          console.log('📦 Network error, loaded sessions from cache');
        } else {
          showToastMessage('Network error and no cached data available');
        }
      } catch (cacheError) {
        showToastMessage('Error fetching sessions');
      }
    } finally {
      setLoading(false);
    }
  };

  // Create session
  const createSession = async (sessionData: Partial<Session>) => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${apiBase}/sessions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(sessionData)
      });

      if (response.ok) {
        showToastMessage('Session created successfully');
        fetchNext10DaysSessions();
        return true;
      } else {
        const error = await response.json();
        showToastMessage(error.message || 'Failed to create session');
        return false;
      }
    } catch (error) {
      console.error('Error creating session:', error);
      showToastMessage('Error creating session');
      return false;
    }
  };

  // Update session
  const updateSession = async (sessionId: string, sessionData: Partial<Session>) => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${apiBase}/sessions/${sessionId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(sessionData)
      });

      if (response.ok) {
        showToastMessage('Session updated successfully');
        fetchNext10DaysSessions();
        return true;
      } else {
        const error = await response.json();
        showToastMessage(error.message || 'Failed to update session');
        return false;
      }
    } catch (error) {
      console.error('Error updating session:', error);
      showToastMessage('Error updating session');
      return false;
    }
  };

  // Delete session
  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${apiBase}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        showToastMessage('Session deleted successfully');
        fetchNext10DaysSessions();
      } else {
        const error = await response.json();
        showToastMessage(error.message || 'Failed to delete session');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      showToastMessage('Error deleting session');
    }
  };

  // Verify QR code
  const verifyQRCode = async () => {
    if (!qrCode.trim()) {
      showToastMessage('Please enter a QR code');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${apiBase}/bookings/verify-qr`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ qrCode: qrCode.trim() })
      });

      if (response.ok) {
        const result = await response.json();
        showToastMessage('Booking verified successfully');
        setQrCode('');
        fetchNext10DaysSessions(); // Refresh to show updated seat counts
        console.log('QR verification result:', result);
      } else {
        const error = await response.json();
        showToastMessage(error.message || 'Invalid QR code');
      }
    } catch (error) {
      console.error('Error verifying QR code:', error);
      showToastMessage('Error verifying QR code');
    }
  };

  // Handle form submissions
  const handleAddSession = async () => {
    if (await createSession(newSession)) {
      setNewSession({
        branchId: selectedBranchId,
        date: selectedDate,
        activity: selectedActivity,
        time: '10:00',
        label: '10:00 AM',
        totalSeats: 15,
        type: selectedActivity === 'slime' ? 'Slime Play & Demo' : 'Small Tufting',
        ageGroup: selectedActivity === 'slime' ? '3+' : '15+',
        isActive: true,
        notes: ''
      });
      setShowAddModal(false);
    }
  };

  const handleUpdateSession = async () => {
    if (editingSession && editingSession._id) {
      if (await updateSession(editingSession._id, editingSession)) {
        setEditingSession(null);
      }
    }
  };

  // Effect hooks
  useEffect(() => {
    if (selectedBranchId) {
      setSelectedBranch(selectedBranchId);
      fetchNext10DaysSessions();
    }
  }, [selectedBranchId, selectedActivity]);

  useEffect(() => {
    setNewSession(prev => ({
      ...prev,
      branchId: selectedBranchId,
      date: selectedDate,
      activity: selectedActivity
    }));
  }, [selectedBranchId, selectedDate, selectedActivity]);

  // Filter sessions for selected date
  const sessionsForDate = sessions.filter(s => s.date === selectedDate && s.activity === selectedActivity);

  // Check if branch supports activity
  const branchSupportsActivity = (activity: 'slime' | 'tufting') => {
    const branch = branches.find(b => b.id === selectedBranchId);
    if (!branch) return false;
    return activity === 'slime' ? branch.supportsSlime : branch.supportsTufting;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Enhanced Session Management</h3>
          <p className="text-gray-600">Manage all activity sessions with real-time seat tracking</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchNext10DaysSessions}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <div className={`h-4 w-4 ${loading ? 'animate-spin rounded-full border-2 border-white border-t-transparent' : ''}`}>
              {!loading && '🔄'}
            </div>
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Session</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Branch Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
            >
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>

          {/* Activity Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedActivity('slime')}
                disabled={!branchSupportsActivity('slime')}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  selectedActivity === 'slime'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${!branchSupportsActivity('slime') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Slime
              </button>
              <button
                onClick={() => setSelectedActivity('tufting')}
                disabled={!branchSupportsActivity('tufting')}
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                  selectedActivity === 'tufting'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${!branchSupportsActivity('tufting') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Tufting
              </button>
            </div>
          </div>

          {/* QR Verification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">QR Verification</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                placeholder="Enter QR code"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={verifyQRCode}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold mb-4">Select Date</h4>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {next10Days.map((date) => {
            const dateObj = new Date(date);
            const isMonday = dateObj.getDay() === 1;
            const isSelected = selectedDate === date;
            
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`p-3 rounded-lg text-center transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white'
                    : isMonday
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                disabled={isMonday}
              >
                <div className="text-xs font-medium">
                  {formatDate(date)}
                </div>
                <div className="text-lg font-bold">
                  {dateObj.getDate()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sessions Display */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">
            {selectedActivity.charAt(0).toUpperCase() + selectedActivity.slice(1)} Sessions - {formatDate(selectedDate)}
          </h4>
          {!branchSupportsActivity(selectedActivity) && (
            <div className="flex items-center text-amber-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">This branch doesn't support {selectedActivity}</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600 mb-2">Loading sessions...</p>
            <p className="text-sm text-gray-500">
              Fetching {selectedActivity} sessions for {branches.find(b => b.id === selectedBranchId)?.name}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessionsForDate.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No sessions found for this date</p>
                <p className="text-sm mt-2">
                  Sessions for the next 10 days are automatically created. Click "Add Session" to add more.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-3 text-purple-600 hover:underline"
                >
                  Add Session for {formatDate(selectedDate)}
                </button>
              </div>
            ) : (
              <>
                <div className="text-sm text-gray-600 mb-4">
                  Showing {sessionsForDate.length} session{sessionsForDate.length !== 1 ? 's' : ''} for {formatDate(selectedDate)}
                </div>
                {sessionsForDate.map((session) => (
                  <div
                    key={session._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="font-medium">{session.label || session.time}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.type} • {session.ageGroup}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                            <span className={`text-sm font-medium ${
                              session.availableSeats === 0 ? 'text-red-600' :
                              session.availableSeats <= 3 ? 'text-amber-600' : 'text-green-600'
                            }`}>
                              {session.availableSeats}/{session.totalSeats} available
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.bookedSeats} booked
                          </div>
                          {!session.isActive && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              Inactive
                            </span>
                          )}
                          {session.createdBy === 'system' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                              Auto-created
                            </span>
                          )}
                        </div>
                        {session.notes && (
                          <p className="text-sm text-gray-600 mt-1">{session.notes}</p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingSession(session)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit session"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => session._id && deleteSession(session._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete session"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Session</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={newSession.time || ''}
                  onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Label</label>
                <input
                  type="text"
                  value={newSession.label || ''}
                  onChange={(e) => setNewSession({ ...newSession, label: e.target.value })}
                  placeholder="e.g., 10:00 AM"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Total Seats</label>
                <input
                  type="number"
                  value={newSession.totalSeats || ''}
                  onChange={(e) => setNewSession({ ...newSession, totalSeats: parseInt(e.target.value) })}
                  min="1"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <input
                  type="text"
                  value={newSession.type || ''}
                  onChange={(e) => setNewSession({ ...newSession, type: e.target.value })}
                  placeholder="e.g., Slime Play & Demo"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Age Group</label>
                <input
                  type="text"
                  value={newSession.ageGroup || ''}
                  onChange={(e) => setNewSession({ ...newSession, ageGroup: e.target.value })}
                  placeholder="e.g., 3+, 8+, 15+"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                <textarea
                  value={newSession.notes || ''}
                  onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  rows={2}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newSession.isActive || false}
                  onChange={(e) => setNewSession({ ...newSession, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm">Active (visible to customers)</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSession}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Add Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {editingSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Session</h3>
              <button onClick={() => setEditingSession(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={editingSession.time}
                  onChange={(e) => setEditingSession({ ...editingSession, time: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Label</label>
                <input
                  type="text"
                  value={editingSession.label || ''}
                  onChange={(e) => setEditingSession({ ...editingSession, label: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Total Seats</label>
                <input
                  type="number"
                  value={editingSession.totalSeats}
                  onChange={(e) => setEditingSession({ ...editingSession, totalSeats: parseInt(e.target.value) })}
                  min={editingSession.bookedSeats}
                  className="w-full border rounded-md px-3 py-2"
                />
                {editingSession.bookedSeats > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum: {editingSession.bookedSeats} (current bookings)
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <input
                  type="text"
                  value={editingSession.type}
                  onChange={(e) => setEditingSession({ ...editingSession, type: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Age Group</label>
                <input
                  type="text"
                  value={editingSession.ageGroup}
                  onChange={(e) => setEditingSession({ ...editingSession, ageGroup: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={editingSession.notes || ''}
                  onChange={(e) => setEditingSession({ ...editingSession, notes: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  rows={2}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingSession.isActive}
                  onChange={(e) => setEditingSession({ ...editingSession, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm">Active (visible to customers)</label>
              </div>
              
              {editingSession.bookedSeats > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-700">
                    This session has {editingSession.bookedSeats} confirmed bookings.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingSession(null)}
                className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSession}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default EnhancedSessionManagement;

```

# src\components\Admin\ManagerManagement.tsx

```tsx
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { sendManagerInvite, generateTemporaryPassword } from '../../utils/emailService';
import { 
  Users, 
  Mail, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  User,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ManagerManagement: React.FC = () => {
  const { 
    managers, 
    branches,
    addManager, 
    updateManager, 
    deleteManager 
  } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingManager, setEditingManager] = useState<any>(null);
  const [newManager, setNewManager] = useState({
    name: '',
    email: '',
    role: 'branch_manager' as const,
    branchId: ''
  });

  const handleAddManager = async () => {
    if (newManager.name && newManager.email && newManager.branchId) {
      // Generate temporary password
      const temporaryPassword = generateTemporaryPassword();
      
      // Add manager with temporary password
      const managerWithPassword = {
        ...newManager,
        temporaryPassword,
        mustChangePassword: true
      };
      
      await addManager(managerWithPassword);
      
      // Send invitation email
      const branch = branches.find(b => b.id === newManager.branchId);
      const emailSent = await sendManagerInvite({
        name: newManager.name,
        email: newManager.email,
        branchName: branch?.name || 'Unknown Branch',
        temporaryPassword,
        loginUrl: `${window.location.origin}/login`
      });
      
      if (emailSent) {
        // Show success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          font-family: Arial, sans-serif;
          max-width: 350px;
        `;
        notification.innerHTML = `
          <div style="display: flex; align-items: center;">
            <span style="margin-right: 10px;">✅</span>
            <div>
              <div style="font-weight: bold;">Manager Added Successfully!</div>
              <div style="font-size: 14px; opacity: 0.9;">Login credentials sent to ${newManager.email}</div>
            </div>
          </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 5000);
      }
      
      setNewManager({
        name: '',
        email: '',
        role: 'branch_manager',
        branchId: ''
      });
      setShowAddModal(false);
    }
  };

  const handleUpdateManager = async () => {
    if (editingManager) {
      await updateManager(editingManager);
      setEditingManager(null);
    }
  };

  const handleDeleteManager = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this manager? This action cannot be undone.')) {
      await deleteManager(id);
    }
  };

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'No Branch Assigned';
  };

  const getBranchLocation = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.location : '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Manager Management</h3>
          <p className="text-gray-600">Manage branch managers and their assignments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Manager</span>
        </button>
      </div>

      {/* Manager Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managers.map(manager => (
          <div key={manager.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-6 w-6" />
                  <h4 className="text-lg font-bold">{manager.name}</h4>
                </div>
                <Shield className="h-5 w-5 text-green-300" />
              </div>
              <p className="text-sm opacity-90">{manager.role.replace('_', ' ').toUpperCase()}</p>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{manager.email}</span>
              </div>

              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-sm text-gray-600 block">{getBranchName(manager.branchId || '')}</span>
                  <span className="text-xs text-gray-500">{getBranchLocation(manager.branchId || '')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Joined: {new Date(manager.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingManager(manager)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteManager(manager.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Manager Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Manager</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newManager.name}
                  onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter manager's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={newManager.email}
                  onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="manager@craftfactory.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Branch *</label>
                <select
                  value={newManager.branchId}
                  onChange={(e) => setNewManager({ ...newManager, branchId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} - {branch.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newManager.role}
                  onChange={(e) => setNewManager({ ...newManager, role: e.target.value as 'branch_manager' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="branch_manager">Branch Manager</option>
                </select>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="font-semibold text-blue-800 mb-2">📧 Email Notification</h4>
                <p className="text-sm text-blue-700">
                  The manager will receive an email with login credentials and instructions to access their dashboard.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddManager}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Manager Modal */}
      {editingManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Manager</h3>
              <button
                onClick={() => setEditingManager(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={editingManager.name}
                  onChange={(e) => setEditingManager({ ...editingManager, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={editingManager.email}
                  onChange={(e) => setEditingManager({ ...editingManager, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Branch *</label>
                <select
                  value={editingManager.branchId || ''}
                  onChange={(e) => setEditingManager({ ...editingManager, branchId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} - {branch.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={editingManager.role}
                  onChange={(e) => setEditingManager({ ...editingManager, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="branch_manager">Branch Manager</option>
                </select>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Password Reset</h4>
                <p className="text-sm text-yellow-700">
                  If the manager needs to reset their password, they can use the "Forgot Password" option on the login page.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingManager(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateManager}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerManagement;
```

# src\components\Admin\PaymentTracking.tsx

```tsx
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  CreditCard, 
  DollarSign, 
  Calendar,
  User,
  MapPin,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const PaymentTracking: React.FC = () => {
  const { orders, bookings, branches, events, products } = useData();
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [selectedBranch, setSelectedBranch] = useState('all');

  // Combine orders and bookings for payment tracking
  const allPayments = [
    ...orders.map(order => ({
      id: order.id,
      type: 'order' as const,
      customerId: order.customerId,
      branchId: order.branchId,
      amount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      paymentIntentId: order.paymentIntentId,
      createdAt: order.createdAt,
      items: order.products.map(p => p.name).join(', '),
      itemCount: order.products.length
    })),
    ...bookings.map(booking => ({
      id: booking.id,
      type: 'booking' as const,
      customerId: booking.customerId,
      branchId: booking.branchId,
      amount: booking.totalAmount,
      paymentStatus: booking.paymentStatus,
      paymentIntentId: booking.paymentIntentId,
      createdAt: booking.createdAt,
      items: events.find(e => e.id === booking.eventId)?.title || 'Event',
      itemCount: booking.seats
    }))
  ];

  // Filter payments
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - parseInt(dateRange));

  const filteredPayments = allPayments.filter(payment => {
    const paymentDate = new Date(payment.createdAt);
    const dateInRange = paymentDate >= startDate && paymentDate <= endDate;
    const branchMatch = selectedBranch === 'all' || payment.branchId === selectedBranch;
    const statusMatch = filter === 'all' || payment.paymentStatus === filter;
    
    return dateInRange && branchMatch && statusMatch;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Calculate metrics
  const totalPayments = filteredPayments.length;
  const completedPayments = filteredPayments.filter(p => p.paymentStatus === 'completed').length;
  const pendingPayments = filteredPayments.filter(p => p.paymentStatus === 'pending').length;
  const failedPayments = filteredPayments.filter(p => p.paymentStatus === 'failed').length;
  const totalRevenue = filteredPayments
    .filter(p => p.paymentStatus === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const downloadReport = () => {
    const reportData = {
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      branch: selectedBranch === 'all' ? 'All Branches' : branches.find(b => b.id === selectedBranch)?.name,
      filter: filter === 'all' ? 'All Payments' : filter,
      summary: {
        totalPayments,
        completedPayments,
        pendingPayments,
        failedPayments,
        totalRevenue,
        successRate: totalPayments > 0 ? ((completedPayments / totalPayments) * 100).toFixed(2) : 0
      },
      payments: filteredPayments.map(payment => ({
        id: payment.id,
        type: payment.type,
        amount: payment.amount,
        status: payment.paymentStatus,
        paymentId: payment.paymentIntentId,
        branch: getBranchName(payment.branchId),
        items: payment.items,
        date: payment.createdAt
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Payment Tracking</h3>
          <p className="text-gray-600">Monitor all customer payments and transactions</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Branches</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Payments</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          
          <button
            onClick={downloadReport}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Payment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{totalPayments}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedPayments}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{failedPayments}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Payment Success Rate */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Payment Success Rate</h4>
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div 
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="text-lg font-bold text-gray-900">
            {totalPayments > 0 ? ((completedPayments / totalPayments) * 100).toFixed(1) : 0}%
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Success Rate</span>
          <span>{completedPayments} of {totalPayments} payments successful</span>
        </div>
      </div>

      {/* Payment List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-bold text-gray-800">Payment Transactions</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={`${payment.type}-${payment.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        payment.type === 'order' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {payment.type === 'order' ? (
                          <CreditCard className={`h-4 w-4 ${payment.type === 'order' ? 'text-blue-600' : 'text-purple-600'}`} />
                        ) : (
                          <Calendar className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.type === 'order' ? 'Product Order' : 'Event Booking'}
                        </div>
                        <div className="text-sm text-gray-500">#{payment.id.slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">#{payment.customerId.slice(-6)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.items}</div>
                    <div className="text-sm text-gray-500">
                      {payment.type === 'order' ? `${payment.itemCount} items` : `${payment.itemCount} seats`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{getBranchName(payment.branchId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{payment.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPaymentStatusIcon(payment.paymentStatus)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(payment.paymentStatus)}`}>
                        {payment.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                    <div className="text-xs text-gray-400">
                      {new Date(payment.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.paymentIntentId ? (
                      <div className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {payment.paymentIntentId.slice(-12)}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No payment ID</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No payments found for the selected criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTracking;
```

# src\components\Admin\ProductManagement.tsx

```tsx
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Image as ImageIcon,
  DollarSign,
  Archive,
  Eye,
  EyeOff
} from 'lucide-react';

const ProductManagement: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    images: [''],
    category: '',
    stock: 0,
    materials: [''],
    isActive: true
  });

  const categories = ['Slime Kits', 'Art Supplies', 'Kids Supplies', 'Craft Materials', 'Premium Kits'];

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.description && newProduct.price > 0) {
      const filteredImages = newProduct.images.filter(img => img.trim() !== '');
      const filteredMaterials = newProduct.materials.filter(mat => mat.trim() !== '');
      
      await addProduct({
        ...newProduct,
        images: filteredImages.length > 0 ? filteredImages : ['https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg'],
        materials: filteredMaterials.length > 0 ? filteredMaterials : ['Basic materials']
      });
      
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        images: [''],
        category: '',
        stock: 0,
        materials: [''],
        isActive: true
      });
      setShowAddModal(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (editingProduct) {
      const filteredImages = editingProduct.images.filter((img: string) => img.trim() !== '');
      const filteredMaterials = editingProduct.materials.filter((mat: string) => mat.trim() !== '');
      
      await updateProduct({
        ...editingProduct,
        images: filteredImages.length > 0 ? filteredImages : ['https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg'],
        materials: filteredMaterials.length > 0 ? filteredMaterials : ['Basic materials']
      });
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      await deleteProduct(id);
    }
  };

  const addImageField = (isEditing = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: [...editingProduct.images, '']
      });
    } else {
      setNewProduct({
        ...newProduct,
        images: [...newProduct.images, '']
      });
    }
  };

  const removeImageField = (index: number, isEditing = false) => {
    if (isEditing && editingProduct) {
      const newImages = editingProduct.images.filter((_: any, i: number) => i !== index);
      setEditingProduct({
        ...editingProduct,
        images: newImages.length > 0 ? newImages : ['']
      });
    } else {
      const newImages = newProduct.images.filter((_, i) => i !== index);
      setNewProduct({
        ...newProduct,
        images: newImages.length > 0 ? newImages : ['']
      });
    }
  };

  const updateImageField = (index: number, value: string, isEditing = false) => {
    if (isEditing && editingProduct) {
      const newImages = [...editingProduct.images];
      newImages[index] = value;
      setEditingProduct({
        ...editingProduct,
        images: newImages
      });
    } else {
      const newImages = [...newProduct.images];
      newImages[index] = value;
      setNewProduct({
        ...newProduct,
        images: newImages
      });
    }
  };

  const addMaterialField = (isEditing = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        materials: [...editingProduct.materials, '']
      });
    } else {
      setNewProduct({
        ...newProduct,
        materials: [...newProduct.materials, '']
      });
    }
  };

  const removeMaterialField = (index: number, isEditing = false) => {
    if (isEditing && editingProduct) {
      const newMaterials = editingProduct.materials.filter((_: any, i: number) => i !== index);
      setEditingProduct({
        ...editingProduct,
        materials: newMaterials.length > 0 ? newMaterials : ['']
      });
    } else {
      const newMaterials = newProduct.materials.filter((_, i) => i !== index);
      setNewProduct({
        ...newProduct,
        materials: newMaterials.length > 0 ? newMaterials : ['']
      });
    }
  };

  const updateMaterialField = (index: number, value: string, isEditing = false) => {
    if (isEditing && editingProduct) {
      const newMaterials = [...editingProduct.materials];
      newMaterials[index] = value;
      setEditingProduct({
        ...editingProduct,
        materials: newMaterials
      });
    } else {
      const newMaterials = [...newProduct.materials];
      newMaterials[index] = value;
      setNewProduct({
        ...newProduct,
        materials: newMaterials
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Product Management</h3>
          <p className="text-gray-600">Manage all products available nationwide</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg';
                }}
              />
              {product.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  +{product.images.length - 1} more
                </div>
              )}
              <div className="absolute top-2 left-2 flex items-center space-x-1">
                {product.isActive ? (
                  <Eye className="h-4 w-4 text-green-600 bg-white rounded p-1" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400 bg-white rounded p-1" />
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {product.category}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  product.stock > 10 ? 'bg-green-100 text-green-800' :
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Stock: {product.stock}
                </span>
              </div>

              <h4 className="font-bold text-gray-800 mb-2">{product.name}</h4>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-1">Materials:</p>
                <div className="flex flex-wrap gap-1">
                  {product.materials.slice(0, 3).map((material, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {material}
                    </span>
                  ))}
                  {product.materials.length > 3 && (
                    <span className="text-gray-500 text-xs">+{product.materials.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-green-600">₹{product.price}</span>
                <span className="text-sm text-gray-600">Available Globally</span>
              </div>

              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Product Images</label>
                  <button
                    onClick={() => addImageField(false)}
                    className="text-green-600 hover:text-green-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Image</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {newProduct.images.map((image, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => updateImageField(index, e.target.value, false)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter image URL"
                      />
                      {newProduct.images.length > 1 && (
                        <button
                          onClick={() => removeImageField(index, false)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Materials Included</label>
                  <button
                    onClick={() => addMaterialField(false)}
                    className="text-green-600 hover:text-green-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Material</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {newProduct.materials.map((material, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => updateMaterialField(index, e.target.value, false)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter material name"
                      />
                      {newProduct.materials.length > 1 && (
                        <button
                          onClick={() => removeMaterialField(index, false)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newProduct.isActive}
                  onChange={(e) => setNewProduct({ ...newProduct, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active Product (visible to customers)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Product</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Product Images</label>
                  <button
                    onClick={() => addImageField(true)}
                    className="text-green-600 hover:text-green-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Image</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {editingProduct.images.map((image: string, index: number) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => updateImageField(index, e.target.value, true)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter image URL"
                      />
                      {editingProduct.images.length > 1 && (
                        <button
                          onClick={() => removeImageField(index, true)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Materials Included</label>
                  <button
                    onClick={() => addMaterialField(true)}
                    className="text-green-600 hover:text-green-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Material</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {editingProduct.materials.map((material: string, index: number) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => updateMaterialField(index, e.target.value, true)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter material name"
                      />
                      {editingProduct.materials.length > 1 && (
                        <button
                          onClick={() => removeMaterialField(index, true)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingProduct.isActive}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="editIsActive" className="text-sm font-medium text-gray-700">
                  Active Product (visible to customers)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
```

# src\components\Admin\SalesAnalytics.tsx

```tsx
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Calendar,
  Users,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

const SalesAnalytics: React.FC = () => {
  const { orders, bookings, branches, events, products } = useData();
  const [dateRange, setDateRange] = useState('30'); // days
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [reportType, setReportType] = useState('overview');

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - parseInt(dateRange));

  // Filter data by date range and branch
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const dateInRange = orderDate >= startDate && orderDate <= endDate;
    const branchMatch = selectedBranch === 'all' || order.branchId === selectedBranch;
    return dateInRange && branchMatch;
  });

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.createdAt);
    const dateInRange = bookingDate >= startDate && bookingDate <= endDate;
    const branchMatch = selectedBranch === 'all' || booking.branchId === selectedBranch;
    return dateInRange && branchMatch;
  });

  // Calculate metrics
  const totalRevenue = [...filteredOrders, ...filteredBookings].reduce((sum, item) => sum + item.totalAmount, 0);
  const totalOrders = filteredOrders.length;
  const totalBookings = filteredBookings.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / (totalOrders + totalBookings) : 0;

  // Previous period comparison
  const prevStartDate = new Date(startDate);
  prevStartDate.setDate(prevStartDate.getDate() - parseInt(dateRange));
  const prevEndDate = new Date(startDate);

  const prevOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= prevStartDate && orderDate < prevEndDate;
  });
  const prevBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.createdAt);
    return bookingDate >= prevStartDate && bookingDate < prevEndDate;
  });

  const prevRevenue = [...prevOrders, ...prevBookings].reduce((sum, item) => sum + item.totalAmount, 0);
  const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

  // Daily revenue data for line chart
  const dailyRevenueData = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayOrders = filteredOrders.filter(order => order.createdAt.startsWith(dateStr));
    const dayBookings = filteredBookings.filter(booking => booking.createdAt.startsWith(dateStr));
    const dayRevenue = [...dayOrders, ...dayBookings].reduce((sum, item) => sum + item.totalAmount, 0);
    
    dailyRevenueData.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: dayRevenue,
      orders: dayOrders.length,
      bookings: dayBookings.length
    });
  }

  // Branch revenue data for pie chart
  const branchRevenueData = branches.map(branch => {
    const branchOrders = filteredOrders.filter(order => order.branchId === branch.id);
    const branchBookings = filteredBookings.filter(booking => booking.branchId === branch.id);
    const branchRevenue = [...branchOrders, ...branchBookings].reduce((sum, item) => sum + item.totalAmount, 0);
    
    return {
      name: branch.name,
      value: branchRevenue,
      orders: branchOrders.length,
      bookings: branchBookings.length
    };
  });

  // Product performance data
  const productPerformance = products.map(product => {
    const productOrders = filteredOrders.filter(order => 
      order.products.some(p => p.productId === product.id)
    );
    const totalSold = productOrders.reduce((sum, order) => {
      const productInOrder = order.products.find(p => p.productId === product.id);
      return sum + (productInOrder?.quantity || 0);
    }, 0);
    const revenue = productOrders.reduce((sum, order) => {
      const productInOrder = order.products.find(p => p.productId === product.id);
      return sum + ((productInOrder?.quantity || 0) * (productInOrder?.price || 0));
    }, 0);

    return {
      name: product.name,
      sold: totalSold,
      revenue: revenue,
      category: product.category
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  // Event performance data
  const eventPerformance = events.map(event => {
    const eventBookings = filteredBookings.filter(booking => booking.eventId === event.id);
    const totalSeats = eventBookings.reduce((sum, booking) => sum + booking.seats, 0);
    const revenue = eventBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

    return {
      name: event.title,
      bookings: eventBookings.length,
      seats: totalSeats,
      revenue: revenue,
      date: event.date
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  const COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#fff7ed'];

  const downloadReport = () => {
    const reportData = {
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      branch: selectedBranch === 'all' ? 'All Branches' : branches.find(b => b.id === selectedBranch)?.name,
      summary: {
        totalRevenue,
        totalOrders,
        totalBookings,
        averageOrderValue,
        revenueGrowth
      },
      dailyRevenue: dailyRevenueData,
      branchPerformance: branchRevenueData,
      topProducts: productPerformance,
      topEvents: eventPerformance
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Sales Analytics</h2>
          <p className="text-gray-600">Comprehensive sales and revenue analysis</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Branches</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
          
          <button
            onClick={downloadReport}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                {revenueGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(revenueGrowth).toFixed(1)}%
                </span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              <p className="text-sm text-gray-500 mt-2">Product orders</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
              <p className="text-sm text-gray-500 mt-2">Event bookings</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{averageOrderValue.toFixed(0)}</p>
              <p className="text-sm text-gray-500 mt-2">Per transaction</p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Revenue Trend</h3>
            <BarChart3 className="h-5 w-5 text-gray-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#ea580c" fill="#ea580c" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Branch Performance Pie Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Branch Performance</h3>
            <PieChartIcon className="h-5 w-5 text-gray-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={branchRevenueData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {branchRevenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders vs Bookings Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Orders vs Bookings Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} name="Orders" />
            <Line type="monotone" dataKey="bookings" stroke="#8b5cf6" strokeWidth={2} name="Bookings" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Top Performing Products</h3>
          <div className="space-y-4">
            {productPerformance.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sold} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Events */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Top Performing Events</h3>
          <div className="space-y-4">
            {eventPerformance.map((event, index) => (
              <div key={event.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.name}</p>
                    <p className="text-sm text-gray-600">{event.bookings} bookings, {event.seats} seats</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{event.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
```

# src\components\Admin\SessionManagement.tsx

```tsx
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import type { Event } from '../../types';
import { Plus, X, Save } from 'lucide-react';

const SessionManagement: React.FC = () => {
  const { branches, addEvent, updateEvent, selectedBranch, setSelectedBranch, updateSlotsForDate, getSlotsForDate, getBranchAvailability, updateBranchAvailability, verifyQRCode } = useData();

  // Types for slots and activity state
  type Slot = {
    time: string;
    label: string;
    available: number;
    total: number;
    type: string;
    age: string;
    // price removed: admin does not set price; it's defined by customer's selected plan
    price?: number;
  };

  type ActivitySlots = Record<string, { slime: Slot[]; tufting: Slot[] }>;

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    branchId: '',
    date: '',
    time: '',
    duration: 60,
    maxSeats: 10,
    price: 0,
    materials: [''],
    isActive: true
  });

  // 9-day calendar view for Slime and Tufting sessions
  const today = new Date();
  const nineDays = Array.from({ length: 9 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  // Example: session slots state (should be fetched/synced with backend in real app)
  const [activitySlots, setActivitySlots] = useState<ActivitySlots>(() => {
    // Example structure: { 'YYYY-MM-DD': { slime: [slotObj], tufting: [slotObj] } }
    const slots: ActivitySlots = {};
    nineDays.forEach(date => {
      const key = date.toISOString().split('T')[0];
      slots[key] = {
        slime: [
          { time: '10:00', label: '10:00 AM', available: 12, total: 15, type: 'Slime Play', age: '3+' },
          { time: '11:30', label: '11:30 AM', available: 8, total: 15, type: 'Slime Making', age: '8+' },
        ],
        tufting: [
          { time: '12:00', label: '12:00 PM', available: 5, total: 8, type: 'Small', age: 'All' },
          { time: '15:00', label: '3:00 PM', available: 2, total: 8, type: 'Medium', age: 'All' },
        ]
      };
    });
    return slots;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<'slime' | 'tufting'>('slime');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Admin UI state
  const [selectedBranchId, setSelectedBranchId] = useState<string>(selectedBranch || (branches.length ? branches[0].id : ''));
  const [selectedDate, setSelectedDate] = useState<string>(nineDays[0].toISOString().split('T')[0]);
  const [preview, setPreview] = useState(false);

  // Load saved slots for branch+date if present
  React.useEffect(() => {
    const saved = getSlotsForDate(selectedBranchId, selectedDate);
    if (saved) {
      setActivitySlots(prev => ({ ...prev, [selectedDate]: saved }));
    }
  }, [selectedBranchId, selectedDate, getSlotsForDate]);

  // Prefill activitySlots for all nineDays from DataContext when branch changes
  React.useEffect(() => {
    const fill: ActivitySlots = { ...activitySlots };
    nineDays.forEach(date => {
      const key = date.toISOString().split('T')[0];
      const saved = getSlotsForDate(selectedBranchId, key);
      if (saved) {
        fill[key] = saved;
      } else if (!fill[key]) {
        // keep existing default if present
        fill[key] = activitySlots[key] || { slime: [], tufting: [] };
      }
    });
    setActivitySlots(fill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranchId]);

  // branch availability state (allowMonday)
  const [allowMonday, setAllowMonday] = React.useState<boolean>(() => {
    const av = getBranchAvailability(selectedBranchId);
    return av ? av.allowMonday : false;
  });

  React.useEffect(() => {
    const av = getBranchAvailability(selectedBranchId);
    setAllowMonday(av ? av.allowMonday : false);
  }, [selectedBranchId, getBranchAvailability]);

  // Handler to update slot details
  const updateSlot = (dateKey: string, activity: 'slime' | 'tufting', slotIdx: number, field: keyof Slot, value: string | number) => {
    setActivitySlots((prev: ActivitySlots) => {
      const updated: ActivitySlots = { ...prev };
      updated[dateKey] = { ...updated[dateKey] };
      updated[dateKey][activity] = updated[dateKey][activity].map((slot: Slot, idx: number) =>
        idx === slotIdx ? { ...slot, [field]: value } as Slot : slot
      );
      return updated;
    });
  };

  // Handler to add a new slot
  const addSlot = (dateKey: string, activity: 'slime' | 'tufting') => {
    setActivitySlots((prev: ActivitySlots) => {
      const updated: ActivitySlots = { ...prev };
      updated[dateKey] = { ...updated[dateKey] };
      updated[dateKey][activity] = [
  ...updated[dateKey][activity],
  { time: '', label: '', available: 0, total: 0, type: '', age: '' }
      ];
      return updated;
    });
  };

  // Handler to remove a slot
  const removeSlot = (dateKey: string, activity: 'slime' | 'tufting', slotIdx: number) => {
    setActivitySlots((prev: ActivitySlots) => {
      const updated: ActivitySlots = { ...prev };
      updated[dateKey] = { ...updated[dateKey] };
      updated[dateKey][activity] = updated[dateKey][activity].filter((_, idx: number) => idx !== slotIdx);
      return updated;
    });
  };

  const handleAddEvent = async () => {
    if (newEvent.title && newEvent.description && newEvent.branchId && newEvent.date && newEvent.time) {
      const filteredMaterials = newEvent.materials.filter(mat => mat.trim() !== '');
      
      await addEvent({
        ...newEvent,
        bookedSeats: 0,
        materials: filteredMaterials.length > 0 ? filteredMaterials : ['Basic materials']
      });
      
      setNewEvent({
        title: '',
        description: '',
        branchId: '',
        date: '',
        time: '',
        duration: 60,
        maxSeats: 10,
        price: 0,
        materials: [''],
        isActive: true
      });
      setShowAddModal(false);
    }
  };

  const handleUpdateEvent = async () => {
    if (editingEvent) {
      const filteredMaterials = editingEvent.materials.filter((mat: string) => mat.trim() !== '');
      
      await updateEvent({
        ...editingEvent,
        materials: filteredMaterials.length > 0 ? filteredMaterials : ['Basic materials']
      });
      setEditingEvent(null);
    }
  };

  // Deletion and branch name helpers are available via DataContext as needed.

  const addMaterialField = (isEditing = false) => {
    if (isEditing && editingEvent) {
      setEditingEvent({
        ...editingEvent,
        materials: [...editingEvent.materials, '']
      });
    } else {
      setNewEvent({
        ...newEvent,
        materials: [...newEvent.materials, '']
      });
    }
  };

  const removeMaterialField = (index: number, isEditing = false) => {
    if (isEditing && editingEvent) {
      const newMaterials = editingEvent.materials.filter((_: string, i: number) => i !== index);
      setEditingEvent({
        ...editingEvent,
        materials: newMaterials.length > 0 ? newMaterials : ['']
      });
    } else {
      const newMaterials = newEvent.materials.filter((_, i) => i !== index);
      setNewEvent({
        ...newEvent,
        materials: newMaterials.length > 0 ? newMaterials : ['']
      });
    }
  };

  const updateMaterialField = (index: number, value: string, isEditing = false) => {
    if (isEditing && editingEvent) {
      const newMaterials = [...editingEvent.materials];
      newMaterials[index] = value;
      setEditingEvent({
        ...editingEvent,
        materials: newMaterials
      });
    } else {
      const newMaterials = [...newEvent.materials];
      newMaterials[index] = value;
      setNewEvent({
        ...newEvent,
        materials: newMaterials
      });
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Session Management</h3>
          <p className="text-gray-600">Manage all classes and workshops across branches</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Session</span>
        </button>
      </div>


          // Branch selector + 9-Day Date Picker + Preview
          <div className="mb-8 bg-white rounded-2xl p-6 shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-600">Manage Branch:</label>
                  <select value={selectedBranchId} onChange={(e) => { setSelectedBranchId(e.target.value); setSelectedBranch(e.target.value); }} className="border rounded px-3 py-2">
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-600">Allow Monday Sessions:</label>
                  <input type="checkbox" checked={allowMonday} onChange={async (e) => {
                    const val = e.target.checked;
                    setAllowMonday(val);
                    try {
                      await updateBranchAvailability(selectedBranchId, { allowMonday: val });
                    } catch (err) {
                      console.error('Failed to update branch availability', err);
                    }
                  }} className="w-4 h-4" />
                </div>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-600">Preview as customer</label>
                <input type="checkbox" checked={preview} onChange={(e) => setPreview(e.target.checked)} className="w-4 h-4" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="flex gap-4 min-w-[720px]">
                {nineDays.map((date) => {
                  const value = date.toISOString().split('T')[0];
                  const isMonday = date.getDay() === 1 && !allowMonday;
                  const selected = selectedDate === value;
                  return (
                    <div key={value} onClick={() => !isMonday && setSelectedDate(value)} className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all min-w-24 ${isMonday ? 'bg-gray-100 opacity-60 cursor-not-allowed' : selected ? 'border-green-400 bg-green-100 -translate-y-1 shadow-lg' : 'hover:border-green-400 hover:bg-green-50'}`}>
                      <div className="text-sm font-semibold">{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                      <div className="text-xl font-bold my-1">{date.getDate()}</div>
                      <div className="text-xs">{date.toLocaleDateString(undefined, { month: 'short' })}</div>
                      {isMonday && <div className="text-xs text-red-500 mt-1">No Sessions</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

      {/* Slots for selected date (editable) */}
      <div className="mb-10">
        <h4 className="text-2xl font-bold text-red-600 mb-4 text-center">Manage Slots for {new Date(selectedDate).toLocaleDateString()}</h4>

        {/* Activity selector */}
        <div className="flex justify-center gap-3 mb-4">
          <button onClick={() => setSelectedActivity('slime')} className={`px-4 py-2 rounded ${selectedActivity === 'slime' ? 'bg-green-600 text-white' : 'bg-white border'}`}>
            Slime
          </button>
          <button
            onClick={() => setSelectedActivity('tufting')}
            className={`px-4 py-2 rounded ${selectedActivity === 'tufting' ? 'bg-purple-600 text-white' : 'bg-white border'}`}
            disabled={(() => {
              const branch = branches.find(b => b.id === selectedBranchId);
              return branch ? branch.supportsTufting === false : false;
            })()}
          >
            Tufting
          </button>
        </div>

        {/* If tufting not supported show hint */}
        {selectedActivity === 'tufting' && (() => {
          const branch = branches.find(b => b.id === selectedBranchId);
          if (branch && branch.supportsTufting === false) {
            return <div className="text-center text-sm text-red-600 mb-4">Tufting is not available for the selected branch ({branch.name}).</div>;
          }
          return null;
        })()}

        <div className="grid grid-cols-1 gap-6">
          {/* Single activity editor */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold text-lg">{selectedActivity === 'slime' ? 'Slime Sessions' : 'Tufting Sessions'}</div>
              <button onClick={() => addSlot(selectedDate, selectedActivity)} className="text-sm text-green-600">+ Add Slot</button>
            </div>
            <div className="space-y-3">
              {(() => {
                const day = activitySlots[selectedDate];
                const slots = day ? (selectedActivity === 'slime' ? day.slime : day.tufting) : [];
                return slots.map((slot: Slot, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-md p-2">
                    <input type="time" value={slot.time} onChange={(e) => updateSlot(selectedDate, selectedActivity, idx, 'time', e.target.value)} className="w-24 border rounded px-1 py-0.5 text-sm" />
                    <input type="text" value={slot.label} onChange={(e) => updateSlot(selectedDate, selectedActivity, idx, 'label', e.target.value)} className="w-28 border rounded px-2 py-1 text-sm" placeholder="Label" />
                    <input type="number" value={slot.available} min={0} max={slot.total} onChange={(e) => updateSlot(selectedDate, selectedActivity, idx, 'available', Number(e.target.value))} className="w-14 border rounded px-1 py-0.5 text-sm" />
                    <input type="number" value={slot.total} min={1} onChange={(e) => updateSlot(selectedDate, selectedActivity, idx, 'total', Number(e.target.value))} className="w-14 border rounded px-1 py-0.5 text-sm" />
                    <input type="text" value={slot.type} onChange={(e) => updateSlot(selectedDate, selectedActivity, idx, 'type', e.target.value)} className="w-20 border rounded px-1 py-0.5 text-sm" placeholder="Type" />
                    <input type="text" value={slot.age} onChange={(e) => updateSlot(selectedDate, selectedActivity, idx, 'age', e.target.value)} className="w-12 border rounded px-1 py-0.5 text-sm" placeholder="Age" />
                    <button onClick={() => removeSlot(selectedDate, selectedActivity, idx)} className="text-red-500">✕</button>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={async () => {
            setIsSaving(true);
            try {
              // preserve the other activity when saving only one
              const existing = getSlotsForDate(selectedBranchId, selectedDate) || { slime: [], tufting: [] };
              const toSave = {
                slime: selectedActivity === 'slime' ? activitySlots[selectedDate].slime : (existing.slime || activitySlots[selectedDate].slime),
                tufting: selectedActivity === 'tufting' ? activitySlots[selectedDate].tufting : (existing.tufting || activitySlots[selectedDate].tufting)
              };
              await updateSlotsForDate(selectedBranchId, selectedDate, toSave);
              console.log('Saved slots for', selectedBranchId, selectedDate, 'activity', selectedActivity);
              setToastMessage('Slots saved');
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            } catch (e) {
              console.error('Failed to save slots', e);
            } finally {
              setIsSaving(false);
            }
          }} className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Toast / Snackbar */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded shadow-lg z-50 flex items-center gap-3">
          <div className="font-medium">{toastMessage}</div>
          <button onClick={() => setShowToast(false)} className="text-gray-300 hover:text-white">✕</button>
        </div>
      )}

        {/* Manager QR Verification Panel */}
        <div className="bg-white rounded-xl p-4 shadow-sm mt-6">
          <h4 className="text-lg font-semibold mb-2">Manager: Verify Booking QR</h4>
          <div className="flex gap-2 items-center">
            <input id="qr-input" placeholder="Enter QR code" className="border rounded px-3 py-2 w-64" />
            <button onClick={async () => {
              const el = document.getElementById('qr-input') as HTMLInputElement | null;
              if (!el || !el.value) return alert('Enter QR code');
              const ok = await verifyQRCode(el.value.trim());
              if (ok) alert('Booking verified'); else alert('QRCode not found or already verified');
            }} className="bg-green-600 text-white px-3 py-2 rounded">Verify</button>
          </div>
          <div className="mt-3 text-sm text-gray-600">You can paste the customer's QR from their ticket to verify entry.</div>
        </div>

      {/* Add Session Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Session</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Title *</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Daily Slime Making Class"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch *</label>
                  <select
                    value={newEvent.branchId}
                    onChange={(e) => setNewEvent({ ...newEvent, branchId: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe what participants will learn and do"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    min={getMinDate()}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                  <input
                    type="number"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) || 60 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="30"
                    step="15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Seats *</label>
                  <input
                    type="number"
                    value={newEvent.maxSeats}
                    onChange={(e) => setNewEvent({ ...newEvent, maxSeats: parseInt(e.target.value) || 10 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="1"
                    max="50"
                  />
                </div>

                <div>
                  <div className="text-sm text-gray-600">Price is determined by the customer's selected plan and is not set here.</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Materials Included</label>
                  <button
                    onClick={() => addMaterialField(false)}
                    className="text-purple-600 hover:text-purple-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Material</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {newEvent.materials.map((material, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => updateMaterialField(index, e.target.value, false)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Glue, Colors, Glitter"
                      />
                      {newEvent.materials.length > 1 && (
                        <button
                          onClick={() => removeMaterialField(index, false)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newEvent.isActive}
                  onChange={(e) => setNewEvent({ ...newEvent, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active Session (visible to customers)
                </label>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">📅 Session Management Rules</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Sessions cannot be edited or deleted within one week of the scheduled date</li>
                  <li>• Sessions with existing bookings cannot be deleted</li>
                  <li>• Minimum session duration is 30 minutes</li>
                  <li>• Maximum capacity is 50 participants per session</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Add Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Session</h3>
              <button
                onClick={() => setEditingEvent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Title *</label>
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch *</label>
                  <select
                    value={editingEvent.branchId}
                    onChange={(e) => setEditingEvent({ ...editingEvent, branchId: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    min={getMinDate()}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <input
                    type="time"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                  <input
                    type="number"
                    value={editingEvent.duration}
                    onChange={(e) => setEditingEvent({ ...editingEvent, duration: parseInt(e.target.value) || 60 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="30"
                    step="15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Seats *</label>
                  <input
                    type="number"
                    value={editingEvent.maxSeats}
                    onChange={(e) => setEditingEvent({ ...editingEvent, maxSeats: parseInt(e.target.value) || 10 })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min={editingEvent.bookedSeats || 1}
                    max="50"
                  />
                  {editingEvent.bookedSeats > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum: {editingEvent.bookedSeats} (current bookings)
                    </p>
                  )}
                </div>

                <div>
                  <div className="text-sm text-gray-600">Price is determined by the customer's selected plan and is not set here.</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Materials Included</label>
                  <button
                    onClick={() => addMaterialField(true)}
                    className="text-purple-600 hover:text-purple-800 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Material</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {editingEvent.materials.map((material: string, index: number) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => updateMaterialField(index, e.target.value, true)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Glue, Colors, Glitter"
                      />
                      {editingEvent.materials.length > 1 && (
                        <button
                          onClick={() => removeMaterialField(index, true)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingEvent.isActive}
                  onChange={(e) => setEditingEvent({ ...editingEvent, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="editIsActive" className="text-sm font-medium text-gray-700">
                  Active Session (visible to customers)
                </label>
              </div>

              {editingEvent.bookedSeats > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">📋 Current Bookings</h4>
                  <p className="text-sm text-blue-700">
                    This session has {editingEvent.bookedSeats} confirmed bookings. 
                    Be careful when making changes that might affect existing customers.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEvent}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionManagement;
```

# src\components\Auth\Login.tsx

```tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Palette, Mail, Lock, AlertCircle } from 'lucide-react';
import { sendPasswordReset, generateResetToken } from '../../utils/emailService';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
  await login(email, password);
  // Redirect back to where the user came from (if present) or to home
  const from = (location.state as { from?: string } | null)?.from || '/';
  navigate(from);
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMessage('');

    try {
      // Generate reset token
      const resetToken = generateResetToken();
      const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(resetEmail)}`;
      
      // Send password reset email
      const emailSent = await sendPasswordReset({
        name: 'Manager', // In real app, get name from database
        email: resetEmail,
        resetToken,
        resetUrl
      });

      if (emailSent) {
        setResetMessage('Password reset email sent! Check your inbox for instructions.');
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetMessage('');
          setResetEmail('');
        }, 3000);
      } else {
        setResetMessage('Failed to send reset email. Please try again.');
      }
    } catch {
      setResetMessage('An error occurred. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Palette className="h-12 w-12 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          No account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">Create a new account</a>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
          >
            Forgot your password?
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Admin: admin@craftfactory.com / password</p>
            <p>Manager: hyderabad@craftfactory.com / password</p>
            <p>Customer: customer@example.com / password</p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetMessage('');
                  setResetEmail('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {resetMessage && (
                <div className={`p-3 rounded-md flex items-center ${
                  resetMessage.includes('sent') 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {resetMessage}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetMessage('');
                    setResetEmail('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
```

# src\components\Auth\PasswordReset.tsx

```tsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Palette, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const PasswordReset: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    token: searchParams.get('token') || '',
    email: searchParams.get('email') || '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.token || !formData.email) {
      setError('Invalid reset link. Please request a new password reset.');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await resetPassword(formData.token, formData.email, formData.newPassword);
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError('Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. You will be redirected to the login page shortly.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Palette className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-600 mt-2">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              placeholder="Enter your email"
              required
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reset Token
            </label>
            <input
              type="text"
              value={formData.token}
              onChange={(e) => setFormData({ ...formData, token: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter reset token from email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
```

# src\components\Auth\Signup.tsx

```tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Registration failed');
        setLoading(false);
        return;
      }
      // Try to auto-login the user after successful registration
      try {
        await login(email, password);
        navigate('/');
        return;
      } catch {
        // If auto-login fails, fall back to the login page
        navigate('/login');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e || 'Network error');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

```

# src\components\AuthTest.tsx

```tsx
import React, { useState } from 'react';

const AuthTest: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testDirectAPI = async () => {
    setLoading(true);
    addResult('🚀 Starting Direct API Test...');

    try {
      // Test Health
      addResult('Testing health endpoint...');
      const healthResponse = await fetch('http://localhost:5001/api/health');
      const healthData = await healthResponse.json();
      addResult(`Health: ${healthResponse.status} - ${JSON.stringify(healthData)}`);

      // Test Registration
      const testEmail = `test${Date.now()}@example.com`;
      addResult(`Testing registration with: ${testEmail}`);
      
      const registerResponse = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Direct API Test User',
          email: testEmail,
          password: 'password123'
        })
      });

      if (registerResponse.ok) {
        const registerData = await registerResponse.json();
        addResult(`✅ Registration successful: ${registerData.user.name} (${registerData.user.email})`);

        // Test Login
        addResult('Testing login...');
        const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: testEmail,
            password: 'password123'
          })
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          addResult(`✅ Login successful: ${loginData.user.name}`);
        } else {
          const loginError = await loginResponse.text();
          addResult(`❌ Login failed: ${loginError}`);
        }
      } else {
        const registerError = await registerResponse.text();
        addResult(`❌ Registration failed: ${registerError}`);
      }

    } catch (error) {
      addResult(`❌ Test failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testFrontendSignup = async () => {
    setLoading(true);
    addResult('🚀 Starting Frontend Signup Test...');

    try {
      const testEmail = `frontend${Date.now()}@example.com`;
      addResult(`Testing frontend signup with: ${testEmail}`);

      // Simulate what the frontend does
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      addResult(`Using API URL: ${apiUrl}`);

      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Frontend Test User',
          email: testEmail,
          password: 'password123'
        })
      });

      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Frontend signup successful: ${data.user.name} (${data.user.email})`);
      } else {
        const errorText = await response.text();
        addResult(`❌ Frontend signup failed: ${response.status} - ${errorText}`);
      }

    } catch (error) {
      addResult(`❌ Frontend test failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Authentication System Test</h1>
      
      <div className="space-x-2 mb-4">
        <button 
          onClick={testDirectAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Direct API
        </button>
        <button 
          onClick={testFrontendSignup}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Frontend Signup
        </button>
        <button 
          onClick={clearResults}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Results
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg h-96 overflow-y-auto">
        <h3 className="font-semibold mb-2">Test Results:</h3>
        {results.length === 0 ? (
          <p className="text-gray-500">No tests run yet. Click a button above to start testing.</p>
        ) : (
          <div className="space-y-1">
            {results.map((result, index) => (
              <div key={index} className="font-mono text-sm">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Environment Info:</h3>
        <p><strong>VITE_API_URL:</strong> {import.meta.env.VITE_API_URL || 'Not set (using /api)'}</p>
        <p><strong>Current URL:</strong> {window.location.origin}</p>
      </div>
    </div>
  );
};

export default AuthTest;

```

# src\components\Customer\Dashboard.tsx

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Calendar, ShoppingBag, Download, QrCode, Package, Eye, Truck } from 'lucide-react';
// Helper to generate a QR image data URL for booking/order payloads.
// Use dynamic import so bundlers handle the module and we avoid using `require` at runtime
async function generateQRCodeDataUrl(text: string): Promise<string> {
  try {
    // Dynamically import the qrcode module so this runs in the browser environment
    const qrcodeModule = await import('qrcode');
    // Support both ESM and CommonJS interop shapes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toDataURL = (qrcodeModule as any).toDataURL || (qrcodeModule as any).default?.toDataURL;
    if (typeof toDataURL !== 'function') return '';
    return await toDataURL(text, { width: 512, margin: 1 });
  } catch {
    return '';
  }
}

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { bookings, orders, events, branches } = useData();

  const [trackOrder, setTrackOrder] = React.useState<null | typeof orders[0]>(null);

  const userBookings = bookings.filter(b => b.customerId === user?.id);
  const userOrders = orders.filter(o => o.customerId === user?.id);

  // Responsive grid classes
  const gridClasses = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8";
  const cardClasses = "bg-white rounded-lg shadow-lg p-4 md:p-6";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const downloadTicket = async (booking: any) => {
    const event = events.find(e => e.id === booking.eventId);
    const branch = branches.find(b => b.id === booking.branchId);

    const ticketData = {
      ticketId: booking.id,
      eventTitle: event?.title,
      eventDescription: event?.description,
      date: event?.date,
      time: event?.time,
      duration: event?.duration,
      venue: branch?.name,
      address: branch?.address,
      qrCode: booking.qrCode,
      seats: booking.seats,
      totalAmount: booking.totalAmount,
      customerName: user?.name,
      customerId: user?.id,
      customerPhone: user?.phone || '',
      customerAddress: user?.address || null,
      bookingDate: booking.createdAt,
      status: booking.isVerified ? 'Verified' : 'Pending Verification'
    };

    // Generate QR code PNG for this booking payload
    const qrPayload = JSON.stringify({ type: 'booking', ...ticketData });
    const dataUrl = await generateQRCodeDataUrl(qrPayload);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `booking-qr-${booking.id}.png`;
    a.click();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const downloadInvoice = async (order: any) => {
    const branch = branches.find(b => b.id === order.branchId);

    const invoiceData = {
      invoiceId: order.id,
      orderDate: order.createdAt,
      customerName: user?.name,
      customerId: user?.id,
      customerPhone: user?.phone || '',
      customerAddress: user?.address || null,
      customerEmail: user?.email,
      branch: branch?.name,
      branchAddress: branch?.address,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      products: order.products.map((p: any) => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price,
        total: p.quantity * p.price
      })),
      subtotal: order.totalAmount,
      tax: 0,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      trackingNumber: order.trackingNumber,
      shippingAddress: order.shippingAddress
    };

    // Generate QR image for order payload
    const qrPayload = JSON.stringify({ type: 'order', ...invoiceData });
    const dataUrl = await generateQRCodeDataUrl(qrPayload);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `order-qr-${order.id}.png`;
    a.click();
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-indigo-100 text-indigo-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'packed': return 'bg-cyan-100 text-cyan-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'payment_confirmed': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusLabel = (status: string) => {
    const statusLabels: { [key: string]: string } = {
      'pending': 'Pending',
      'payment_confirmed': 'Payment Confirmed',
      'processing': 'Processing',
      'packed': 'Packed',
      'shipped': 'Shipped',
      'in_transit': 'In Transit',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusLabels[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-sm md:text-base text-gray-600">Manage your bookings, orders, and account settings</p>
          </div>
          <div>
            <Link to="/profile" className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-md shadow-sm text-sm">Edit Profile</Link>
          </div>
        </div>

        {/* Customer Info Card */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow p-4 md:p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Your Information</h3>
              <div className="mt-2 text-sm text-gray-700">
                <div><span className="font-medium">Name:</span> {user?.name}</div>
                <div><span className="font-medium">Customer ID:</span> {user?.id}</div>
                <div><span className="font-medium">Email:</span> {user?.email}</div>
                <div><span className="font-medium">Phone:</span> {user?.phone || '—'}</div>
                <div><span className="font-medium">Address:</span> {user?.address ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.zipCode}` : '—'}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">This information is included in your bookings and orders for tracking purposes.</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={gridClasses}>
          <div className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Bookings</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600">{userBookings.length}</p>
              </div>
              <Calendar className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            </div>
          </div>

          <div className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Orders</p>
                <p className="text-xl md:text-2xl font-bold text-purple-600">{userOrders.length}</p>
              </div>
              <ShoppingBag className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
            </div>
          </div>

          <div className={cardClasses}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Spent</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">
                  ₹{[...userBookings, ...userOrders].reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString()}
                </p>
              </div>
              <Package className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Event Bookings */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">My Bookings</h2>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {userBookings.length} total
              </span>
            </div>

            {userBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No bookings yet</p>
                <Link
                  to="/activities"
                  className="inline-flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book a Session</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {userBookings.map(booking => {
                  const event = events.find(e => e.id === booking.eventId);
                  const branch = branches.find(b => b.id === booking.branchId);
                  return (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">{event?.title}</h3>
                          <p className="text-sm text-gray-600">{branch?.name}</p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${booking.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {booking.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Date:</span> {event?.date}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {event?.time}
                        </div>
                        <div>
                          <span className="font-medium">Seats:</span> {booking.seats}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> ₹{booking.totalAmount}
                        </div>
                        {booking.paymentIntentId && (
                          <div className="col-span-2">
                            <span className="font-medium">Payment ID:</span>
                            <span className="font-mono text-xs ml-1">{booking.paymentIntentId}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <QrCode className="h-4 w-4" />
                          <span className="font-mono">{booking.qrCode}</span>
                        </div>
                        <button
                          onClick={() => downloadTicket(booking)}
                          className="flex items-center space-x-1 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Ticket</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Orders */}
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <ShoppingBag className="h-6 w-6 text-orange-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
              </div>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {userOrders.length} total
              </span>
            </div>

            {userOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No orders yet</p>
                <Link
                  to="/store"
                  className="inline-flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Shop Now</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {userOrders.map(order => {
                  const branch = branches.find(b => b.id === order.branchId);
                  return (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm md:text-base">Order #{order.id.slice(-6)}</h3>
                          <p className="text-xs md:text-sm text-gray-600">{branch?.name}</p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getOrderStatusColor(order.orderStatus)}`}>
                            {getOrderStatusLabel(order.orderStatus)}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs md:text-sm text-gray-600 mb-1">
                          <span className="font-medium">Items:</span> {order.products.length} products
                        </p>
                        <div className="text-xs text-gray-500">
                          {order.products.slice(0, 2).map(p => p.name).join(', ')}
                          {order.products.length > 2 && ` +${order.products.length - 2} more`}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Amount:</span> ₹{order.totalAmount}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        {order.paymentIntentId && (
                          <div className="md:col-span-2">
                            <span className="font-medium">Payment ID:</span>
                            <span className="font-mono text-xs ml-1">{order.paymentIntentId}</span>
                          </div>
                        )}
                        {order.trackingNumber && (
                          <div className="md:col-span-2">
                            <span className="font-medium">Tracking:</span> {order.trackingNumber}
                          </div>
                        )}
                      </div>

                      {/* Enhanced Order Status Timeline */}
                      {order.orderStatus !== 'pending' && (
                        <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-3 text-sm">Order Progress</h4>
                          <div className="space-y-2">
                            {/* Status Progress Indicator */}
                            <div className="flex items-center space-x-2 text-xs">
                              {['payment_confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'].map((status, index) => {
                                const statusLabels = {
                                  'payment_confirmed': 'Payment Confirmed',
                                  'processing': 'Processing',
                                  'packed': 'Packed',
                                  'shipped': 'Shipped',
                                  'in_transit': 'In Transit',
                                  'out_for_delivery': 'Out for Delivery',
                                  'delivered': 'Delivered'
                                };

                                const statusOrder = ['pending', 'payment_confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'];
                                const currentIndex = statusOrder.indexOf(order.orderStatus);
                                const isCompleted = index <= currentIndex - 1; // -1 because we skip 'pending'
                                const isCurrent = status === order.orderStatus;

                                return (
                                  <div key={status} className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isCompleted || isCurrent ? 'bg-green-500' : 'bg-gray-300'
                                      }`}></div>
                                    <span className={`ml-2 ${isCompleted || isCurrent ? 'text-green-700 font-medium' : 'text-gray-500'
                                      }`}>
                                      {statusLabels[status as keyof typeof statusLabels]}
                                    </span>
                                    {index < 6 && <div className={`w-4 h-0.5 mx-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                      }`}></div>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Product Tracking Timeline */}
                      {order.trackingUpdates && order.trackingUpdates.length > 0 && (
                        <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                          <h4 className="font-medium text-gray-800 mb-2 text-sm">Tracking Updates</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {order.trackingUpdates.map((update, index) => (
                              <div key={update.id || index} className="flex justify-between items-start text-xs">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${update.status === 'delivered' || update.status === 'Delivered' ? 'bg-green-500' :
                                      update.status === 'shipped' || update.status === 'Shipped' || update.status === 'out_for_delivery' || update.status === 'Out for Delivery' ? 'bg-blue-500' :
                                        update.status === 'processing' || update.status === 'Processing' || update.status === 'packed' || update.status === 'Packed' ? 'bg-yellow-500' :
                                          'bg-gray-500'
                                      }`}></div>
                                    <span className="font-medium">{getOrderStatusLabel(update.status) || update.status}</span>
                                  </div>
                                  <p className="text-gray-600 ml-4">{update.description}</p>
                                  <p className="text-gray-500 ml-4">{update.location}</p>
                                </div>
                                <span className="text-gray-500 ml-2">
                                  {(() => {
                                    const ts = update.createdAt || update.timestamp;
                                    return ts ? new Date(ts as unknown as string).toLocaleDateString() : '';
                                  })()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => downloadInvoice(order)}
                          className="flex items-center space-x-1 px-2 md:px-3 py-1 bg-orange-600 text-white rounded text-xs md:text-sm hover:bg-orange-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Invoice</span>
                        </button>
                        {order.trackingNumber && (
                          <button onClick={() => setTrackOrder(order)} className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                            <Truck className="h-4 w-4" />
                            <span>Track</span>
                          </button>
                        )}
                        <button className="flex items-center space-x-1 px-2 md:px-3 py-1 bg-gray-600 text-white rounded text-xs md:text-sm hover:bg-gray-700 transition-colors">
                          <Eye className="h-4 w-4" />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {trackOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Order Tracking - #{trackOrder.id.slice(-8)}</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {(trackOrder.trackingUpdates || []).map((u, index) => (
                <div key={u.id || index} className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${u.status === 'delivered' || u.status === 'Delivered' ? 'bg-green-500' :
                        u.status === 'shipped' || u.status === 'Shipped' || u.status === 'out_for_delivery' || u.status === 'Out for Delivery' ? 'bg-blue-500' :
                          u.status === 'processing' || u.status === 'Processing' || u.status === 'packed' || u.status === 'Packed' ? 'bg-yellow-500' :
                            'bg-gray-500'
                        }`}></div>
                      <span className="font-medium">{getOrderStatusLabel(u.status) || u.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-4">{u.description}</p>
                    <p className="text-xs text-gray-500 ml-4">{u.location}</p>
                  </div>
                  <div className="text-xs text-gray-500">{(() => {
                    const ts = u.createdAt || u.timestamp;
                    return ts ? new Date(ts as unknown as string).toLocaleString() : '';
                  })()}</div>
                </div>
              ))}
              {(!trackOrder.trackingUpdates || trackOrder.trackingUpdates.length === 0) && (
                <div className="text-gray-600">No tracking updates yet.</div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setTrackOrder(null)} className="px-4 py-2 bg-gray-200 rounded-md">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
```

# src\components\Customer\EventBooking.tsx

```tsx
import { useState } from "react";
import {
  Play,
  Star,
  Calendar,
  Users,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const events = [
    {
      id: 1,
      icon: "🎂",
      title: "Birthday Parties",
      shortDesc:
        "Make birthdays unforgettable with themed art parties, slime making, and creative activities for all ages.",
      description:
        "Transform your child's special day into an artistic adventure! Our birthday party packages include personalized themes, age-appropriate art activities, and memorable takeaways. From canvas painting to pottery wheels, we ensure every guest leaves with a masterpiece and beautiful memories.",
      features: [
        "Customized themes",
        "All materials included",
        "Professional guidance",
        "Party favors",
        "Clean-up service",
      ],
      images: [
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop",
      ],
      feedbacks: [
        {
          name: "Priya Sharma",
          rating: 5,
          comment:
            "Amazing party! The kids were engaged for hours. Highly recommend!",
        },
        {
          name: "Rajesh Kumar",
          rating: 5,
          comment:
            "Professional team, creative activities. Best birthday party ever!",
        },
        {
          name: "Meera Patel",
          rating: 4,
          comment:
            "Great experience, kids loved the art activities. Will book again!",
        },
      ],
      videos: [
        {
          title: "Birthday Party Highlights",
          thumbnail:
            "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=200&fit=crop",
        },
        {
          title: "Kids Art Session",
          thumbnail:
            "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=300&h=200&fit=crop",
        },
      ],
    },
    {
      id: 2,
      icon: "🏢",
      title: "Corporate Events",
      shortDesc:
        "Team building activities with art workshops, collaborative projects, and stress-relief creative sessions.",
      description:
        "Boost team morale and creativity with our corporate art workshops. Perfect for team building, stress relief, and fostering innovation. Our facilitators guide groups through collaborative projects that enhance communication and build stronger workplace relationships.",
      features: [
        "Team building focus",
        "Flexible scheduling",
        "Corporate packages",
        "Professional facilitation",
        "Certificates",
      ],
      images: [
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop",
      ],
      feedbacks: [
        {
          name: "Tech Solutions Ltd",
          rating: 5,
          comment:
            "Excellent team building activity. Our team loved the creative challenge!",
        },
        {
          name: "Marketing Pro Inc",
          rating: 5,
          comment:
            "Perfect for stress relief. Everyone was so relaxed and happy afterwards.",
        },
        {
          name: "Design Studio",
          rating: 4,
          comment:
            "Great way to break the routine. Highly professional service.",
        },
      ],
      videos: [
        {
          title: "Corporate Team Building",
          thumbnail:
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=200&fit=crop",
        },
        {
          title: "Office Art Workshop",
          thumbnail:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&h=200&fit=crop",
        },
      ],
    },
    {
      id: 3,
      icon: "🎨",
      title: "Art Workshops",
      shortDesc:
        "Community workshops featuring guest artists, new techniques, and collaborative art projects.",
      description:
        "Join our regular community workshops to learn new techniques, meet fellow art enthusiasts, and create beautiful pieces. From watercolor basics to advanced sculpting, our expert instructors provide personalized guidance for all skill levels.",
      features: [
        "Expert instructors",
        "All skill levels",
        "Materials provided",
        "Small groups",
        "Monthly themes",
      ],
      images: [
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&h=300&fit=crop",
      ],
      feedbacks: [
        {
          name: "Anita Desai",
          rating: 5,
          comment:
            "Learning so much in each session. The instructors are amazing!",
        },
        {
          name: "Vikram Singh",
          rating: 5,
          comment: "Great community, love the monthly themes. Very inspiring!",
        },
        {
          name: "Pooja Malhotra",
          rating: 4,
          comment:
            "Perfect for beginners like me. Very encouraging environment.",
        },
      ],
      videos: [
        {
          title: "Watercolor Workshop",
          thumbnail:
            "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=200&fit=crop",
        },
        {
          title: "Pottery Class",
          thumbnail:
            "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&h=200&fit=crop",
        },
      ],
    },
    {
      id: 4,
      icon: "👫",
      title: "Kitty Parties",
      shortDesc:
        "Private group bookings for friends, families, or special occasions with customized activities.",
      description:
        "Make your kitty party memorable with creative activities that bring friends together. Our customized sessions include art activities, refreshments, and plenty of laughter. Perfect for ladies' groups, friend circles, and special get-togethers.",
      features: [
        "Private bookings",
        "Customized activities",
        "Refreshments included",
        "Group discounts",
        "Photo sessions",
      ],
      images: [
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop",
      ],
      feedbacks: [
        {
          name: "Sunita Group",
          rating: 5,
          comment: "Best kitty party ever! Everyone loved the art activities.",
        },
        {
          name: "Friends Forever Club",
          rating: 5,
          comment: "So much fun! The perfect way to bond with friends.",
        },
        {
          name: "Ladies Circle",
          rating: 4,
          comment: "Creative and enjoyable. Will definitely book again!",
        },
      ],
      videos: [
        {
          title: "Kitty Party Fun",
          thumbnail:
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=200&fit=crop",
        },
        {
          title: "Group Art Session",
          thumbnail:
            "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&h=200&fit=crop",
        },
      ],
    },
    {
      id: 5,
      icon: "🎪",
      title: "Baby Shower Parties",
      shortDesc:
        "Celebrate new beginnings with gentle art activities and memorable keepsakes for expecting mothers.",
      description:
        "Celebrate the upcoming arrival with our special baby shower art parties. Create personalized keepsakes, decorate onesies, and make beautiful memories with art activities designed for expecting mothers and their loved ones.",
      features: [
        "Gentle activities",
        "Keepsake creation",
        "Maternity-friendly",
        "Custom decorations",
        "Memory book",
      ],
      images: [
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=500&h=300&fit=crop",
        "https://images.unsplash.com/photo-1576219313824-e2d0d7f72056?w=500&h=300&fit=crop",
      ],
      feedbacks: [
        {
          name: "Kavita Agarwal",
          rating: 5,
          comment:
            "Perfect for my baby shower. Everyone loved creating keepsakes!",
        },
        {
          name: "Rina Chopra",
          rating: 5,
          comment:
            "So thoughtful and creative. Made my special day even more memorable.",
        },
        {
          name: "Deepa Jain",
          rating: 4,
          comment:
            "Beautiful activities, perfect for expecting mothers. Highly recommend!",
        },
      ],
      videos: [
        {
          title: "Baby Shower Celebration",
          thumbnail:
            "https://res.cloudinary.com/dwb3vztcv/video/upload/v1755549136/BABY_SHOWER_AT_ARTGARM_jjzl9x.mp4",
        },
        {
          title: "Keepsake Creation",
          thumbnail:
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
        },
      ],
    },
  ];

  const nextImage = () => {
    if (selectedEvent) {
      setCurrentImageIndex((prev) =>
        prev === selectedEvent.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedEvent) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedEvent.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-900 via-orange-900 to-orange-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-24 h-24 rounded-full bg-white/5 backdrop-blur-sm animate-pulse"
              style={{
                left: `${15 + (i * 15)}%`,
                top: `${20 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 text-center">
          <div className="mb-6 inline-block rounded-full bg-white/10 px-6 py-2 backdrop-blur-sm">
            <span className="text-sm font-medium text-white">
              ✨ Creating Magical Moments
            </span>
          </div>
          <h1 className="mb-6 text-5xl font-extrabold leading-tight text-white md:text-7xl">
            Special{" "}
            <span className="bg-gradient-to-r from-orange-400 to-orange-400 bg-clip-text text-transparent">
              Events
            </span>
          </h1>
          <p className="mb-4 text-xl text-white/90 md:text-2xl">
            Celebrate life's special moments with creative experiences
          </p>
          <p className="text-lg text-white/80">
            Birthday parties, corporate events, and community workshops
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-800">
              Our Events
            </h2>
            <p className="text-lg text-gray-600">
              Choose from our variety of creative experiences
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => {
                  setSelectedEvent(event);
                  setActiveTab("description");
                  setCurrentImageIndex(0);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed left-0 right-0 bottom-0 top-24 z-50 bg-black/60 backdrop-blur-sm">
          <div className="relative h-[calc(100vh-6rem)] w-screen overflow-hidden bg-white">
            {/* Close Button */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute right-6 top-6 z-10 rounded-full bg-white/10 p-2 text-gray-600 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="overflow-y-auto h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-12 text-white">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm">
                    {selectedEvent.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">
                      {selectedEvent.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b bg-gray-50 px-4 md:px-8 ">
                <nav className="flex space-x-4 md:space-x-8 overflow-x-auto hide-scrollbar">
                  {[
                    { id: "description", label: "Description", icon: "📝" },
                    { id: "images", label: "Gallery", icon: "🖼️" },
                    { id: "feedback", label: "Reviews", icon: "⭐" },
                    { id: "videos", label: "Videos", icon: "🎥" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 border-b-2 px-3 py-3 md:px-4 md:py-4 text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-rose-500 text-rose-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content Sections */}
              <div className="p-8">
                {activeTab === "description" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="mb-3 text-xl font-semibold text-gray-800">
                        About This Event
                      </h4>
                      <p className="leading-relaxed text-gray-600">
                        {selectedEvent.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-3 text-xl font-semibold text-gray-800">
                        What's Included
                      </h4>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {selectedEvent.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 py-4 text-white font-semibold text-lg hover:shadow-lg transition-all transform hover:scale-105">
                      Book This Event
                    </button>
                  </div>
                )}

                {activeTab === "images" && (
                  <div className="space-y-6">
                    <div className="relative">
                      <img
                        src={selectedEvent.images[currentImageIndex]}
                        alt={`${selectedEvent.title} ${currentImageIndex + 1}`}
                        className="h-96 w-full rounded-2xl object-cover shadow-lg"
                      />

                      {selectedEvent.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm hover:bg-white"
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm hover:bg-white"
                          >
                            <ChevronRight className="h-6 w-6" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {selectedEvent.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 rounded-xl overflow-hidden ${
                            currentImageIndex === index
                              ? "ring-4 ring-orange-500"
                              : ""
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="h-20 w-32 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "feedback" && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="mb-2 flex items-center justify-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-6 w-6 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-2xl font-bold text-gray-800">
                          4.9
                        </span>
                      </div>
                      <p className="text-gray-600">
                        Based on {selectedEvent.feedbacks.length} reviews
                      </p>
                    </div>

                    <div className="space-y-4">
                      {selectedEvent.feedbacks.map((feedback, index) => (
                        <div key={index} className="rounded-2xl bg-gray-50 p-6">
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-800">
                                {feedback.name}
                              </h5>
                              <div className="flex">
                                {[...Array(feedback.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600">{feedback.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "videos" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {selectedEvent.videos.map((video, index) => (
                        <div
                          key={index}
                          className="group cursor-pointer overflow-hidden rounded-2xl bg-gray-100 shadow-lg hover:shadow-xl transition-all"
                        >
                          <div className="relative">
                            {(
                              video.src ||
                              (video.thumbnail &&
                                (video.thumbnail.endsWith(".mp4") ||
                                  video.thumbnail.endsWith(".webm") ||
                                  video.thumbnail.endsWith(".ogg")))
                            ) ? (
                              <video
                                controls
                                src={video.src ? video.src : video.thumbnail}
                                className="h-[520px] w-full rounded-2xl object-cover bg-black"
                                playsInline
                              />
                            ) : (
                              <>
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="h-[520px] w-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                                  <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                                    <Play className="h-8 w-8 text-white" />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="p-4">
                            <h5 className="font-semibold text-gray-800">
                              {video.title}
                            </h5>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EventCard = ({ event, onClick }) => {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-orange-400 to-purple-500 p-8">
          <div className="flex h-full flex-col justify-between">
            <div className="text-right">
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                Popular
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm">
                {event.icon}
              </div>
              <div className="text-right"></div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h4 className="mb-3 text-2xl font-bold text-gray-800">
            {event.title}
          </h4>
          <p className="mb-6 leading-relaxed text-gray-600">
            {event.shortDesc}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Flexible</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Groups</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium text-gray-700">4.9</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t bg-gray-50 p-6">
        <button
          onClick={onClick}
          className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 py-3 font-semibold text-white transition-all hover:shadow-lg transform hover:scale-105"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default EventsPage;
```

# src\components\Customer\Profile.tsx

```tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [stateVal, setStateVal] = useState(user?.address?.state || '');
  const [zipCode, setZipCode] = useState(user?.address?.zipCode || '');
  const [country, setCountry] = useState(user?.address?.country || '');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!updateProfile) return;
    setSaving(true);
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: {
        street: street.trim(),
        city: city.trim(),
        state: stateVal.trim(),
        zipCode: zipCode.trim(),
        country: country.trim() || 'India'
      }
    });
    setSaving(false);
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Street</label>
              <input value={street} onChange={e => setStreet(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input value={city} onChange={e => setCity(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input value={stateVal} onChange={e => setStateVal(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ZIP</label>
              <input value={zipCode} onChange={e => setZipCode(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input value={country} onChange={e => setCountry(e.target.value)} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleSave} disabled={saving} className="bg-orange-600 text-white px-4 py-2 rounded-md">{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-md border">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

```

# src\components\Customer\Store.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { initiatePayment, createRazorpayOrder, RazorpayResponse } from '../../utils/razorpay';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

const Store: React.FC = () => {
  const { products, createOrder } = useData();
  const { user } = useAuth();
  const [cart, setCart] = useState<{ [productId: string]: number }>({});
  const [filter, setFilter] = useState('all');
  const [searchTerm] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [priceRange, setPriceRange] = useState(3000);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const availableProducts = products.filter(product => 
    product.isActive && 
    product.stock > 0 &&
    (filter === 'all' || product.category === filter) &&
    (searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (product.price <= priceRange)
  );

  const categories = [
    { id: 'all', name: 'All Products', icon: '🎨', count: products.length },
    ...Array.from(new Set(products.map(p => p.category))).map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1) + ' Kits',
      icon: cat === 'slime' ? '🌈' : cat === 'art' ? '🎨' : cat === 'tufting' ? '🧶' : '🛍️',
      count: products.filter(p => p.category === cat).length
    }))
  ];

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product && (cart[productId] || 0) < product.stock) {
      setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [productId, qty]) => {
      const product = products.find(p => p.id === productId);
      return sum + (product?.price || 0) * qty;
    }, 0);
  };

    const handleCheckout = async () => {
    if (!user) {
      alert('Please login to checkout');
      return;
    }

    setProcessing(true);
    try {
      const totalAmount = getTotalPrice();
      const orderProducts = Object.entries(cart).map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId)!;
        return {
          productId,
          quantity,
          price: product.price,
          name: product.name
        };
      });

      // Create Razorpay order (server-side recommended)
      const order = await createRazorpayOrder(totalAmount);
      // Initiate Razorpay payment
      await initiatePayment({
        amount: order.amount / 100,
        currency: order.currency,
        name: 'Craft Factory',
        description: 'Purchase from Craft Factory Store',
        order_id: order.id,
        key: 'rzp_test_default_key', // Default key for global orders
        handler: async (response: RazorpayResponse) => {
          try {
            // Payment successful, create order
            await createOrder({
              customerId: user.id,
              customerName: user.name,
              customerEmail: user.email,
              customerPhone: user?.phone || '',
              branchId: 'online', // Online orders not tied to specific branch
              products: orderProducts,
              totalAmount,
              paymentStatus: 'completed',
              orderStatus: 'pending',
              paymentIntentId: response.razorpay_payment_id,
              shippingAddress: {
                street: '123 Main St',
                city: 'City',
                state: 'State',
                zipCode: '12345',
                country: 'India'
              }
            });
            
            setCart({});
            setShowCheckout(false);
            setProcessing(false);
            alert('Payment successful! Order placed successfully. Check your dashboard for tracking details.');
          } catch {
            alert('Order failed after payment. Please contact support.');
            setProcessing(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: '9999999999' // You might want to add phone to user profile
        },
        theme: {
          color: '#ea580c' // Orange color matching your theme
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          }
        }
      });

      } catch {
      alert('Payment failed. Please try again.');
      setProcessing(false);
    } finally {
      // Processing state will be reset in payment handler or modal dismiss
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-rose-50 ">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-rose-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-24 h-24 rounded-full bg-white/5 backdrop-blur-sm animate-pulse"
              style={{
                left: `${15 + (i * 15)}%`,
                top: `${20 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`
              }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className={`text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="mb-4">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-rose-200 bg-clip-text text-transparent mb-1">
                Art & Slime
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-rose-400 mx-auto rounded-full mb-6" />
            </div>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Curated premium kits and materials to bring your creativity to life at home!
            </p>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-32">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <span className="text-2xl">🔍</span>
                  Filters
                </h2>
                <div className="space-y-8">
                  {/* Categories */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Categories</h3>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setFilter(category.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-left
                            ${filter === category.id 
                              ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-lg' 
                              : 'bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                            }`}
                        >
                          <span className="text-xl">{category.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold">{category.name}</div>
                            <div className={`text-sm ${filter === category.id ? 'text-white/80' : 'text-gray-500'}`}>
                              {category.count} items
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Price Range */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Price Range</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>₹0</span>
                        <span className="font-semibold text-purple-600">₹{priceRange}</span>
                        <span>₹3000</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="3000" 
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600" 
                      />
                    </div>
                  </div>
                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-purple-50 to-rose-50 p-6 rounded-2xl">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🎯</div>
                      <div className="text-lg font-bold text-purple-600">{availableProducts.length} Products</div>
                      <div className="text-sm text-gray-600">Match your filters</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
            {/* Products Grid */}
            <main className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {filter === 'all' ? 'All Products' : categories.find(c => c.id === filter)?.name}
                </h2>
                <p className="text-gray-600">
                  Showing {availableProducts.length} of {products.length} products
                </p>
              </div>
              {/* Shopping Cart Summary */}
              {getTotalItems() > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <ShoppingCart className="h-5 w-5 text-orange-600" />
                      <span className="text-orange-800 font-semibold">
                        Cart: {getTotalItems()} items
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-orange-800 font-bold text-lg">₹{getTotalPrice()}</span>
                      <button
                        onClick={() => setShowCheckout(true)}
                        disabled={!user}
                        className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Products Grid */}
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                {availableProducts.length === 0 ? (
                  <div className="col-span-full text-center py-20">
                    <div className="text-gray-400 text-6xl mb-4">🛍️</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      No products match your current filters. Try adjusting your search criteria.
                    </p>
                  </div>
                ) : (
                  availableProducts.map((product, index) => {
                    const cartQuantity = cart[product.id] || 0;
                    return (
                      <div
                        key={product.id}
                        className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:scale-105"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Product Image */}
                        <div className="relative h-80 w-full overflow-hidden">
                          <div
                            className="h-full w-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: `url('${product.images?.[0] || ''}')` }}
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            {/* You can add a details link here if needed */}
                          </div>
                          {/* Optional Badge (Top Left) */}
                          {product.badge && (
                            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg bg-purple-600`}>
                              {product.badge}
                            </div>
                          )}
                          {/* Optional Discount Badge (Top Right) */}
                          {product.originalPrice && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                            </div>
                          )}
                          {/* Shop Icon (Bottom Right) */}
                          <div 
                            className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white cursor-pointer"
                            onClick={() => addToCart(product.id)}
                          >
                            <ShoppingCart className="h-6 w-6 text-gray-800" />
                          </div>
                        </div>
                        {/* Product Info */}
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                          </div>
                          {/* Removed description and rating as requested */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                          </div>
                          {/* Removed 'Includes' (materials) section as requested */}
                          <div className="flex justify-between items-center mb-4">
                            <span className={`text-sm px-2 py-1 rounded ${
                              product.stock > 10 ? 'bg-green-100 text-green-800' :
                              product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              Stock: {product.stock}
                            </span>
                            <span className="text-sm text-gray-600">Available Nationwide</span>
                          </div>
                          <div className="flex items-center justify-between">
                            {cartQuantity > 0 ? (
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => removeFromCart(product.id)}
                                  className="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400 transition-colors"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="font-semibold text-lg">{cartQuantity}</span>
                                <button
                                  onClick={() => addToCart(product.id)}
                                  disabled={cartQuantity >= product.stock}
                                  className="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400 disabled:opacity-50 transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(product.id)}
                                disabled={product.stock === 0 || !user}
                                className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <ShoppingCart className="h-4 w-4" />
                                <span>{!user ? 'Login to Buy' : 'Add to Cart'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {/* Bulk Orders Section */}
              <div className="bg-gradient-to-br from-white via-purple-50 to-rose-50 p-12 rounded-3xl shadow-xl border border-purple-100 mt-12">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="text-6xl mb-6">📦</div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent mb-4">
                    Looking for Bulk Orders?
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                    We offer special discounts on bulk purchases for parties, corporate events, and gifting. 
                    Get in touch with us for a custom quote and exclusive deals!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="group bg-gradient-to-r from-purple-600 to-rose-600 text-white font-semibold px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <span className="flex items-center justify-center gap-3">
                        📞 Get Custom Quote
                        <div className="w-0 group-hover:w-4 h-0.5 bg-white rounded transition-all duration-300" />
                      </span>
                    </button>
                    <button className="bg-white text-purple-600 border-2 border-purple-600 font-semibold px-8 py-4 rounded-full hover:bg-purple-50 transition-all duration-300">
                      Learn More
                    </button>
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">10%+</div>
                      <div className="text-sm text-gray-600">Bulk Discounts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">24h</div>
                      <div className="text-sm text-gray-600">Quick Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">🎁</div>
                      <div className="text-sm text-gray-600">Custom Packaging</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Checkout Modal */}
              {showCheckout && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-bold mb-4">Checkout</h3>
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Order Summary</h4>
                        {Object.entries(cart).map(([productId, quantity]) => {
                          const product = products.find(p => p.id === productId);
                          return (
                            <div key={productId} className="flex justify-between items-center py-2">
                              <div>
                                <p className="font-medium">{product?.name}</p>
                                <p className="text-sm text-gray-600">Qty: {quantity}</p>
                              </div>
                              <span className="font-semibold">₹{(product?.price || 0) * quantity}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg">Total Amount:</span>
                          <span className="text-2xl font-bold text-orange-600">₹{getTotalPrice()}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>• Items will be shipped to your registered address</p>
                        <p>• You will receive tracking information via email</p>
                        <p>• Payment will be processed securely</p>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setShowCheckout(false)}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCheckout}
                          disabled={processing}
                          className="flex-1 bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
                        >
                          {processing ? 'Processing...' : 'Pay with Razorpay'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Store;
```

# src\components\Home\About.tsx

```tsx
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Users, Award, Heart, Target } from 'lucide-react';

const About: React.FC = () => {
  const { cmsContent } = useData();
  const aboutContent = cmsContent.find(c => c.type === 'about' && c.isActive);
  const aboutImages = aboutContent?.images || ['https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg'];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {aboutContent?.title || 'About Craft Factory'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {aboutContent?.content || 'We are passionate about bringing creativity to life through hands-on crafting experiences'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img
                src={aboutImages[0]}
                alt="Craft Factory Workshop"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg';
                }}
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h3>
              <p className="text-gray-600 mb-6">
                Founded with a passion for creativity, Craft Factory has been inspiring artists and crafters 
                of all ages to explore their artistic potential. Our expert instructors and premium materials 
                create the perfect environment for learning and creating.
              </p>
              <p className="text-gray-600 mb-6">
                From daily slime-making classes to advanced crafting workshops, we offer a wide range of 
                activities designed to spark imagination and develop artistic skills.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Expert Instructors</h4>
              <p className="text-gray-600">Passionate professionals with years of experience</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Quality Materials</h4>
              <p className="text-gray-600">Premium supplies from trusted brands</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Small Classes</h4>
              <p className="text-gray-600">Intimate groups for personalized attention</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">All Skill Levels</h4>
              <p className="text-gray-600">From beginners to advanced crafters</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
```

# src\components\Home\Activities.tsx

```tsx
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Activities: React.FC = () => {
  const { events, branches } = useData();
  const upcomingEvents = events.filter(e => e.isActive).slice(0, 4);

  return (
    <section id="activities" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Daily Activities</h2>
            <p className="text-xl text-gray-600">Join our exciting daily classes and workshops</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {upcomingEvents.map(event => {
              const branch = branches.find(b => b.id === event.branchId);
              return (
                <div key={event.id} className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg shadow-lg overflow-hidden text-white">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                    <p className="mb-4 opacity-90">{event.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        <span>{event.maxSeats - event.bookedSeats} seats left</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>{branch?.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">₹{event.price}</span>
                      <Link
                        to="/events"
                        className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-block"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors"
            >
              <Calendar className="h-5 w-5" />
              <span>View All Activities</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities;
```

# src\components\Home\Carousel.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel: React.FC = () => {
  const { cmsContent } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselContent = cmsContent.filter(c => c.type === 'carousel' && c.isActive);

  useEffect(() => {
    if (carouselContent.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselContent.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [carouselContent.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselContent.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselContent.length) % carouselContent.length);
  };

  if (carouselContent.length === 0) {
    return null;
  }

  return (
    <section className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
      {carouselContent.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className="relative h-full">
            {slide.images && slide.images[0] && (
              <img
                src={slide.images[0]}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {carouselContent.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {carouselContent.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselContent.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Carousel;
```

# src\components\Home\Contact.tsx

```tsx
"use client";
import React, { useState, useEffect } from 'react';

const ContactUsPage = () => {
    const [isVisible, setIsVisible] = useState(false)
    useEffect(() => {
        setIsVisible(true)
      }, [])
  
  // Helper functions to open email and WhatsApp
  function openGmail(email) {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, "_blank");
  }

  function openWhatsApp(phoneNumber, message) {
    const encodedMessage = encodeURIComponent(message);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const url = isMobile 
      ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.elements.namedItem("name")?.value || "there";
    alert(`Thank you for contacting us, ${name}! We'll get back to you shortly.`);
    form.reset();
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-rose-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-rose-900 overflow-hidden">
      <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-24 h-24 rounded-full bg-white/5 backdrop-blur-sm animate-pulse"
              style={{
                left: `${15 + (i * 15)}%`,
                top: `${20 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`
              }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className={`text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <div className="mb-6">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-rose-200 bg-clip-text text-transparent mb-4">Get in Touch</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-rose-400 mx-auto rounded-full mb-6" />
            </div>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">We'd love to hear from you! Whether it's a question, feedback, or collaboration idea—drop us a message.</p>
        </div>
        </div>
      </section>

      {/* Contact Form & Details */}
      

      {/* Branches Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold mb-12 text-gray-800">Our Branches</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BranchCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754637272/wp6539521_vvafqv.jpg"
              name="Hyderabad"
              address="#NO.8-2-686/K/1 AND 8-2686/K/2, 5TH FLOOR, KIMTEE SQUARE, ROAD NO-12, BANJARA HILLS, CIRCLE 37, HYDERABAD 500034"
              phone="+917766012299"
              openTime="9:00 AM"
              closeTime="9:00 PM"
              onWhatsApp={() => openWhatsApp("917766012299", "Hi, I am interested in ArtGram activities in Hyderabad!")}
            />
            <BranchCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754637352/jayanth-muppaneni-y96JVdGu7XU-unsplash_1_kooajm.jpg"
              name="Bangalore"
              address="#418, 4TH FLOOR, JB ARCADE, 27TH MAIN ROAD, HSR LAYOUT, SECTOR 1, BENGALURU 560102"
              phone="+919216345672"
              openTime="9:30 AM"
              closeTime="9:30 PM"
              onWhatsApp={() => openWhatsApp("919216345672", "Hi, I am interested in ArtGram activities in Bangalore!")}
            />
            <BranchCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754637135/durgamma_temple_vj_6472215382_l3h6wj.jpg"
              name="Vijayawada"
              address="#40-6-11, 2ND FLOOR, MEENAKSHI TOWERS HOTEL, MURALI FORTUNE ROAD, MOGALRAJPURAM, OPP. SUBWAY 520010"
              phone="+919686846100"
              openTime="10:00 AM"
              closeTime="8:00 PM"
              onWhatsApp={() => openWhatsApp("919686846100", "Hi, I am interested in ArtGram activities in Vijayawada!")}
            />
             <BranchCard
              img="https://media2.thrillophilia.com/images/photos/000/013/594/original/1567154682_shutterstock_1304062492.jpg?w=753&h=450&dpr=1.5"
              name="Yelagiri"
              address="Nilavoor Road
Yelagiri Hills - 635853, Tamil Nadu"
              phone="+919566351199"
               openTime="9:30 AM"
              closeTime="9:30 PM"
              onWhatsApp={() => openWhatsApp("919566351199", "Hi, I am interested in ArtGram activities in Vijayawada!")}
            />
            <BranchCard
              img="https://im.whatshot.in/img/2020/Aug/istock-1139387103-cropped-1597665160.jpg"
              name="Nagpur"
              address="Kidzee Planet
Plot No. 18, Gajanan Mandir Road, Ring Road, Renghe Layout, Behind Bhagwaati Hall, Trimurtee Nagar, Nagpur, Maharashtra 440022
"
              phone="+91880630693"
               openTime="9:30 AM"
              closeTime="9:30 PM"
              onWhatsApp={() => openWhatsApp("918806320693", "Hi, I am interested in ArtGram activities in Vijayawada!")}
            />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Studio Locations</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Visit us at any of our vibrant studios across South India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hyderabad Location */}
            <a 
              href="https://www.google.com/maps/place/Artgram/@17.4114992,78.4323407,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcb970038d64857:0x406d7a28320f2e9b!8m2!3d17.4114992!4d78.4349156!16s%2Fg%2F11ryf2z9v5?entry=ttu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
            >
              <div className="h-64 relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.0060108339585!2d78.43234067524435!3d17.411499183479815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb970038d64857%3A0x406d7a28320f2e9b!2sArtgram!5e0!3m2!1sen!2sin!4v1755189886825!5m2!1sen!2sin"
                  title="Artgram Hyderabad Location"
                  className="w-full h-full absolute inset-0 pointer-events-none"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-xl">Hyderabad</h3>
                </div>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    📍
                  </div>
                  <p className="text-gray-700 font-medium">Banjara Hills, Road No. 12</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    🕒
                  </div>
                  <p className="text-gray-700">Mon-Sun: 9AM - 9PM</p>
                </div>
                <div className="mt-4 text-purple-600 font-medium flex items-center gap-2">
                  <span>View on Maps</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </a>

            {/* Vijayawada Location */}
            <a 
              href="https://www.google.com/maps/place/ARTGRAM/@16.5041061,80.6443325,17z/data=!3m1!4b1!4m6!3m5!1s0x3a35fbf061f36a01:0x57d79131087c8de4!8m2!3d16.5041061!4d80.6469074!16s%2Fg%2F11v0v3c8w4?entry=ttu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
            >
              <div className="h-64 relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.4353260109456!2d80.64433247522446!3d16.504106084240263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35fbf061f36a01%3A0x57d79131087c8de4!2sARTGRAM!5e0!3m2!1sen!2sin!4v1755189043469!5m2!1sen!2sin"
                  title="Artgram Vijayawada Location"
                  className="w-full h-full absolute inset-0 pointer-events-none"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-xl">Vijayawada</h3>
                </div>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    📍
                  </div>
                  <p className="text-gray-700 font-medium">MG Road, Near Prakasam Barrage</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    🕒
                  </div>
                  <p className="text-gray-700">Mon-Sun: 10AM - 8PM</p>
                </div>
                <div className="mt-4 text-purple-600 font-medium flex items-center gap-2">
                  <span>View on Maps</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </a>

            {/* Bengaluru Location */}
            <a 
              href="https://www.google.com/maps/place/Artgram/@12.9187316,77.6491285,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae15ae8353d0dd:0x395df1674441651f!8m2!3d12.9187316!4d77.6517034!16s%2Fg%2F11s7j9wq5_?entry=ttu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
            >
              <div className="h-64 relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.8286590945104!2d77.64912847515608!3d12.918731587391807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15ae8353d0dd%3A0x395df1674441651f!2sArtgram!5e0!3m2!1sen!2sin!4v1755189902986!5m2!1sen!2sin"
                  title="Artgram Bengaluru Location"
                  className="w-full h-full absolute inset-0 pointer-events-none"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-xl">Bengaluru</h3>
                </div>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    📍
                  </div>
                  <p className="text-gray-700 font-medium">HSR Layout, Sector 2</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    🕒
                  </div>
                  <p className="text-gray-700">Mon-Sun: 9:30AM - 9:30PM</p>
                </div>
                <div className="mt-4 text-purple-600 font-medium flex items-center gap-2">
                  <span>View on Maps</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-5 gap-12">
          {/* Form on the left */}
          

          {/* Contact info on the right */}
          <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-xl border-gray-100 sticky top-32">
            <h3 className="text-2xl font-semibold mb-6">Reach Us Directly</h3>
            <div className="space-y-4 text-slate-900">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <div>
                  <strong>Email:</strong><br />
                  <button onClick={() => openGmail("artgram.yourhobbylobby@gmail.com")} className="text-purple-600 hover:underline">
                    artgram.yourhobbylobby@gmail.com
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
                <div>
                  <strong>Phone:</strong><br />
                  <a href="tel:+919686846100" className="hover:text-purple-600">+91 9686846100</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                <div>
                  <strong>Instagram:</strong><br />
                  <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/artgram_yourhobbylobby/?hl=en" className="text-purple-600 hover:underline">
                    @artgram_yourhobbylobby
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <div>
                  <strong>Business Hours:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-700">
                    <li>Mon - Sat: 10:00 AM - 8:00 PM</li>
                    <li>Sun: 10:00 AM - 6:00 PM</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * Branch Card Component with official logos
 */
const BranchCard = ({ img, name, address, phone, openTime, closeTime, onWhatsApp, instagram }) => {
  return (
    <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer transform hover:scale-105">
      <div className="relative h-52 overflow-hidden">
        <img 
          src={img || "/placeholder.svg"} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h4 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-purple-600">{name}</h4>
        
        {/* Address with map icon and link */}
        <div className="flex items-start mb-3">
          <svg className="w-4 h-4 mt-1 mr-2 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
          </svg>
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-600 text-sm hover:text-purple-600 transition-colors"
          >
            {address}
          </a>
        </div>
        
        {/* Opening hours */}
        <div className="flex items-start mb-4">
          <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <div className="text-slate-600 text-sm">
            <div className="font-medium">Opening Hours:</div>
            <div>{openTime} - {closeTime}</div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3 mt-auto">
  {/* Call */}
  <a 
    href={`tel:${phone}`} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
    </svg>
  </a>

  {/* WhatsApp */}
  <button 
    onClick={onWhatsApp} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
  >
   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
  <path d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.59 5.97L0 24l6.22-1.63A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22.02a9.92 9.92 0 01-5.05-1.38l-.36-.22-3.7.97.99-3.61-.24-.37A9.94 9.94 0 012.02 12C2.02 6.48 6.48 2.02 12 2.02c2.67 0 5.18 1.04 7.07 2.93A9.94 9.94 0 0121.98 12c0 5.52-4.46 10.02-9.98 10.02zm5.38-7.47c-.29-.15-1.72-.85-1.98-.95s-.46-.15-.65.15c-.2.29-.75.95-.92 1.14-.17.2-.34.22-.63.07-.29-.15-1.21-.45-2.3-1.44-.85-.76-1.42-1.7-1.59-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.2.05-.37-.02-.52-.07-.15-.63-1.52-.87-2.08-.23-.55-.47-.47-.65-.48-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.29-1.05 1.02-1.05 2.49 0 1.47 1.08 2.89 1.23 3.09.15.2 2.14 3.38 5.18 4.61.73.32 1.3.51 1.74.65.73.23 1.39.2 1.91.12.58-.09 1.72-.7 1.96-1.37.24-.67.24-1.24.17-1.36-.07-.12-.27-.19-.57-.34z"/>
</svg>

  </button>

  {/* Google Maps */}
  <a 
    href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
    </svg>
  </a>

  {/* Instagram */}
  <a 
    href={instagram} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors"
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.75 2.25a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1a.75.75 0 01.75-.75zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"/>
    </svg>
  </a>
</div>

      </div>
    </div>
  );
};


export default ContactUsPage;
```

# src\components\Home\Events.tsx

```tsx
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Calendar, Clock, Users, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events: React.FC = () => {
  const { events, branches, cmsContent } = useData();
  const specialEvents = events.filter(e => e.isActive && e.price > 600).slice(0, 3);
  const eventsContent = cmsContent.find(c => c.type === 'events' && c.isActive);
  const eventImages = eventsContent?.images || [];

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Special Events</h2>
            <p className="text-xl text-gray-600">Join our exclusive workshops and special craft sessions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {specialEvents.map(event => {
              const branch = branches.find(b => b.id === event.branchId);
              const eventImage = eventImages[0] || 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg';
              return (
                <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={eventImage}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 bg-opacity-80 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Calendar className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-lg font-semibold">Special Workshop</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">Premium Event</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.time} ({event.duration} min)</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.maxSeats - event.bookedSeats} seats available</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{branch?.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-600">₹{event.price}</span>
                      <Link
                        to="/events"
                        className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors inline-block"
                      >
                        Register Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
            >
              <Calendar className="h-5 w-5" />
              <span>View All Events</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
```

# src\components\Home\Features.tsx

```tsx

import React from 'react';
import { Link } from 'react-router-dom';

const Features: React.FC = () => {
  return (
    <>
      <section
        id="activities"
        className="py-20 text-center bg-gradient-to-br from-slate-50 to-gray-100"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <h2 className="text-4xl font-black bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
              Explore activities at Artgram
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <ActivityCard
              img="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755538130/HAR05881_knyc5j.jpg"
              title="🎨 Art Making"
              text="Enjoy 30+ hands on activities for all age groups"
              bgColor="bg-gradient-to-br from-orange-100 to-orange-100"
              link="/art-making-activity.html"
            />
            <ActivityCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754630801/HAR05956_c7944n.jpg"
              title="🌈 Slime Play"
              text="Get messy and creative with colorful, stretchy slime! Perfect for kids and adults who love sensory fun."
              bgColor="bg-gradient-to-br from-orange-100 to-orange-100"
              link="/slime-play.html"
            />
            <ActivityCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651197/HAR05826_iefkzg.jpg"
              title="🧶 Tufting"
              text="Explore a new art form: make your own rugs and coasters to decorate your home."
              bgColor="bg-gradient-to-br from-orange-100 to-orange-100"
              link="/tufting-activity.html"
            />
          </div>
        </div>
      </section>
      {/* Events Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center lg:justify-start">
              <a
                href="https://youtube.com/shorts/3Ho2S0v2PF0?si=jqswBjCvh31Vbd4u"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full max-w-lg h-72 rounded-2xl shadow-2xl border-4 border-gradient-to-r from-orange-200 to-orange-200 overflow-hidden relative"
              >
                <img
                  src="https://img.youtube.com/vi/3Ho2S0v2PF0/maxresdefault.jpg"
                  alt="YouTube Video Thumbnail"
                  className="w-full h-full object-cover"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-white drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </a>
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-black bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent mb-6">
                Events at Artgram
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-gray-700">
                Artgram is the ultimate destination for birthdays,
                get-togethers, and corporate events. Whether you're planning a
                cozy gathering or a grand celebration, we offer tailored
                packages to suit every occasion.
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Whatever your vision, Artgram ensures a seamless, joyful
                experience for you and your guests!
              </p>
            </div>
          </div>
          {/* Event Cards */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <EventCard
              icon="🎂"
              title="Birthdays"
              bgColor="bg-gradient-to-br from-orange-100 to-orange-100"
              link="/events"
            />
            <EventCard
              icon="👶"
              title="Baby Shower"
              bgColor="bg-gradient-to-br from-orange-100 to-orange-100"
              link="/events"
            />
            <EventCard
              icon="🏢"
              title="Corporate"
              bgColor="bg-gradient-to-br from-orange-100 to-orange-100"
              link="/events"
            />
            <EventCard
              icon="🎨"
              title="Workshops"
              bgColor="bg-gradient-to-br from-orange-100 to-orange-100"
              link="/events"
            />
          </div>
        </div>
      </section>
    </>
  );
};

type ActivityCardProps = {
  img: string;
  title: string;
  text: string;
  bgColor: string;
  link: string;
};

const ActivityCard: React.FC<ActivityCardProps> = ({ img, title, text, bgColor, link }) => {
  return (
    <Link to={link} className="block no-underline">
      <div
        className={`${bgColor} rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col border border-white/50 cursor-pointer`}
      >
        <div className="relative overflow-hidden">
          <img
            src={img}
            alt={title}
            className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-bold text-xl mb-3 text-gray-800">{title}</h3>
          <p className="text-gray-700 text-base leading-relaxed flex-grow">
            {text}
          </p>
        </div>
      </div>
    </Link>
  );
};

type EventCardProps = {
  icon: string;
  title: string;
  bgColor: string;
  link: string;
};

const EventCard: React.FC<EventCardProps> = ({ icon, title, bgColor, link }) => {
  return (
    <Link to={link} className="block no-underline">
      <div
        className={`text-center p-6 ${bgColor} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 cursor-pointer`}
      >
        <div className="text-4xl mb-4 transform hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
    </Link>
  );
};


export default Features;
```

# src\components\Home\Gallery.tsx

```tsx
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery: React.FC = () => {
  const { cmsContent } = useData();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Get gallery images from CMS, fallback to default images
  const galleryContent = cmsContent.find(c => c.type === 'gallery' && c.isActive);
  const cmsGalleryImages = galleryContent?.images || [];
  
  const defaultGalleryImages = [
    {
      id: 1,
      src: 'https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg',
      alt: 'Craft Workshop Session',
      category: 'Workshops'
    },
    {
      id: 2,
      src: 'https://images.pexels.com/photos/6941924/pexels-photo-6941924.jpeg',
      alt: 'Slime Making Class',
      category: 'Slime Classes'
    },
    {
      id: 3,
      src: 'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg',
      alt: 'Art Supplies',
      category: 'Materials'
    },
    {
      id: 4,
      src: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
      alt: 'Creative Workshop',
      category: 'Workshops'
    },
    {
      id: 5,
      src: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg',
      alt: 'Kids Crafting',
      category: 'Kids Classes'
    },
    {
      id: 6,
      src: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg',
      alt: 'Art Creation',
      category: 'Art Classes'
    }
  ];

  // Combine CMS images with default structure
  const galleryImages = cmsGalleryImages.length > 0 
    ? cmsGalleryImages.map((src, index) => ({
        id: index + 1,
        src,
        alt: `Gallery Image ${index + 1}`,
        category: 'Gallery'
      }))
    : defaultGalleryImages;

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Gallery</h2>
            <p className="text-xl text-gray-600">Explore our creative workshops and happy moments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <p className="font-semibold">{image.alt}</p>
                    <p className="text-sm">{image.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            
            <img
              src={galleryImages[selectedImage].src}
              alt={galleryImages[selectedImage].alt}
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
              <p className="font-semibold">{galleryImages[selectedImage].alt}</p>
              <p className="text-sm opacity-75">{galleryImages[selectedImage].category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
```

# src\components\Home\Hero.tsx

```tsx
"use client";

import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';

// Carousel images for hero section
const carouselImages = [
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651195/DSC07659_zj2pcc.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1755025999/IMG-20250807-WA0003_u999yh.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1755026061/HAR05826_hv05wz.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651197/HAR05826_iefkzg.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754831665/HAR05956_cwxrxr.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754831662/IMG_4561_axaohh.jpg",
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  function openWhatsApp(phoneNumber, message) {
    // Only proceed if window is available (client-side)
    if (typeof window !== 'undefined') {
      const encodedMessage = encodeURIComponent(message);
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const url = isMobile 
        ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
        : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  // Floating button visibility state and handlers
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (typeof window !== 'undefined') setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBookNow = () => {
    navigate('/slime-play.html');
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hero Section with Carousel */}
      <header className="relative w-full max-w-6xl mx-auto mt-4 md:mt-8 px-4">
        <div className="relative w-full aspect-[4/3] md:aspect-video bg-gray-200 rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
          <img
            key={currentSlide}
            src={carouselImages[currentSlide]}
            alt="Artgram creation"
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          
          {/* Carousel Navigation - Hidden on mobile, visible on larger screens */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-2 transition-all duration-300"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-2 transition-all duration-300"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Mobile navigation - swipe area indicators */}
          <div className="md:hidden absolute inset-0 flex justify-between items-center z-10">
            <div 
              className="h-full w-1/4 flex items-center justify-start opacity-0 active:opacity-20 active:bg-gray-400 transition-opacity"
              onClick={prevSlide}
            ></div>
            <div 
              className="h-full w-1/4 flex items-center justify-end opacity-0 active:opacity-20 active:bg-gray-400 transition-opacity"
              onClick={nextSlide}
            ></div>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentSlide === index ? 'bg-white scale-110' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* The rest of your components remain the same */}
      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <video
              className="w-full h-72 rounded-2xl object-cover shadow-2xl border-4 border-white"
              src="https://res.cloudinary.com/df2mieky2/video/upload/v1754938196/EVENTS_AT_ARTGRAM_v9yeol.mp4"
              autoPlay
              loop
              muted
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="font-black text-4xl mb-4 text-slate-800">
              ABOUT ARTGRAM
            </h2>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              From Inspiration to Impact
            </h3>
            <p className="mb-4 text-lg leading-relaxed text-gray-700">
              Artgram began with a dream — to make art accessible, joyful, and
              part of everyday life. What started as a small initiative has
              grown into a vibrant community, nurturing creativity across all
              ages.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              We believe that art is not just a hobby but a way to communicate,
              heal, and evolve. Through our programs and events, we've touched
              hundreds of lives, empowering individuals to create fearlessly.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <p className="text-4xl font-bold text-rose-600">25,000+</p>
            <p className="text-gray-600 font-medium">Customers</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <p className="text-4xl font-bold text-rose-600">40+</p>
            <p className="text-gray-600 font-medium">Unique Designs</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <p className="text-4xl font-bold text-rose-600">100+</p>
            <p className="text-gray-600 font-medium">Birthday Parties</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <p className="text-4xl font-bold text-rose-600">5</p>
            <p className="text-gray-600 font-medium">Studio Locations</p>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section
        id="activities"
        className="py-20 text-center bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Explore activities at Artgram
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <ActivityCard
              img="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755538130/HAR05881_knyc5j.jpg"
              title="🎨 Art Making"
              text="Enjoy 30+ hands on activities for all age groups"
              bgColor="bg-gradient-to-br from-pink-100 to-purple-100"
              link="/art-making-activity.html"
            />
            <ActivityCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754630801/HAR05956_c7944n.jpg"
              title="🌈 Slime Play"
              text="Get messy and creative with colorful, stretchy slime! Perfect for kids and adults who love sensory fun."
              bgColor="bg-gradient-to-br from-blue-100 to-cyan-100"
              link="/slime-play.html"
            />
            <ActivityCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651197/HAR05826_iefkzg.jpg"
              title="🧶 Tufting"
              text="Explore a new art form: make your own rugs and coasters to decorate your home."
              bgColor="bg-gradient-to-br from-green-100 to-emerald-100"
              link="/tufting-activity.html"
            />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center lg:justify-start">
              <a
                href="https://youtube.com/shorts/3Ho2S0v2PF0?si=jqswBjCvh31Vbd4u"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full max-w-lg h-72 rounded-2xl shadow-2xl border-4 border-gradient-to-r from-pink-200 to-purple-200 overflow-hidden relative"
              >
                <img
                  src="https://img.youtube.com/vi/3Ho2S0v2PF0/maxresdefault.jpg"
                  alt="YouTube Video Thumbnail"
                  className="w-full h-full object-cover"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-white drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </a>
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                Events at Artgram
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-gray-700">
                Artgram is the ultimate destination for birthdays,
                get-togethers, and corporate events. Whether you're planning a
                cozy gathering or a grand celebration, we offer tailored
                packages to suit every occasion.
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Whatever your vision, Artgram ensures a seamless, joyful
                experience for you and your guests!
              </p>
            </div>
          </div>
          {/* Event Cards */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <EventCard
              icon="🎂"
              title="Birthdays"
              bgColor="bg-gradient-to-br from-purple-100 to-violet-100"
              link="/events.html#birthdays"
            />
            <EventCard
              icon="👶"
              title="Baby Shower"
              bgColor="bg-gradient-to-br from-blue-100 to-cyan-100"
              link="/events.html#baby-shower"
            />
            <EventCard
              icon="🏢"
              title="Corporate"
              bgColor="bg-gradient-to-br from-indigo-100 to-blue-100"
              link="/events.html#corporate"
            />
            <EventCard
              icon="🎨"
              title="Workshops"
              bgColor="bg-gradient-to-br from-green-100 to-teal-100"
              link="/events.html#workshops"
            />
          </div>
        </div>
      </section>

      {/* Instagram Feed Placeholder */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
      From Our Instagram
    </h2>
    <p className="text-gray-600 mb-10">
      Follow us{" "}
      <a
        href="https://www.instagram.com/artgram_yourhobbylobby/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-pink-600 hover:text-purple-600 hover:underline transition-colors"
      >
        @artgram_yourhobbylobby
      </a>
    </p>

    {/* Instagram-like cards */}
    <div className="grid md:grid-cols-3 gap-8">
      {/* Card 1 */}
      <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
        <img
          src="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755697368/480422168_673070211723714_4415539318595045525_n_dhm03i.jpg"
          alt="Reel 1"
          className="w-full h-96 object-cover transform group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <a
            href="https://www.instagram.com/reel/DGS5MUppMc4/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-pink-600 hover:text-white transition"
          >
            View on Instagram
          </a>
        </div>
      </div>

      {/* Card 2 */}
      <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
        <img
          src="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755697413/527539994_1083129567123356_9166913181327332852_n_cx6okk.jpg"
          alt="Reel 2"
          className="w-full h-96 object-cover transform group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <a
            href="https://www.instagram.com/reel/DNC-sJuR0A4/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-pink-600 hover:text-white transition"
          >
            View on Instagram
          </a>
        </div>
      </div>

      {/* Card 3 */}
      <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
        <img
          src="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755697208/528978528_1298911128567327_2580940791983865225_n_qxbuqg.jpg"
          alt="Reel 3"
          className="w-full h-96 object-cover transform group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <a
            href="https://www.instagram.com/reel/DM91tFgvQrS/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-orange-600 hover:text-white transition"
          >
            View on Instagram
          </a>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-16 text-center">
            In their own words: Artgram experiences
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto text-white">
            <TestimonialCard
              stars="⭐⭐⭐⭐⭐"
              text="Had a wonderful time doing the slime activity! Everything was well-organized, and the staff were so kind, patient, and engaging. It was a lot of fun for both kids and adults!"
              name="Tejaswi Kalisetty"
              bgColor="bg-gradient-to-br from-gray-600 to-blue-900 text-white"
            />
            <TestimonialCard
              stars="⭐⭐⭐⭐⭐"
              text="We hosted a onesie-themed baby shower at Artgram, and it was the best decision! Their team was attentive and turned a simple idea into a beautiful, memorable event."
              name="Mohana Swetha Nune"
              bgColor="bg-gradient-to-br from-gray-600 to-blue-900 text-white"
            />
            <TestimonialCard
              stars="⭐⭐⭐⭐⭐"
              text="I celebrated my daughter's birthday party here and everyone had a fantastic time! The venue was spacious, bright, and easy to reach, and the team was very responsive."
              name="Bhaswati Bhar"
              bgColor="bg-gradient-to-br from-gray-600 to-blue-900 text-white"
            />
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold mb-12 text-gray-800">Our Branches</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BranchCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754637272/wp6539521_vvafqv.jpg"
              name="Hyderabad"
              address="#NO.8-2-686/K/1 AND 8-2686/K/2, 5TH FLOOR, KIMTEE SQUARE, ROAD NO-12, BANJARA HILLS, CIRCLE 37, HYDERABAD 500034"
              phone="+917766012299"
              openTime="9:00 AM"
              closeTime="9:00 PM"
              onWhatsApp={() => openWhatsApp("917766012299", "Hi, I am interested in ArtGram activities in Hyderabad!")}
            />
            <BranchCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754637352/jayanth-muppaneni-y96JVdGu7XU-unsplash_1_kooajm.jpg"
              name="Bangalore"
              address="#418, 4TH FLOOR, JB ARCADE, 27TH MAIN ROAD, HSR LAYOUT, SECTOR 1, BENGALURU 560102"
              phone="+919216345672"
              openTime="9:30 AM"
              closeTime="9:30 PM"
              onWhatsApp={() => openWhatsApp("919216345672", "Hi, I am interested in ArtGram activities in Bangalore!")}
            />
            <BranchCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754637135/durgamma_temple_vj_6472215382_l3h6wj.jpg"
              name="Vijayawada"
              address="#40-6-11, 2ND FLOOR, MEENAKSHI TOWERS HOTEL, MURALI FORTUNE ROAD, MOGALRAJPURAM, OPP. SUBWAY 520010"
              phone="+919686846100"
              openTime="10:00 AM"
              closeTime="8:00 PM"
              onWhatsApp={() => openWhatsApp("919686846100", "Hi, I am interested in ArtGram activities in Vijayawada!")}
            />
       
            <BranchCard
              img="https://media2.thrillophilia.com/images/photos/000/013/594/original/1567154682_shutterstock_1304062492.jpg?w=753&h=450&dpr=1.5"
              name="Yelagiri"
              address="Nilavoor Road
Yelagiri Hills - 635853, Tamil Nadu"
              phone="+919566351199"
               openTime="9:30 AM"
              closeTime="9:30 PM"
              onWhatsApp={() => openWhatsApp("919566351199", "Hi, I am interested in ArtGram activities in Vijayawada!")}
            />
            <BranchCard
              img="https://im.whatshot.in/img/2020/Aug/istock-1139387103-cropped-1597665160.jpg"
              name="Nagpur"
              address="Kidzee Planet
Plot No. 18, Gajanan Mandir Road, Ring Road, Renghe Layout, Behind Bhagwaati Hall, Trimurtee Nagar, Nagpur, Maharashtra 440022
"
              phone="+91880630693"
               openTime="9:30 AM"
              closeTime="9:30 PM"
              onWhatsApp={() => openWhatsApp("918806320693", "Hi, I am interested in ArtGram activities in Vijayawada!")}
            />
          </div>
        </div>
      </section>

      {/* Floating action buttons: Book Now and Scroll to Top */}
      <div aria-hidden={false} className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
        <button
          onClick={handleBookNow}
          className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
          aria-label="Book Slime Session"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a2 2 0 00-2 2v1H7a2 2 0 00-2 2v1H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2h-1V7a2 2 0 00-2-2h-3V4a2 2 0 00-2-2zM9 7V5h6v2H9z"/>
          </svg>
          <span className="font-semibold">Book Slime Session</span>
        </button>

        {showTop && (
          <button
            onClick={scrollToTop}
            className="inline-flex items-center justify-center bg-white text-gray-800 w-12 h-12 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
            aria-label="Scroll to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Activity Card Component with Link wrapper
const ActivityCard = ({ img, title, text, bgColor, link }) => {
  return (
    <Link to={link} className="block no-underline">
      <div
        className={`${bgColor} rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col border border-white/50 cursor-pointer`}
      >
        <div className="relative overflow-hidden">
          <img
            src={img}
            alt={title}
            className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-bold text-xl mb-3 text-gray-800">{title}</h3>
          <p className="text-gray-700 text-base leading-relaxed flex-grow">
            {text}
          </p>
        </div>
      </div>
    </Link>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ stars, text, name, bgColor }) => {
  return (
    <div
      className={`${bgColor} p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 border border-white/50`}
    >
      <div className="flex flex-col h-full text-white">
        <div className="text-2xl mb-4 text-amber-500">{stars}</div>
        <p className="leading-relaxed mb-6 flex-grow italic opacity-90">"{text}"</p>
        <div className="flex items-center mt-auto">
          <p className="font-bold text-lg opacity-95">{name}</p>
        </div>
      </div>
    </div>
  );
};

// Event Card Component with Link wrapper
const EventCard = ({ icon, title, bgColor, link }) => {
  return (
    <Link to={link} className="block no-underline">
      <div
        className={`text-center p-6 ${bgColor} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 cursor-pointer`}
      >
        <div className="text-4xl mb-4 transform hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
    </Link>
  );
};

const BranchCard = ({ img, name, address, phone, openTime, closeTime, onWhatsApp, instagram }) => {
  return (
    <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer transform hover:scale-105">
      <div className="relative h-52 overflow-hidden">
        <img 
          src={img || "/placeholder.svg"} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h4 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-purple-600">{name}</h4>
        
        {/* Address with map icon and link */}
        <div className="flex items-start mb-3">
          <svg className="w-4 h-4 mt-1 mr-2 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
          </svg>
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-600 text-sm hover:text-purple-600 transition-colors"
          >
            {address}
          </a>
        </div>
        
        {/* Opening hours */}
        <div className="flex items-start mb-4">
          <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <div className="text-slate-600 text-sm">
            <div className="font-medium">Opening Hours:</div>
            <div>{openTime} - {closeTime}</div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3 mt-auto">
  {/* Call */}
  <a 
    href={`tel:${phone}`} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
    </svg>
  </a>

  {/* WhatsApp */}
  <button 
    onClick={onWhatsApp} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
  >
   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
  <path d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.59 5.97L0 24l6.22-1.63A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22.02a9.92 9.92 0 01-5.05-1.38l-.36-.22-3.7.97.99-3.61-.24-.37A9.94 9.94 0 012.02 12C2.02 6.48 6.48 2.02 12 2.02c2.67 0 5.18 1.04 7.07 2.93A9.94 9.94 0 0121.98 12c0 5.52-4.46 10.02-9.98 10.02zm5.38-7.47c-.29-.15-1.72-.85-1.98-.95s-.46-.15-.65.15c-.2.29-.75.95-.92 1.14-.17.2-.34.22-.63.07-.29-.15-1.21-.45-2.3-1.44-.85-.76-1.42-1.7-1.59-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.2.05-.37-.02-.52-.07-.15-.63-1.52-.87-2.08-.23-.55-.47-.47-.65-.48-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.29-1.05 1.02-1.05 2.49 0 1.47 1.08 2.89 1.23 3.09.15.2 2.14 3.38 5.18 4.61.73.32 1.3.51 1.74.65.73.23 1.39.2 1.91.12.58-.09 1.72-.7 1.96-1.37.24-.67.24-1.24.17-1.36-.07-.12-.27-.19-.57-.34z"/>
</svg>

  </button>

  {/* Google Maps */}
  <a 
    href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
    </svg>
  </a>

  {/* Instagram */}
  <a 
    href={instagram} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors"
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.75 2.25a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1a.75.75 0 01.75-.75zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"/>
    </svg>
  </a>
</div>

      </div>
    </div>
  );
};

export default HomePage;
```

# src\components\Home\Products.tsx

```tsx
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Products: React.FC = () => {
  const { products } = useData();
  const featuredProducts = products.filter(p => p.isActive).slice(0, 6);

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Premium craft supplies and complete kits for all your creative needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                  </div>
                  
                  <button className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition-colors">
                    <Link to="/store" className="block">Add to Cart</Link>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/store"
              className="inline-flex items-center space-x-2 bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>View All Products</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
```

# src\components\Home\Studios.tsx

```tsx
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Studios: React.FC = () => {
  const { branches, cmsContent } = useData();
  const studiosContent = cmsContent.find(c => c.type === 'studios' && c.isActive);
  const studioImages = studiosContent?.images || [];

  return (
    <section id="studios" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Studios</h2>
            <p className="text-xl text-gray-600">Visit our creative spaces across multiple locations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {branches.map(branch => (
              <div key={branch.id} className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-orange-400 to-pink-500 relative overflow-hidden">
                  {studioImages.length > 0 && (
                    <img
                      src={studioImages[0]}
                      alt={`${branch.name} Studio`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{branch.name}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{branch.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-orange-600 mr-3" />
                      <span className="text-gray-600">{branch.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-orange-600 mr-3" />
                      <span className="text-gray-600">{branch.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-orange-600 mr-3" />
                      <span className="text-gray-600">Mon-Sun: 9:00 AM - 8:00 PM</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition-colors text-center"
                    >
                      Get Directions
                    </a>
                    <a 
                      href={`tel:${branch.phone}`}
                      className="flex-1 border border-orange-600 text-orange-600 py-2 rounded-md hover:bg-orange-50 transition-colors text-center"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>



  );
};

export default Studios;
```

# src\components\Home\Testimonials.tsx

```tsx
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const { cmsContent } = useData();
  
  // Get testimonial images from CMS
  const testimonialsContent = cmsContent.find(c => c.type === 'testimonials' && c.isActive);
  const testimonialImages = testimonialsContent?.images || [
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg'
  ];
  
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Pune',
      rating: 5,
      comment: 'My daughter absolutely loves the slime making classes! The instructors are so patient and creative. Highly recommend!',
      image: testimonialImages[0] || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      location: 'Mumbai',
      rating: 5,
      comment: 'Great quality materials and excellent workshops. The kids had an amazing time and learned so much!',
      image: testimonialImages[1] || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'
    },
    {
      id: 3,
      name: 'Anita Desai',
      location: 'Pune',
      rating: 5,
      comment: 'The craft supplies are top-notch and the classes are well-organized. Perfect for family bonding time!',
      image: testimonialImages[2] || 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg'
    }
  ];

  return (
    <>
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
              <p className="text-xl text-gray-600">Real experiences from our craft community</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg';
                      }}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-orange-200" />
                    <p className="text-gray-600 italic pl-6">{testimonial.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold mb-12 text-gray-800">Our Branches</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BranchCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754637272/wp6539521_vvafqv.jpg"
              name="Hyderabad"
              address="#NO.8-2-686/K/1 AND 8-2686/K/2, 5TH FLOOR, KIMTEE SQUARE, ROAD NO-12, BANJARA HILLS, CIRCLE 37, HYDERABAD 500034"
              phone="+917766012299"
              openTime="9:00 AM"
              closeTime="9:00 PM"
              onWhatsApp={() => openWhatsApp("917766012299", "Hi, I am interested in ArtGram activities in Hyderabad!")}
            />
            <BranchCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754637352/jayanth-muppaneni-y96JVdGu7XU-unsplash_1_kooajm.jpg"
              name="Bangalore"
              address="#418, 4TH FLOOR, JB ARCADE, 27TH MAIN ROAD, HSR LAYOUT, SECTOR 1, BENGALURU 560102"
              phone="+919216345672"
              openTime="9:30 AM"
              closeTime="9:30 PM"
              onWhatsApp={() => openWhatsApp("919216345672", "Hi, I am interested in ArtGram activities in Bangalore!")}
            />
            <BranchCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754637135/durgamma_temple_vj_6472215382_l3h6wj.jpg"
              name="Vijayawada"
              address="#40-6-11, 2ND FLOOR, MEENAKSHI TOWERS HOTEL, MURALI FORTUNE ROAD, MOGALRAJPURAM, OPP. SUBWAY 520010"
              phone="+919686846100"
              openTime="10:00 AM"
              closeTime="8:00 PM"
              onWhatsApp={() => openWhatsApp("919686846100", "Hi, I am interested in ArtGram activities in Vijayawada!")}
            />
            <BranchCard
              img="https://media2.thrillophilia.com/images/photos/000/013/594/original/1567154682_shutterstock_1304062492.jpg?w=753&h=450&dpr=1.5"
              name="Yelagiri"
              address="Nilavoor Road
Yelagiri Hills - 635853, Tamil Nadu"
              phone="+919566351199"
              openTime="9:30 AM"
              closeTime="9:30 PM"
              onWhatsApp={() => openWhatsApp("919566351199", "Hi, I am interested in ArtGram activities in Vijayawada!")}
            />
            <BranchCard
              img="https://im.whatshot.in/img/2020/Aug/istock-1139387103-cropped-1597665160.jpg"
              name="Nagpur"
              address="Kidzee Planet
Plot No. 18, Gajanan Mandir Road, Ring Road, Renghe Layout, Behind Bhagwaati Hall, Trimurtee Nagar, Nagpur, Maharashtra 440022
"
              phone="+91880630693"
              openTime="9:30 AM"
              closeTime="9:30 PM"
              onWhatsApp={() => openWhatsApp("918806320693", "Hi, I am interested in ArtGram activities in Vijayawada!")}
            />
          </div>
        </div>
      </section>
    </>
  );
}

// BranchCard component moved to top level
const BranchCard = ({ img, name, address, phone, openTime, closeTime, onWhatsApp, instagram }) => {
  return (
    <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer transform hover:scale-105">
      <div className="relative h-52 overflow-hidden">
        <img 
          src={img || "/placeholder.svg"} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h4 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-purple-600">{name}</h4>
        {/* Address with map icon and link */}
        <div className="flex items-start mb-3">
          <svg className="w-4 h-4 mt-1 mr-2 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
          </svg>
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-600 text-sm hover:text-purple-600 transition-colors"
          >
            {address}
          </a>
        </div>
        {/* Opening hours */}
        <div className="flex items-start mb-4">
          <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <div className="text-slate-600 text-sm">
            <div className="font-medium">Opening Hours:</div>
            <div>{openTime} - {closeTime}</div>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex gap-3 mt-auto">
          {/* Call */}
          <a 
            href={`tel:${phone}`} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
          </a>
          {/* WhatsApp */}
          <button 
            onClick={onWhatsApp} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.59 5.97L0 24l6.22-1.63A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22.02a9.92 9.92 0 01-5.05-1.38l-.36-.22-3.7.97.99-3.61-.24-.37A9.94 9.94 0 012.02 12C2.02 6.48 6.48 2.02 12 2.02c2.67 0 5.18 1.04 7.07 2.93A9.94 9.94 0 0121.98 12c0 5.52-4.46 10.02-9.98 10.02zm5.38-7.47c-.29-.15-1.72-.85-1.98-.95s-.46-.15-.65.15c-.2.29-.75.95-.92 1.14-.17.2-.34.22-.63.07-.29-.15-1.21-.45-2.3-1.44-.85-.76-1.42-1.7-1.59-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.2.05-.37-.02-.52-.07-.15-.63-1.52-.87-2.08-.23-.55-.47-.47-.65-.48-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.29-1.05 1.02-1.05 2.49 0 1.47 1.08 2.89 1.23 3.09.15.2 2.14 3.38 5.18 4.61.73.32 1.3.51 1.74.65.73.23 1.39.2 1.91.12.58-.09 1.72-.7 1.96-1.37.24-.67.24-1.24.17-1.36-.07-.12-.27-.19-.57-.34z"/>
            </svg>
          </button>
          {/* Google Maps */}
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a 
            href={instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.75 2.25a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1a.75.75 0 01.75-.75zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

// Add openWhatsApp helper function
function openWhatsApp(phone, message) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export default Testimonials;
```

# src\components\Layout\ActivitiesPage.tsx

```tsx
const ActivitiesPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-600 to-rose-700 text-white text-center py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Creative Activities</h1>
          <p className="text-lg mb-4">Discover hands-on experiences that spark imagination and creativity</p>
          <p className="text-base">
            From slime making to art creation - we have something special for every creative soul
          </p>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold mb-12 text-slate-900">Our Featured Activities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="🌈"
              title="Slime Play"
              desc="Create colorful, stretchy, and sparkly slime in various textures."
              cta="Book Now"
              href="/slime-play.html"
            />
            <FeatureCard
              icon="🎨"
              title="Art Making"
              desc="Express creativity through painting, drawing, and mixed media art."
              cta="Learn More →"
              href="/art-making-activity.html"
      
            />
            <FeatureCard
              icon="🧶"
              title="Tufting Experience"
              desc="Create beautiful rugs and wall hangings using tufting guns."
              cta="Book Now"
              href="/tufting-activity.html"
            />
          </div>
        </div>
      </section>

      {/* All Activities */}
      <section className="py-20 bg-slate-100">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold mb-12 text-slate-900">All Our Activities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ActivityCard
              icon="🌈"
              age="Ages 4-12"
              title="Slime Play"
              price="₹299"
              desc="Create colorful, stretchy, and sparkly slime in various textures. Kids learn about polymers while having endless fun mixing and creating their perfect slime recipe."
            />
            <ActivityCard
              icon="🎨"
              age="Ages 3-15"
              title="Art Making"
              price="₹399"
              desc="Express creativity through painting, drawing, and mixed media art. Professional guidance helps children explore different techniques and discover their artistic style."
            />
            <ActivityCard
              icon="🧶"
              age="Ages 8+"
              title="Tufting Experience"
              price="₹799"
              desc="Create beautiful rugs and wall hangings using tufting guns. Learn this trending craft technique and take home your unique textile masterpiece."
            />
            <ActivityCard
              icon="💡"
              age="Ages 10+"
              title="Neon Art Creation"
              price="₹599"
              desc="Design and create stunning neon-style artwork using LED strips and acrylic. Perfect for room decoration and learning about color theory and design."
            />
            <ActivityCard
              icon="🏺"
              age="Ages 5-14"
              title="Clay Modeling Workshop"
              price="₹449"
              desc="Shape imagination into reality with clay modeling. Create pottery, sculptures, and decorative items while developing fine motor skills and spatial awareness."
            />
            <ActivityCard
              icon="💻"
              age="Ages 8+"
              title="Digital Art & Design"
              price="₹549"
              desc="Explore digital creativity using tablets and design software. Learn illustration, animation basics, and create digital masterpieces in a tech-savvy environment."
            />
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold mb-12 text-slate-900">Why Choose Our Activities?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <WhyCard
              icon="👨‍🏫"
              title="Expert Instructors"
              desc="Professional artists and educators guide every session with patience and expertise."
            />
            <WhyCard
              icon="🎯"
              title="Age-Appropriate"
              desc="Activities designed specifically for different age groups to ensure optimal learning experience."
            />
            <WhyCard
              icon="🏆"
              title="Take Home Creations"
              desc="Every participant leaves with their unique creation and newfound skills."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

const FeatureCard = ({ icon, title, desc, cta, href, accent }) => {
  return (
    <a
      href={href}
      className="block bg-white rounded-2xl p-10 text-center shadow-[0_5px_20px_rgba(0,0,0,0.1)] transition-all relative overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(225,29,72,0.3)] no-underline"
    >
      <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
        {icon}
      </div>
      <h4 className="text-slate-900 font-bold text-xl mb-3">{title}</h4>
      <p className="text-slate-500 mb-6">{desc}</p>
      <div
        className={`${accent ? "text-rose-600" : "bg-rose-600 text-white px-5 py-2 rounded-full inline-block"} font-semibold`}
      >
        {cta}
      </div>
    </a>
  )
}

const ActivityCard = ({ icon, age, title, price, desc }) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all">
      <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
        {icon}
      </div>
      <span className="bg-rose-600 text-white px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">{age}</span>
      <h4 className="text-xl font-bold mb-3 text-slate-900">{title}</h4>
      <p className="text-slate-600 mb-4">{desc}</p>
      <div className="text-rose-600 font-bold text-xl mb-4">{price}</div>
      <button className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 text-white py-3 font-semibold transition-colors">
        Book Now
      </button>
    </div>
  )
}

const WhyCard = ({ icon, title, desc }) => {
  return (
    <div className="text-center p-6">
      <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
        {icon}
      </div>
      <h5 className="text-slate-900 font-semibold mb-2">{title}</h5>
      <p className="text-slate-600">{desc}</p>
    </div>
  )
}

export default ActivitiesPage

```

# src\components\Layout\ArtMakingActivityPage.tsx

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ArtMakingActivityPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const location = useLocation();
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);

  const handleUserInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      if (videoRef.current) {
        videoRef.current.muted = false;
        setMuted(false);
      }
    }
  };

  useEffect(() => {
    let scrollTimer;
    const handleScroll = () => {
      if (videoRef.current && userInteracted) {
        videoRef.current.muted = true;
        setMuted(true);
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {}, 1000);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); clearTimeout(scrollTimer); };
  }, [userInteracted]);

  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const el = document.getElementById(location.hash.replace('#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.pathname]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const artFormsKids = [
    "Mosaic art",
    "Piggy banks",
    "Welcome boards",
    "Glass painting",
    "Rangoli stencils",
    "Letter arts",
    "Spin art",
    "Key holders",
    "Name boards",
    "Acrylic pour"
  ];

  const artFormsAdults = [
    "Block printing",
    "Clutch painting",
    "Glass painting",
    "Mandalas",
    "Couple boards",
    "Pichwai arts",
    "Madhubani",
    "Tissue art",
    "Home decor crafts",
    "Gods painting"
  ];

  const features = [
    {
      icon: "🎨",
      title: "30+ Art Varieties",
      description:
        "Discover endless creative possibilities with our diverse collection of art forms.",
      color: "from-rose-400 to-pink-400",
    },
    {
      icon: "👥",
      title: "Collaborative Creation",
      description:
        "Share the magical journey of creation with loved ones on a single masterpiece.",
      color: "from-violet-400 to-purple-400",
    },
    {
      icon: "🏠",
      title: "Cherish Forever",
      description:
        "Take home your unique creation as a beautiful memory of your artistic journey.",
      color: "from-blue-400 to-indigo-400",
    },
    {
      icon: "⏰",
      title: "Timeless Experience",
      description:
        "Create at your own pace without any time constraints or pressure.",
      color: "from-emerald-400 to-teal-400",
    },
  ];

  return (
     <div 
      className="min-h-screen bg-gradient-to-br from-green-100 to-purple-100"
      onClick={handleUserInteraction}
    >
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-black flex items-center justify-center text-center text-white overflow-hidden">
  <div className="absolute inset-0 z-10">
    <video
      ref={videoRef}
      src="https://res.cloudinary.com/dwb3vztcv/video/upload/v1755544541/My_First_Project_sx8bvy.mp4"
      autoPlay
      loop
      playsInline
      muted={!userInteracted || muted}
      className="absolute w-auto min-w-full min-h-full max-w-none opacity-70"
    />

    {/* 🔊 Mute/Unmute button */}
    <button 
      onClick={() => {
        if (videoRef.current) {
          videoRef.current.muted = !videoRef.current.muted;
          setMuted(videoRef.current.muted);
        }
      }}
      className="absolute bottom-6 right-6 z-20 bg-black/50 hover:bg-black/70 rounded-full p-3 backdrop-blur-sm transition-all duration-300"
      aria-label={muted ? "Unmute video" : "Mute video"}
    >
      {muted ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a7.975 7.975 0 015.657 2.343m0 0a7.975 7.975 0 010 11.314m-11.314 0a7.975 7.975 0 010-11.314m0 0a7.975 7.975 0 015.657-2.343" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </button>
  </div>

  {/* 🔲 Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-0" />

  {/* Center content (if you want text here later) */}
  <div className="relative z-20 max-w-4xl text-center">
    {/* You can add a heading/intro text here if needed */}
  </div>

  {/* 🔘 Button pinned to bottom center */}
 
</section>

      {/* Main Content */}
      <section className="py-20 relative">


        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Experience Section 
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent mb-6 pb-5">
                Your Artistic Journey
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Immerse yourself in a world of creativity where every stroke
                tells a story
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`group relative bg-white rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100
                    ${activeCard === index ? "scale-105" : "hover:scale-102"}`}
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}
                  />

                  <div className="relative z-10">
                    <div className="text-4xl md:text-5xl mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 group-hover:text-purple-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
*/}
          {/* Pricing Section with Artistic Design */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-white via-purple-50 to-rose-50 rounded-3xl p-8 md:p-12 shadow-2xl border border-purple-100">
              <div className="grid lg:grid-cols-3 gap-8 md:gap-12 items-center">
                {/* Pricing Info */}
                
                <div className="lg:col-span-2 space-y-4 md:space-y-2">
  <h3 className="text-5xl p-8 font-bold bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent mb-4 md:mb-6 ">
    Art Making Experience
  </h3>

  <div className="pt-1">
    <div className="pt-1 flex items-baseline gap-2 md:gap-4 mb-4 md:mb-6">
      <span className="text-4xl md:text-6xl font-bold text-gray-800">
        ₹350
      </span>
      <span className="text-xl md:text-2xl text-gray-500">to</span>
      <span className="text-4xl md:text-6xl font-bold text-gray-800">
        ₹2000
      </span>
    </div>
    <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
      Choose your art form and pay accordingly - no hidden costs!
    </p>
  </div>

  

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
    {[
      "Choose your preferred art form",
      "All premium materials included",
      "Expert guidance available",
      "No booking required",
      "Walk-in anytime",
      "Take your creation home",
      "30+ Art Varieties",
      "Collaborative Creation",
      "Cherish Forever",
      "Timeless Experience"
    ].map((item, i) => (
      <div key={i} className="flex items-center gap-3 group">
        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-rose-400 rounded-full group-hover:scale-150 transition-transform duration-300" />
        <span className="text-sm md:text-base text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
          {item}
        </span>
      </div>
    ))}
  </div>

                </div>

                {/* Special Offer */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white text-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <div className="absolute -top-3 -right-3 w-12 h-12 md:-top-4 md:-right-4 md:w-16 md:h-16 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-lg">
                      HOT!
                    </div>
                    <h4 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Special Combo</h4>
                    <div className="text-3xl md:text-4xl font-bold mb-2">10% OFF</div>
                    <p className="text-purple-100 text-sm md:text-base mb-4 md:mb-6">
                      10% off only on art bill if you do slime ans arts on the same day.
                    </p>
                    <button className="bg-white text-purple-600 px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold hover:bg-purple-50 transition-colors duration-300 text-sm md:text-base">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

{/*
           <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { value: "30+", label: "Art Varieties", icon: "🎨" },
                { value: "2+", label: "Years Min Age", icon: "👶" },
                { value: "₹350-₹2000", label: "Price Range", icon: "💰" },
                { value: "11AM-7PM", label: "Open Hours", icon: "🕐" },
              ].map((stat, i) => (
                <div key={i} className="group p-2 md:p-0">
                  <div className="text-3xl md:text-4xl mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">{stat.value}</div>
                  <div className="text-purple-100 font-medium text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
           */}

          {/* Art Forms Gallery - Kids Section */}
          <div className="mb-20 pt-20">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
                Art Forms for Kids 🧑‍🎨
              </h3>
              <p className="text-lg md:text-xl text-gray-600">
                Fun and creative projects for our young artists
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {artFormsKids.map((art, index) => (
                <div
                  key={art}
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-200"
                >
                  <div className="text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-400 to-rose-400 rounded-full mx-auto mb-2 md:mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-base md:text-lg">🎨</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300 text-sm md:text-base">
                      {art}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Art Forms Gallery - Adults Section */}
          <div className="mb-20">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
                Art Forms for Adults 🧑‍🎨
              </h3>
              <p className="text-lg md:text-xl text-gray-600">
                Explore a range of sophisticated and intricate art techniques
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {artFormsAdults.map((art, index) => (
                <div
                  key={art}
                  className="group bg-gradient-to-br from-white to-gray-50 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-purple-200"
                >
                  <div className="text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-400 to-rose-400 rounded-full mx-auto mb-2 md:mb-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-base md:text-lg">🎨</span>
                    </div>
                    <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300 text-sm md:text-base">
                      {art}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Stats Section */}
         

          {/* Brochure Section */}
          <div className="mt-16 md:mt-20 text-center">
  <h3 className="text-3xl font-bold text-gray-800 mb-4">Our Brochures</h3>
  <p className="text-base md:text-xl text-gray-600 mb-10">
    Get detailed information about all our art forms and pricing across different branches
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
    {/* Branch 1 */}
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 shadow-xl border border-gray-100">
      <h4 className="text-xl font-semibold text-gray-700 mb-4">Bangalore Branch</h4>
      <div style={{ position: 'relative', width: '100%', paddingTop: '141.4286%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(63,69,81,0.16)' }}>
        <iframe
          loading="lazy"
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none' }}
          src="https://www.canva.com/design/DAGkzJWHL44/aCM0VggQIbL4QbK96MEopw/view?embed"
          allowFullScreen
        ></iframe>
      </div>
      <a
        href="https://www.canva.com/design/DAGkzJWHL44/aCM0VggQIbL4QbK96MEopw/view"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
      >
        📋 View / Download
      </a>
    </div>

    {/* Branch 2 */}
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 shadow-xl border border-gray-100">
      <h4 className="text-xl font-semibold text-gray-700 mb-4">Vijayawada Branch</h4>
      <div style={{ position: 'relative', width: '100%', paddingTop: '141.4286%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(63,69,81,0.16)' }}>
        <iframe
          loading="lazy"
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none' }}
          src="https://www.canva.com/design/DAFzM-Gz7Kg/92ExSAFWSxaxXJownvur4A/view?embed"
          allowFullScreen
        ></iframe>
      </div>
      <a
        href="https://www.canva.com/design/DAFzM-Gz7Kg/92ExSAFWSxaxXJownvur4A/view"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
      >
        📋 View / Download
      </a>
    </div>

    {/* Branch 3 */}
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 shadow-xl border border-gray-100">
      <h4 className="text-xl font-semibold text-gray-700 mb-4">Hyderabad Branch</h4>
      <div style={{ position: 'relative', width: '100%', paddingTop: '141.4286%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(63,69,81,0.16)' }}>
        <iframe
          loading="lazy"
          style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none' }}
          src="https://www.canva.com/design/DAFzMTK_uQY/B3-KsNjAyUb0Jx3YCDwmtg/view?embed"
          allowFullScreen
        ></iframe>
      </div>
      <a
        href="https://www.canva.com/design/DAFzMTK_uQY/B3-KsNjAyUb0Jx3YCDwmtg/view"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
      >
        📋 View / Download
      </a>
    </div>
  </div>
</div>

        </div>
      </section>
    </div>
  );
}

```

# src\components\Layout\CartPage.tsx

```tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CART_KEY = 'cart_items';

function readCart(){
  try{ const r = localStorage.getItem(CART_KEY); return r?JSON.parse(r):[] }catch{return []}
}
function writeCart(data){
  try{
    localStorage.setItem(CART_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('cart_updated'));
  } catch (err) { console.debug('writeCart error', err); }
}

export default function CartPage(){
  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState({name:'', email:'', phone:''});
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(()=> setItems(readCart()), []);

  const updateQty = (id, qty) => {
    const updated = items.map(i => i.id === id ? {...i, qty} : i);
    setItems(updated); writeCart(updated);
  }
  const remove = (id) => { const filtered = items.filter(i=>i.id!==id); setItems(filtered); writeCart(filtered); }

  const checkout = () => {
  if(!customer.name || !customer.email) return alert('Enter name and email');
    // create order + transaction
    const orders = (()=>{try{const r=localStorage.getItem('admin_orders'); return r?JSON.parse(r):[];}catch{return []}})();
    const txs = (()=>{try{const r=localStorage.getItem('admin_transactions'); return r?JSON.parse(r):[];}catch{return []}})();

    const orderId = orders.length ? Math.max(...orders.map(o=>o.id))+1 : 1;
    const total = items.reduce((s,i)=> s + (i.price||0) * (i.qty||1), 0);
  const contact = { ...customer, address };
  const order = { id: orderId, customer: customer.name, contact, total, items: items.map(i=>({productId:i.id, title:i.title, qty:i.qty, price:i.price})), status:'Pending' };
    orders.push(order);
    localStorage.setItem('admin_orders', JSON.stringify(orders));

    const txId = txs.length ? Math.max(...txs.map(t=>t.id))+1 : 1;
    const tx = { id: txId, orderId, amount: total, method:'card', date: new Date().toISOString(), customer: customer };
    txs.push(tx);
    localStorage.setItem('admin_transactions', JSON.stringify(txs));

    // decrement product stock in admin_products and persist
    try {
      const rawProducts = localStorage.getItem('admin_products');
      const products = rawProducts ? JSON.parse(rawProducts) : [];
      const updatedProducts = products.map((p) => {
        const cartItem = items.find((it) => it.id === p.id || it.id === p.productId || it.slug === p.slug);
        if (!cartItem) return p;
        const newStock = (typeof p.stock === 'number' ? p.stock : Number(p.stock || 0)) - (cartItem.qty || 1);
        return { ...p, stock: Math.max(0, newStock) };
      });
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
      // notify in-page listeners
  try { window.dispatchEvent(new Event('products_updated')); } catch { /* ignore */ }
    } catch (err) { console.debug('failed updating product stock', err); }

    // store booking as well if any item is session-based (optional)

  // clear cart
  writeCart([]);
  setItems([]);
    alert('Order placed: ' + orderId);
    navigate('/admin#orders');
  }

  const total = items.reduce((s,i)=> s + (i.price||0) * (i.qty||1), 0);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
        {items.length===0 ? (
          <div className="text-center py-8 text-gray-500">
            Your cart is empty. <Link to="/shop.html" className="text-rose-600">Browse products</Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map(it=> (
                <div key={it.id} className="flex items-center gap-4 border-b pb-3">
                  <img src={it.image} alt="" className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-semibold">{it.title}</div>
                    <div className="text-sm text-gray-500">₹{it.price}</div>
                  </div>
                  <div>
                    <input type="number" min="1" value={it.qty||1} onChange={(e)=> updateQty(it.id, Number(e.target.value))} className="w-20 p-1 border rounded" />
                  </div>
                  <div className="w-24 text-right">₹{((it.price||0)*(it.qty||1)).toFixed(2)}</div>
                  <button onClick={()=>remove(it.id)} className="text-red-600 ml-4">Remove</button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-2xl font-bold">₹{total.toFixed(2)}</div>
              </div>
              <div className="w-1/3">
                <input value={customer.name} onChange={(e)=>setCustomer({...customer, name:e.target.value})} placeholder="Name" className="w-full p-2 border rounded mb-2" />
                <input value={customer.email} onChange={(e)=>setCustomer({...customer, email:e.target.value})} placeholder="Email" className="w-full p-2 border rounded mb-2" />
                <input value={customer.phone} onChange={(e)=>setCustomer({...customer, phone:e.target.value})} placeholder="Phone" className="w-full p-2 border rounded mb-2" />
                <input value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Address" className="w-full p-2 border rounded mb-2" />
                <button onClick={checkout} className="w-full bg-rose-600 text-white py-2 rounded">Place Order</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

```

# src\components\Layout\ContactUsPage.tsx

```tsx
"use client";
import React, { useState, useEffect } from 'react';

const ContactUsPage = () => {
    const [isVisible, setIsVisible] = useState(false)
    useEffect(() => {
        setIsVisible(true)
      }, [])
  
  // Helper functions to open email and WhatsApp
  function openGmail(email) {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, "_blank");
  }

  function openWhatsApp(phoneNumber, message) {
    const encodedMessage = encodeURIComponent(message);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const url = isMobile 
      ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.elements.namedItem("name")?.value || "there";
    alert(`Thank you for contacting us, ${name}! We'll get back to you shortly.`);
    form.reset();
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-rose-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 overflow-hidden">
      <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-24 h-24 rounded-full bg-white/5 backdrop-blur-sm animate-pulse"
              style={{
                left: `${15 + (i * 15)}%`,
                top: `${20 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`
              }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className={`text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <div className="mb-6">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-rose-200 bg-clip-text text-transparent mb-4">Get in Touch</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-rose-400 mx-auto rounded-full mb-6" />
            </div>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">We'd love to hear from you! Whether it's a question, feedback, or collaboration idea—drop us a message.</p>
        </div>
        </div>
      </section>

      {/* Contact Form & Details */}
      

      {/* Branches Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold mb-12 text-gray-800">Our Branches</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BranchCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754637272/wp6539521_vvafqv.jpg"
              name="Hyderabad"
              address="#NO.8-2-686/K/1 AND 8-2686/K/2, 5TH FLOOR, KIMTEE SQUARE, ROAD NO-12, BANJARA HILLS, CIRCLE 37, HYDERABAD 500034"
              phone="+917766012299"
              openTime="9:00 AM"
              closeTime="9:00 PM"
              onWhatsApp={() => openWhatsApp("917766012299", "Hi, I am interested in ArtGram activities in Hyderabad!")}
            />
            <BranchCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754637352/jayanth-muppaneni-y96JVdGu7XU-unsplash_1_kooajm.jpg"
              name="Bangalore"
              address="#418, 4TH FLOOR, JB ARCADE, 27TH MAIN ROAD, HSR LAYOUT, SECTOR 1, BENGALURU 560102"
              phone="+919216345672"
              openTime="9:30 AM"
              closeTime="9:30 PM"
              onWhatsApp={() => openWhatsApp("919216345672", "Hi, I am interested in ArtGram activities in Bangalore!")}
            />
            <BranchCard
              img="https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754637135/durgamma_temple_vj_6472215382_l3h6wj.jpg"
              name="Vijayawada"
              address="#40-6-11, 2ND FLOOR, MEENAKSHI TOWERS HOTEL, MURALI FORTUNE ROAD, MOGALRAJPURAM, OPP. SUBWAY 520010"
              phone="+919686846100"
              openTime="10:00 AM"
              closeTime="8:00 PM"
              onWhatsApp={() => openWhatsApp("919686846100", "Hi, I am interested in ArtGram activities in Vijayawada!")}
            />
             <BranchCard
              img="https://media2.thrillophilia.com/images/photos/000/013/594/original/1567154682_shutterstock_1304062492.jpg?w=753&h=450&dpr=1.5"
              name="Yelagiri"
              address="Nilavoor Road
Yelagiri Hills - 635853, Tamil Nadu"
              phone="+919566351199"
               openTime="9:30 AM"
              closeTime="9:30 PM"
              onWhatsApp={() => openWhatsApp("919566351199", "Hi, I am interested in ArtGram activities in Vijayawada!")}
            />
            <BranchCard
              img="https://im.whatshot.in/img/2020/Aug/istock-1139387103-cropped-1597665160.jpg"
              name="Nagpur"
              address="Kidzee Planet
Plot No. 18, Gajanan Mandir Road, Ring Road, Renghe Layout, Behind Bhagwaati Hall, Trimurtee Nagar, Nagpur, Maharashtra 440022
"
              phone="+91880630693"
               openTime="9:30 AM"
              closeTime="9:30 PM"
              onWhatsApp={() => openWhatsApp("918806320693", "Hi, I am interested in ArtGram activities in Vijayawada!")}
            />
          </div>
        </div>
      </section>

      {/* Map Section 
      <section className="py-16 bg-gradient-to-br from-purple-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Studio Locations</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Visit us at any of our vibrant studios across South India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
            <a 
              href="https://www.google.com/maps/place/Artgram/@17.4114992,78.4323407,17z/data=!3m1!4b1!4m6!3m5!1s0x3bcb970038d64857:0x406d7a28320f2e9b!8m2!3d17.4114992!4d78.4349156!16s%2Fg%2F11ryf2z9v5?entry=ttu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
            >
              <div className="h-64 relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.0060108339585!2d78.43234067524435!3d17.411499183479815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb970038d64857%3A0x406d7a28320f2e9b!2sArtgram!5e0!3m2!1sen!2sin!4v1755189886825!5m2!1sen!2sin"
                  title="Artgram Hyderabad Location"
                  className="w-full h-full absolute inset-0 pointer-events-none"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-xl">Hyderabad</h3>
                </div>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    📍
                  </div>
                  <p className="text-gray-700 font-medium">Banjara Hills, Road No. 12</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    🕒
                  </div>
                  <p className="text-gray-700">Mon-Sun: 9AM - 9PM</p>
                </div>
                <div className="mt-4 text-purple-600 font-medium flex items-center gap-2">
                  <span>View on Maps</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </a>

          
            <a 
              href="https://www.google.com/maps/place/ARTGRAM/@16.5041061,80.6443325,17z/data=!3m1!4b1!4m6!3m5!1s0x3a35fbf061f36a01:0x57d79131087c8de4!8m2!3d16.5041061!4d80.6469074!16s%2Fg%2F11v0v3c8w4?entry=ttu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
            >
              <div className="h-64 relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.4353260109456!2d80.64433247522446!3d16.504106084240263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35fbf061f36a01%3A0x57d79131087c8de4!2sARTGRAM!5e0!3m2!1sen!2sin!4v1755189043469!5m2!1sen!2sin"
                  title="Artgram Vijayawada Location"
                  className="w-full h-full absolute inset-0 pointer-events-none"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-xl">Vijayawada</h3>
                </div>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    📍
                  </div>
                  <p className="text-gray-700 font-medium">MG Road, Near Prakasam Barrage</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    🕒
                  </div>
                  <p className="text-gray-700">Mon-Sun: 10AM - 8PM</p>
                </div>
                <div className="mt-4 text-purple-600 font-medium flex items-center gap-2">
                  <span>View on Maps</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </a>

           
            <a 
              href="https://www.google.com/maps/place/Artgram/@12.9187316,77.6491285,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae15ae8353d0dd:0x395df1674441651f!8m2!3d12.9187316!4d77.6517034!16s%2Fg%2F11s7j9wq5_?entry=ttu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
            >
              <div className="h-64 relative overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.8286590945104!2d77.64912847515608!3d12.918731587391807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15ae8353d0dd%3A0x395df1674441651f!2sArtgram!5e0!3m2!1sen!2sin!4v1755189902986!5m2!1sen!2sin"
                  title="Artgram Bengaluru Location"
                  className="w-full h-full absolute inset-0 pointer-events-none"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold text-xl">Bengaluru</h3>
                </div>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    📍
                  </div>
                  <p className="text-gray-700 font-medium">HSR Layout, Sector 2</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    🕒
                  </div>
                  <p className="text-gray-700">Mon-Sun: 9:30AM - 9:30PM</p>
                </div>
                <div className="mt-4 text-purple-600 font-medium flex items-center gap-2">
                  <span>View on Maps</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
 */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-5 gap-12">
          {/* Form on the left */}
          

          {/* Contact info on the right */}
          <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-xl border-gray-100 sticky top-32">
            <h3 className="text-2xl font-semibold mb-6">Reach Us Directly</h3>
            <div className="space-y-4 text-slate-900">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <div>
                  <strong>Email:</strong><br />
                  <button onClick={() => openGmail("artgram.yourhobbylobby@gmail.com")} className="text-purple-600 hover:underline">
                    artgram.yourhobbylobby@gmail.com
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
                <div>
                  <strong>Phone:</strong><br />
                  <a href="tel:+919686846100" className="hover:text-purple-600">+91 9686846100</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                <div>
                  <strong>Instagram:</strong><br />
                  <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/artgram_yourhobbylobby/?hl=en" className="text-purple-600 hover:underline">
                    @artgram_yourhobbylobby
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 mt-1 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <div>
                  <strong>Business Hours:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-700">
                    <li>Mon - Sat: 10:00 AM - 8:00 PM</li>
                    <li>Sun: 10:00 AM - 6:00 PM</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * Branch Card Component with official logos
 */
const BranchCard = ({ img, name, address, phone, openTime, closeTime, onWhatsApp, instagram }) => {
  return (
    <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer transform hover:scale-105">
      <div className="relative h-52 overflow-hidden">
        <img 
          src={img || "/placeholder.svg"} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h4 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-purple-600">{name}</h4>
        
        {/* Address with map icon and link */}
        <div className="flex items-start mb-3">
          <svg className="w-4 h-4 mt-1 mr-2 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
          </svg>
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-600 text-sm hover:text-purple-600 transition-colors"
          >
            {address}
          </a>
        </div>
        
        {/* Opening hours */}
        <div className="flex items-start mb-4">
          <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <div className="text-slate-600 text-sm">
            <div className="font-medium">Opening Hours:</div>
            <div>{openTime} - {closeTime}</div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3 mt-auto">
  {/* Call */}
  <a 
    href={`tel:${phone}`} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
    </svg>
  </a>

  {/* WhatsApp */}
  <button 
    onClick={onWhatsApp} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
  >
   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
  <path d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.59 5.97L0 24l6.22-1.63A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22.02a9.92 9.92 0 01-5.05-1.38l-.36-.22-3.7.97.99-3.61-.24-.37A9.94 9.94 0 012.02 12C2.02 6.48 6.48 2.02 12 2.02c2.67 0 5.18 1.04 7.07 2.93A9.94 9.94 0 0121.98 12c0 5.52-4.46 10.02-9.98 10.02zm5.38-7.47c-.29-.15-1.72-.85-1.98-.95s-.46-.15-.65.15c-.2.29-.75.95-.92 1.14-.17.2-.34.22-.63.07-.29-.15-1.21-.45-2.3-1.44-.85-.76-1.42-1.7-1.59-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.2.05-.37-.02-.52-.07-.15-.63-1.52-.87-2.08-.23-.55-.47-.47-.65-.48-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.29-1.05 1.02-1.05 2.49 0 1.47 1.08 2.89 1.23 3.09.15.2 2.14 3.38 5.18 4.61.73.32 1.3.51 1.74.65.73.23 1.39.2 1.91.12.58-.09 1.72-.7 1.96-1.37.24-.67.24-1.24.17-1.36-.07-.12-.27-.19-.57-.34z"/>
</svg>

  </button>

  {/* Google Maps */}
  <a 
    href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
    </svg>
  </a>

  {/* Instagram */}
  <a 
    href={instagram} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors"
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.75 2.25a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1a.75.75 0 01.75-.75zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"/>
    </svg>
  </a>
</div>

      </div>
    </div>
  );
};


export default ContactUsPage;
```

# src\components\Layout\DiscountBar.tsx

```tsx
import React from "react";
import "/src/DiscountBar.css"; // import the CSS file

const DiscountBar = () => {
  return (
    <div className="fixed top-0 inset-x-0 bg-red-600 text-white py-1 px-2 z-[1031] overflow-hidden">
      <p className="scroll-text text-xs sm:text-sm md:text-base font-medium leading-snug whitespace-nowrap">
        🎉 Special Offer Alert! 🎉 Get 10% OFF on all activities – Use code:{" "}
        <strong>SUMMER20</strong> at checkout
      </p>
    </div>
  );
};

export default DiscountBar;

```

# src\components\Layout\Footer.tsx

```tsx
import React from 'react';
import { Palette, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
               <img
      src="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755159745/ARTGRAM_LOGO_zdhftc.png"
      alt="ArtGram Logo"
      className="h-20 w-auto pt-3"
    />
              <span className="text-xl font-bold">Artgram</span>
            </div>
            <p className="text-gray-400">
              Inspiring creativity through hands-on crafting experiences and premium supplies.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-orange-500 transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Shop DIY kits</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Contact us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy-policy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions" className="hover:text-orange-500 transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/shipping-policy" className="hover:text-orange-500 transition-colors">Shipping Policy</Link></li>
                <li><Link to="/refund-policy" className="hover:text-orange-500 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 96868 46100</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>artgram.yourhobbylobby@gmail.com</span>
              </div>
              
            </div>
          </div>
          
           
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Artgram. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

# src\components\Layout\Header.tsx

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LogOut } from 'lucide-react';

// localStorage cart key
const CART_KEY = 'cart_items';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  useData(); // keep for future needs

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const desktopDropdownRef = useRef<HTMLDivElement | null>(null);
  const [cartCount, setCartCount] = useState(0);

  // simple class helpers
  const linkBase = 'text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md';
  const activeLink = 'text-orange-600 font-semibold';
  const isActive = (paths: string[]) => paths.includes(location.pathname);

  // update cart count from localStorage
  const updateCartCount = () => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const items = raw ? JSON.parse(raw) : [];
      const count = items.reduce((s: number, i: { qty?: number }) => s + (i.qty || 1), 0);
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  // close menus on route change
  useEffect(() => {
    setOpen(false);
    updateCartCount();
  }, [location.pathname]);

  // click outside handler to close dropdowns (kept minimal)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target as Node)) {
        /* no-op for now */
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // keep cart count in sync across tabs and via custom events
  useEffect(() => {
    updateCartCount();
    const storageHandler = (e: StorageEvent) => {
      if (e.key === CART_KEY) updateCartCount();
    };
    // custom event dispatched in other parts of the app
  const custom = () => updateCartCount();
    window.addEventListener('storage', storageHandler as EventListener);
    window.addEventListener('app_data_updated', custom as EventListener);
    return () => {
      window.removeEventListener('storage', storageHandler as EventListener);
      window.removeEventListener('app_data_updated', custom as EventListener);
    };
  }, []);

  return (
    <nav id="universalNavbar" className="sticky top-0 inset-x-0 z-[1030] bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-[86px]">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center no-underline">
              <img src="https://res.cloudinary.com/dwb3vztcv/image/upload/v1755159745/ARTGRAM_LOGO_zdhftc.png" alt="ArtGram Logo" className="h-14 w-auto" />
              <span className="ml-3 text-2xl font-bold text-orange-600">ArtGram</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            <Link to="/" className={`${linkBase} ${isActive(['/', '/index.html']) ? activeLink : ''}`}>Home</Link>
            <Link to="/activities" className={`${linkBase} ${isActive(['/activities']) ? activeLink : ''}`}>Activities</Link>
            <Link to="/events" className={`${linkBase} ${isActive(['/events']) ? activeLink : ''}`}>Events</Link>
            <Link to="/store" className={`${linkBase} ${isActive(['/store']) ? activeLink : ''}`}>Store</Link>
            <Link to="/ourstory" className={`${linkBase} ${isActive(['/ourstory']) ? activeLink : ''}`}>Our Story</Link>
            <Link to="/contact" className={`${linkBase} ${isActive(['/contact']) ? activeLink : ''}`}>Contact</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative inline-flex items-center no-underline">
              <span className="ml-2 text-gray-600">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
              )}
            </Link>

            {!user && (
              <Link to="/login" className="ml-2 inline-block rounded-full bg-orange-600 text-white px-4 py-2 font-semibold hover:bg-orange-700 transition-all no-underline">Login</Link>
            )}

            {user && (
              <>
                <Link to={user.role === 'admin' ? '/admin' : user.role === 'branch_manager' ? '/manager' : '/dashboard'} className="ml-2 inline-block rounded-full bg-orange-600 text-white px-4 py-2 font-semibold hover:bg-orange-700 transition-all no-underline">Dashboard</Link>
                <button onClick={() => { logout(); navigate('/'); }} className="ml-2 inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 text-gray-700 px-3 py-2 font-semibold hover:bg-gray-100 transition-all"><LogOut className="w-4 h-4" />Logout</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" className={`${linkBase} block ${isActive(['/', '/index.html']) ? activeLink : ''}`}>Home</Link>
            <Link to="/activities" className={`${linkBase} block ${isActive(['/activities']) ? activeLink : ''}`}>Activities</Link>
            <Link to="/events" className={`${linkBase} block ${isActive(['/events']) ? activeLink : ''}`}>Events</Link>
            <Link to="/store" className={`${linkBase} block ${isActive(['/store']) ? activeLink : ''}`}>Store</Link>
            <Link to="/ourstory" className={`${linkBase} block ${isActive(['/ourstory']) ? activeLink : ''}`}>Our Story</Link>
            <Link to="/contact" className={`${linkBase} block ${isActive(['/contact']) ? activeLink : ''}`}>Contact</Link>
            <div className="mt-3">
              <Link to="/cart" className="block text-sm text-gray-700">Cart {cartCount > 0 && <span className="ml-1 text-xs text-red-600">({cartCount})</span>}</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
```

# src\components\Layout\OurStoryPage.tsx

```tsx
import React, { useState, useEffect } from "react";

const OurStoryPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const timelineEvents = [
    {
      year: "May 2023",
      title: "Artgram's Inception",
      description: "ArtGram starts in Vijayawada",
      icon: "🌱",
      color: "from-green-400 to-emerald-500",
    },
    {
      year: "Oct 2023",
      title: "Hyderabad Branch",
      description:
        "First branch in Hyderabad, Gachibowli",
      icon: "🏢",
      color: "from-blue-400 to-cyan-500",
    },
    {
      year: "Mar 2024",
      title: "Hyderabad Relocation",
      description:
        "Shift of location in Hyderabad: Gachibowli to Banjara Hills",
      icon: "📍",
      color: "from-purple-400 to-violet-500",
    },
    {
      year: "May 2024",
      title: "Summer Expansion",
      description:
        "Temporary summer branches in Mysore, Nellore, and Vizag",
      icon: "☀️",
      color: "from-orange-400 to-red-500",
    },
    {
      year: "2024",
      title: "Bengaluru Calling",
      description:
        "Branch in Bengaluru, HSR Layout",
      icon: "🚀",
      color: "from-indigo-400 to-purple-500",
    },
    {
      year: "Oct 2024",
      title: "New Activities",
      description: "Slime and tufting introduced",
      icon: "🎨",
      color: "from-pink-400 to-rose-500",
    },
    {
      year: "2025",
      title: "Future Vision",
      description:
        "Franchise branches in multiple cities of India.",
      icon: "✨",
      color: "from-yellow-400 to-amber-500",
    },
  ];

  const collaborationLogos = [
    {
      name: "Lala Land",
      url: "https://res.cloudinary.com/dwb3vztcv/image/upload/v1755589424/1_d02g4n.png",
    },
    {
      name: "Cocobakes",
      url: "https://res.cloudinary.com/dwb3vztcv/image/upload/v1755589425/2_tnqlc0.png",
    },
    {
      name: "The Culture Garage",
      url: "https://res.cloudinary.com/dwb3vztcv/image/upload/v1755589427/3_aic0ye.png",
    },
    {
      name: "Pop up",
      url: "https://res.cloudinary.com/dwb3vztcv/image/upload/v1755589429/4_gkcesc.png",
    },
    {
      name: "Lim",
      url: "https://res.cloudinary.com/dwb3vztcv/image/upload/v1755589433/6_t40s4k.png",
    },
    {
      name: "Kali",
      url: "https://res.cloudinary.com/dwb3vztcv/image/upload/v1755589431/5_wwhme1.png",
    },
  ];

  const featuredLogos = [
    {
      name: "The Hindu",
      url: "https://res.cloudinary.com/df2mieky2/image/upload/v1754843595/Screenshot_2025-08-10_220245_kh5xpy.png",
    },
    {
      name: "The New Indian Express",
      url: "https://res.cloudinary.com/df2mieky2/image/upload/v1754843718/Screenshot_2025-08-10_220452_v58xwq.png",
    },
    {
      name: "Eenadu",
      url: "https://res.cloudinary.com/df2mieky2/image/upload/v1754843509/Screenshot_2025-08-10_220123_dstox5.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
      {/* Hero Story Section */}
           <section className="relative min-h-screen flex items-center bg-gradient-to-br from-orange-200 via-amber-200 to-orange-300 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating elements */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute text-2xl opacity-30 animate-float"
              style={{
                left: `${5 + (i * 8)}%`,
                top: `${10 + (i % 5) * 20}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${6 + (i % 3)}s`
              }}
            >
              {i % 3 === 0 ? '🍊' : i % 3 === 1 ? '✨' : '⭐'}
            </div>
          ))}
          
          {/* Soft bubbles */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={`bubble-${i}`}
              className="absolute rounded-full bg-gradient-to-br from-amber-200/40 to-orange-300/40 backdrop-blur-sm animate-float"
              style={{
                width: `${40 + (i * 12)}px`,
                height: `${40 + (i * 12)}px`,
                left: `${80 - (i * 8)}%`,
                top: `${15 + (i % 4) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${8 + (i % 4)}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}>
              <div className="relative group pt-8">
                {/* Cute frame effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-200 to-orange-300 rounded-3xl opacity-70 blur-md group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute -inset-2 bg-white/50 rounded-3xl backdrop-blur-sm" />
                
                <img
                  src="https://res.cloudinary.com/df2mieky2/image/upload/q_auto,f_auto,w_800/v1754830108/Screenshot_2025-08-10_181702_urntu7.png"
                  alt="A vibrant Artgram studio space with people creating art"
                  className="relative max-w-[400px] w-full mx-auto rounded-2xl shadow-lg transform group-hover:scale-105 transition-all duration-500 border-4 border-white"
                />
                
                {/* Decorative elements around image */}
                <div className="absolute -top-4 -right-4 text-4xl bg-white p-2 rounded-full shadow-md rotate-12">🎨</div>
                <div className="absolute -bottom-4 -left-4 text-4xl bg-white p-2 rounded-full shadow-md -rotate-12">🖌️</div>
              </div>
            </div>

            {/* Content - Keeping the exact same content but with orange color scheme */}
            <div className={`space-y-8 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">👋</div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                    Our Sweet Story
                  </h1>
                </div>
                
                <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mb-6" />
                
                <h2 className="text-3xl font-semibold text-orange-900 leading-relaxed">
                  From a Spark of Passion <span className="text-amber-600">to a Creative Community</span>
                </h2>
              </div>
              
              <div className="space-y-6 text-lg text-orange-800/90 leading-relaxed">
                <p>
                  Artgram is the ultimate destination for birthdays, get-togethers, and corporate events. Whether you're planning a cozy gathering or a grand celebration, we offer tailored packages to suit every occasion. 
                </p>
                
                <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-amber-200">
                  <div className="text-2xl mt-1">🎉</div>
                  <p>
                    Enjoy a private room with captivating activities, exquisite food with a buffet setup, and stunning décor. With capacity to accommodate 60 people, Artgram perfectly suits your venue destination needs.
                  </p>
                </div>
                
                <p>
                  From thoughtful return gifts to extra attractions like face painting, tattoos, or hair braiding, we have you covered. Whatever your vision, Artgram ensures a seamless, joyful experience for you and your guests!
                </p>
              </div>

              
            </div>
          </div>
        </div>
      </section>


      {/* Recognition & Partnerships Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Featured In */}
          <div className="text-center mb-9">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent mb-4 leading-tight md:leading-snug pb-2">
              Featured In
            </h2>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
  {featuredLogos.map((logo, index) => (
    <div
      key={logo.name}
      className="group transition-all duration-300 hover:scale-110 flex items-center justify-center"
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <img
        src={logo.url}
        alt={logo.name}
        className="w-auto h-auto max-h-72 max-w-lg object-contain transition-all duration-300 drop-shadow-lg"
        style={{
          background: "transparent",
          borderRadius: "0",
          padding: "0",
        }}
      />
    </div>
  ))}
</div>


          {/* Collaborations */}
          <div className="mb-16 pt-16 py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent mb-6 leading-tight md:leading-snug pb-2">
                Our Collaborations
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                Working together to spread creativity
              </p>
            </div>    

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {collaborationLogos.map((logo, index) => (
                <div
                  key={logo.name}
                  className="group text-center transition-all duration-300 hover:scale-110 flex flex-col items-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-44 h-44 mx-auto flex items-center justify-center mb-3 group-hover:shadow-2xl transition-all duration-300 p-0 bg-transparent">
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className="max-h-full max-w-full object-contain drop-shadow-lg"
                      style={{
                        borderRadius: "50%",
                        background: "transparent",
                        border: "none",
                        padding: 0,
                      }}
                    />
                  </div>
                  <p className="font-semibold text-gray-700 group-hover:text-orange-600 transition-colors duration-300 text-lg">
                    {logo.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Franchise CTA */}
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-gray-600 via-gray-600 to-gray-600 rounded-3xl p-12 text-white text-center overflow-hidden shadow-2xl">
              {/* Background Elements */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-32 h-32 rounded-full bg-white animate-pulse"
                    style={{
                      left: `${20 + i * 20}%`,
                      top: `${20 + (i % 2) * 40}%`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <div className="text-6xl mb-6">🤝</div>
                <h2 className="text-4xl font-bold mb-6">
                  Become a Part of Our Story
                </h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
                  Interested in bringing Artgram to your city? We are expanding
                  and looking for passionate partners to join our franchise
                  family.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
  <a href="tel:+91 9686846100" className="group bg-white text-orange-600 font-bold px-8 py-4 rounded-full hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-xl">
    <span className="flex items-center justify-center gap-3">
      📞 Enquire About Franchise
      <div className="w-0 group-hover:w-4 h-0.5 bg-purple-600 rounded transition-all duration-300" />
    </span>
  </a>
  <button className="bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
    Learn More
  </button>
</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStoryPage;

```

# src\components\Layout\SlimePlayPage.tsx

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from '../../contexts/DataContext';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { createRazorpayOrder, initiatePayment } from '../../utils/razorpay';

export default function SlimePlayPage() {
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  type BookingData = {
    location: string | null;
    date: string | null;
    session: string;
  price: number;
    time: string | null;
    quantity: number;
  };

  const [bookingData, setBookingData] = useState<BookingData>({
    location: null,
    date: null,
    session: "complete",
  price: 0,
    time: null,
    quantity: 1,
  });

  const [timeSlots, setTimeSlots] = useState([
    {
      time: "10:00",
      label: "10:00 AM",
      status: "available",
      type: "Slime Play & Demo",
      age: "3+ years",
      available: 12,
      total: 15,
      sessionId: undefined, // Will be populated from API
    },
    {
      time: "11:30",
      label: "11:30 AM",
      status: "available",
      type: "Slime Play & Making",
      age: "8+ years",
      available: 8,
      total: 15,
      sessionId: undefined,
    },
    {
      time: "1:00",
      label: "1:00 PM",
      status: "filling-fast",
      type: "Slime Play & Demo",
      age: "3+ years",
      available: 4,
      total: 15,
      sessionId: undefined,
    },
    {
      time: "2:30",
      label: "2:30 PM",
      status: "available",
      type: "Slime Play & Demo",
      age: "3+ years",
      available: 15,
      total: 15,
      sessionId: undefined,
    },
    {
      time: "4:00",
      label: "4:00 PM",
      status: "filling-fast",
      type: "Slime Play & Making",
      age: "8+ years",
      available: 3,
      total: 15,
      sessionId: undefined,
    },
    {
      time: "5:30",
      label: "5:30 PM",
      status: "sold-out",
      type: "Slime Play & Demo",
      age: "3+ years",
      available: 0,
      total: 15,
      sessionId: undefined,
    },
  ]);
  const { getSlotsForDate, createBooking, slotsVersion, getBranchById } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Map booking location codes to branch ids used in DataContext (stable ref)
  const branchMapRef = useRef<Record<string, string>>({ downtown: 'hyderabad', mall: 'vijayawada', park: 'bangalore' });

  // Load dynamic slots from backend API when location or date changes
  useEffect(() => {
    if (!bookingData.location || !bookingData.date) return;
    
    const fetchSessions = async () => {
      try {
        const branchId = branchMapRef.current[bookingData.location];
        const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';
        
        // Get next 10 days sessions for this branch
        const response = await fetch(`${apiBase}/sessions/next-10-days/${branchId}?activity=slime`);
        
        if (response.ok) {
          const sessions = await response.json();
          
          // Filter sessions for the selected date
          const sessionsForDate = sessions.filter((s: any) => s.date === bookingData.date && s.isActive);
          
          // Convert to the format expected by the frontend
          const slots = sessionsForDate.map((s: any) => ({
            time: s.time,
            label: s.label || s.time,
            status: s.availableSeats <= 0 ? 'sold-out' : 
                   (s.availableSeats <= Math.max(1, Math.round(s.totalSeats * 0.25)) ? 'filling-fast' : 'available'),
            type: s.type,
            age: s.ageGroup,
            available: s.availableSeats,
            total: s.totalSeats,
            sessionId: s._id // Store session ID for booking
          }));
          
          setTimeSlots(slots);
        } else {
          console.error('Failed to fetch sessions');
          // Fallback to DataContext
          const saved = getSlotsForDate(branchId, bookingData.date);
          if (saved && saved.slime && Array.isArray(saved.slime)) {
            setTimeSlots(saved.slime.map(s => ({
              time: s.time,
              label: s.label || s.time,
              status: s.available <= 0 ? 'sold-out' : (s.available <= Math.max(1, Math.round(s.total * 0.25)) ? 'filling-fast' : 'available'),
              type: s.type,
              age: s.age,
              available: s.available,
              total: s.total,
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
        // Fallback to DataContext
        const branchId = branchMapRef.current[bookingData.location];
        const saved = getSlotsForDate(branchId, bookingData.date);
        if (saved && saved.slime && Array.isArray(saved.slime)) {
          setTimeSlots(saved.slime.map(s => ({
            time: s.time,
            label: s.label || s.time,
            status: s.available <= 0 ? 'sold-out' : (s.available <= Math.max(1, Math.round(s.total * 0.25)) ? 'filling-fast' : 'available'),
            type: s.type,
            age: s.age,
            available: s.available,
            total: s.total,
          })));
        }
      }
    };
    
    fetchSessions();
  }, [bookingData.location, bookingData.date, getSlotsForDate, slotsVersion]);

  // Handle initial user interaction to enable audio
  const handleUserInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      if (videoRef.current) {
        videoRef.current.muted = false;
        setMuted(false);
      }
    }
  };

  // Handle scroll to mute
  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;
    const handleScroll = () => {
      if (videoRef.current && userInteracted) {
        videoRef.current.muted = true;
        setMuted(true);
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          // Don't auto-unmute after scrolling
        }, 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [userInteracted]);

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const el = document.getElementById(location.hash.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.pathname]);

  // Booking flow functions
  const nextStep = (step: number) => setCurrentStep(step);
  const prevStep = (step: number) => setCurrentStep(step);
  const selectLocation = (location: string) => setBookingData(prev => ({ ...prev, location }));
  const selectDate = (date: string) => {
    if (!user) {
      // Redirect to login and preserve return path
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    setBookingData(prev => ({ ...prev, date }));
  };
  // Slime plans (customer chooses a plan and price is taken from here)
  const plans = [
    { id: 'base', label: 'Base Package', price: 750 },
    { id: 'premium', label: 'Premium Experience', price: 850 }
  ];
  const selectSession = (session: string, planId: string) => {
    // planId may be a plan id ('base'|'premium') or a numeric price string like '750' or '850'
    let price = 0;
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      price = plan.price;
    } else if (!isNaN(Number(planId))) {
      price = Number(planId);
    }
    setBookingData(prev => ({ ...prev, session, price }));
  };
  const selectTime = (time: string) => setBookingData(prev => ({ ...prev, time }));
  const setQuantity = (qty: number) => setBookingData(prev => ({ ...prev, quantity: Number(qty) }));

  const confirmBooking = async () => {
    if (!user) {
      // redirect to login and return here after login
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!bookingData.location || !bookingData.date || !bookingData.time) {
      alert('Please select location, date and time before proceeding.');
      return;
    }

    const total = getTotalPriceSafe();
    try {
  // create order (server-side is recommended). Use branch-specific publishable key when initiating payment.
  const branchId = bookingData.location ? branchMapRef.current[bookingData.location] : undefined;
  const branch = getBranchById(branchId);
  const order = await createRazorpayOrder(total);
  await initiatePayment({ amount: order.amount / 100, currency: order.currency, name: 'Craft Factory', description: 'Slime Booking', order_id: order.id, key: branch?.razorpayKey, handler: async (response) => {
        // on success create booking using new session-based API
        const branchId = bookingData.location ? branchMapRef.current[bookingData.location] : undefined;
        
        // Find the selected session
        const selectedSlot = timeSlots.find(slot => slot.time === bookingData.time);
        
        const bookingPayload: any = {
          customerId: user.id,
          customerName: user.name,
          customerEmail: (user as User).email || '',
          customerPhone: '',
          branchId: branchId || 'hyderabad',
          date: bookingData.date || undefined,
          time: bookingData.time || undefined,
          seats: bookingData.quantity,
          totalAmount: total,
          paymentStatus: 'completed',
          paymentIntentId: response.razorpay_payment_id,
          packageType: bookingData.session, // 'basic' or 'complete'
          activity: 'slime'
        };
        
        // If we have a session ID from the new API, use it
        if (selectedSlot && selectedSlot.sessionId) {
          bookingPayload.sessionId = selectedSlot.sessionId;
        } else {
          // Fallback to legacy eventId for compatibility
          bookingPayload.eventId = `slot-${Date.now()}`;
        }
        
        await createBooking(bookingPayload);
        alert('Booking successful! Check your dashboard for details.');
        navigate('/dashboard');
  }, prefill: { name: user.name, email: (user as User).email || '' , contact: '' }, theme: { color: '#3399cc' }, modal: { ondismiss: () => {} } });
    } catch (e) {
      console.error('Payment/booking failed', e);
      alert('Payment failed. Please try again.');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not selected";
    return new Date(dateStr).toDateString();
  };

  type LocationKey = 'downtown' | 'mall' | 'park';
  const getLocationName = (location: LocationKey | string | null) => {
    const locationNames: Record<LocationKey, string> = {
      downtown: "Hyderabad",
      mall: "Vijayawada",
      park: "Bangalore",
    };
    if (!location) return 'Not selected';
    return (locationNames as Record<string, string>)[location] || "Not selected";
  };

  // If bookingData.price wasn't set for some reason, infer price from selected session
  const getPlanPrice = () => {
    if (bookingData.price && bookingData.price > 0) return bookingData.price;
    // Map internal session keys to plan ids used above
    const sessionToPlanId: Record<string, string> = {
      complete: 'premium',
      basic: 'base'
    };
    const planId = sessionToPlanId[bookingData.session] || 'base';
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.price : 0;
  };

  const getTotalPriceSafe = () => getPlanPrice() * bookingData.quantity;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-green-100 to-purple-100"
      onClick={handleUserInteraction}
    >
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-black flex items-center justify-center text-center text-white overflow-hidden">
  <div className="absolute inset-0 z-10">
    <video
      ref={videoRef}
      src="https://res.cloudinary.com/df2mieky2/video/upload/v1755029444/HYDERABAD_Slime_xa1l3x.mp4"
      autoPlay
      loop
      playsInline
      muted={!userInteracted || muted}
      className="absolute w-auto min-w-full min-h-full max-w-none opacity-70"
    />

    {/* 🔊 Mute/Unmute button */}
    <button 
      onClick={() => {
        if (videoRef.current) {
          videoRef.current.muted = !videoRef.current.muted;
          setMuted(videoRef.current.muted);
        }
      }}
      className="absolute bottom-6 right-6 z-20 bg-black/50 hover:bg-black/70 rounded-full p-3 backdrop-blur-sm transition-all duration-300"
      aria-label={muted ? "Unmute video" : "Mute video"}
    >
      {muted ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a7.975 7.975 0 015.657 2.343m0 0a7.975 7.975 0 010 11.314m-11.314 0a7.975 7.975 0 010-11.314m0 0a7.975 7.975 0 015.657-2.343" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </button>
  </div>

  {/* 🔲 Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-0" />

  {/* Center content (if you want text here later) */}
  <div className="relative z-20 max-w-4xl text-center">
    {/* You can add a heading/intro text here if needed */}
  </div>

 
</section>



      {/* Package Overview Section */} 
      <section className="py-16 md:py-20">
  <div className="max-w-6xl mx-auto px-5 flex flex-col">
    
    {/* Title */}
    <h2 className="text-3xl md:text-4xl font-bold text-center text-red-600 mb-10">
      Choose Your Slime Adventure
    </h2>

    {/* Packages */}
   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
      
  {/* Base Package */}
  <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-green-400">
    <h3 className="text-2xl md:text-3xl font-black text-center text-red-600 mb-3">
      Rs 750/- Base Package
    </h3>
    <p className="text-gray-600 text-base md:text-lg font-medium text-center mb-4">
      Play + Demo or  Making
    </p>
    
    {/* Items */}
    <div className="space-y-4 mb-6">
      {/* Slime Play */}
      <div className="bg-white rounded-2xl p-4 md:p-5 flex items-start gap-4">
        <img
          src="https://res.cloudinary.com/df2mieky2/image/upload/v1754831671/HAR05994_de7kjp.jpg"
          alt="Slime Play"
          className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg border"
        />
        <div>
          <h4 className="text-base md:text-lg font-bold text-red-600">
            Slime Play 
            <span className="bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-semibold ml-2">
              45 min
            </span>
          </h4>
          <p className="text-sm text-gray-600 leading-tight mt-1">
            Touch different colours and textures, slime throwing, jumping, magnetic slime and much more!
          </p>
        </div>
      </div>

      <h2 className="text-center">+</h2>

      {/* Slime Demo */}
      <div className="bg-white rounded-2xl p-4 md:p-5 flex items-start gap-4">
        <img
          src="https://res.cloudinary.com/df2mieky2/image/upload/v1754831672/DSC07792_xxy5w1.jpg"
          alt="Slime Demo"
          className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg border"
        />
        <div>
          <h4 className="text-base md:text-lg font-bold text-red-600">
            Slime Demo 
            <span className="bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-semibold ml-2">
              15 min
            </span>
          </h4>
          <p className="text-sm text-gray-600 leading-tight mt-1">
            Hands-on experience for 8+ years. In some sessions, 8+ kits/adults can make their own slime. 
            Not available in all sessions — please check while booking.
          </p>
        </div>
      </div>
      <h2 className="text-center">or</h2>

      {/* Slime Making */}
      <div className="bg-white rounded-2xl p-4 md:p-5 flex items-start gap-4">
        <img
          src="https://res.cloudinary.com/df2mieky2/image/upload/v1754831672/DSC07792_xxy5w1.jpg"
          alt="Slime Making"
          className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg border"
        />
        <div>
          <h4 className="text-base md:text-lg font-bold text-red-600">
            Slime Making 
            <span className="bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-semibold ml-2">
              15 min
            </span>
          </h4>
          <p className="text-sm text-gray-600 leading-tight mt-1">
            Hands-on experience for 8+ years. In some sessions, 8+ kits/adults can make their own slime. 
            Not available in all sessions — please check while booking.
          </p>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="text-center border-t-2 border-gray-100 pt-5">
      <div className="text-base md:text-lg font-semibold text-green-400 mb-4">
        ⏱️ Total: 1 Hour
      </div>
      <a
        href="#booking"
        onClick={() => selectSession("basic", 'base')}
        className="bg-green-400 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold hover:bg-blue-500 transition-colors"
      >
        Choose Base Package
      </a>
    </div>
  </div>

  {/* Premium Package */}
  <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-purple-500">
    <h3 className="text-2xl md:text-3xl font-black text-center text-red-600 mb-2">
      Rs 850/- Premium Experience
    </h3>
    <p className="text-gray-600 text-base md:text-lg font-medium text-center mb-4">
      Ultimate Slime Adventure
    </p>

    <div className="mb-6">
     
      
      {/* Base Package Items */}
      <div className="space-y-4 mb-4">
        {/* Slime Play */}
        <div className="bg-white rounded-2xl p-4 md:p-5 flex items-start gap-4">
          <img
            src="https://res.cloudinary.com/df2mieky2/image/upload/v1754831671/HAR05994_de7kjp.jpg"
            alt="Slime Play"
            className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg border"
          />
          <div>
            <h4 className="text-base md:text-lg font-bold text-red-600">
              Everything in Base Package
              <span className="bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-semibold ml-2">
                1 Hour
              </span>
            </h4>
            <p className="text-sm text-gray-600 leading-tight mt-1">
              Play + Demo or  Making
            </p>
          </div>
        </div>

        {/* Slime Demo OR Making */}
        
      </div>
      
      {/* Plus Icon */}
      <div className="flex justify-center my-3">
        <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">+</div>
      </div>
      
      {/* Premium Addition */}
      <div className="bg-white rounded-2xl p-4 md:p-6 border-2 border-pink-400 flex items-start gap-4">
        <img
          src="https://res.cloudinary.com/df2mieky2/image/upload/v1754831818/Screenshot_2025-08-10_184600_dugdpm.png"
          alt="Glow in Dark"
          className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg border"
        />
        <div>
          <h4 className="text-base md:text-lg font-bold text-red-600">
            ✨ Glow in Dark Experience 
            <span className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold ml-2">
              +15 min
            </span>
          </h4>
          <p className="text-sm text-gray-600 leading-tight mt-1">
            15 minutes of magical glowing slime in our special dark room. Watch your slime transform!
          </p>
        </div>
      </div>
    </div>

    <div className="text-center border-t-2 border-purple-100 pt-5">
      <div className="text-base md:text-lg font-semibold text-purple-600 mb-4">
        ⏱️ Total: 1 Hour 15 Minutes
      </div>
      <a
        href="#booking"
        onClick={() => selectSession("complete", "850")}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold hover:from-pink-500 hover:to-purple-500 transition-all"
      >
        Choose Premium Pack
      </a>
    </div>
  </div>
</div>

  </div>
</section>


      {/* Additional Information Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center text-red-600 mb-12">
            Additional Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border-l-4 border-green-400">
              <h4 className="text-xl font-bold text-red-600 mb-3">
                Booking Required
              </h4>
              <p className="text-gray-700">
                By booking only, Limited slots. Advance booking essential to
                secure your spot for this popular experience.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border-l-4 border-green-400">
              <h4 className="text-xl font-bold text-red-600 mb-3">
                Parent Supervision
              </h4>
              <p className="text-gray-700">
                One parent allowed with 1 kid (below 12yrs). We ensure a safe
                and supervised environment for all activities.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border-l-4 border-green-400">
              <h4 className="text-xl font-bold text-red-600 mb-3">
                Age Requirement
              </h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  For <strong>Slime Play & Demo</strong> sessions: anyone above{" "}
                  <strong>3+ years</strong> is welcome.
                </li>
                <li>
                  For <strong>Slime Play & Making</strong> sessions: anyone
                  above <strong>8+ years</strong> is welcome.
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 border-l-4 border-green-400">
              <h4 className="text-xl font-bold text-red-600 mb-3">
                Group & Private Sessions
              </h4>
              <p className="text-gray-700">
                All our Slime sessions are group sessions. Private sessions are
                available for an additional cost. Please contact us for details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-center text-red-600 mb-12">
            Slime Experience Gallery
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "https://res.cloudinary.com/df2mieky2/image/upload/v1754831671/HAR05994_de7kjp.jpg",
              "https://res.cloudinary.com/df2mieky2/image/upload/v1754831665/HAR05956_cwxrxr.jpg",
              "https://res.cloudinary.com/df2mieky2/image/upload/v1754831664/IMG_5291.JPEG_fjpdme.jpg",
              "https://res.cloudinary.com/df2mieky2/image/upload/v1754831662/IMG_4561_axaohh.jpg",
              "https://res.cloudinary.com/df2mieky2/image/upload/v1754831660/IMG_3352_nsdiar.jpg",
              "https://res.cloudinary.com/df2mieky2/image/upload/v1754831672/DSC07792_xxy5w1.jpg",
            ].map((src, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-10 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-purple-500 to-pink-500"></div>
                <img
                  src={src || "/placeholder.svg"}
                  alt={`Slime activity ${index + 1}`}
                  className="w-full h-48 object-cover rounded-2xl hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-4xl font-bold text-center text-red-600 mb-8">Book Your Slime Experience</h2>
            
            {/* Step 1: Select Location */}
            {currentStep === 1 && (
              <div>
                <h3 className="text-2xl font-bold text-red-600 text-center mb-6">Step 1: Choose Location</h3>
                <div className="flex gap-5 flex-wrap justify-center mb-5">
                  {['downtown', 'mall', 'park'].map(id => (
                    <div key={id} onClick={() => selectLocation(id)} className={`border-2 rounded-xl p-6 text-center cursor-pointer transition-all min-w-48 ${bookingData.location === id ? 'border-green-400 bg-green-100 -translate-y-1 shadow-lg' : 'border-gray-200 hover:border-green-400 hover:bg-green-50'}`}>
                      <div className="font-bold text-lg mb-1">{getLocationName(id)}</div>
                      {id === 'mall' && <div className="text-xs text-red-500">No Session on Mondays</div>}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <button disabled={!bookingData.location} onClick={() => nextStep(2)} className="bg-green-400 text-black px-8 py-2 rounded-full font-semibold hover:bg-blue-500 hover:text-white transition-colors disabled:bg-gray-300">Next</button>
                </div>
              </div>
            )}

            {/* Step 2: Select Date */}
            {currentStep === 2 && (
              <div>
                <h3 className="text-2xl font-bold text-red-600 text-center mb-6">Step 2: Select Your Date</h3>
                <div className="flex gap-4 flex-wrap justify-center mb-5">
                  {[...Array(9)].map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const value = date.toISOString().split('T')[0];
                    const isMonday = date.getDay() === 1;
                    const isHyderabad = bookingData.location === 'mall';
                    const isDisabled = isMonday && isHyderabad;
                    
                    return (
                      <div 
                        key={value} 
                        onClick={() => !isDisabled && selectDate(value)} 
                        className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all min-w-24 ${
                          isDisabled ? 'bg-gray-100 cursor-not-allowed opacity-50' :
                          bookingData.date === value ? 'border-green-400 bg-green-100 -translate-y-1 shadow-lg' : 
                          'border-gray-200 hover:border-green-400 hover:bg-green-50'
                        }`}
                      >
                        <div className="text-sm font-semibold">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-xl font-bold my-1">{date.getDate()}</div>
                        <div className="text-xs">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                        {isDisabled && <div className="text-xs text-red-500 mt-1">No Sessions</div>}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={() => prevStep(1)} className="border-2 border-gray-500 text-gray-500 px-8 py-2 rounded-full font-semibold">Back</button>
                  <button disabled={!bookingData.date} onClick={() => nextStep(3)} className="bg-green-400 text-black px-8 py-2 rounded-full font-semibold hover:bg-blue-500 hover:text-white disabled:bg-gray-300">Next</button>
                </div>
              </div>
            )}
            
            {/* Step 3: Select Quantity */}
            {currentStep === 3 && (
                <div>
                    <h3 className="text-2xl font-bold text-red-600 text-center mb-6">Step 3: How many tickets?</h3>
                    <div className="flex justify-center items-center gap-4 mb-5">
                        <button onClick={() => setQuantity(Math.max(1, bookingData.quantity - 1))} className="w-12 h-12 rounded-full bg-gray-200 text-2xl font-bold">-</button>
                        <span className="text-4xl font-bold w-20 text-center">{bookingData.quantity}</span>
                        <button onClick={() => setQuantity(bookingData.quantity + 1)} className="w-12 h-12 rounded-full bg-gray-200 text-2xl font-bold">+</button>
                    </div>
                     <div className="flex justify-between mt-6">
                        <button onClick={() => prevStep(2)} className="border-2 border-gray-500 text-gray-500 px-8 py-2 rounded-full font-semibold">Back</button>
                        <button onClick={() => nextStep(4)} className="bg-green-400 text-black px-8 py-2 rounded-full font-semibold hover:bg-blue-500 hover:text-white">Next</button>
                    </div>
                </div>
            )}

            {/* Step 4: Select Session & Time */}
            {currentStep === 4 && (
              <div>
                <h3 className="text-2xl font-bold text-red-600 text-center mb-6">Step 4: Choose Session</h3>
                 <div className="flex gap-5 flex-wrap justify-center mb-10">
                    <div onClick={() => selectSession('complete', '850')} className={`border-2 rounded-2xl p-6 text-center cursor-pointer min-w-48 ${bookingData.session === 'complete' ? 'border-purple-400 bg-purple-100' : 'hover:border-purple-400'}`}>
                        <div className="font-bold text-lg mb-1">Premium Experience</div>
                        <div className="text-sm opacity-80 mb-2">Play + Demo + Glow (1 Hr 15 min)</div>
                        <div className="text-2xl font-bold text-red-500">Rs 850/-</div>
                    </div>
                    <div onClick={() => selectSession('basic', '750')} className={`border-2 rounded-2xl p-6 text-center cursor-pointer min-w-48 ${bookingData.session === 'basic' ? 'border-green-400 bg-green-100' : 'hover:border-green-400'}`}>
                        <div className="font-bold text-lg mb-1">Base Package</div>
                        <div className="text-sm opacity-80 mb-2">Play + Demo (1 Hour)</div>
                        <div className="text-2xl font-bold text-red-500">Rs 750/-</div>
                    </div>
                 </div>

                <h3 className="text-2xl font-bold text-red-600 text-center mb-6">Step 5: Select Time Slot</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                  {timeSlots.map((slot) => (
                    <div key={slot.time} onClick={() => slot.status !== 'sold-out' && selectTime(slot.time)} 
                    className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${ slot.status === 'sold-out' ? 'bg-gray-100 cursor-not-allowed opacity-60' : bookingData.time === slot.time ? 'border-green-400 bg-green-100 -translate-y-1 shadow-lg' : 'hover:border-green-400'}`}>
                      <div className="font-bold mb-1 text-lg">{slot.label}</div>
                      <div className="text-xs font-semibold text-blue-600">{slot.type}</div>
                       <div className="text-xs font-semibold text-purple-600 mb-2">({slot.age})</div>
                      <div className={`text-xs font-bold ${slot.status === 'sold-out' ? 'text-red-500' : slot.status === 'filling-fast' ? 'text-orange-500' : 'text-green-600'}`}>
                        {slot.status === 'sold-out' ? 'Sold Out' : `${slot.available}/${slot.total} available`}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={() => prevStep(3)} className="border-2 border-gray-500 text-gray-500 px-8 py-2 rounded-full font-semibold">Back</button>
                  <button disabled={!bookingData.time} onClick={() => nextStep(5)} className="bg-green-400 text-black px-8 py-2 rounded-full font-semibold hover:bg-blue-500 hover:text-white disabled:bg-gray-300">Next</button>
                </div>
              </div>
            )}

            {/* Step 6: Contact Details & Summary */}
            {currentStep === 5 && (
              <div>
                <h3 className="text-2xl font-bold text-red-600 text-center mb-6">Step 6: Contact & Summary</h3>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Contact Information</h4>
                    <div className="space-y-4">
                       <div>
                        <label className="block font-semibold text-gray-700 mb-1">Parent/Guardian Name *</label>
                        <input type="text" className="w-full border-2 border-gray-200 rounded-lg p-3" placeholder="Enter your name" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Phone Number *</label>
                        <input type="tel" className="w-full border-2 border-gray-200 rounded-lg p-3" placeholder="+91 XXXXX XXXXX" />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                        <input type="email" className="w-full border-2 border-gray-200 rounded-lg p-3" placeholder="your.email@example.com" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold mb-4">Booking Summary</h4>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="space-y-2 text-sm">
                        <div><strong>Location:</strong> <span>{getLocationName(bookingData.location)}</span></div>
                        <div><strong>Date:</strong> <span>{formatDate(bookingData.date)}</span></div>
                        <div><strong>Time:</strong> <span>{bookingData.time || 'Not selected'}</span></div>
                        <div><strong>Tickets:</strong> <span>{bookingData.quantity}</span></div>
                        <div><strong>Session:</strong> <span>{bookingData.session === 'complete' ? 'Premium Experience' : 'Base Package'}</span></div>
                        <ul className="list-disc list-inside ml-4 pt-1">
                          <li>Slime Play (45 min)</li>
                          <li>Slime Demo/Making (15 min)</li>
                          {bookingData.session === 'complete' && <li>Glow in Dark Experience (15 min)</li>}
                        </ul>
                      </div>
                      <div className="text-3xl font-bold text-green-500 mt-4 pt-4 border-t border-gray-200">
                        Total: Rs {getTotalPriceSafe()}/-
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8">
                  <button onClick={() => prevStep(4)} className="border-2 border-gray-500 text-gray-500 px-8 py-2 rounded-full font-semibold">Back</button>
                  <button onClick={confirmBooking} className="w-full max-w-xs bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-xl font-bold text-lg">
                      Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
```

# src\components\Layout\TuftingActivityPage.tsx

```tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { createRazorpayOrder, initiatePayment } from '../../utils/razorpay';



// Define gallery images to be used in the carousel and the gallery section
const galleryImages = [
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651196/DSC07703_y0ykmy.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651200/HAR05892_zs7cre.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651194/IMG_0168_kqn6hv.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651192/HAR05922_vmmr5p.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651195/DSC07659_zj2pcc.jpg",
  "https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651197/HAR05826_iefkzg.jpg",
];

const TuftingActivityPage = () => {
  // The booking process now starts with the location step.
  const [step, setStep] = useState("location");
  // State for storing available dates
  const [dates, setDates] = useState<Date[]>([]);
  // Types
  type TuftingSlot = { time: string; label?: string; available?: number; total?: number; status?: string; price?: number; type?: string; age?: string };
  type BookingSession = { id: string; price: number; label: string } | null;
  type BookingData = {
    date: string;
    location: string;
    session: BookingSession;
    time: string;
    quantity: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
  };

  // State for storing all booking details
  const [booking, setBooking] = useState<BookingData>({
    date: "",
    location: "",
    session: null,
    time: "",
    quantity: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
  });
  // State for the image carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);

  const { getSlotsForDate, createBooking, slotsVersion, getBranchById } = useData();
  const { branches } = useData();
  const { user } = useAuth();
  const [tuftingSlots, setTuftingSlots] = useState<TuftingSlot[]>([]);

  const handleUserInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      if (videoRef.current) {
        videoRef.current.muted = false;
        setMuted(false);
      }
    }
  };

  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;
    const handleScroll = () => {
      if (videoRef.current && userInteracted) {
        if (videoRef.current) videoRef.current.muted = true;
        setMuted(true);
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {}, 1000);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); if (scrollTimer) clearTimeout(scrollTimer); };
  }, [userInteracted]);

  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const el = document.getElementById(location.hash.replace('#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [location.hash, location.pathname]);

  // Effect to generate the next 7 days for date selection
  useEffect(() => {
    const today = new Date();
    const arr = [];
  for (let i = 0; i < 9; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    setDates(arr as Date[]);
  }, []);

  // Effect for the auto-playing image carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(timer);
  }, []);

  // Available tufting session options
  const sessions = [
    { id: "beginner", price: 2000, label: "Small - 8x8 (Inches)" },
    { id: "advanced", price: 3500, label: "Medium - 12x12 (Inches)" },
    { id: "master", price: 4500, label: "Big - 14x14 (Inches)" },
  ];

  // Memoized calculation for the total booking cost
  const total = useMemo(
    () =>
      booking.session && booking.quantity
        ? booking.session.price * Number(booking.quantity)
        : 0,
    [booking.session, booking.quantity]
  );

  // Handler for input changes to keep state updated
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setBooking((prev) => ({ ...prev, [id]: value } as BookingData));
  };

  // Load tufting slots when booking.location or booking.date changes
  useEffect(() => {
    if (!booking.location || !booking.date) return;
    const branchMap: Record<string, string> = { downtown: 'hyderabad', mall: 'vijayawada', park: 'bangalore', hyderabad: 'hyderabad', bangalore: 'bangalore', vijayawada: 'vijayawada' };
    const branchId = branchMap[booking.location] || booking.location;
    const saved = getSlotsForDate(branchId, booking.date);
    if (saved && Array.isArray(saved.tufting)) {
      setTuftingSlots(saved.tufting as TuftingSlot[]);
    }
  }, [booking.location, booking.date, getSlotsForDate, slotsVersion]);

  // Check if all required fields for the final step are filled
  const canProceedToBook =
    booking.customerName && booking.customerPhone && booking.customerEmail && booking.quantity;

  return (
  <div onClick={handleUserInteraction}>
      {/* Hero Section with Video Background */}
       <section className="relative h-[70vh] bg-black flex items-center justify-center text-center text-white overflow-hidden">
  <div className="absolute inset-0 z-10">
    <video
      ref={videoRef}
      src="https://res.cloudinary.com/dwb3vztcv/video/upload/v1755546792/TUFTING_LANSCAPE_pm5v9h.mp4"
      autoPlay
      loop
      playsInline
      muted={!userInteracted || muted}
      className="absolute w-auto min-w-full min-h-full max-w-none opacity-70"
    />

    {/* 🔊 Mute/Unmute button */}
    <button 
      onClick={() => {
        if (videoRef.current) {
          videoRef.current.muted = !videoRef.current.muted;
          setMuted(videoRef.current.muted);
        }
      }}
      className="absolute bottom-6 right-6 z-20 bg-black/50 hover:bg-black/70 rounded-full p-3 backdrop-blur-sm transition-all duration-300"
      aria-label={muted ? "Unmute video" : "Mute video"}
    >
      {muted ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a7.975 7.975 0 015.657 2.343m0 0a7.975 7.975 0 010 11.314m-11.314 0a7.975 7.975 0 010-11.314m0 0a7.975 7.975 0 015.657-2.343" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </button>
  </div>

  {/* 🔲 Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-0" />

  {/* Center content (if you want text here later) */}
  <div className="relative z-20 max-w-4xl text-center">
    {/* You can add a heading/intro text here if needed */}
  </div>

  {/* 🔘 Button pinned to bottom center */}
  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
    
  </div>
   
</section>

      

      {/* What is Tufting Section with Mini Carousel */}
     <section className="py-16 bg-gray-50">
  <div className="container mx-auto px-4">
    
    {/* Title */}
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-black text-rose-600 mb-2">
        🤔 What is Tufting?
      </h2>
      <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
        A modern twist on rug making — use a tufting gun to punch yarn into fabric
        and create your own textured art.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8 items-center">

      {/* Feature Cards */}
      <div className="flex flex-col space-y-5">
        <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <div className="text-3xl mb-2">🎨</div>
          <h3 className="text-lg font-bold mb-1 text-gray-800">
            Tufting Fun & Creativity
          </h3>
          <div className="flex items-center gap-3 group">
  {/* Bullet */}
  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-rose-400 rounded-full group-hover:scale-150 transition-transform duration-300" />
  
  {/* Text */}
  <p className="text-gray-600 text-sm md:text-base group-hover:text-gray-900 transition-colors duration-300">
    Make rugs, coasters, charms or wall art with colorful yarn and a tufting gun.
  </p>
</div>

        </div>

        <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <div className="text-3xl mb-2">🧵</div>
          <h3 className="text-lg font-bold mb-1 text-gray-800">
            Guided by Experts
          </h3>
          <div className="flex items-center gap-3 group">
  {/* Bullet */}
  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-rose-400 rounded-full group-hover:scale-150 transition-transform duration-300" />
  
  {/* Text */}
  <p className="text-gray-600 text-sm md:text-base group-hover:text-gray-900 transition-colors duration-300">
    Step-by-step help with plenty of colors to choose from.
  </p>
</div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <div className="text-3xl mb-2">🏠</div>
          <h3 className="text-lg font-bold mb-1 text-gray-800">
            Take Home Your Art 
          </h3>
           <div className="flex items-center gap-3 group">
  {/* Bullet */}
  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-rose-400 rounded-full group-hover:scale-150 transition-transform duration-300" />
  
  {/* Text */}
  <p className="text-gray-600 text-sm md:text-base group-hover:text-gray-900 transition-colors duration-300">
    Leave with a unique piece that reflects your style.
  </p>
</div>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-xl shadow-lg overflow-hidden">
        <img
          key={currentImageIndex}
          src={galleryImages[currentImageIndex]}
          alt="Tufting creation"
          className="w-full h-full object-cover animate-fade-in"
        />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                currentImageIndex === index ? 'bg-white scale-110' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Gallery Section */}
      <section className="py-16 bg-pink-50">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-rose-600">
            🖼️ Tufting Gallery - Customer Creations
          </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((src) => (
              <div key={src} className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src={src}
                  alt="Tufting creation by a student"
                  className="w-full h-[250px] object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = 'https://placehold.co/400x250/f9699c/white?text=Art' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
     <section
        id="tufting-booking"
        className="py-16"
        style={{ backgroundImage: "linear-gradient(135deg, #f9699c, #3f51b5)" }}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="backdrop-blur bg-white/95 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-extrabold text-center mb-8 text-purple-600">
              🎯 BOOK YOUR TUFTING EXPERIENCE NOW!
            </h2>

            {/* Step 1: Date Selection */}
            <TuftStep
              title="📅 Select Date"
              color="#9b59b6"
              isVisible={step === "date"}
              onNext={() => setStep("location")}
              canNext={Boolean(booking.date)}
            >
              <div className="flex flex-wrap gap-2">
                  {dates.map((d, i) => {
                  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
                  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                  const label = i === 0 ? "TODAY" : i === 1 ? "TOM" : dayNames[d.getDay()];
                  const iso = d.toISOString().split("T")[0];
                  const selected = booking.date === iso;
                    return (
                    <button
                      key={iso}
                      onClick={() => {
                        if (!user) {
                          navigate('/login', { state: { from: window.location.pathname } });
                          return;
                        }
                        setBooking((b) => ({ ...b, date: iso }));
                      }}
                      className={`min-w-[100px] text-center rounded-lg border-2 px-4 py-3 transition-all ${
                        selected
                          ? "border-purple-600 bg-purple-600 text-white -translate-y-0.5"
                          : "border-gray-300 bg-white hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="text-xs font-semibold">{label}</div>
                      <div className="text-xl font-extrabold">{d.getDate()}</div>
                      <div className="text-xs">{monthNames[d.getMonth()]}</div>
                    </button>
                  );
                })}
              </div>
            </TuftStep>

            {/* Step 2: Location Selection */}
            <TuftStep
              title="📍 Select Location"
              color="#9b59b6"
              isVisible={step === "location"}
              onBack={() => setStep("date")}
              onNext={() => setStep("session")}
              canNext={Boolean(booking.location)}
            >
              <div className="flex flex-wrap gap-3">
                {branches.filter(b => b.supportsTufting !== false).map((b) => ({ id: b.id, name: b.name.includes('Vijayawada') ? '🏬 Vijayawada' : b.name, detail: b.location })) .map((l) => {
                  const selected = booking.location === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setBooking((b) => ({ ...b, location: l.id }))}
                      className={`min-w-[200px] text-center rounded-xl border-2 px-6 py-5 transition-all ${
                        selected
                          ? "border-purple-600 bg-purple-600 text-white -translate-y-0.5 shadow"
                          : "border-gray-300 bg-white hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="font-bold">{l.name}</div>
                      <div className="text-sm opacity-80">{l.detail}</div>
                    </button>
                  );
                })}
              </div>
            </TuftStep>

            {/* Step 3: Session Selection */}
            <TuftStep
              title="🧶 Select Tufting Session (Per 2 Persons) ONLY 15+ YEARS"
              color="#9b59b6"
              isVisible={step === "session"}
              onBack={() => setStep("location")}
              onNext={() => setStep("time")}
              canNext={Boolean(booking.session)}
            >
              <div className="flex flex-wrap gap-3">
                {sessions.map((s) => {
                  const selected = booking.session?.id === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setBooking((b) => ({ ...b, session: s }))}
                      className={`min-w-[200px] cursor-pointer rounded-xl border-2 px-6 py-6 text-center transition-all ${
                        selected
                          ? "border-purple-600 bg-purple-600 text-white -translate-y-1 shadow-xl"
                          : "border-gray-300 bg-white hover:-translate-y-1"
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {s.id === "beginner" ? "🌟" : s.id === "advanced" ? "🎨" : "👑"}
                      </div>
                      <div className="font-bold">{s.label}</div>
                      <div className="text-sm opacity-80">
                        02 - 04 Hr 
                      </div>
                      <div className={`mt-2 font-bold ${selected ? "text-white" : "text-red-600"}`}>
                        ₹ {s.price}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TuftStep>

            {/* Step 4: Time Slot Selection */}
            <TuftStep
              title="⏰ Select Time Slot"
              color="#9b59b6"
              isVisible={step === "time"}
              onBack={() => setStep("session")}
              onNext={() => setStep("details")}
              canNext={Boolean(booking.time)}
            >
              <div className="flex flex-wrap gap-2">
                {(tuftingSlots && tuftingSlots.length > 0 ? tuftingSlots.map((slot) => ({ t: slot.time, label: slot.label || slot.time, cls: slot.available === 0 ? 'sold-out' : 'available' })) : [
                  { t: "09:00", label: "9:00 AM", cls: "available" },
                  { t: "11:30", label: "11:30 AM", cls: "available" },
                  { t: "14:00", label: "2:00 PM", cls: "available" },
                  { t: "16:30", label: "4:30 PM", cls: "available" },
                  { t: "19:00", label: "7:00 PM", cls: "filling-fast" },
                ]).map((slot) => {
                  const selected = booking.time === slot.t;
                  return (
                    <div
                      key={slot.t}
                      onClick={() => setBooking((b) => ({ ...b, time: slot.t }))}
                      className={`min-w-[120px] text-center rounded-lg border-2 px-4 py-3 transition-all cursor-pointer ${
                        selected
                          ? "border-purple-600 bg-purple-600 text-white -translate-y-0.5"
                          : slot.cls === "filling-fast"
                          ? "border-orange-400"
                          : "border-gray-300 bg-white hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="font-bold">{slot.label}</div>
                      <div className="text-xs opacity-80">
                        {slot.cls === "filling-fast" ? "Filling Fast" : "Available"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TuftStep>

            {/* Step 5: Your Details */}
            <TuftStep
              title="👤 Your Details"
              color="#9b59b6"
              isVisible={step === "details"}
              onBack={() => setStep("time")}
              canNext={false}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    id="customerName"
                    type="text"
                    value={booking.customerName}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number *</label>
                  <input
                    id="customerPhone"
                    type="tel"
                    value={booking.customerPhone}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
                    placeholder="+91 12345 67890"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Email Address *</label>
                  <input
                    id="customerEmail"
                    type="email"
                    value={booking.customerEmail}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Number of Participants *</label>
                  <select
                    id="quantity"
                    value={booking.quantity}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600"
                    required
                  >
                    <option value="" disabled>Select quantity</option>
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5">5 People</option>
                    <option value="6">6+ People (Group Booking)</option>
                  </select>
                </div>
              </div>

              {booking.quantity && booking.session && (
                <div
                  className="mt-6 rounded-2xl p-6 text-white"
                  style={{ background: "linear-gradient(135deg, #9b59b6, #e91e63)" }}
                >
                  <h5 className="font-bold mb-2">📋 Tufting Booking Summary</h5>
                  <div className="text-sm space-y-1">
                    <div><strong>Date:</strong> {booking.date ? new Date(booking.date).toLocaleDateString('en-GB') : ""}</div>
                    <div><strong>Location:</strong> <span className="capitalize">{booking.location}</span></div>
                    <div><strong>Session:</strong> {booking.session.label}</div>
                    <div><strong>Time:</strong> {booking.time}</div>
                    <div><strong>Participants:</strong> {booking.quantity}</div>
                  </div>
                  <div className="mt-3 text-center font-extrabold text-xl">
                    Total Amount: ₹{total.toLocaleString()}
                  </div>
                  <button
                    className={`mt-3 w-full rounded-full font-bold py-3 transition-all ${
                        canProceedToBook
                        ? 'bg-yellow-400 text-slate-800 hover:-translate-y-0.5'
                        : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    }`}
                    onClick={async () => {
                      if (!canProceedToBook) {
                        alert('Please fill in all required fields.');
                        return;
                      }
                      if (!user) {
                        navigate('/login', { state: { from: window.location.pathname } });
                        return;
                      }
                      const amount = booking.session ? booking.session.price * Number(booking.quantity) : 0;
                      try {
                        const branch = getBranchById(booking.location);
                        const order = await createRazorpayOrder(amount);
                        await initiatePayment({ amount: order.amount / 100, currency: order.currency, name: 'Craft Factory', description: 'Tufting Booking', order_id: order.id, key: branch?.razorpayKey, handler: async (response) => {
                          const bookingPayload: any = {
                              customerId: user.id,
                              customerName: user.name,
                              customerEmail: user.email || '',
                              customerPhone: booking.customerPhone || '',
                              branchId: booking.location,
                              date: booking.date,
                              time: booking.time,
                              seats: Number(booking.quantity),
                              totalAmount: amount,
                              paymentStatus: 'completed',
                              paymentIntentId: response.razorpay_payment_id,
                              activity: 'tufting',
                              packageType: booking.session?.id || 'standard'
                          };
                          
                          // Try to find session ID if available (for new API integration)
                          // This would require updating tufting slots fetching as well
                          
                          // Fallback to legacy eventId for now
                          if (!bookingPayload.sessionId) {
                            bookingPayload.eventId = `tuft-${Date.now()}`;
                          }
                          
                          await createBooking(bookingPayload);
                          alert('Tufting booked! Check your dashboard.');
                          navigate('/dashboard');
                        }, prefill: { name: user.name, email: user.email || '', contact: '' }, theme: { color: '#9b59b6' }, modal: { ondismiss: () => {} } });
                      } catch (err) {
                        console.error('Payment failed', err);
                        alert('Payment failed. Try again.');
                      }
                    }}
                    disabled={!canProceedToBook}
                  >
                    🧶 PROCEED TO BOOK TUFTING SESSION
                  </button>
                </div>
              )}
            </TuftStep>
          </div>
        </div>
      </section>
    </div>
  );
};

type TuftStepProps = {
  title: string;
  color: string;
  isVisible: boolean;
  onBack?: () => void;
  onNext?: () => void;
  canNext?: boolean;
  children: React.ReactNode;
};

const TuftStep: React.FC<TuftStepProps> = ({ title, color, isVisible, onBack, onNext, canNext, children }) => {
  if (!isVisible) return null;
  return (
    <div className="mb-6 bg-white rounded-2xl p-5 shadow">
      <div className="flex items-center justify-between gap-3 border-b pb-3 mb-4">
        <h4 className="text-lg font-bold" style={{ color }}>
          {title}
        </h4>
        <div className="flex gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-1.5 rounded-full bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-colors"
            >
              ← Back
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              disabled={!canNext}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all ${canNext
                ? "text-white hover:-translate-y-px"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              style={{ backgroundColor: canNext ? color : undefined }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default TuftingActivityPage;

```

# src\components\Manager\ManagerDashboard.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  QrCode,
  Package,
  TrendingUp,
  Calendar,
  DollarSign,
  Eye,
  Truck,
  CheckCircle,
  Camera,
  AlertCircle
} from 'lucide-react';
import type { Order, Booking, Branch, Event as CustomEvent } from '../../types';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    orders: contextOrders,
    events: contextEvents,
    bookings: contextBookings,
    branches: contextBranches,
    updateOrderStatus: contextUpdateOrderStatus,
    addTrackingUpdate: contextAddTrackingUpdate
  } = useData();

  // Local state that mirrors context, without mock fallbacks
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);

  // Sync with context data and persist locally
  useEffect(() => {
    setOrders(contextOrders);
  }, [contextOrders]);

  useEffect(() => {
    setBookings(contextBookings);
  }, [contextBookings]);

  useEffect(() => {
    if (contextBranches.length > 0) {
      setBranches(contextBranches);
    }
  }, [contextBranches]);

  useEffect(() => {
    if (contextEvents.length > 0) {
      setCustomEvents(contextEvents);
    }
  }, [contextEvents]);

  // Debug: Track data changes and persist state
  useEffect(() => {
    console.log('🔄 ManagerDashboard - Data updated:', {
      ordersCount: orders.length,
      bookingsCount: bookings.length,
      branchesCount: branches.length,
      eventsCount: customEvents.length,
      timestamp: new Date().toISOString()
    });
  }, [orders.length, bookings.length, branches.length, customEvents.length]);

  // Check token expiry
  const [tokenWarning, setTokenWarning] = useState(false);
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        const timeUntilExpiry = payload.exp - now;

        // Show warning if token expires in less than 1 hour
        if (timeUntilExpiry < 3600 && timeUntilExpiry > 0) {
          setTokenWarning(true);
        } else if (timeUntilExpiry <= 0) {
          // Token expired, force logout
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          window.location.reload();
        }
      } catch (error) {
        console.error('Error checking token expiry:', error);
      }
    };

    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingUpdate, setTrackingUpdate] = useState({
    status: '',
    location: '',
    description: ''
  });
  const [qrCode, setQrCode] = useState('');
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [qrResult, setQrResult] = useState<any>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  // Set initial loading to false and provide immediate data
  const [isDataLoading, setIsDataLoading] = useState(false);  // Track when data is initially loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 3000); // Give data 3 seconds to load

    return () => clearTimeout(timer);
  }, []);

  // Reset loading state when data arrives
  useEffect(() => {
    if (orders.length > 0 || bookings.length > 0) {
      setIsDataLoading(false);
    }
  }, [orders.length, bookings.length]);

  // Get API base URL
  const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';

  // Determine manager branchId even if branches haven't loaded yet
  const effectiveBranchId = user?.branchId || branches.find(b => b.managerId === user?.id)?.id || undefined;

  // Filter data for manager's branch using effectiveBranchId
  const branchOrders = effectiveBranchId ? orders.filter(order => order.branchId === effectiveBranchId) : orders;
  const branchBookings = effectiveBranchId ? bookings.filter(booking => booking.branchId === effectiveBranchId) : bookings;
  const branchEvents = effectiveBranchId ? customEvents.filter((event: CustomEvent) => event.branchId === effectiveBranchId) : customEvents;

  // Calculate analytics
  const totalRevenue = branchOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalBookings = branchBookings.length;
  const pendingOrders = branchOrders.filter(order => order.orderStatus === 'pending').length;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await contextUpdateOrderStatus(orderId, status);
    showToast('Order status updated', 'success');
  };

  const addTrackingUpdate = async (orderId: string, update: any) => {
    await contextAddTrackingUpdate(orderId, update);
    showToast('Tracking update added', 'success');
  };

  const verifyQRCode = async (qrCodeValue: string) => {
    try {
      console.log('🔍 Verifying QR code:', qrCodeValue);

      // First try to parse if it's a JSON string
      let codeToVerify = qrCodeValue;
      try {
        const parsed = JSON.parse(qrCodeValue);
        if (parsed.type === 'booking' && parsed.qrCode) {
          codeToVerify = parsed.qrCode;
          console.log('📋 Extracted QR code from JSON:', codeToVerify);
        }
      } catch {
        // Not JSON, use as is
      }

      // Check if this is our test QR code or matches any booking
      const matchingBooking = bookings.find(booking => booking.qrCode === codeToVerify);

      if (matchingBooking) {
        // Local verification successful
        const result = {
          success: true,
          booking: {
            customerName: matchingBooking.customerName,
            activity: matchingBooking.activity,
            date: matchingBooking.date,
            time: matchingBooking.time,
            seats: matchingBooking.seats,
            status: matchingBooking.status,
            verifiedAt: new Date().toISOString()
          }
        };

        setQrResult(result);
        showToast('QR Code verified successfully!', 'success');
        console.log('✅ QR verification successful:', result);

        // Update booking status locally and persist
        setBookings(prevBookings => {
          const updatedBookings = prevBookings.map(booking =>
            booking.qrCode === codeToVerify
              ? { ...booking, isVerified: true, verifiedAt: new Date().toISOString(), verifiedBy: user?.name || 'Manager' }
              : booking
          );

          // Save to localStorage for persistence
          try {
            localStorage.setItem('manager_bookings', JSON.stringify(updatedBookings));
            console.log('📅 Updated booking verification and cached locally');
          } catch (error) {
            console.warn('Failed to cache updated bookings:', error);
          }

          return updatedBookings;
        });

        return;
      }

      // Try backend verification as fallback (bookings route supports verify-qr)
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBase}/bookings/verify-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ qrCode: codeToVerify })
      });

      if (response.ok) {
        const result = await response.json();
        setQrResult(result);
        showToast('QR Code verified successfully via backend!', 'success');
        console.log('✅ Backend QR verification successful:', result);

        // Persist verification into local bookings state using returned booking id or qr
        setBookings(prevBookings => {
          const bookingIdFromResult = result?.booking?.id;
          const updated = prevBookings.map(b =>
            (bookingIdFromResult ? b.id === bookingIdFromResult : b.qrCode === codeToVerify)
              ? { ...b, isVerified: true, verifiedAt: result?.booking?.verifiedAt || new Date().toISOString(), verifiedBy: user?.name || 'Manager' }
              : b
          );
          try { localStorage.setItem('bookings', JSON.stringify(updated)); } catch { /* ignore */ }
          try { window.dispatchEvent(new Event('app_data_updated')); } catch { /* ignore */ }
          return updated;
        });
      } else {
        const error = await response.json();
        console.error('❌ QR verification failed:', error);
        showToast(error.message || 'Invalid QR Code.', 'error');
        setQrResult(null);
      }
    } catch (error) {
      console.error('Error verifying QR code:', error);
      showToast('Error verifying QR code. Try the test QR: QR-1756191881137-1', 'error');
      setQrResult(null);
    }
  };

  const handleQRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qrCode.trim()) {
      verifyQRCode(qrCode.trim());
      setQrCode('');
    }
  };

  // Enhanced QR scanner with multiple fallback options
  useEffect(() => {
    let stream: MediaStream | null = null;
    let rafId: number | null = null;
    let detector: any = null;

    const start = async () => {
      if (!qrScannerOpen || scannerActive) return;

      try {
        console.log('🎥 Starting QR scanner...');

        // Method 1: Try BarcodeDetector API (Chrome/Edge)
        if ('BarcodeDetector' in window) {
          console.log('✅ BarcodeDetector available');
          detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        } else {
          console.warn('⚠️ BarcodeDetector not supported');
          showToast('Camera scanning not supported. Please use manual QR entry or try Chrome/Edge browser.', 'error');
          // Don't return here, still try to start camera for manual scanning
        }

        // Request camera access
        const constraints = {
          video: {
            facingMode: { ideal: 'environment' },
            width: { min: 320, ideal: 640, max: 1280 },
            height: { min: 240, ideal: 480, max: 720 }
          }
        };

        console.log('📱 Requesting camera access...');
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('✅ Camera stream obtained');

        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;

          // Wait for video to be ready
          await new Promise<void>((resolve, reject) => {
            if (!videoRef.current) {
              reject(new Error('Video element not available'));
              return;
            }

            const video = videoRef.current;

            const onLoadedMetadata = () => {
              video.play()
                .then(() => {
                  console.log('✅ Video playing');
                  setScannerActive(true);
                  resolve();
                })
                .catch(reject);
            };

            const onError = (error: any) => {
              console.error('Video error:', error);
              reject(error);
            };

            video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
            video.addEventListener('error', onError, { once: true });

            // Cleanup listeners
            setTimeout(() => {
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              video.removeEventListener('error', onError);
            }, 10000);
          });

          // Only start scanning if BarcodeDetector is available
          if (detector) {
            const scan = async () => {
              try {
                if (!videoRef.current || !detector || !scannerActive) return;

                const detections = await detector.detect(videoRef.current);

                if (detections && detections.length > 0) {
                  const code = detections[0].rawValue;
                  if (code && code.trim()) {
                    console.log('📱 QR Code detected:', code);

                    // Process the QR code
                    let qrCodeToVerify = code.trim();

                    // Try to parse as JSON first
                    try {
                      const parsed = JSON.parse(code);
                      if (parsed.type === 'booking' && parsed.qrCode) {
                        qrCodeToVerify = parsed.qrCode;
                      }
                    } catch {
                      // If not JSON, use the code directly
                    }

                    // Verify the QR code
                    await verifyQRCode(qrCodeToVerify);
                    setQrScannerOpen(false); // Close scanner after successful scan
                    return;
                  }
                }
              } catch (error) {
                console.error('QR scanning error:', error);
              }

              if (scannerActive) {
                rafId = requestAnimationFrame(scan);
              }
            };

            // Start scanning loop
            rafId = requestAnimationFrame(scan);
          } else {
            // Show message that manual entry is required
            showToast('Camera started but automatic scanning not supported. Please use manual QR entry.', 'error');
          }
        }
      } catch (error) {
        console.error('❌ Camera initialization failed:', error);
        let errorMessage = 'Failed to access camera. ';

        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            errorMessage += 'Please allow camera access in your browser settings and try again.';
          } else if (error.name === 'NotFoundError') {
            errorMessage += 'No camera found on this device.';
          } else if (error.name === 'NotReadableError') {
            errorMessage += 'Camera is already in use by another application.';
          } else if (error.name === 'OverconstrainedError') {
            errorMessage += 'Camera constraints not supported.';
          } else {
            errorMessage += error.message;
          }
        }

        showToast(errorMessage, 'error');
        setQrScannerOpen(false);
      }
    };

    const stop = () => {
      console.log('🛑 Stopping camera scanner...');

      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('🎥 Camera track stopped:', track.kind);
        });
        stream = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setScannerActive(false);
    };

    if (qrScannerOpen) {
      start();
    } else {
      stop();
    }

    return () => stop();
  }, [qrScannerOpen]);

  const handleStatusUpdate = (orderId: string, status: string) => {
    updateOrderStatus(orderId, status);
  };

  const handleAddTracking = (orderId: string) => {
    if (trackingUpdate.status && trackingUpdate.location) {
      addTrackingUpdate(orderId, {
        ...trackingUpdate,
        timestamp: new Date().toISOString()
      });
      setTrackingUpdate({ status: '', location: '', description: '' });
      setSelectedOrder(null);
    }
  };

  const orderStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'payment_confirmed', label: 'Payment Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'packed', label: 'Packed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-indigo-100 text-indigo-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'packed': return 'bg-cyan-100 text-cyan-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'payment_confirmed': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Branch Info */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">
          {branches.find(b => b.id === effectiveBranchId)?.name || 'Branch Manager Dashboard'}
        </h2>
        <p className="opacity-90">{branches.find(b => b.id === effectiveBranchId)?.location}</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
            <Package className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Events</p>
              <p className="text-2xl font-bold text-gray-900">{branchEvents.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {branchOrders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-medium text-gray-900">{order.customerName || `Customer #${order.customerId.slice(0, 6)}`}</div>
                    <div className="text-xs text-gray-600">{order.customerEmail || '—'}</div>
                    <div className="text-xs text-gray-600">{order.customerPhone || '—'}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}` : '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                      {orderStatusOptions.find(opt => opt.value === order.orderStatus)?.label || order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details (branch scoped) */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Details</h3>
        <div className="space-y-3">
          {[
            ...branchOrders.map(o => ({ id: o.customerId, name: o.customerName, email: o.customerEmail, phone: o.customerPhone })),
            ...branchBookings.map(b => ({ id: b.customerId, name: b.customerName, email: b.customerEmail, phone: b.customerPhone }))
          ]
            .filter((v, i, arr) => v.id && arr.findIndex(x => x.id === v.id) === i)
            .slice(0, 8)
            .map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{c.name || `Customer #${c.id?.slice(0, 6)}`}</p>
                  <p className="text-xs text-gray-600">{c.email || '—'}</p>
                </div>
                <div className="text-sm text-gray-600">{c.phone || '—'}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderOrderManagement = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Order Management</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {branchOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="font-medium text-gray-900">{order.customerName || `Customer #${order.customerId.slice(0, 6)}`}</div>
                  <div className="text-xs text-gray-600">{order.customerEmail || '—'}</div>
                  <div className="text-xs text-gray-600">{order.customerPhone || '—'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.products.length} items
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className={`text-sm border-none rounded-md focus:ring-indigo-500 focus:border-indigo-500 px-2 py-1 ${getStatusColor(order.orderStatus)}`}
                  >
                    {orderStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    title="Add tracking update"
                  >
                    <Truck className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-gray-600 hover:text-gray-900"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderQRVerification = () => (
    <div className="space-y-6">
      {/* QR Scanner Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">QR Code Scanner</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Manual QR Input */}
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-3">Manual QR Code Entry</h4>
            <form onSubmit={handleQRSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter QR Code
                </label>
                <input
                  type="text"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  placeholder="Scan or type QR code here (e.g., QR-1756191881137-1)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="mt-2 text-xs text-gray-500">
                  <p><strong>Test QR Code:</strong> QR-1756191881137-1</p>
                  <p>Or paste the full JSON booking data</p>
                </div>
              </div>
              <button
                type="submit"
                disabled={!qrCode.trim()}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Verify QR Code
              </button>
              <button
                type="button"
                onClick={() => setQrCode('QR-1756191881137-1')}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm"
              >
                Use Test QR Code
              </button>
            </form>
          </div>

          {/* Camera Scanner */}
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-3">Camera Scanner</h4>
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">Use your device camera to scan QR codes</p>
              {!qrScannerOpen ? (
                <div>
                  <button
                    onClick={() => setQrScannerOpen(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Open Camera Scanner
                  </button>
                  <div className="text-xs text-gray-500 mt-3 space-y-1">
                    <p>• Ensure camera permissions are enabled</p>
                    <p>• Works best in Chrome/Edge browsers</p>
                    <p>• Use manual entry if camera scanning fails</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="relative inline-block">
                    <video
                      ref={videoRef}
                      className="mx-auto w-full max-w-xs rounded border bg-black"
                      muted
                      playsInline
                      style={{ aspectRatio: '4/3' }}
                    />
                    {!scannerActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
                          <p className="text-sm">Starting camera...</p>
                        </div>
                      </div>
                    )}
                    {scannerActive && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-32 h-32 border-2 border-green-400 rounded-lg animate-pulse"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setQrScannerOpen(false)}
                    className="mt-3 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Close Scanner
                  </button>
                  <div className="text-xs text-gray-500 mt-2 space-y-1">
                    <p>Position QR code within the highlighted area</p>
                    <p>If automatic scanning fails, use manual entry above</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QR Verification Result */}
        {qrResult && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-green-800 font-medium">Booking Verified Successfully!</h4>
                <div className="mt-2 text-sm text-green-700">
                  <p><strong>Customer:</strong> {qrResult.booking.customerName}</p>
                  <p><strong>Activity:</strong> {qrResult.booking.activity}</p>
                  <p><strong>Date:</strong> {qrResult.booking.date}</p>
                  <p><strong>Time:</strong> {qrResult.booking.time}</p>
                  <p><strong>Seats:</strong> {qrResult.booking.seats}</p>
                  <p><strong>Verified at:</strong> {new Date(qrResult.booking.verifiedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Verifications */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Recent Verifications</h4>
        <div className="space-y-3">
          {branchBookings
            .filter(booking => booking.isVerified)
            .slice(0, 10)
            .map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{booking.customerName || `Customer #${booking.customerId.slice(0, 6)}`}</p>
                  <p className="text-sm text-gray-600">
                    {booking.activity} • {booking.date} • {booking.time}
                  </p>
                  <p className="text-xs text-gray-500">
                    QR: {booking.qrCode}
                  </p>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <div className="text-right">
                    <span className="text-sm font-medium">Verified</span>
                    <p className="text-xs text-gray-500">
                      {booking.verifiedAt ? new Date(booking.verifiedAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          {branchBookings.filter(booking => booking.isVerified).length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <QrCode className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No verified bookings yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        {/* Token Expiry Warning */}
        {tokenWarning && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-yellow-800 font-medium">Session Expiring Soon</p>
                <p className="text-yellow-700 text-sm">Your session will expire soon. Please save your work and refresh the page to continue.</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="ml-auto bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
              >
                Refresh Now
              </button>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isDataLoading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-800">Loading dashboard data...</p>
            </div>
          </div>
        )}

        {/* Data Summary for Debug */}
        {!isDataLoading && (
          <div className="mb-6 bg-gray-100 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <p>📊 Data Status: {orders.length} orders, {bookings.length} bookings, {branches.length} branches available</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                🔄 Force Refresh
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'orders', label: 'Orders', icon: Package },
              { id: 'qr', label: 'QR Verification', icon: QrCode }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'orders' && renderOrderManagement()}
          {activeTab === 'qr' && renderQRVerification()}
        </div>

        {/* Tracking Update Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Add Tracking Update - Order #{selectedOrder.id.slice(0, 8)}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={trackingUpdate.status}
                    onChange={(e) => setTrackingUpdate({ ...trackingUpdate, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Status</option>
                    {orderStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={trackingUpdate.location}
                    onChange={(e) => setTrackingUpdate({ ...trackingUpdate, location: e.target.value })}
                    placeholder="e.g., Warehouse, Transit Hub, Local Facility"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={trackingUpdate.description}
                    onChange={(e) => setTrackingUpdate({ ...trackingUpdate, description: e.target.value })}
                    placeholder="Additional details about this update"
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddTracking(selectedOrder.id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Add Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg z-50 ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
          <div className="flex items-center">
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {toast.message}
          </div>
        </div>
      )}

      {/* Camera Scanner Modal (Placeholder) */}
      {/* Removed legacy placeholder modal to avoid conflicts with live scanner UI */}
    </div>
  );
};

export default ManagerDashboard;
```

# src\components\ProtectedRoute.tsx

```tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'branch_manager' | 'customer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    // send the attempted path so the login page can return the user here after auth
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

# src\contexts\AuthContext.tsx

```tsx
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

// Small helper to call backend API (if VITE_API_URL is configured)
const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';

async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as any) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const url = `${apiBase}${path}`;
  console.log('🌐 Making API request to:', url);
  console.log('📝 Request options:', { ...opts, headers });

  const res = await fetch(url, { ...opts, headers });
  console.log('📡 Response status:', res.status, res.statusText);

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    console.log('❌ API Error response:', txt);

    // Handle token expiry
    if (res.status === 401 || res.status === 403) {
      console.log('🔒 Token expired or invalid, logging out');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.reload(); // Force reload to reset app state
    }

    throw new Error(txt || res.statusText || 'API error');
  }
  const data = await res.json().catch(() => null);
  console.log('✅ API Success response:', data);
  return data;
}

// Helper function to check if token is expired
function isTokenExpired(token: string): boolean {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp < now;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  resetPassword: (token: string, email: string, newPassword: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateProfile?: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordResetTokens, setPasswordResetTokens] = useState<{ [key: string]: { email: string, expires: number } }>({});

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        console.log('🔒 Token expired, clearing auth data');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } else {
        // Normalize branchId to string if backend populated it as an object
        try {
          const parsed = JSON.parse(storedUser);
          const normalized = {
            ...parsed,
            branchId: typeof parsed?.branchId === 'object' ? (parsed?.branchId?._id || parsed?.branchId?.id || '') : parsed?.branchId
          } as User;
          // Persist normalization in storage to avoid future mismatches
          localStorage.setItem('user', JSON.stringify(normalized));
          setUser(normalized);
        } catch {
          setUser(JSON.parse(storedUser));
        }
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔵 Login attempt for:', email);
    setLoading(true);
    try {
      // Try real backend login first
      console.log('🌐 Attempting backend login...');
      const resp = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      console.log('✅ Backend login response:', resp);
      const { token, user: u } = resp as any;
      if (token && u) {
        // Normalize branchId to a plain string to ensure manager-scoped API calls work
        const normalizedUser: User = {
          ...(u as User),
          branchId: typeof (u as any)?.branchId === 'object' ? ((u as any)?.branchId?._id || (u as any)?.branchId?.id || '') : (u as any)?.branchId
        };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        console.log('✅ Login successful, user set:', u);
        return;
      }

      // If we get here, backend login failed
      console.log('❌ Backend login failed - no token or user');
      throw new Error('Backend login failed');
    } catch (err) {
      console.log('❌ Login error:', err);
      // Only fall back to mock users if backend is completely unavailable (connection error)
      const isConnectionError = err instanceof Error && (
        err.message.includes('fetch') ||
        err.message.includes('NetworkError') ||
        err.message.includes('Failed to fetch')
      );

      if (isConnectionError) {
        console.warn('Backend unavailable, falling back to mock users');

        // Fallback mock login for offline/demo mode
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'admin@craftfactory.com',
            name: 'Admin User',
            role: 'admin',
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: '10',
            email: 'hyderabad@craftfactory.com',
            name: 'Hyderabad Branch Manager',
            role: 'branch_manager',
            branchId: 'hyderabad',
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: '11',
            email: 'vijayawada@craftfactory.com',
            name: 'Vijayawada Branch Manager',
            role: 'branch_manager',
            branchId: 'vijayawada',
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: '12',
            email: 'bangalore@craftfactory.com',
            name: 'Bangalore Branch Manager',
            role: 'branch_manager',
            branchId: 'bangalore',
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: '4',
            email: 'customer@example.com',
            name: 'John Doe',
            phone: '+91 98765 43210',
            address: {
              street: '12 MG Road',
              city: 'Hyderabad',
              state: 'Telangana',
              zipCode: '500081',
              country: 'India'
            },
            role: 'customer',
            createdAt: '2024-01-01T00:00:00Z'
          }
        ];

        const foundUser = mockUsers.find(u => u.email === email);
        if (foundUser && password === 'password') {
          setUser(foundUser);
          localStorage.setItem('user', JSON.stringify(foundUser));
          localStorage.setItem('token', 'mock_token');
          console.log('✅ Mock login successful:', foundUser);
        } else {
          throw new Error('Invalid credentials');
        }
      } else {
        // Re-throw the original error for proper handling
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    // Try backend update but keep local copy in sync for offline/demo
    (async () => {
      try {
        await apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(updates) });
      } catch (err) {
        // ignore backend errors and continue with local update
      }
    })();

    setUser(prev => {
      const next = prev ? { ...prev, ...updates } : null;
      if (next) localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  const resetPassword = async (token: string, email: string) => {
    setLoading(true);
    try {
      // Validate reset token
      const tokenData = passwordResetTokens[token];
      if (!tokenData || tokenData.email !== email || Date.now() > tokenData.expires) {
        throw new Error('Invalid or expired reset token');
      }

      // In a real app, this would update the password in the database
      // For demo purposes, we'll just simulate success
      console.log('Password reset successful for:', email);

      // Remove used token
      setPasswordResetTokens(prev => {
        const newTokens = { ...prev };
        delete newTokens[token];
        return newTokens;
      });

      // Show success notification
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: Arial, sans-serif;
      `;
      notification.innerHTML = '✅ Password reset successful!';
      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);

    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, resetPassword, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
```

# src\contexts\DataContext.tsx

```tsx
// Allow exporting hooks and helpers from this file (fast-refresh rule can be noisy in dev)
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import type { Branch, Event, Product, Order, Booking, CMSContent, User, TrackingUpdate } from '../types';

type Slot = {
  time: string;
  label: string;
  available: number;
  total: number;
  type: string;
  age: string;
  // price is determined by the customer's chosen plan; admin does not set it
  price?: number;
};

type ActivitySlots = Record<string, { slime: Slot[]; tufting: Slot[] }>;

interface DataContextType {
  branches: Branch[];
  events: Event[];
  products: Product[];
  orders: Order[];
  bookings: Booking[];
  cmsContent: CMSContent[];
  managers: User[];
  selectedBranch: string | null;
  setSelectedBranch: (branchId: string | null) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>;
  verifyQRCode: (qrCode: string) => Promise<boolean>;
  updateCMSContent: (content: CMSContent) => Promise<void>;
  deleteCMSContent: (id: string) => Promise<void>;
  addCMSContent: (content: Omit<CMSContent, 'id' | 'updatedAt'>) => Promise<void>;
  addManager: (manager: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateManager: (manager: User) => Promise<void>;
  deleteManager: (id: string) => Promise<void>;
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  addBranch: (branch: Omit<Branch, 'id' | 'createdAt'>) => Promise<void>;
  updateBranch: (branch: Branch) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
  addTrackingUpdate: (orderId: string, update: Omit<TrackingUpdate, 'id'>) => Promise<void>;
  // session slots persistence (in-memory + localStorage)
  updateSlotsForDate: (branchId: string, date: string, slots: { slime: Slot[]; tufting: Slot[] }) => Promise<void>;
  getSlotsForDate: (branchId: string, date: string) => { slime: Slot[]; tufting: Slot[] } | null;
  // per-branch availability settings
  getBranchAvailability: (branchId: string) => { allowMonday: boolean } | null;
  updateBranchAvailability: (branchId: string, settings: { allowMonday: boolean }) => Promise<void>;
  // get full branch metadata (including optional razorpayKey)
  getBranchById: (id?: string) => Branch | null;
  // version/timestamp to notify consumers when slots change
  slotsVersion: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // branches are defined below as branchesState
  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Daily Slime Making Class',
      description: 'Learn to make colorful, stretchy slime with safe ingredients',
      branchId: 'hyderabad',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      duration: 60,
      maxSeats: 15,
      bookedSeats: 3,
      price: 850,
      materials: ['Glue', 'Activator', 'Colors'],
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Tufting Workshop - Intro',
      description: 'Introductory tufting for all ages',
      branchId: 'vijayawada',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      duration: 90,
      maxSeats: 8,
      bookedSeats: 1,
      price: 2000,
      materials: ['Rug Canvas', 'Yarn', 'Tufting Gun'],
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Family Slime Session',
      description: 'Fun family-friendly slime play',
      branchId: 'bangalore',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      duration: 60,
      maxSeats: 20,
      bookedSeats: 5,
      price: 750,
      materials: ['Glue', 'Activator', 'Glitter'],
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ]);

  const [products, setProducts] = useState<Product[]>([]);

  const [orders, setOrders] = useState<Order[]>([
    // Mock data for immediate testing
    {
      id: 'order1',
      products: [{ productId: 'prod1', name: 'Slime Kit', quantity: 2, price: 500 }],
      totalAmount: 1000,
      branchId: 'hyderabad',
      customerId: 'cust1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+91 98765 43210',
      shippingAddress: {
        street: '123 Main St',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500001',
        country: 'India'
      },
      paymentStatus: 'completed',
      orderStatus: 'processing',
      trackingNumber: 'TRK123',
      trackingUpdates: [],
      createdAt: new Date().toISOString()
    }
  ]);
  const [bookings, setBookings] = useState<Booking[]>([
    // Mock data for immediate testing
    {
      id: 'booking1',
      eventId: 'event1',
      sessionId: 'session1',
      activity: 'slime',
      branchId: 'hyderabad',
      customerId: 'cust1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+91 98765 43210',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      seats: 2,
      totalAmount: 600,
      paymentStatus: 'completed',
      qrCode: 'QR-1756191881137-1',
      isVerified: false,
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const [managers, setManagers] = useState<User[]>([
    {
      id: '10',
      email: 'hyderabad@craftfactory.com',
      name: 'Hyderabad Branch Manager',
      role: 'branch_manager',
      branchId: 'hyderabad',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '11',
      email: 'vijayawada@craftfactory.com',
      name: 'Vijayawada Branch Manager',
      role: 'branch_manager',
      branchId: 'vijayawada',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '12',
      email: 'bangalore@craftfactory.com',
      name: 'Bangalore Branch Manager',
      role: 'branch_manager',
      branchId: 'bangalore',
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [cmsContent, setCmsContent] = useState<CMSContent[]>([
    {
      id: '0',
      type: 'carousel',
      title: 'Welcome to Craft Factory',
      content: 'Discover the joy of crafting with our expert-led workshops and premium supplies',
      images: [
        'https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1754651195/DSC07659_zj2pcc.jpg',
        'https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1755025999/IMG-20250807-WA0003_u999yh.jpg'

      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '0.5',
      type: 'carousel',
      title: 'Premium Art Supplies',
      content: 'Shop our curated collection of high-quality art and craft materials',
      images: [

        'https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1755025999/IMG-20250807-WA0003_u999yh.jpg'
      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '0.6',
      type: 'carousel',
      title: 'Creative Workshops for All Ages',
      content: 'Join our fun-filled workshops designed for children and adults alike',
      images: [
        'https://res.cloudinary.com/df2mieky2/image/upload/q_70/v1755026061/HAR05826_hv05wz.jpg',
        'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg'
      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '1',
      type: 'hero',
      title: 'Welcome to Craft Factory',
      content: 'Discover the joy of crafting with our expert-led workshops and premium supplies',
      images: ['https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg'],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      type: 'about',
      title: 'About Craft Factory',
      content: 'We are passionate about bringing creativity to life through hands-on crafting experiences. Our expert instructors and premium materials create the perfect environment for learning and creating.',
      images: [
        'https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg',
        'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg'
      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      type: 'services',
      title: 'Our Services',
      content: 'From daily slime-making classes to advanced crafting workshops, we offer a wide range of activities designed to spark imagination and develop artistic skills.',
      images: [],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      type: 'testimonials',
      title: 'What Our Customers Say',
      content: 'Real experiences from our craft community',
      images: [
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
        'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg'
      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      type: 'contact',
      title: 'Contact Us',
      content: 'Get in touch with us for any questions or bookings',
      images: [],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '6',
      type: 'gallery',
      title: 'Our Gallery',
      content: 'Explore our creative workshops and happy moments',
      images: [
        'https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg',
        'https://images.pexels.com/photos/6941924/pexels-photo-6941924.jpeg',
        'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg',
        'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
        'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg',
        'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg'
      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '7',
      type: 'studios',
      title: 'Our Studios',
      content: 'Visit our state-of-the-art creative spaces',
      images: [
        'https://images.pexels.com/photos/1545558/pexels-photo-1545558.jpeg',
        'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg'
      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '8',
      type: 'events',
      title: 'Special Events',
      content: 'Join our exclusive workshops and special events',
      images: [
        'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg',
        'https://images.pexels.com/photos/6941924/pexels-photo-6941924.jpeg'
      ],
      isActive: true,
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    // Try backend first
    const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${apiBase}/bookings`, { method: 'POST', headers, body: JSON.stringify(bookingData) });
      if (res.ok) {
        const saved = await res.json();
        setBookings(prev => {
          const next = [...prev, saved as Booking];
          try { localStorage.setItem('bookings', JSON.stringify(next)); } catch { }
          try { window.dispatchEvent(new Event('app_data_updated')); } catch { }
          return next;
        });
        return;
      }
    } catch (err) {
      // fallback to local
    }

    // Local fallback behavior (offline/demo)
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      qrCode: `QR-${Date.now()}`,
      isVerified: false
    };
    setBookings(prev => {
      const next = [...prev, newBooking];
      try { localStorage.setItem('bookings', JSON.stringify(next)); } catch { /* ignore localStorage errors */ }
      try { window.dispatchEvent(new Event('app_data_updated')); } catch { /* ignore dispatch errors */ }
      return next;
    });
    // Update event booked seats (local)
    setEvents(prev => prev.map(event =>
      event.id === bookingData.eventId
        ? { ...event, bookedSeats: event.bookedSeats + (bookingData.seats || 1) }
        : event
    ));
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${apiBase}/orders`, { method: 'POST', headers, body: JSON.stringify(orderData) });
      if (res.ok) {
        const saved = await res.json();
        setOrders(prev => {
          const next = [...prev, saved as Order];
          try { localStorage.setItem('orders', JSON.stringify(next)); } catch { }
          try { window.dispatchEvent(new Event('app_data_updated')); } catch { }
          return next;
        });
        return;
      }
    } catch (err) {
      // fallback to local
    }

    // Local fallback
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      trackingNumber: `TRK-${Date.now()}`
    };
    setOrders(prev => {
      const next = [...prev, newOrder];
      try { localStorage.setItem('orders', JSON.stringify(next)); } catch { /* ignore localStorage errors */ }
      try { window.dispatchEvent(new Event('app_data_updated')); } catch { /* ignore dispatch errors */ }
      return next;
    });

    // Update product stock
    (orderData.products || []).forEach((product: any) => {
      setProducts(prev => prev.map(p =>
        p.id === product.productId
          ? { ...p, stock: Math.max(0, p.stock - product.quantity) }
          : p
      ));
    });
  };

  const verifyQRCode = async (qrCode: string): Promise<boolean> => {
    const booking = bookings.find(b => b.qrCode === qrCode);
    if (booking && !booking.isVerified) {
      setBookings(prev => {
        const next = prev.map(b => b.qrCode === qrCode ? { ...b, isVerified: true } : b);
        try { localStorage.setItem('bookings', JSON.stringify(next)); } catch { /* ignore localStorage errors */ }
        try { window.dispatchEvent(new Event('app_data_updated')); } catch { /* ignore dispatch errors */ }
        return next;
      });
      return true;
    }
    return false;
  };

  const updateCMSContent = async (content: CMSContent) => {
    setCmsContent(prev => prev.map(c =>
      c.id === content.id ? { ...content, updatedAt: new Date().toISOString() } : c
    ));
  };

  const addCMSContent = async (contentData: Omit<CMSContent, 'id' | 'updatedAt'>) => {
    const newContent: CMSContent = {
      ...contentData,
      id: Date.now().toString(),
      updatedAt: new Date().toISOString()
    };
    setCmsContent(prev => [...prev, newContent]);
  };
  const deleteCMSContent = async (id: string) => {
    setCmsContent(prev => prev.filter(c => c.id !== id));
  };

  const addManager = async (managerData: Omit<User, 'id' | 'createdAt'>) => {
    const newManager: User = {
      ...managerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setManagers(prev => [...prev, newManager]);
  };

  const updateManager = async (manager: User) => {
    setManagers(prev => prev.map(m => m.id === manager.id ? manager : m));
  };

  const deleteManager = async (id: string) => {
    setManagers(prev => prev.filter(m => m.id !== id));
  };

  const addEvent = async (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = async (event: Event) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
  };

  const deleteEvent = async (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = async (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    // Try backend first
    const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await fetch(`${apiBase}/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        });
        if (res.ok) {
          const saved = await res.json();
          setOrders(prev => {
            const next = prev.map(o => (o.id === orderId ? {
              ...o,
              orderStatus: saved.orderStatus ?? (status as unknown as Order['orderStatus']),
              trackingUpdates: saved.trackingUpdates ?? o.trackingUpdates
            } : o));
            try { localStorage.setItem('orders', JSON.stringify(next)); } catch { /* ignore localStorage errors */ }
            try { window.dispatchEvent(new Event('app_data_updated')); } catch { /* ignore dispatch errors */ }
            return next;
          });
          return;
        }
      }
    } catch {
      // fall through to local update
    }

    // Local optimistic update
    setOrders(prev => {
      const next = prev.map(order => order.id === orderId ? { ...order, orderStatus: status as unknown as Order['orderStatus'] } : order);
      try { localStorage.setItem('orders', JSON.stringify(next)); } catch { /* ignore localStorage errors */ }
      try { window.dispatchEvent(new Event('app_data_updated')); } catch { /* ignore dispatch errors */ }
      return next;
    });
  };

  const [branchesState, setBranches] = useState<Branch[]>([
    // Mock branches for immediate testing
    {
      id: 'hyderabad',
      name: 'Craft Factory Hyderabad',
      location: 'Hyderabad',
      address: '123 Tech City, Hyderabad',
      phone: '+91 40 1234 5678',
      email: 'hyderabad@craftfactory.com',
      supportsSlime: true,
      supportsTufting: true,
      managerId: '10',
      isActive: true,
      stripeAccountId: 'acct_hyderabad',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'vijayawada',
      name: 'Craft Factory Vijayawada',
      location: 'Vijayawada',
      address: '456 Business Center, Vijayawada',
      phone: '+91 866 1234 5678',
      email: 'vijayawada@craftfactory.com',
      supportsSlime: true,
      supportsTufting: false,
      managerId: '11',
      isActive: true,
      stripeAccountId: 'acct_vijayawada',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'bangalore',
      name: 'Craft Factory Bangalore',
      location: 'Bangalore',
      address: '789 Innovation Hub, Bangalore',
      phone: '+91 80 1234 5678',
      email: 'bangalore@craftfactory.com',
      supportsSlime: true,
      supportsTufting: true,
      managerId: '12',
      isActive: true,
      stripeAccountId: 'acct_bangalore',
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const getBranchById = (id: string | undefined) => branchesState.find(b => b.id === id) || null;

  // Fetch backend data on mount
  useEffect(() => {
    const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';
    const token = localStorage.getItem('token');
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    console.log('🚀 Initializing data fetch from backend...');

    // Branches
    (async () => {
      try {
        console.log('🏢 Fetching branches...');
        const res = await fetch(`${apiBase}/branches`);
        if (res.ok) {
          const data = await res.json();
          console.log('✅ Branches fetched:', data?.length || 0);
          const mapped: Branch[] = data.map((b: any) => ({
            id: b._id,
            name: b.name,
            location: b.location,
            address: b.address || '',
            phone: b.phone || '',
            email: b.email || '',
            razorpayKey: b.razorpayKey,
            supportsSlime: true,
            supportsTufting: (b.location || '').toLowerCase() !== 'vijayawada',
            managerId: b.managerId || '',
            isActive: true,
            createdAt: b.createdAt || new Date().toISOString()
          }));
          setBranches(mapped);
        } else {
          console.error('❌ Failed to fetch branches:', res.status, res.statusText);
        }
      } catch (error) {
        console.error('❌ Error fetching branches:', error);
      }
    })();

    // Products
    (async () => {
      try {
        console.log('📦 Fetching products...');
        const res = await fetch(`${apiBase}/products?isActive=true`);
        if (res.ok) {
          const data = await res.json();
          console.log('✅ Products fetched:', data?.length || 0);
          const mapped: Product[] = data.map((p: any) => ({
            id: p._id,
            name: p.name,
            description: p.description || '',
            price: p.price,
            images: p.imageUrl ? [p.imageUrl] : [],
            category: p.category || '',
            stock: typeof p.stock === 'number' ? p.stock : (typeof p.quantity === 'number' ? p.quantity : 0),
            materials: Array.isArray(p.tags) ? p.tags : [],
            isActive: p.isActive !== false,
            createdAt: p.createdAt || new Date().toISOString()
          }));
          setProducts(mapped);
        } else {
          console.error('❌ Failed to fetch products:', res.status, res.statusText);
        }
      } catch (error) {
        console.error('❌ Error fetching products:', error);
      }
    })();

  // Orders (auth)
    (async () => {
      if (!token) {
        console.log('🔒 No token, skipping orders fetch');
        return;
      }
      try {
  const isManager = user?.role === 'branch_manager';
    const branchParam = isManager ? (user?.branchId || selectedBranch || '') : '';
    const ordersUrl = `${apiBase}/orders${branchParam ? `?branchId=${encodeURIComponent(branchParam)}` : ''}`;
    console.log('📋 Fetching orders from:', ordersUrl);
    const res = await fetch(ordersUrl, { headers: { 'Content-Type': 'application/json', ...authHeaders } });
        if (res.ok) {
          const data = await res.json();
          console.log('✅ Orders fetched:', data?.length || 0);
          const mapped: Order[] = data.map((o: any) => ({
            id: o._id,
            products: (o.products || []).map((it: any) => ({ productId: it.productId || it._id, name: it.name, quantity: it.quantity, price: it.price })),
            totalAmount: o.totalAmount,
            branchId: typeof o.branchId === 'object' ? o.branchId._id : o.branchId,
            customerId: typeof o.customerId === 'object' ? o.customerId._id : o.customerId,
            customerName: o.customerName,
            customerEmail: o.customerEmail,
            customerPhone: o.customerPhone,
            shippingAddress: o.shippingAddress,
            paymentStatus: o.paymentStatus,
            orderStatus: o.orderStatus,
            trackingNumber: o.trackingNumber,
            trackingUpdates: (o.trackingUpdates || []).map((u: any) => ({ id: u._id || undefined, status: u.status, location: u.location, description: u.description, createdAt: u.createdAt })),
            createdAt: o.createdAt
          }));
          setOrders(mapped);
          try { localStorage.setItem('orders', JSON.stringify(mapped)); } catch { }
        } else {
          console.error('❌ Failed to fetch orders:', res.status, res.statusText);
          if (res.status === 401 || res.status === 403) {
            console.log('🔒 Authentication issue with orders');
          }
        }
      } catch (error) {
        console.error('❌ Error fetching orders:', error);
      }
    })();

  // Bookings (auth)
    (async () => {
      if (!token) {
        console.log('🔒 No token, skipping bookings fetch');
        return;
      }
      try {
  const isManager = user?.role === 'branch_manager';
    const branchParam = isManager ? (user?.branchId || selectedBranch || '') : '';
    const bookingsUrl = `${apiBase}/bookings${branchParam ? `?branchId=${encodeURIComponent(branchParam)}` : ''}`;
    console.log('📅 Fetching bookings from:', bookingsUrl);
    const res = await fetch(bookingsUrl, { headers: { 'Content-Type': 'application/json', ...authHeaders } });
        if (res.ok) {
          const data = await res.json();
          console.log('✅ Bookings fetched:', data?.length || 0);
          const mapped: Booking[] = data.map((b: any) => ({
            id: b._id,
            eventId: b.eventId,
            sessionId: typeof b.sessionId === 'object' ? b.sessionId._id : b.sessionId,
            activity: b.activity,
            branchId: typeof b.branchId === 'object' ? b.branchId._id : b.branchId,
            customerId: typeof b.customerId === 'object' ? b.customerId._id : b.customerId,
            customerName: b.customerName,
            customerEmail: b.customerEmail,
            customerPhone: b.customerPhone,
            date: b.date || b.sessionDate,
            time: b.time,
            seats: b.seats,
            totalAmount: b.totalAmount || 0,
            paymentStatus: b.paymentStatus,
            qrCode: b.qrCode || b.qrCodeData,
            isVerified: !!b.isVerified,
            verifiedAt: b.verifiedAt,
            status: b.status,
            createdAt: b.createdAt
          }));
          setBookings(mapped);
          try { localStorage.setItem('bookings', JSON.stringify(mapped)); } catch { }
        } else {
          console.error('❌ Failed to fetch bookings:', res.status, res.statusText);
          if (res.status === 401 || res.status === 403) {
            console.log('🔒 Authentication issue with bookings');
          }
        }
      } catch (error) {
        console.error('❌ Error fetching bookings:', error);
      }
    })();
  }, []);

  // Load cached data from localStorage as fallback if backend fails
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const cachedOrders = localStorage.getItem('orders');
        const cachedBookings = localStorage.getItem('bookings');

        if (cachedOrders && orders.length === 0) {
          console.log('📦 Loading cached orders from localStorage');
          setOrders(JSON.parse(cachedOrders));
        }

        if (cachedBookings && bookings.length === 0) {
          console.log('📅 Loading cached bookings from localStorage');
          setBookings(JSON.parse(cachedBookings));
        }
      } catch (error) {
        console.error('❌ Error loading cached data:', error);
      }
    };

    // Load cached data after a short delay to give backend fetch a chance
    const timer = setTimeout(loadCachedData, 2000);
    return () => clearTimeout(timer);
  }, [orders.length, bookings.length]);

  // Periodically refresh orders and bookings from backend so status changes propagate
  useEffect(() => {
    const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';
    let timer: number | null = null;
    let refreshCount = 0;

    const fetchOrdersAndBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('🔒 No token found, skipping data fetch');
        return;
      }

      const authHeaders: Record<string, string> = { Authorization: `Bearer ${token}` };
      try {
        refreshCount++;
        console.log(`🔄 Fetching orders and bookings from backend... (attempt ${refreshCount})`);

        const isManager = user?.role === 'branch_manager';
        const branchParam = isManager ? (user?.branchId || selectedBranch || '') : '';
        const ordersUrl = `${apiBase}/orders${branchParam ? `?branchId=${encodeURIComponent(branchParam)}` : ''}`;
        const bookingsUrl = `${apiBase}/bookings${branchParam ? `?branchId=${encodeURIComponent(branchParam)}` : ''}`;
        const [oRes, bRes] = await Promise.all([
          fetch(ordersUrl, { headers: { 'Content-Type': 'application/json', ...authHeaders } }),
          fetch(bookingsUrl, { headers: { 'Content-Type': 'application/json', ...authHeaders } })
        ]);

        console.log('📊 Orders response status:', oRes.status);
        console.log('📊 Bookings response status:', bRes.status);

        if (oRes.ok) {
          const data = await oRes.json();
          console.log('✅ Orders data received:', data?.length || 0, 'orders');
          if (Array.isArray(data)) {
            const mapped: Order[] = data.map((o: any) => ({
              id: o._id,
              products: (o.products || []).map((it: any) => ({ productId: it.productId || it._id, name: it.name, quantity: it.quantity, price: it.price })),
              totalAmount: o.totalAmount,
              branchId: typeof o.branchId === 'object' ? o.branchId._id : o.branchId,
              customerId: typeof o.customerId === 'object' ? o.customerId._id : o.customerId,
              customerName: o.customerName,
              customerEmail: o.customerEmail,
              customerPhone: o.customerPhone,
              shippingAddress: o.shippingAddress,
              paymentStatus: o.paymentStatus,
              orderStatus: o.orderStatus,
              trackingNumber: o.trackingNumber,
              trackingUpdates: (o.trackingUpdates || []).map((u: any) => ({ id: u._id || undefined, status: u.status, location: u.location, description: u.description, createdAt: u.createdAt })),
              createdAt: o.createdAt
            }));

            // Only update if data has changed to prevent unnecessary re-renders
            setOrders(prevOrders => {
              const isDifferent = JSON.stringify(prevOrders.map(o => o.id).sort()) !== JSON.stringify(mapped.map(o => o.id).sort());
              if (isDifferent || prevOrders.length !== mapped.length) {
                console.log('📦 Updating orders state with fresh data');
                try { localStorage.setItem('orders', JSON.stringify(mapped)); } catch { }
                try { window.dispatchEvent(new Event('app_data_updated')); } catch { }
                return mapped;
              }
              return prevOrders;
            });
          } else {
            console.warn('⚠️ Orders response is not an array:', data);
          }
        } else {
          console.error('❌ Orders request failed:', oRes.status, oRes.statusText);
          if (oRes.status === 401 || oRes.status === 403) {
            console.log('🔒 Authentication failed, stopping polling and clearing auth');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            if (timer) window.clearInterval(timer);
            window.location.reload();
            return;
          }
        }

        if (bRes.ok) {
          const data = await bRes.json();
          console.log('✅ Bookings data received:', data?.length || 0, 'bookings');
          if (Array.isArray(data)) {
            const mapped: Booking[] = data.map((b: any) => ({
              id: b._id,
              eventId: b.eventId,
              sessionId: typeof b.sessionId === 'object' ? b.sessionId._id : b.sessionId,
              activity: b.activity,
              branchId: typeof b.branchId === 'object' ? b.branchId._id : b.branchId,
              customerId: typeof b.customerId === 'object' ? b.customerId._id : b.customerId,
              customerName: b.customerName,
              customerEmail: b.customerEmail,
              customerPhone: b.customerPhone,
              date: b.date || b.sessionDate,
              time: b.time,
              seats: b.seats,
              totalAmount: b.totalAmount || 0,
              paymentStatus: b.paymentStatus,
              qrCode: b.qrCode || b.qrCodeData,
              isVerified: !!b.isVerified,
              verifiedAt: b.verifiedAt,
              status: b.status,
              createdAt: b.createdAt
            }));

            // Only update if data has changed
            setBookings(prevBookings => {
              const isDifferent = JSON.stringify(prevBookings.map(b => b.id).sort()) !== JSON.stringify(mapped.map(b => b.id).sort());
              if (isDifferent || prevBookings.length !== mapped.length) {
                console.log('📅 Updating bookings state with fresh data');
                try { localStorage.setItem('bookings', JSON.stringify(mapped)); } catch { }
                try { window.dispatchEvent(new Event('app_data_updated')); } catch { }
                return mapped;
              }
              return prevBookings;
            });
          } else {
            console.warn('⚠️ Bookings response is not an array:', data);
          }
        } else {
          console.error('❌ Bookings request failed:', bRes.status, bRes.statusText);
          if (bRes.status === 401 || bRes.status === 403) {
            console.log('🔒 Authentication failed, stopping polling and clearing auth');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            if (timer) window.clearInterval(timer);
            window.location.reload();
            return;
          }
        }
      } catch (error) {
        console.error('❌ Network error during polling:', error);
        // Don't clear data on network errors, just log and continue
      }
    };

    // Start polling if logged in
    if (localStorage.getItem('token')) {
      fetchOrdersAndBookings();

      // Use visibility change to avoid background polling
      const onVisibility = () => {
        if (!document.hidden && localStorage.getItem('token')) {
          console.log('👁️ Page became visible, refreshing data...');
          fetchOrdersAndBookings();
        }
      };

      document.addEventListener('visibilitychange', onVisibility);

      // Poll every 30 seconds instead of 60 for more responsive updates
      timer = window.setInterval(() => {
        if (!document.hidden && localStorage.getItem('token')) {
          fetchOrdersAndBookings();
        }
      }, 30000);

      return () => {
        if (timer) window.clearInterval(timer);
        document.removeEventListener('visibilitychange', onVisibility);
      };
    }
    return () => { if (timer) window.clearInterval(timer); };
  }, []);

  const addBranch = async (branchData: Omit<Branch, 'id' | 'createdAt'>) => {
    const newBranch: Branch = {
      ...branchData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setBranches(prev => [...prev, newBranch]);
  };

  const updateBranch = async (branch: Branch) => {
    setBranches(prev => prev.map(b => b.id === branch.id ? branch : b));
  };

  const deleteBranch = async (id: string) => {
    setBranches(prev => prev.filter(b => b.id !== id));
  };

  const addTrackingUpdate = async (orderId: string, update: Omit<TrackingUpdate, 'id'>) => {
    const apiBase = (import.meta as any).env?.VITE_API_URL || '/api';
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`${apiBase}/orders/${orderId}/tracking`, { method: 'POST', headers, body: JSON.stringify(update) });
      if (res.ok) {
        const saved = await res.json();
        setOrders(prev => {
          const next = prev.map(o => o.id === saved._id || o.id === saved.id ? (saved as any) : o);
          try { localStorage.setItem('orders', JSON.stringify(next)); } catch { }
          try { window.dispatchEvent(new Event('app_data_updated')); } catch { }
          return next;
        });
        return;
      }
    } catch (err) {
      // fallback to local
    }

    const newUpdate = {
      ...update,
      id: Date.now().toString()
    };
    setOrders(prev => {
      const next = prev.map(order => order.id === orderId ? { ...order, trackingUpdates: [...(order.trackingUpdates || []), newUpdate], orderStatus: update.status as unknown as Order['orderStatus'] } : order);
      try { localStorage.setItem('orders', JSON.stringify(next)); } catch { /* ignore localStorage errors */ }
      try { window.dispatchEvent(new Event('app_data_updated')); } catch { /* ignore dispatch errors */ }
      return next;
    });
  };

  // Session slots stored per branch in localStorage key 'sessionSlots'
  const [sessionSlots, setSessionSlots] = useState<Record<string, ActivitySlots>>(() => {
    try {
      const raw = localStorage.getItem('sessionSlots');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return {};
  });

  // Keep bookings/orders/sessionSlots in sync across tabs and when custom updates are emitted
  useEffect(() => {
    const reload = () => {
      try {
        const rawB = localStorage.getItem('bookings');
        if (rawB) setBookings(JSON.parse(rawB));
      } catch { /* ignore */ }
      try {
        const rawO = localStorage.getItem('orders');
        if (rawO) setOrders(JSON.parse(rawO));
      } catch { /* ignore */ }
      try {
        const rawS = localStorage.getItem('sessionSlots');
        if (rawS) setSessionSlots(JSON.parse(rawS));
      } catch { /* ignore */ }
    };

    const storageHandler = (e: StorageEvent) => {
      if (!e.key || ['bookings', 'orders', 'sessionSlots'].includes(e.key)) reload();
    };
    const customHandler = () => reload();

    window.addEventListener('storage', storageHandler);
    window.addEventListener('app_data_updated', customHandler as EventListener);
    return () => {
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('app_data_updated', customHandler as EventListener);
    };
  }, []);

  // version/timestamp to notify consumers of slot changes
  const [slotsVersion, setSlotsVersion] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('sessionSlotsVersion');
      if (raw) return Number(raw);
    } catch {
      /* ignore parse errors */
    }
    return Date.now();
  });

  const persistSlotsVersion = (v: number) => {
    try { localStorage.setItem('sessionSlotsVersion', String(v)); } catch { /* ignore */ }
  };

  const persistSlots = (slotsState: Record<string, ActivitySlots>) => {
    try {
      localStorage.setItem('sessionSlots', JSON.stringify(slotsState));
    } catch {
      // ignore
    }
  };

  // Per-branch availability settings (e.g., allowMonday)
  const [branchAvailability, setBranchAvailability] = useState<Record<string, { allowMonday: boolean }>>(() => {
    try {
      const raw = localStorage.getItem('branchAvailability');
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    // default: allowMonday false except Vijayawada true as requested
    return {
      hyderabad: { allowMonday: false },
      vijayawada: { allowMonday: true },
      bangalore: { allowMonday: false }
    };
  });

  const persistBranchAvailability = (state: Record<string, { allowMonday: boolean }>) => {
    try {
      localStorage.setItem('branchAvailability', JSON.stringify(state));
    } catch {
      // ignore
    }
  };

  const getBranchAvailability = (branchId: string) => {
    return branchAvailability[branchId] || null;
  };

  const updateBranchAvailability = async (branchId: string, settings: { allowMonday: boolean }) => {
    setBranchAvailability(prev => {
      const next = { ...prev, [branchId]: settings };
      persistBranchAvailability(next);
      return next;
    });
  };

  const updateSlotsForDate = async (branchId: string, date: string, slots: { slime: Slot[]; tufting: Slot[] }) => {
    const key = branchId || 'global';
    setSessionSlots(prev => {
      const next = { ...prev };
      if (!next[key]) next[key] = {};
      next[key][date] = { ...slots };
      persistSlots(next);
      // bump version so consumers reload
      const v = Date.now();
      setSlotsVersion(v);
      persistSlotsVersion(v);
      return next;
    });
  };

  const getSlotsForDate = (branchId: string, date: string) => {
    const key = branchId || 'global';
    return (sessionSlots[key] && sessionSlots[key][date]) ? sessionSlots[key][date] : null;
  };
  return (
    <DataContext.Provider value={{
      branches: branchesState,
      // utility to get full branch metadata including razorpayKey
      getBranchById,
      events,
      products,
      orders,
      bookings,
      cmsContent,
      managers,
      selectedBranch,
      setSelectedBranch,
      createBooking,
      createOrder,
      verifyQRCode,
      updateCMSContent,
      deleteCMSContent,
      addCMSContent,
      addManager,
      updateManager,
      deleteManager,
      addEvent,
      updateEvent,
      deleteEvent,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      addBranch,
      updateBranch,
      deleteBranch,
      addTrackingUpdate
      ,
      updateSlotsForDate,
      getSlotsForDate
      ,
      getBranchAvailability,
      updateBranchAvailability
      ,
      slotsVersion
    }}>
      {children}
    </DataContext.Provider>
  );
};
```

# src\index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

```

# src\main.tsx

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

```

# src\pages\Home.tsx

```tsx
import React from 'react';
import Carousel from '../components/Home/Carousel';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Testimonials from '../components/Home/Testimonials';
import Studios from '../components/Home/Studios';

const Home: React.FC = () => {
  return (
    <div>
      
  
      <Hero />
    
   
    </div>
  );
};

export default Home;
```

# src\pages\PrivacyPolicy.tsx

```tsx
import React from 'react';

const PrivacyPolicy: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 py-16 px-4">
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-4 border-orange-200">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-8">Privacy Policy</h1>
      <p className="mb-4 text-gray-700">Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.</p>
      <h2 className="text-2xl font-bold text-orange-600 mt-8 mb-2">Information We Collect</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Personal information you provide (name, email, phone, etc.)</li>
        <li>Booking and purchase details</li>
        <li>Usage data and cookies</li>
      </ul>
      <h2 className="text-2xl font-bold text-orange-600 mt-8 mb-2">How We Use Your Information</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>To process bookings and orders</li>
        <li>To improve our services and user experience</li>
        <li>To send updates, offers, and important information</li>
      </ul>
      <h2 className="text-2xl font-bold text-orange-600 mt-8 mb-2">Data Security</h2>
      <p className="mb-4 text-gray-700">We use industry-standard security measures to protect your data. Your information is never sold or shared with third parties except as required by law or to fulfill your requests.</p>
      <h2 className="text-2xl font-bold text-orange-600 mt-8 mb-2">Contact Us</h2>
      <p className="text-gray-700">If you have any questions about our Privacy Policy, please contact us at <a href="mailto:info@artgram.com" className="text-purple-600 underline">info@artgram.com</a>.</p>
    </div>
  </div>
);

export default PrivacyPolicy;

```

# src\pages\RefundPolicy.tsx

```tsx
import React from 'react';

const RefundPolicy: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 py-16 px-4">
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-300">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-8">Refund Policy</h1>
      <p className="mb-4 text-gray-700">We want you to have a great experience with Artgram. Please read our refund policy below.</p>
      <h2 className="text-2xl font-bold text-green-600 mt-8 mb-2">Cancellations &amp; Refunds</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Refunds are available for cancellations made at least 24 hours before your scheduled session or event.</li>
        <li>No refunds for cancellations within 24 hours of the event or for no-shows.</li>
        <li>For store purchases, refunds are processed for defective or damaged products reported within 48 hours of delivery.</li>
      </ul>
      <h2 className="text-2xl font-bold text-green-600 mt-8 mb-2">How to Request a Refund</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Contact us at <a href="mailto:info@artgram.com" className="text-purple-600 underline">info@artgram.com</a> with your order or booking details.</li>
        <li>Refunds will be processed to your original payment method within 7-10 business days after approval.</li>
      </ul>
      <h2 className="text-2xl font-bold text-green-600 mt-8 mb-2">Contact Us</h2>
      <p className="text-gray-700">For any refund-related questions, please email <a href="mailto:info@artgram.com" className="text-purple-600 underline">info@artgram.com</a>.</p>
    </div>
  </div>
);

export default RefundPolicy;

```

# src\pages\ShippingPolicy.tsx

```tsx
import React from 'react';

const ShippingPolicy: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 py-16 px-4">
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-200">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-8">Shipping Policy</h1>
      <p className="mb-4 text-gray-700">We strive to deliver your orders quickly and safely. Please review our shipping policy below.</p>
      <h2 className="text-2xl font-bold text-pink-600 mt-8 mb-2">Order Processing</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Orders are processed within 1-2 business days after payment confirmation.</li>
        <li>Shipping times may vary based on your location and product availability.</li>
      </ul>
      <h2 className="text-2xl font-bold text-pink-600 mt-8 mb-2">Delivery</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>We deliver across India using trusted courier partners.</li>
        <li>Estimated delivery time is 3-7 business days after dispatch.</li>
        <li>Tracking details will be provided once your order is shipped.</li>
      </ul>
      <h2 className="text-2xl font-bold text-pink-600 mt-8 mb-2">Shipping Charges</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Shipping charges are calculated at checkout based on your order value and location.</li>
        <li>Free shipping may be available for select products or promotions.</li>
      </ul>
      <h2 className="text-2xl font-bold text-pink-600 mt-8 mb-2">Contact Us</h2>
      <p className="text-gray-700">For shipping-related queries, contact us at <a href="mailto:info@artgram.com" className="text-purple-600 underline">info@artgram.com</a>.</p>
    </div>
  </div>
);

export default ShippingPolicy;

```

# src\pages\TermsAndConditions.tsx

```tsx
import React from 'react';

const TermsAndConditions: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 py-16 px-4">
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-8">Terms &amp; Conditions</h1>
      <p className="mb-4 text-gray-700">By using our website and services, you agree to the following terms and conditions. Please read them carefully.</p>
      <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-2">Bookings &amp; Payments</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>All bookings are subject to availability and confirmation.</li>
        <li>Full payment is required to confirm your booking.</li>
        <li>Prices are subject to change without prior notice.</li>
      </ul>
      <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-2">User Responsibilities</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Provide accurate information during booking and checkout.</li>
        <li>Follow all safety and participation guidelines at our events and studios.</li>
        <li>Respect our staff, property, and other guests.</li>
      </ul>
      <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-2">Changes &amp; Cancellations</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>We reserve the right to reschedule or cancel events due to unforeseen circumstances.</li>
        <li>Customers will be notified promptly and offered alternatives or refunds as per our policy.</li>
      </ul>
      <h2 className="text-2xl font-bold text-purple-600 mt-8 mb-2">Contact Us</h2>
      <p className="text-gray-700">For any questions regarding these terms, please contact us at <a href="mailto:info@artgram.com" className="text-purple-600 underline">info@artgram.com</a>.</p>
    </div>
  </div>
);

export default TermsAndConditions;

```

# src\types\index.ts

```ts
export interface User {
  id: string;
  email: string;
  name: string;
  // optional contact/profile fields
  phone?: string;
  address?: Address;
  role: 'admin' | 'branch_manager' | 'customer';
  branchId?: string;
  temporaryPassword?: string;
  mustChangePassword?: boolean;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  stripeAccountId: string;
  // optional Razorpay publishable key (client-side) and account id (server-side)
  razorpayKey?: string;
  razorpayAccountId?: string;
  // which activities this branch runs
  supportsSlime?: boolean;
  supportsTufting?: boolean;
  managerId: string;
  isActive: boolean;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  branchId: string;
  date: string;
  time: string;
  duration: number;
  maxSeats: number;
  bookedSeats: number;
  price: number;
  materials: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  // Legacy fields for backward compatibility
  eventId?: string;
  sessionDate?: string;
  
  // New session-based fields
  sessionId?: string;
  activity?: 'slime' | 'tufting';
  
  // Core booking info
  customerId: string;
  // store customer details snapshot for manager access
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  
  // Session details
  date?: string;
  time?: string;
  branchId: string;
  seats: number;
  totalAmount: number;
  
  // Payment info
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentIntentId?: string;
  
  // QR and verification
  qrCode: string;
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  
  // Additional info
  packageType?: string; // 'base', 'premium', etc.
  specialRequests?: string;
  status?: 'active' | 'cancelled' | 'completed';
  
  createdAt: string;
}

export interface Session {
  id: string;
  branchId: string;
  date: string; // YYYY-MM-DD format
  activity: 'slime' | 'tufting';
  time: string; // HH:MM format
  label?: string; // Display label like "10:00 AM"
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  type: string; // e.g., "Slime Play", "Slime Making", "Small Tufting", etc.
  ageGroup: string; // e.g., "3+", "8+", "All", "15+"
  price?: number; // Base price (can be overridden by packages)
  isActive: boolean;
  createdBy?: string; // Admin/Manager who created this session
  notes?: string; // Additional notes for the session
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  materials: string[];
  isActive: boolean;
  // optional UI/product metadata
  badge?: string;
  originalPrice?: number;
  createdAt: string;
}

export interface Order {
  id: string;
  // store customer snapshot for admin access
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerId: string;
  branchId: string;
  products: OrderProduct[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'payment_confirmed' | 'processing' | 'packed' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentIntentId?: string;
  trackingNumber?: string;
  trackingUpdates?: TrackingUpdate[];
  shippingAddress: Address;
  createdAt: string;
}

export interface TrackingUpdate {
  id?: string;
  status: string;
  location: string;
  timestamp?: string;
  createdAt?: string;
  description: string;
}
export interface OrderProduct {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CMSContent {
  id: string;
  type: 'carousel' | 'hero' | 'about' | 'services' | 'testimonials' | 'contact' | 'gallery' | 'studios' | 'events';
  title: string;
  content: string;
  images: string[];
  isActive: boolean;
  updatedAt: string;
}

export interface Analytics {
  totalRevenue: number;
  totalBookings: number;
  totalOrders: number;
  branchRevenue: { [branchId: string]: number };
  popularEvents: Event[];
  topProducts: Product[];
}
```

# src\utils\emailService.ts

```ts
// Email service utility for sending notifications
export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export interface ManagerInviteData {
  name: string;
  email: string;
  branchName: string;
  temporaryPassword: string;
  loginUrl: string;
}

export interface PasswordResetData {
  name: string;
  email: string;
  resetToken: string;
  resetUrl: string;
}

// Generate temporary password
export const generateTemporaryPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Generate reset token
export const generateResetToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Create manager invitation email template
export const createManagerInviteEmail = (data: ManagerInviteData): EmailTemplate => {
  return {
    to: data.email,
    subject: 'Welcome to Craft Factory - Manager Account Created',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ea580c, #f97316); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ea580c; }
          .button { display: inline-block; background: #ea580c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎨 Welcome to Craft Factory!</h1>
            <p>Your Manager Account Has Been Created</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            <p>Congratulations! You have been assigned as a Branch Manager for <strong>${data.branchName}</strong>.</p>
            
            <div class="credentials">
              <h3>🔐 Your Login Credentials:</h3>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Temporary Password:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${data.temporaryPassword}</code></p>
            </div>
            
            <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
            
            <div style="text-align: center;">
              <a href="${data.loginUrl}" class="button">Login to Dashboard</a>
            </div>
            
            <h3>📋 Your Responsibilities:</h3>
            <ul>
              <li>Manage branch operations and events</li>
              <li>Process and track customer orders</li>
              <li>Verify QR codes for event bookings</li>
              <li>Update order statuses and tracking information</li>
            </ul>
            
            <p>If you have any questions or need assistance, please contact the admin team.</p>
          </div>
          <div class="footer">
            <p>© 2024 Craft Factory. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Create password reset email template
export const createPasswordResetEmail = (data: PasswordResetData): EmailTemplate => {
  return {
    to: data.email,
    subject: 'Craft Factory - Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .reset-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>Craft Factory Manager Portal</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            <p>We received a request to reset your password for your Craft Factory manager account.</p>
            
            <div class="reset-info">
              <h3>🔑 Reset Your Password:</h3>
              <p>Click the button below to reset your password. This link will expire in 1 hour for security purposes.</p>
              
              <div style="text-align: center;">
                <a href="${data.resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p><strong>Reset Token:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${data.resetToken}</code></p>
            </div>
            
            <div class="warning">
              <p><strong>⚠️ Security Notice:</strong></p>
              <ul>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>This link will expire in 1 hour</li>
                <li>Never share your reset token with anyone</li>
              </ul>
            </div>
            
            <p>If you're having trouble with the button above, copy and paste the following URL into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 4px;">${data.resetUrl}</p>
          </div>
          <div class="footer">
            <p>© 2024 Craft Factory. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Simulate sending email (in real app, this would integrate with email service like SendGrid, Mailgun, etc.)
export const sendEmail = async (emailData: EmailTemplate): Promise<boolean> => {
  try {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In development, log the email content
    console.log('📧 Email Sent:', {
      to: emailData.to,
      subject: emailData.subject,
      // html: emailData.html // Uncomment to see full HTML in console
    });
    
    // Show notification to admin
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-family: Arial, sans-serif;
      max-width: 300px;
    `;
    notification.innerHTML = `
      <div style="display: flex; align-items: center;">
        <span style="margin-right: 10px;">✅</span>
        <div>
          <div style="font-weight: bold;">Email Sent!</div>
          <div style="font-size: 14px; opacity: 0.9;">Sent to ${emailData.to}</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Email service functions
export const sendManagerInvite = async (data: ManagerInviteData): Promise<boolean> => {
  const emailTemplate = createManagerInviteEmail(data);
  return await sendEmail(emailTemplate);
};

export const sendPasswordReset = async (data: PasswordResetData): Promise<boolean> => {
  const emailTemplate = createPasswordResetEmail(data);
  return await sendEmail(emailTemplate);
};
```

# src\utils\razorpay.ts

```ts
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    // Keep typing flexible; we'll cast to any when invoking
    Razorpay: unknown;
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  // In a real application, this would be an API call to your backend
  // For demo purposes, we'll simulate the order creation
  return {
    id: `order_${Date.now()}`,
    amount: amount * 100, // Razorpay expects amount in paise
    currency,
    status: 'created'
  };
};
export const initiatePayment = async (options: Omit<RazorpayOptions, 'key'> & { key?: string }) => {
  const isLoaded = await loadRazorpayScript();
  
  if (!isLoaded) {
    throw new Error('Razorpay SDK failed to load');
  }
  const razorpayOptions: RazorpayOptions = {
    key: options.key || 'rzp_test_1234567890', // fallback test key
    ...options
  };

  // If you need to pass merchant account id or notes for server-side transfers,
  // create the order on the server using the branch's Razorpay account and include
  // the appropriate account id/transfer instructions. Client-side we can only
  // switch publishable keys to simulate directing payments to different accounts.
  type RazorpayCtorType = new (opts: Record<string, unknown>) => { open: () => void };
  const RazorpayCtor = (window.Razorpay as unknown) as RazorpayCtorType;
  const razorpay = new RazorpayCtor(razorpayOptions as unknown as Record<string, unknown>);
  razorpay.open();
};
```

# src\vite-env.d.ts

```ts
/// <reference types="vite/client" />

```

# tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

```

# test-auth-complete.js

```js

```

# test-auth.js

```js

```

# test-auth.sh

```sh

```

# test-fixes.md

```md

```

# TESTING_GUIDE.md

```md

```

# tsconfig.app.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}

```

# tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}

```

# tsconfig.node.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}

```

# vite.config.ts

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

```

