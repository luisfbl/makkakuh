export interface User {
  id?: number;
  username: string;
  password?: string;
  email?: string;
  fullName?: string;
  active: boolean;
}