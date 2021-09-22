import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
const SECRET_KEY = 'Ber1g0';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  encrypt(textToEncrypt) {
    return CryptoJS.AES.encrypt(textToEncrypt, SECRET_KEY.trim()).toString();
  }
  decrypt(textToDecrypt) {
    try {
      return CryptoJS.AES.decrypt(textToDecrypt.toString(), SECRET_KEY.trim()).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return { msg: 'Encrypt invalido', err: true };
    }

  }

}