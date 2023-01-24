import { NotImplementedError } from './errors';
import * as bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function hashPassword(password: string): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const salt: string = await bcryptjs.genSalt(10);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  return await bcryptjs.hash(password, salt);
}

export function generateToken(data: TokenData): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  return jwt.sign(data, process.env.JWT_SECRET as string, {expiresIn: '30d'});
}

export function isValidToken(token: string): boolean  {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return !!jwt.verify(token, process.env.JWT_SECRET as string);
}

// NOTE(roman): assuming that `isValidToken` will be called before
export function extraDataFromToken(token: string): TokenData  {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return jwt.verify(token, process.env.JWT_SECRET as string) as TokenData;
}

export interface TokenData {
  id: number;
}
