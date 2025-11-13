import { HttpException, HttpStatus } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { AxiosError } from 'axios';

export function ResponseError(message: string, status: HttpStatus) {
  throw new HttpException(
    {
      statusCode: status,
      message,
    },
    status,
  ).getResponse();
}

export function messageError(error) {
  let errorMessage: unknown = '';
  if (error instanceof AxiosError) {
    if (error.response) {
      errorMessage = error.response.data?.message ?? error.response.data;
    } else if (error.cause) {
      errorMessage = error.cause;
    }
  } else if (error instanceof PrismaClientKnownRequestError) {
    if (error.message) {
      errorMessage = error.message;
    } else if (error.cause) {
      errorMessage = error.cause;
    }
  } else if (error instanceof PrismaClientUnknownRequestError) {
    if (error.message) {
      errorMessage = error.message;
    } else if (error.cause) {
      errorMessage = error.cause;
    }
  } else if (error instanceof PrismaClientValidationError) {
    if (error.message) {
      errorMessage = error.message;
    } else if (error.cause) {
      errorMessage = error.cause;
    }
  } else if (typeof error === 'object') {
    if (error?.message) {
      errorMessage = error.message;
    }
  } else {
    errorMessage = error;
  }

  return errorMessage;
}
