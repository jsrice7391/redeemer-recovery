export interface Group {
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
  facilitatorId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGroupDto {
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
  facilitatorId?: number;
}

export interface UpdateGroupDto {
  name?: string;
  location?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  meetingDay?: string;
  meetingTime?: string;
  focusArea?: string;
  description?: string;
  facilitatorName?: string;
  address?: string;
  facilitatorId?: number | null;
}

export interface GroupSearchParams {
  searchTerm?: string;
  focusArea?: string;
  meetingDay?: string;
}
