import {UserModel, CatalogueModel, AddressModel} from '@models/core';

export interface ProfessionalModel {
  id?: number;
  user?: UserModel;
  sex?: CatalogueModel;
  gender?: CatalogueModel;
  nationality?: CatalogueModel;
  addresses?: AddressModel[];
  traveled?: boolean;
  disabled?: boolean;
  familiarDisabled?: boolean;
  identificationFamiliarDisabled?: string;
  catastrophicDiseased?: boolean;
  familiarCatastrophicDiseased?: boolean;
  aboutMe?: string;
}
