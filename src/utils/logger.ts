import { CONFIG } from '../config';
import * as path from 'path';
import  *  as  winston  from  'winston';
import  'winston-daily-rotate-file';
import { createLogger } from 'winston';

const rootDir = path.resolve(__dirname, '../../');

const logger = createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      )
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(rootDir , 'logs', `${CONFIG.appName}-%DATE%.log`),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      )
    }),
  ],
});

export { logger };
