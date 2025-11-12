import {ArgumentsHost, Catch, HttpStatus} from '@nestjs/common';
import {BaseExceptionFilter} from '@nestjs/core';
import {Prisma} from '@prisma/client';
import {Response} from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let status, message, messageArray;

        switch (exception.code) {
            case 'P2002':
            case 'P2003':
                status = HttpStatus.BAD_REQUEST;
                messageArray = exception.message.replace(/\n/g, '').split(';');
                message = messageArray[messageArray.length - 1].trim();
                response.status(status).json({
                    statusCode: status,
                    message: message,
                });
                break;
            case 'P2025':
                status = HttpStatus.NOT_FOUND;
                response.status(status).json({
                    statusCode: status,
                    message: "Record to delete does not exist",
                });
                break;
            default:
                // default 500 error code
                // super.catch(exception, host);
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                messageArray = exception.message.replace(/\n/g, '').split(';');
                message = exception.code + ": " + messageArray[messageArray.length - 1].trim();
                response.status(status).json({
                    statusCode: status,
                    message: message,
                });
                break;
        }
    }
}

@Catch(Prisma.PrismaClientInitializationError)
export class PrismaClientInitializationError extends BaseExceptionFilter {
    catch(exception: Prisma.PrismaClientInitializationError, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status;
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
            statusCode: status,
            message: exception.message,
        });
    }
}

@Catch(Prisma.PrismaClientValidationError)
export class PrismaClientExceptionFilter2 extends BaseExceptionFilter {
    catch(exception: Prisma.PrismaClientValidationError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let status, message;

        status = HttpStatus.BAD_REQUEST;
        message = exception.message.replace(/\n/g, '');
        response.status(status).json({
            statusCode: status,
            message: message,
        });

    }
}