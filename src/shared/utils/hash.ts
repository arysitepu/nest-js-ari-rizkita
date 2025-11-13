import { AES, enc, HmacSHA256, TripleDES } from 'crypto-js';
import * as _ from 'lodash';
import { ENCRYPT_KEY, ENCRYPT_KEY2 } from './constant';

export function encrypt(data: string) {
  if (_.isEmpty(data)) return data;
  const aes = AES.encrypt(
    data,
    HmacSHA256(ENCRYPT_KEY, process.env.SECRET_KEY).toString(enc.Base64),
  );
  const tripleDES = TripleDES.encrypt(
    aes.toString(),
    HmacSHA256(ENCRYPT_KEY2, process.env.SECRET_KEY).toString(enc.Base64),
  );
  return tripleDES.toString();
}

export function decrypt(data: string) {
  if (_.isEmpty(data)) return data;
  const tripleDES = TripleDES.decrypt(
    data,
    HmacSHA256(ENCRYPT_KEY2, process.env.SECRET_KEY).toString(enc.Base64),
  ).toString(enc.Utf8);
  const aes = AES.decrypt(
    tripleDES,
    HmacSHA256(ENCRYPT_KEY, process.env.SECRET_KEY).toString(enc.Base64),
  ).toString(enc.Utf8);
  return aes;
}

export function decryptPwd(pwd: string) {
  if (_.isEmpty(pwd)) return pwd;

  const aes = AES.decrypt(pwd, process.env.SHARED_KEY_AES).toString(enc.Utf8);

  return aes;
}

export function encryptPwd(data: string) {
  if (_.isEmpty(data)) return data;
  const aes = AES.encrypt(data, process.env.SHARED_KEY_AES).toString();
  return aes.toString();
}
