import { ProductModel } from '../models/product.model';
import { ProductDto } from '../../interfaces/product.dto';

export function convertProductToDTO(product: ProductModel): ProductDto{
  return {
    id: product.id,
    name: product.name || '<Sin Nombre>',
    type: product.type || 'default',
    image_url: product.image_url || '',
    price: product.price || 0,
    description: product.description || '',
    quantity_available: product.quantity_available || 0,
    enabled: product.enabled || false,
    images: []
  }
}
