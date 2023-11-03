import { RequestHandler } from 'express';
import { Result } from '../interfaces/result.interface';
import { ProductDto } from '../interfaces/product.dto';
import ProductosService from '../services/productos.service';
import { UserDto } from '../interfaces/user.dto';

class ProductosController {

  private productService: ProductosService = new ProductosService();

  public getAllProducts: RequestHandler = async (req, res, next) => {
    try {
      const products = await this.productService.getAllProducts();
      const result: Result<ProductDto[]> = {data: products, success: true, message: 'OK', code: 0};
      return res.send(result);
    } catch (error) {
      next(error);
    }
  };

  public disableProduct: RequestHandler = async (req, res, next) => {
    try {
      let r;
      return res.send(r);
    } catch (error) {
      next(error);
    }
  };

  public addProduct: RequestHandler = async (req: any, res, next) => {
    try {
      const user: UserDto = req.user;
      if(user.user_type != "ADMIN"){
        return res.status(401).send('ACCESS_DENIED');
      }

      const product: ProductDto = req.body;
      let result = await this.productService.addProduct(product);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };

  public addImage: RequestHandler = async (req: any, res, next) => {
    try {
      const imageUrl = req.file?.path;
      const user: UserDto = req.user;
      const productId = req.params.id;
      let fileBuffer;
      let fileName;

      if (req.file) {
        // Si req.file está presente, usa el buffer del archivo adjunto.
        fileBuffer = req.file.buffer;
        fileName = req.file.originalname;
      } else if (req.body && req.body.mediate && req.body.mediate.file && req.body.mediate.file.$) {
        // Si req.file no está presente, intenta extraer el archivo del cuerpo de la solicitud.
        const base64File = req.body.mediate.file.$;
        fileBuffer = Buffer.from(base64File, 'base64');
        fileName = req.body.mediate.file['@filename'];
      } else {
        throw new Error('No se ha enviado ningún archivo');
      }

      let r = await this.productService.uploadImg(productId, {
        buffer: fileBuffer,
        originalname: fileName,
      });
      return res.send(r);
    } catch (error) {
      next(error);
    }
  };

}

export default ProductosController;
