import {CatalogueModel, RoleModel} from '@models/core';

export interface UserModel {
  id?: number;
  identificationType?: CatalogueModel;
  sex?: CatalogueModel;
  gender?: CatalogueModel;
  ethnicOrigin?: CatalogueModel;
  bloodType?: CatalogueModel;
  civilStatus?: CatalogueModel;
  phones?: CatalogueModel[];
  emails?: CatalogueModel[];
  roles?: RoleModel[];
  avatar?: string;
  birthdate?: string;
  email?: string;
  lastname?: string;
  name?: string;
  phone?: string;
  suspended?: boolean;
  username?: string;
}
