import { Honor } from './honor.model';

export interface UserHonor {
  id?: string;
  userId: string;
  honorId: string;
  honor?: Honor;
}
