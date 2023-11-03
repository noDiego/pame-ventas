export interface Result<T> {
  code: number;
  success: boolean;
  message: string;
  data?: T;
}
