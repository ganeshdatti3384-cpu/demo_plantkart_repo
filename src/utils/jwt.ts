import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export function signJwt(payload: object, expiresIn = '100y') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export async function verifyAuth(req: Request) {
  const role = req.headers.get('x-user-role');
  const userId = req.headers.get('x-user-id');
  
  if (!role || !userId) return null;
  
  return { role, userId };
}
