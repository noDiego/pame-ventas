import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import UserController from '../controllers/user.controller';

class UserRoute implements Route {
  public path = '/auth';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.userController.login);
    this.router.post(`${this.path}/signup`, this.userController.signup);
  }
}

export default UserRoute;
