import App from './app';

import 'dotenv/config';
import ProductosRoute from './routes/productos.route';
import UserRoute from './routes/user.route';

const app = new App([
  new ProductosRoute(),
  new UserRoute(),
]);

app.listen();
