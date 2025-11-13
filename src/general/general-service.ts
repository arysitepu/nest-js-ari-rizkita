import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
@Injectable()
export class GeneralService{
  private readonly encryptionKey: Buffer;
  private readonly logger: Logger;
  private readonly key: Buffer;
    constructor(private prisma: PrismaService){
      const keyString = 'iz5WSPfXvcfKSYDdaRnQQbGrMEnCnXuT'
      this.encryptionKey = Buffer.from(keyString);
      this.logger = new Logger('Auth Services');
      const appKeyDecoded = Buffer.from('9BZjcrxy/7YouOAU2g/mNbc9rNHg98cfEZEkRz5wwlw=', 'base64')
      this.key = appKeyDecoded
    }
  encryptNew(text: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const payload = {
      iv: iv.toString('base64'),
      value: encrypted,
      mac: crypto.createHmac('sha256', this.key).update(iv.toString('base64') + encrypted).digest('hex'),
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

      encrypt(text: string) {  
        const iv = crypto.randomBytes(16); 
        const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);  
        let encrypted = cipher.update(text, 'utf8', 'hex');  
        encrypted += cipher.final('hex');  
        return iv.toString('hex') + ':' + encrypted;
      }  

       decrypt(text: string) {  
        try {  
          const [ivHex, encryptedText] = text.split(':');
          const iv = Buffer.from(ivHex, 'hex');  
          const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, iv);  
          let decrypted = decipher.update(encryptedText, 'hex', 'utf8');  
          decrypted += decipher.final('utf8');  
          return decrypted;  
        } catch (error) {  
          this.logger.error('Decryption error:', error);  
          throw new InternalServerErrorException('Terjadi kesalahan saat mendekripsi');  
        }  
      } 

      decryptNew(encryptedText: string) {  
        try {  
          const decoded = JSON.parse(Buffer.from(encryptedText, 'base64').toString('utf8'));
          const iv = Buffer.from(decoded.iv, 'base64');
          const encrypted = decoded.value;
          const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv);
          let decrypted = decipher.update(encrypted, 'base64', 'utf8');
          decrypted += decipher.final('utf8');
          return decrypted;
        } catch (error) {  
          this.logger.error('Decryption error:', error);  
          throw new InternalServerErrorException('Terjadi kesalahan saat mendekripsi');  
        }  
      } 

      
      decryptPalletCode(encryptedText: string) {  
        try {  
          let res
          const decoded : {
            iv : string;
            value : string;
            mac : string;
          } = JSON.parse(Buffer.from(encryptedText, 'base64').toString('utf8'));
          if(!decoded.iv || !decoded.value ){
            res = 'Data tidak ditemukan'
            return res;
          }
          const iv = Buffer.from(decoded.iv, 'base64');
          const encrypted = decoded.value;
          const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv);
           res = decipher.update(encrypted, 'base64', 'utf8');
           if(!encrypted){
            res = 'Data tidak ditemukan'
            return res;
           }
          res += decipher.final('utf8');
          return res;
        } catch (error) {  
          this.logger.error('Decryption error:', error);  
          throw error
        }  
      } 

      async encryptPassword(password: string): Promise<string> {  
        const saltRounds = 10;  
        const hashedPassword = await bcrypt.hash(password, saltRounds);  
        return hashedPassword;  
      }  

   async processAndValidateEmails(emailString: string, fieldName: string) :Promise<string[]> {
        const emailArray = emailString.split(';').filter(email => email.trim() !== '');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex untuk validasi email
      
        emailArray.forEach(email => {
          if (!emailRegex.test(email)) {
            throw new BadRequestException(`Invalid email format in ${fieldName}: ${email}`);
          }
        });
      
        return emailArray;
      }

      async convertCommaToDot (value: string):Promise<number>{
        return parseFloat(value.replace(',', '.'));
      }

      

     async generateRandomString(length: number) {
        const bytes = crypto.randomBytes(length);
        const base64String = bytes.toString('base64');
        return base64String.replace(/\+/g, '0').replace(/\//g, '0').substring(0, length);
      }

}