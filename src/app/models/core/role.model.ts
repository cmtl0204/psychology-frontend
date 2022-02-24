import {PermissionModel} from './permission.model';

export interface RoleModel {
  id?: number;
  code?: string;
  name?: string;
  permissions?: PermissionModel[];
}
