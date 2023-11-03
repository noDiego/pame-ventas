import { UserModel } from '../models/user.model';
import { UserDto } from '../../interfaces/user.dto';

export function convertUserToDTO(user: UserModel): UserDto{
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number || '0',
    user_type: user.user_type || 'USER'
  }
}
