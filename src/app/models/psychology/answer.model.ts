import {PatientModel} from '@models/psychology/patient.model';

export interface AnswerModel {
  id?: number;
  value?: string;
  type?: string;
  class?: string;
  icon?: string;
}
