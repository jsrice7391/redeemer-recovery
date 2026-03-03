export interface Facilitator {
  id: number;
  name: string;
  role: string;
  phone?: string | null;
  email?: string | null;
  availability?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFacilitatorDto {
  name: string;
  role?: string;
  phone?: string;
  email?: string;
  availability?: string;
}

export interface UpdateFacilitatorDto {
  name?: string;
  role?: string;
  phone?: string;
  email?: string;
  availability?: string;
}
