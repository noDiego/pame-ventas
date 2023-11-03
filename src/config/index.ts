require('dotenv').config();

export const CONFIG = {
  appName: 'pameVentas',
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 30001 ,
  secretKey: <string>process.env.SECRET_KEY,
  imagesFolder: './',
  database:{
    user: process.env.PSQL_USER,
    pass: process.env.PSQL_PASS,
    host: process.env.PSQL_HOST,
    dbName: process.env.PSQL_DB
  }
}
