import { createAuthContext, getCurrentUser, type AuthContext } from './auth';

export interface Context {
  auth: AuthContext;
}

export async function createContext(): Promise<Context> {
  const user = await getCurrentUser();
  
  return {
    auth: createAuthContext(user),
  };
}

export async function createPublicContext(): Promise<Context> {
  // For public routes, still check for auth but don't require it
  const user = await getCurrentUser();
  
  return {
    auth: createAuthContext(user),
  };
}