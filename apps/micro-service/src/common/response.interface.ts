export interface ServiceResponse<T = any> {
  success: boolean;
  message: string;
  method?: string;
  endpoint?: string;
  timestamp: string;
  statusCode: number;
  data?: T;
}
