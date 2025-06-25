export interface IGuideUser {
  guide_user_id: number;
  guide_id: number;
  user_id: number;
  created_at: string;
  user?: {
    user_id: number;
    username: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'guide';
  };
}