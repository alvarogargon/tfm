export interface IProfileInterest {
  interest_id: number;
  profile_id: number;
  interest_name: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}