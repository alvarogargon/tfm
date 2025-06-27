export interface ICategory {
  category_id: number;
  user_id: number | null;
  name: string;
  color: string | null;
  icon: string | null;
  description: string | null;
  created_at: string;
}