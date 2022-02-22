import {PatientModel} from '@models/psychology/patient.model';
import {ResultModel} from '@models/psychology/result.model';

export interface ChatModel {
  id?: number;
  patient?: PatientModel;
  agent?: PatientModel;
  results?: ResultModel[];
  type?: string;
}
