export interface ProductModel {
  id: number;
  name: string;
  type?: string | null;
  image_url?: string | null;
  price: number;
  description?: string | null;
  quantity_available?: number | null;
  created_at?: Date;
  updated_at?: Date;
  enabled?: boolean;
}
