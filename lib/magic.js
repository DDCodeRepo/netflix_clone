import { Magic } from '@magic-sdk/admin';

export const magicAdmin = new Magic(process.env.NEXT_PUBLIC_SECRET_API_KEY);