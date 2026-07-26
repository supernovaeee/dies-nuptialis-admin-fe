
export interface FAQ {
  id: number;
  question: string;
  answer: string;
  archived: boolean;
  created_at: Date;
  updated_at?: Date;
}