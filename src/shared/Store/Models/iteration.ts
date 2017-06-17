import { Assignment } from './assignment';
export interface Iteration {
  name: string;
  start_date: string;
  deadline: string;
  assignment_id: number;
  pa_form_id?: number;
  timespan?: number;
  isDeadSpace?: boolean;
  assignment?: Assignment;
}
