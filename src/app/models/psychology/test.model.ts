import {LocationModel, StateModel, UserModel} from '@models/core';
import {AgentModel, AssignmentModel, PriorityModel, ResultModel} from '@models/psychology';

export interface TestModel {
  id?: number;
  agent?: AgentModel;
  assignment?: AssignmentModel;
  canton?: LocationModel;
  priority?: PriorityModel;
  province?: LocationModel;
  results?: ResultModel[];
  state?: StateModel;
  user?: UserModel;
  age?: number;
  createdAt?: Date;
  code?: string;
  score?: number;
  termsConditions?: boolean;
  type?: string;
  observations?: string[];
}
