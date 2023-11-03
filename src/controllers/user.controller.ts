import { RequestHandler } from 'express';
import UserService from '../services/user.service';
import { AuthResponse, UserDto } from '../interfaces/user.dto';
import { Result } from '../interfaces/result.interface';

class UserController {

  private userService = new UserService();

  public login: RequestHandler = async (req, res, next) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      let result: Result<AuthResponse> = await this.userService.login(email, password);
      return res.status(result.success? 200: 401).send(result);
    } catch (error) {
      next(error);
    }
  };

  public signup: RequestHandler = async (req, res, next) => {
    try {
      const user: UserDto = req.body;
      let result: Result<AuthResponse> = await this.userService.register(user);
      return res.status(result.success? 201: 400).send(result);
    } catch (error) {
      next(error);
    }
  };

}

export default UserController;
