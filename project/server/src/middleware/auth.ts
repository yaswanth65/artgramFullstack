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
