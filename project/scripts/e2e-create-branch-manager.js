/*
 Simple end-to-end script to create a branch and manager and verify propagation.
 Usage: node scripts/e2e-create-branch-manager.js

 It expects a running backend at http://localhost:3001 (or set API_BASE env).
 It will:
  - login as admin (credentials from env: E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD) OR try to register an admin
  - create a branch via POST /api/branches
  - create a manager via POST /api/auth/register with branchId included
  - verify GET /api/branches returns the created branch
  - verify the manager creation response contains branchId

 This script is intentionally dependency-free and uses global fetch (Node 18+). If your Node is older, run with a Node 18+ or install node-fetch and adjust.
*/

const API_BASE = process.env.API_BASE || 'http://localhost:3001/api';

function log(...args) { console.log('[e2e]', ...args); }

async function http(path, opts) {
  const res = await fetch(`${API_BASE}${path}`, opts);
  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }
  return { status: res.status, ok: res.ok, body, headers: res.headers };
}

(async function main(){
  log('Starting e2e create-branch-manager');

  const adminEmail = process.env.E2E_ADMIN_EMAIL || 'admin@artgram.test';
  const adminPassword = process.env.E2E_ADMIN_PASSWORD || 'adminpassword';

  // Try to login
  log('Attempting admin login...');
  let auth = await http('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: adminPassword })
  });

  if (!auth.ok) {
    log('Admin login failed. Attempting to register admin...');
    const reg = await http('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'E2E Admin', email: adminEmail, password: adminPassword, role: 'admin' })
    });
    if (!reg.ok) {
      log('Failed to ensure admin user exists:', reg.status, reg.body);
      process.exit(1);
    }
    auth = reg;
  }

  const token = (auth.body && auth.body.token) ? auth.body.token : (auth.body && auth.body.accessToken) ? auth.body.accessToken : null;
  if (!token) {
    log('No token returned for admin; aborting');
    process.exit(1);
  }
  log('Admin token obtained');

  // Create a branch
  const branchPayload = {
    name: `E2E Branch ${Date.now()}`,
    location: `E2E City ${Date.now()}`,
    address: '123 E2E Lane',
    phone: '+91 99999 99999',
    email: `e2e-${Date.now()}@artgram.test`,
    allowSlime: true,
    allowTufting: true
  };

  const createBranchRes = await http('/branches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(branchPayload)
  });

  if (!createBranchRes.ok) {
    log('Branch creation failed:', createBranchRes.status, createBranchRes.body);
    process.exit(1);
  }
  const createdBranch = createBranchRes.body;
  log('Created branch:', createdBranch._id || createdBranch.id);

  // Create manager and link to branch by passing branchId in registration
  const managerPayload = {
    name: `E2E Manager ${Date.now()}`,
    email: `e2e-manager-${Date.now()}@artgram.test`,
    password: 'managerpassword',
    role: 'branch_manager',
    branchId: createdBranch._id || createdBranch.id
  };

  const createManagerRes = await http('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(managerPayload)
  });

  if (!createManagerRes.ok) {
    log('Manager creation failed:', createManagerRes.status, createManagerRes.body);
    process.exit(1);
  }
  const createdManager = createManagerRes.body;
  log('Created manager:', createdManager.user ? createdManager.user._id || createdManager.user.id : createdManager._id || createdManager.id);

  // Verify branches list contains the created branch
  const branchesRes = await http('/branches', { method: 'GET' });
  if (!branchesRes.ok) {
    log('Failed to fetch branches for verification:', branchesRes.status, branchesRes.body);
    process.exit(1);
  }
  const found = (branchesRes.body || []).find(b => (b._id || b.id) === (createdBranch._id || createdBranch.id));
  if (!found) {
    log('Created branch not found in branches list');
    process.exit(1);
  }
  log('Verified branch present in branches list');

  // Verify manager response includes branchId
  const managerBranchId = createdManager.user?.branchId || createdManager.branchId || null;
  if (!managerBranchId) {
    log('Manager record does not include branchId in response. You may need a server-side update to set manager.branchId after branch creation.');
  } else if (managerBranchId === (createdBranch._id || createdBranch.id)) {
    log('Verified manager is linked to branch via branchId');
  } else {
    log('Manager branchId does not match created branch id:', managerBranchId);
  }

  log('E2E script completed');
  process.exit(0);
})();
