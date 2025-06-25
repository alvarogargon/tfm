export interface IProfileGoal {
  goal_id: number;
  profile_id: number;
  name: string;
  goal_type: string | null;
  description: string | null;
  target_hours_weekly: number | null;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  progress: number;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}