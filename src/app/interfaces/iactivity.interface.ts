export interface IActivity {
  activity_id: number;
  routine_id: number;
  category_id: number | null;
  title: string;
  description: string;
  day_of_week: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  datetime_start: string;
  datetime_end: string;
  created_at: string;
  updated_at: string;
  icon: string | null;
}