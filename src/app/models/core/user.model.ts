import {CatalogueModel} from './catalogue.model';

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
  avatar?: string;
  birthdate?: string;
  email?: string;
  lastname?: string;
  name?: string;
  phone?: string;
  username?: string;
}
