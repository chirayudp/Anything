import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Database } from './db/database';
import { DbUser, UserRole } from './db/types';

const JWT_SECRET = process.env.JWT_SECRET || 'moneyquest_jwt_super_secret_key_hyd_2026';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  organizationId: string;
  studentId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export class AuthService {
  public static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  public static comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  public static generateToken(user: DbUser): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      studentId: user.studentId,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  public static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  }

  public static authenticateHeader(authHeader?: string): TokenPayload | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.substring(7);
    return this.verifyToken(token);
  }
}

/**
 * Middleware requiring a valid authenticated JWT session
 */
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const tokenPayload = AuthService.authenticateHeader(req.headers.authorization);
  if (!tokenPayload) {
    return res.status(401).json({
      error: 'Authentication required. Please log in with valid credentials.',
    });
  }

  // Ensure user still exists
  const user = Database.findUserById(tokenPayload.userId);
  if (!user) {
    return res.status(401).json({ error: 'User account no longer exists.' });
  }

  req.user = tokenPayload;
  next();
};

/**
 * Middleware restricting access to specified roles (e.g. 'ngo_staff' or 'student')
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: role '${req.user.role}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

/**
 * Middleware ensuring a student can ONLY view or update their OWN records
 */
export const requireStudentSelf = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'This endpoint is for students only.' });
  }

  const requestedStudentId = req.params.studentId || req.body?.studentId || req.query?.studentId;
  if (requestedStudentId && requestedStudentId !== req.user.studentId) {
    return res.status(403).json({
      error: 'Access denied: You cannot view or modify another student\'s records.',
    });
  }

  next();
};

/**
 * Middleware ensuring an NGO staff member can ONLY access students within their authorized organization
 */
export const requireNgoOrgScope = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  if (req.user.role !== 'ngo_staff' && req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied: NGO staff role required.',
    });
  }

  const requestedStudentId = req.params.studentId;
  if (requestedStudentId) {
    const studentProfile = Database.getStudentProfile(requestedStudentId);
    if (!studentProfile) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    if (studentProfile.organizationId !== req.user.organizationId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied: This student is not assigned to your authorized organization.',
      });
    }
  }

  next();
};
