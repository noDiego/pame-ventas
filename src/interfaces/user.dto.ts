export interface UserDto {
  id?: number;
  first_name: string;
  last_name: string;
  user_type?: 'USER' | 'ADMIN';
  phone_number: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: UserDto,
  token: string
}
