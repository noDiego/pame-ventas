import { PostgresClient } from '../database/postgresql';
import { UserModel } from '../database/models/user.model';
import { Result } from '../interfaces/result.interface';
import { AuthResponse, UserDto } from '../interfaces/user.dto';
import { convertUserToDTO } from '../database/conversors/user.conversor';
import { comparePassword, hashPassword } from '../utils/utils';
import * as jwt from 'jsonwebtoken';
import { CONFIG } from '../config';

class UserService {
  private productosDB: PostgresClient = new PostgresClient();

  async login(email: string, enteredPassword: string): Promise<Result<AuthResponse>> {

    const userData: UserModel = await this.productosDB.getUser(email);
    if(!userData){
      return {
        code: 400, success: false, message: 'Usuario no existe'
      }
    }

    const validPassword = await comparePassword(enteredPassword, userData.password);
    if(!validPassword){
      return {
        code: 401, success: false, message: 'Contraseña incorrecta'
      }
    }

    // Generar token JWT
    const token = jwt.sign({ userId: userData.id, email: userData.email }, CONFIG.secretKey, {
      expiresIn: '24h'
    });

    return {
      code: 0, success: true, message: 'OK',
      data: { user: convertUserToDTO(userData), token: token }
    };
  }

  async register(user: UserDto): Promise<Result<AuthResponse>> {

    let userData: UserModel = await this.productosDB.getUser(user.email);
    if(userData || !user.password){
      return {
        code: 500, success: false, message: 'Usuario ya registrado'
      }
    }

    const hashedPass = await hashPassword(user.password);

    const id = await this.productosDB.registerUser(user, hashedPass);
    userData = await this.productosDB.getUser(user.email);

    // Generar token JWT
    const token = jwt.sign({ userId: id, email: user.email }, CONFIG.secretKey, {
      expiresIn: '24h'
    });

    return {
      code: 0, success: true, message: 'OK',
      data: {user: convertUserToDTO(userData), token: token}
    };
  }

}

export default UserService;
