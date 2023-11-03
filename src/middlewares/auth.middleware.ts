import { NextFunction, Response } from 'express';
import { CONFIG } from '../config';
import * as jwt from 'jsonwebtoken';
import { PostgresClient } from '../database/postgresql';
import { UserModel } from '../database/models/user.model';
import { convertUserToDTO } from '../database/conversors/user.conversor';

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {

  let token = null;
  let productosDB: PostgresClient;

  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer '))
    token = authHeader.substring(7);
  else
    return res.status(401).send({message: 'Authentication token missing'});

  try {
    const decodedToken = jwt.verify(token, CONFIG.secretKey) as { userId: string, email: string };

    productosDB = new PostgresClient();
    const user: UserModel = await productosDB.getUser(decodedToken.email);

    req.user = convertUserToDTO(user);
    req.user.id = user.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};

export default authMiddleware;
