import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import ProductosController from '../controllers/productos.controller';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

class ProductosRoute implements Route {
  public path = '/products';
  public router = Router();
  public productosController = new ProductosController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/getAll/`, this.productosController.getAllProducts);
    this.router.post(`${this.path}/`, authMiddleware, this.productosController.addProduct);
    this.router.post(`${this.path}/:id`, upload.single('file'), authMiddleware, this.productosController.addImage);
    this.router.delete(`${this.path}/:id`,  authMiddleware, this.productosController.disableProduct);

  }
}

export default ProductosRoute;
