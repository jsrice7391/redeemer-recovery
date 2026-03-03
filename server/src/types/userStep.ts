export interface UserStep {
  id: number;
  userId: number;
  stepNumber: number;
  startedAt: Date;
  note?: string | null;
}

export interface UpsertUserStepDto {
  stepNumber: number;
  note?: string;
}
