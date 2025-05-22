export interface User {
  id?: string;
  username: string;
  email?: string;
  name?: string;
  pictureUrl?: string;
  avatarFilename?: string;
  provider: string;
  bio?: string;
  nickname?: string;
}