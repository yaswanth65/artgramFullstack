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
