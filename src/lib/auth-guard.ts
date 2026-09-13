import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export async function checkAuth() {
  const session = await getServerSession(authOptions);
  return !!session;
}
