import {PatientModel} from '@models/psychology/patient.model';
import {ResultModel} from '@models/psychology/result.model';

export interface TestModel {
  id?: number;
  patient?: PatientModel;
  agent?: PatientModel;
  results?: ResultModel[];
}
