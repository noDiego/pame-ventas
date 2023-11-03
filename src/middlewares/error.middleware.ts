import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/http.exception';
import { logger } from '../utils/logger';

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    return res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
