export interface IRoutine {
  routine_id: number;
  user_id: number;
  name: string;
  description: string | null;
  is_template: boolean;
  created_at: string;
  updated_at: string;
  start_time: string | null;
  end_time: string | null;
  daily_routine: 'Daily' | 'Weekly' | 'Monthly';
  activities: any[];
}