
export interface Admin {
  id: number;
  email: string;
  password_hash: string;
  message?: string;
  created_at: Date;
  updated_at?: Date;
}