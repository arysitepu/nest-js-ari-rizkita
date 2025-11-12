import { SetMetadata } from '@nestjs/common';
// import { MD5, SHA256, HmacSHA256 } from 'crypto-js';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const SHARED_KEY_AES = process.env.SHARED_KEY_AES;
export const ENCRYPT_KEY = process.env.ENCRYPT_KEY;
export const ENCRYPT_KEY2 = process.env.ENCRYPT_KEY2;

export const searchType = ['all', 'spesific'];

// export const regexValidationInput, {invert: true} = /<\/?[^>!&$]*(>|$)/
export const regexValidationInput = /[$\(\)\!\$\`\<>\'\"\#\~\*\^\[\]\=]/;
