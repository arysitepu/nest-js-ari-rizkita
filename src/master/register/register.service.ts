import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';

@Injectable()
export class RegisterService {
private readonly logger = new Logger(RegisterService.name);
private readonly moduleName = 'UserAuth';
  create(body: CreateRegisterDto) {
    try {
      
    } catch (error) {
      const errorMessage = typeof error === 'object' ? error.message : error;
      const logMessage = `Failed create data cause by: ${errorMessage}`;
      this.logger.error(error);
      if (error instanceof HttpException) {
        this.logger.error(logMessage);
        throw error;
      }
      throw new InternalServerErrorException('Failed create data', logMessage);
    }
  }

  findAll() {
    try {
      
    } catch (error) {
      const errorMessage = typeof error === 'object' ? error.message : error;
      const logMessage = `Failed get data cause by: ${errorMessage}`;
      this.logger.error(error);
      if (error instanceof HttpException) {
        this.logger.error(logMessage);
        throw error;
      }
      throw new InternalServerErrorException('Failed get data', logMessage);
    }
  }

  findOne(id: number) {
    try {
      
    } catch (error) {
      const errorMessage = typeof error === 'object' ? error.message : error;
      const logMessage = `Failed get data cause by: ${errorMessage}`;
      this.logger.error(error);
      if (error instanceof HttpException) {
        this.logger.error(logMessage);
        throw error;
      }
      throw new InternalServerErrorException('Failed get data', logMessage);
    }
  }

  update(id: number, updateRegisterDto: UpdateRegisterDto) {
    try {
      
    } catch (error) {
      const errorMessage = typeof error === 'object' ? error.message : error;
      const logMessage = `Failed update data cause by: ${errorMessage}`;
      this.logger.error(error);
      if (error instanceof HttpException) {
        this.logger.error(logMessage);
        throw error;
      }
      throw new InternalServerErrorException('Failed update data', logMessage);  
    }
  }

  remove(id: number) {
    try {
      
    } catch (error) {
      const errorMessage = typeof error === 'object' ? error.message : error;
      const logMessage = `Failed delete data cause by: ${errorMessage}`;
      this.logger.error(error);
      if (error instanceof HttpException) {
        this.logger.error(logMessage);
        throw error;
      }
      throw new InternalServerErrorException('Failed delete data', logMessage); 
    }
  }
}
