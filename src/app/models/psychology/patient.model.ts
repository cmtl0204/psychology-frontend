import {LocationModel} from '@models/core';

export interface PatientModel {
  id?: number;
  name?: string;
  lastname?: string;
  phone?: string;
  email?: string;
  age?: string;
  province?: LocationModel;
  canton?: LocationModel;
}
