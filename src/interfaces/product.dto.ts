export interface ProductDto{
  id: number;
  name: string;
  type?: string;
  image_url?: string;
  price: number;
  description: string;
  quantity_available?: number;
  enabled?: boolean;
  images: string[];
}
