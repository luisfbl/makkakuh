import { BadgeType } from './badge-type.model';

export interface Badge {
  id: number;
  name: string;
  description?: string;
  iconFilename?: string;
  color?: string;
  displayOrder?: number;
  badgeType: BadgeType;
}
