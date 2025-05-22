import { User } from '../../../core/auth/models/user.model';
import { UserDetail } from './user-detail.model';
import { UserHonor } from './user-honor.model';

export interface MemberProfile {
  user: User;
  userDetail: UserDetail;
  honors: UserHonor[];
}
