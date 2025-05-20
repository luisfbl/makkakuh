export interface User {
  id?: string;
  username: string;
  email?: string;
  name?: string;
  pictureUrl?: string;
  provider: string;
  bio?: string;
}