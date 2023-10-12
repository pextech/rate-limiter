import { NextFunction, Request, Response } from 'express';
import { environment } from '../../../config';
import {
  ApiError,
  BadRequestError,
  InternalError,
  NotFoundError,
} from '../../../core/ApiError';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    console.log('error', err)
    // ApiError.handle(err, res);
  } else {
    if (environment === 'development') {
      console.log('err', err);
      // Logger.error(err);
    }

    if (err.name === 'CastError') {
      return ApiError.handle(new NotFoundError('resource not found'), res);
    }

    if ((err as any).code === 11000) {
      let field = err.message.split('index:')[1];
      field = field.split(' dup key')[0];
      field = field.substring(0, field.lastIndexOf('_')); // returns field
      field = field.trim();
      const message = `${field} already exists`;
      return ApiError.handle(new BadRequestError(message), res);
    }

    if (err.name === 'ValidationError') {
      const message = Object.values((err as any).errors)
        .map((val: any): string => val.message)
        .join(', ');
      return ApiError.handle(new BadRequestError(message), res);
    }

    if (environment === 'development') {
      return res.status(500).send(err.message);
    }

    ApiError.handle(new InternalError(err.message), res);
  }
};

export default errorHandler;
