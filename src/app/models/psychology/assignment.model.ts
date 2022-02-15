import {InstitutionModel, ResultModel, TestModel} from '@models/psychology';

export interface AssignmentModel {
  id?: number;
  test?: TestModel;
  institution?: InstitutionModel;
  results?: ResultModel[];
}
