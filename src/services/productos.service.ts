import { PostgresClient } from '../database/postgresql';
import { ProductDto } from '../interfaces/product.dto';
import { convertProductToDTO } from '../database/conversors/product.conversor';
import { ProductModel } from '../database/models/product.model';
import path from 'path';
import fs from 'fs';
import { CONFIG } from '../config';
import { logger } from '../utils/logger';
import { Result } from '../interfaces/result.interface';

class ProductosService {
  private productosDB: PostgresClient = new PostgresClient();

  async getAllProducts(): Promise<ProductDto[]> {

    //Se obtienen los productos desde la BD
    const products: ProductModel[] = await this.productosDB.getAllProducts();

    //Se inicializa lista de productos DTO vacia
    const listProducts: ProductDto[] = [];

    //Se hace la conversion de Productos Model (DB) hacia DTO
    for (const p of products) {
      const productDto: ProductDto = convertProductToDTO(p);
      productDto.images = await this.getProductImages(p.id);
      listProducts.push(productDto);
    }

    return listProducts;
  }

  async addProduct(product: ProductDto): Promise<Result<any>> {
    const idProduct = await this.productosDB.createProduct(product);
    return {code: 0, success: true, message: 'Producto creado correctamente', data: { id: idProduct }};
  }

  async disableProduct(product: ProductDto): Promise<void> {

    //TODO

    return;
  }

  async uploadImg(productId: number, file: any): Promise<Result<any>> {
    const imageFolder = path.join(CONFIG.imagesFolder, String(productId));
    const filePath = path.join(imageFolder, file.originalname);

    try {

      if(!fs.existsSync(imageFolder)){
        await fs.promises.mkdir(imageFolder, { recursive: true });
      }

      if (fs.existsSync(filePath)) {
        logger.info(`El archivo ${file.originalname} ya ha sido subido previamente a ${imageFolder}`);
        return { code: 1, success: false, message: `El archivo ${file.originalname} ya ha sido subido previamente.` };
      }

      fs.writeFileSync(filePath, file.buffer);

      logger.info(`Archivo ${file.originalname} subido correctamente a ${imageFolder}`);
      return { code: 0, success: true, message: `Archivo ${file.originalname} subido correctamente.`, data: { filePath: filePath } };
    } catch (error: any) {
      logger.error(`Error al subir el archivo ${file.originalname} a ${imageFolder}:`, error);
      return { code: 100, success: true, message: `Error al subir el archivo ${file.originalname} a ${imageFolder}: ${error.message}` };
    }
  }

  async getProductImages(productId: number): Promise<string[]> {
    const imageFolder = path.join(CONFIG.imagesFolder, String(productId));
    try {
      if (fs.existsSync(imageFolder)) {
        const files = fs.readdirSync(imageFolder);
        const imagePaths: string[] = [];
        files.forEach(file => {
          imagePaths.push(file);
        });
        return imagePaths;
      } else {
        return [];
      }
    } catch (error: any) {
      logger.error(`Error al leer los archivos de imagen para el producto ${productId}:`, error);
      return [];
    }
  }

}

export default ProductosService;
