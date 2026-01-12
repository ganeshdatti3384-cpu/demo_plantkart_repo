import { verifyJwt } from './jwt';

export async function verifyToken(token: string) {
  try {
    const decoded = verifyJwt(token);
    return decoded as any;
  } catch (error) {
    return null;
  }
}

export function getUserIdFromToken(token: string): string | null {
  const decoded = verifyJwt(token);
  if (decoded && typeof decoded === 'object' && 'userId' in decoded) {
    const userId = (decoded as any).userId;
    return typeof userId === 'string' ? userId : userId.toString();
  }
  return null;
}
