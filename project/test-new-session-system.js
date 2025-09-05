// Test script for new session management system
// Run with: node test-new-session-system.js

const fetch = require('node-fetch').default || require('node-fetch');

const API_BASE = 'http://localhost:3001/api';

async function testNewSessionSystem() {
  console.log('🧪 Testing New Session Management System');
  console.log('==========================================\n');

  // Test 1: Create a branch with permissions
  console.log('1. Testing branch creation with activity permissions...');
  try {
    const branchResponse = await fetch(`${API_BASE}/branches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Branch',
        location: 'Test City',
        allowSlime: true,
        allowTufting: false,
        allowMonday: true
      })
    });
    
    if (branchResponse.ok) {
      const branch = await branchResponse.json();
      console.log('✅ Branch created:', branch.name, '- Slime:', branch.allowSlime, 'Tufting:', branch.allowTufting, 'Monday:', branch.allowMonday);
      
      // Test 2: Try to create a tufting session (should fail)
      console.log('\n2. Testing session creation with permission validation...');
      const sessionResponse = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: branch._id,
          date: '2025-08-31',
          activity: 'tufting',
          time: '14:00',
          totalSeats: 8,
          type: 'Test Tufting',
          ageGroup: '15+'
        })
      });
      
      if (!sessionResponse.ok) {
        const error = await sessionResponse.json();
        console.log('✅ Correctly blocked tufting session:', error.message);
      } else {
        console.log('❌ Should have blocked tufting session');
      }
      
      // Test 3: Create a slime session (should work)
      const slimeSessionResponse = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: branch._id,
          date: '2025-08-31',
          activity: 'slime',
          time: '10:00',
          totalSeats: 15,
          type: 'Slime Play',
          ageGroup: '3+'
        })
      });
      
      if (slimeSessionResponse.ok) {
        const session = await slimeSessionResponse.json();
        console.log('✅ Slime session created:', session.activity, session.type);
        
        // Test 4: Fetch sessions for branch
        console.log('\n3. Testing branch-specific session fetching...');
        const fetchResponse = await fetch(`${API_BASE}/sessions/branch/${branch._id}?activity=slime`);
        
        if (fetchResponse.ok) {
          const sessions = await fetchResponse.json();
          console.log('✅ Sessions fetched:', sessions.length, 'session(s)');
        } else {
          console.log('❌ Failed to fetch sessions');
        }
      } else {
        console.log('❌ Failed to create slime session');
      }
    } else {
      console.log('❌ Failed to create test branch');
    }
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
  
  console.log('\n🏁 Test completed!');
  console.log('\nKey improvements implemented:');
  console.log('• Removed auto-session generation (no more race conditions)');
  console.log('• Added branch activity permissions (allowSlime, allowTufting, allowMonday)');
  console.log('• Session creation validates branch permissions');
  console.log('• New branch-specific session endpoint without auto-creation');
  console.log('• Updated frontend components to use new endpoints');
  console.log('• Enhanced admin dashboard with "Create Branch + Manager" functionality');
}

testNewSessionSystem();
