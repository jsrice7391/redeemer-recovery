import { Facilitator } from './facilitator';

export interface UserGroupEntry {
  id: number;
  userId: number;
  groupId: number;
  isPrimary: boolean;
  joinedAt: Date;
  group: {
    id: number;
    name: string;
    location: string;
    city: string;
    state: string;
    zipCode: string;
    meetingDay: string;
    meetingTime: string;
    focusArea: string;
    description: string;
    facilitatorName: string;
    address: string;
    facilitatorId: number | null;
    facilitator: Facilitator | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface UserScheduleItem {
  groupId: number;
  groupName: string;
  location: string;
  meetingDay: string;
  meetingTime: string;
  nextDate: string;
}
