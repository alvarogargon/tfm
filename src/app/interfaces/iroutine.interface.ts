import { IActivity } from './iactivity.interface';

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
  activities: IActivity[];
  from_template?: boolean; // Campo opcional para marcar rutinas creadas desde plantillas
}

export interface IRoutinePayload {
  user_id?: number;
  name: string;
  description?: string | null;
  is_template?: boolean;
  start_time?: string | null;
  end_time?: string | null;
  daily_routine?: 'Daily' | 'Weekly' | 'Monthly';
}

export interface IReceivedRoutine {
  share_id: number;
  routine_id: number;
  template_name: string;
  template_description: string;
  shared_at: string;
  shared_by: {
    first_name: string;
    last_name: string;
    username: string;
  };
  new_routine: {
    routine_id: number;
    name: string;
  };
}