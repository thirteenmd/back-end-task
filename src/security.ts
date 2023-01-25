import * as bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function hashPassword(password: string): Promise<string> {
  const salt: string = await bcryptjs.genSalt(10) as unknown as string;

  return await bcryptjs.hash(password, salt) as unknown as Promise<string>;
}

export function generateToken(data: TokenData): string {
  return jwt.sign(data, process.env.JWT_SECRET as string, {expiresIn: '30d'}) as unknown as string;
}

export function isValidToken(token: string): boolean  {
  return !!jwt.verify(token, process.env.JWT_SECRET as string) as unknown as boolean;
}

// NOTE(roman): assuming that `isValidToken` will be called before
export function extraDataFromToken(token: string): TokenData  {
  return jwt.verify(token, process.env.JWT_SECRET as string) as unknown as TokenData;
}

export interface TokenData {
  id: number;
}
