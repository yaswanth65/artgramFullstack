import type { Branch } from '../types';

/**
 * Filter branches that support a specific activity and are active
 */
export const getActiveBranchesForActivity = (
  branches: Branch[], 
  activity: 'slime' | 'tufting'
): Branch[] => {
  return branches.filter(branch => {
    // Must be active
    if (!branch.isActive) return false;
    
    // Must allow the specific activity
    if (activity === 'slime') {
      return branch.allowSlime !== false;
    } else if (activity === 'tufting') {
      return branch.allowTufting !== false;
    }
    
    return false;
  });
};

/**
 * Get all active branches regardless of activity
 */
export const getActiveBranches = (branches: Branch[]): Branch[] => {
  return branches.filter(branch => branch.isActive);
};

/**
 * Check if a branch supports a specific activity
 */
export const branchSupportsActivity = (
  branch: Branch | null | undefined, 
  activity: 'slime' | 'tufting'
): boolean => {
  if (!branch || !branch.isActive) return false;
  
  if (activity === 'slime') {
    return branch.allowSlime !== false;
  } else if (activity === 'tufting') {
    return branch.allowTufting !== false;
  }
  
  return false;
};

/**
 * Get branch location options for a specific activity
 */
export const getBranchLocationOptions = (
  branches: Branch[], 
  activity: 'slime' | 'tufting'
): Array<{ value: string; label: string; branchId: string }> => {
  const activeBranches = getActiveBranchesForActivity(branches, activity);
  
  return activeBranches.map(branch => ({
    value: branch.location.toLowerCase().replace(/\s+/g, ''), // e.g., "hyderabad", "vijayawada" 
    label: branch.location,
    branchId: branch.id
  }));
};
