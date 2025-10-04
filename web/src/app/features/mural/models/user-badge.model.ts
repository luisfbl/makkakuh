import { Badge } from './badge.model';
import { User } from '../../../core/auth/models/user.model';

export interface UserBadge {
  id: number;
  user?: User;
  badge: Badge;
  awardedAt: string;
  notes?: string;
}
