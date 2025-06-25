export interface ICategory {
  categoryId: number;
  userId: number | null;
  name: string;
  color: string | null;
  icon: string | null;
  description: string | null;
  createdAt: string;
}