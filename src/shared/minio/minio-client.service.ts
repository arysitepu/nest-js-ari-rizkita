import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { config } from './config-minio';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';

@Injectable()
export class MinioClientService {
    private readonly logger: Logger;
    private readonly baseBucket = config.MINIO_BUCKET

    public get client(){
        return this.minio.client
    }

    constructor(
        private readonly minio: MinioService,
    ){
        this.logger = new Logger('MinioStorageService');
    }

    public async uploadFile(file: BufferedFile, baseBucket: string = this.baseBucket) {
        if(!(file.mimetype.includes('jpeg') || file.mimetype.includes('png') || file.mimetype.includes('pdf'))) {
          throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
        }
        let temp_filename = Date.now().toString()
        let hashedFileName = crypto.createHash('md5').update(temp_filename).digest("hex");
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        let filename = hashedFileName + ext
        const fileName: string = `${filename}`;
        const fileBuffer = file.buffer;
        // this.client.putObject(baseBucket,fileName,fileBuffer, function(err, res) {
        //   if(err) throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
        // })
    
        return {
          url: `https://${config.MINIO_ENDPOINT}:${config.MINIO_PORT_URL}/${config.MINIO_BUCKET}/${filename}` 
        }
      }

    //upload file url
    public async uploadBuffer(data, file, baseBucket: string = this.baseBucket){
        let temp_filename = Date.now().toString()
        let hashedFilename = crypto.createHash('md5').update(temp_filename).digest("hex");
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);

        let filename = hashedFilename + ext
        const fileName: string = `${filename}`;
        const fileBuffer = data;
        // this.client.putObject(baseBucket, filename, fileBuffer, function(err, res){
        //     if(err) throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST), err
        // })

        return {
            url: 'https://'+`${config.MINIO_ENDPOINT}:${config.MINIO_PORT_URL}/${config.MINIO_BUCKET}/${filename}`
        }
    }
}