import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface Facilitator {
  id: number;
  name: string;
  role: string;
  phone?: string | null;
  email?: string | null;
  availability?: string | null;
}

export interface GroupEntry {
  id: number;
  name: string;
  location: string;
  city: string;
  state: string;
  meetingDay: string;
  meetingTime: string;
  focusArea: string;
  description: string;
  facilitatorName: string;
  address: string;
  facilitatorId?: number | null;
  facilitator?: Facilitator | null;
}

export interface UserGroupEntry {
  id: number;
  userId: number;
  groupId: number;
  isPrimary: boolean;
  joinedAt: string;
  group: GroupEntry;
}

export interface UserStep {
  id: number;
  userId: number;
  stepNumber: number;
  startedAt: string;
  note?: string | null;
}

export interface ScheduleItem {
  groupId: number;
  groupName: string;
  location: string;
  meetingDay: string;
  meetingTime: string;
  nextDate: string;
}

export const dashboardApi = {
  getUserGroups: async (userId: number): Promise<UserGroupEntry[]> => {
    const res = await api.get<UserGroupEntry[]>(`/users/${userId}/groups`);
    return res.data;
  },

  getUserStep: async (userId: number): Promise<UserStep | null> => {
    const res = await api.get<UserStep | null>(`/users/${userId}/step`);
    return res.data;
  },

  upsertUserStep: async (userId: number, data: { stepNumber: number; note?: string }): Promise<UserStep> => {
    const res = await api.put<UserStep>(`/users/${userId}/step`, data);
    return res.data;
  },

  getUserSchedule: async (userId: number): Promise<ScheduleItem[]> => {
    const res = await api.get<ScheduleItem[]>(`/users/${userId}/schedule`);
    return res.data;
  },

  getUserContact: async (userId: number): Promise<Facilitator | null> => {
    const res = await api.get<Facilitator | null>(`/users/${userId}/contact`);
    return res.data;
  },

  joinGroup: async (userId: number, groupId: number, isPrimary = false): Promise<UserGroupEntry> => {
    const res = await api.post<UserGroupEntry>(`/users/${userId}/groups/${groupId}`, { isPrimary });
    return res.data;
  },

  leaveGroup: async (userId: number, groupId: number): Promise<void> => {
    await api.delete(`/users/${userId}/groups/${groupId}`);
  },
};
