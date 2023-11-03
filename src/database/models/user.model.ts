export interface UserModel {
  id: number;
  first_name: string;
  last_name: string;
  user_type?: 'USER' | 'ADMIN';
  phone_number?: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  enabled: boolean;
}
