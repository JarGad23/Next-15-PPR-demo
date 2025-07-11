import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { 
  getUserByEmail, 
  createUser as dbCreateUser, 
  getUserById as dbGetUserById,
  createSession,
  getSessionById,
  deleteSession,
} from '@/db/queries';
import type { User } from '@/db/schema';

export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return null;

  // Don't return password hash
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
}

export async function createUser(data: z.infer<typeof signupSchema>): Promise<User> {
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const passwordHash = await hashPassword(data.password);
  const newUser = await dbCreateUser({
    name: data.name,
    email: data.email,
    passwordHash,
  });

  // Don't return password hash
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _pwd, ...userWithoutPassword } = newUser;
  return userWithoutPassword as User;
}

export async function getUserById(id: number): Promise<User | null> {
  const user = await dbGetUserById(id);
  if (!user) return null;

  // Don't return password hash
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _hash, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
}

export async function createSessionToken(userId: number): Promise<string> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await createSession({
    id: sessionId,
    userId,
    expiresAt,
  });

  const token = await new SignJWT({ sessionId, userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresAt)
    .sign(JWT_SECRET);

  return token;
}

export async function verifySessionToken(token: string): Promise<{ sessionId: string; userId: number } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      sessionId: payload.sessionId as string,
      userId: payload.userId as number,
    };
  } catch {
    return null;
  }
}

export async function validateSession(sessionId: string): Promise<User | null> {
  const session = await getSessionById(sessionId);
  if (!session) return null;

  if (new Date() > session.expiresAt) {
    await deleteSession(sessionId);
    return null;
  }

  return session.user as User;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) {
      return null;
    }

    const payload = await verifySessionToken(token);
    if (!payload) {
      return null;
    }

    const user = await validateSession(payload.sessionId);
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    // Don't catch PPR bailout errors - let them propagate
    if (error && typeof error === 'object' && '$$typeof' in error) {
      throw error;
    }
    return null;
  }
}

// PPR-safe version that doesn't access cookies during prerendering
export async function getCurrentUserSafe(): Promise<User | null> {
  try {
    return await getCurrentUser();
  } catch (error) {
    // If PPR bailout, return null to allow static generation
    if (error && typeof error === 'object' && '$$typeof' in error) {
      return null;
    }
    return null;
  }
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await deleteSession(sessionId);
}

export function createAuthContext(user: User | null): AuthContext {
  return {
    user,
    isAuthenticated: !!user,
  };
}