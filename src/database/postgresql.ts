import { Client } from 'pg';
import { CONFIG } from '../config';
import { logger } from '../utils/logger';
import { ProductModel } from './models/product.model';
import { UserModel } from './models/user.model';
import { UserDto } from '../interfaces/user.dto';

const config = {
  user: CONFIG.database.user,
  password: CONFIG.database.pass,
  host: CONFIG.database.host,
  database: CONFIG.database.dbName,
  keepAlive: true
}

let dbClient: Client;

export async function startConnection() {
  try {
    dbClient = new Client(config);
    await dbClient.connect();
    logger.info('Conexion a PostgreSQL iniciada');
  }catch (err: any){
    logger.error('Error al conectar a PostgreSQL: ' + err.message);
  }
}

export class PostgresClient {

  private async query(query: string, values?: any[]){
    try {
      logger.debug(query + (values ? ' - values: ' + values : ''));
      const result = await dbClient.query(query, values);
      logger.debug(`Query ejecutada OK. ${result.rows? 'Results Length:'+result.rows.length:''}`);
      return result;
    }catch (e:any){
      logger.error('Error ejecutando query: '+e.message);
      throw e;
    }
  }

  async getAllProducts(): Promise<ProductModel[]> {
    const query = 'SELECT * FROM productos.products';
    const result = await this.query(query);
    return result.rows;
  }

  async getProductById(id: number): Promise<ProductModel> {
    const query = 'SELECT * FROM productos.products WHERE id = $1';
    const result = await this.query(query, [id]);
    return result.rows[0];
  }

  async createProduct(product: ProductModel) {
    const query = 'INSERT INTO productos.products(name, "type", image_url, price, description, quantity_available, enabled) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id';
    const values = [product.name, product.type, product.image_url, product.price, product.description, product.quantity_available, product.enabled];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async updateProduct(id: number, product: ProductModel) {
    const query = 'UPDATE productos.products SET name=$1, "type"=$2, image_url=$3, price=$4, description=$5, quantity_available=$6, enabled=$7, updated_at=CURRENT_TIMESTAMP WHERE id=$8 RETURNING id';
    const values = [product.name, product.type, product.image_url, product.price, product.description, product.quantity_available, product.enabled, id];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async disableProduct(id: number) {
    const query = 'UPDATE productos.products SET enabled = $1 WHERE id = $2 RETURNING id';
    const result = await this.query(query, [false, id]);
    return result.rows[0];
  }

  async deleteProduct(id: number) {
    const query = 'DELETE FROM productos.products WHERE id = $1 RETURNING id';
    const result = await this.query(query, [id]);
    return result.rows[0];
  }

  async getUser(email: string): Promise<UserModel>{
    const query = 'SELECT * FROM productos.users WHERE email = $1';
    const result = await this.query(query, [email]);
    return result.rows.length > 0 ? result.rows[0] : undefined;
  }

  async registerUser(user: UserDto, encryptedPass: string): Promise<UserModel>{
    const query = 'INSERT INTO productos.users(first_name, last_name, phone_number, email, password, user_type) VALUES($1,' +
      ' $2, $3, $4, $5, $6) RETURNING id';
    const values = [user.first_name, user.last_name, user.phone_number, user.email, encryptedPass, 'USER'];
    const result = await this.query(query, values);
    return result.rows[0];
  }

}
