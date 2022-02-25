import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {UserAdministrationHttpService} from '@services/core/user-administration-http.service';
import {MessageService} from '@services/core/message.service';
import {ColModel, PaginatorModel, UserModel} from '@models/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-user-administration-list',
  templateUrl: './user-administration-list.component.html',
  styleUrls: ['./user-administration-list.component.scss']
})
export class UserAdministrationListComponent implements OnInit {
  users$ = this.userAdministrationHttpService.users$;
  user$ = this.userAdministrationHttpService.user$;
  loaded$ = this.userAdministrationHttpService.loaded$;
  paginator$ = this.userAdministrationHttpService.paginator$;

  selectedUsers: UserModel[] = [];
  selectedUser: UserModel = {};
  cols: ColModel[];
  items: MenuItem[] = []; // optional
  dialogForm: boolean = false; // optional
  progressBarDelete: boolean = false;
  search: FormControl = new FormControl('');
  paginator: PaginatorModel = {};

  constructor(private userAdministrationHttpService: UserAdministrationHttpService,
              public messageService: MessageService) {
    this.cols = [
      {field: 'username', header: 'Número de documento'},
      {field: 'name', header: 'Nombres'},
      {field: 'lastname', header: 'Apellidos'},
      {field: 'email', header: 'Correo'},
      {field: 'roles', header: 'Rol'},
      // {field: 'updatedAt', header: 'Última actualización'},
    ];
    this.items = [
      // {
      //   label: 'Cambiar Contraseña', icon: 'pi pi-key', command: () => {
      //     this.changePassword();
      //   }
      // },
      {
        label: 'Suspender', icon: 'pi pi-ban', command: () => {
          this.suspendUser(this.selectedUser);
        }
      },
      {
        label: 'Reactivar', icon: 'pi pi-sync', command: () => {
          this.reactiveUser(this.selectedUser);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteUser(this.selectedUser);
        }
      },
      // {
      //   label: 'Cambiar Roles', icon: 'pi pi-id-card', command: () => {
      //     this.changePassword();
      //   }
      // },
      // {
      //   label: 'Cambiar Permisos', icon: 'pi pi-sitemap', command: () => {
      //     this.changePassword();
      //   }
      // }
    ];

    this.paginator$.subscribe(response => {
      this.paginator = response;
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = 1) {
    this.users$ = this.userAdministrationHttpService.getUsers(page, this.search.value);
  }

  // optional
  showForm(user: UserModel = {}) {
    this.selectedUser = user;
    this.userAdministrationHttpService.selectUser(user);
    this.dialogForm = true;
  }

  selectUser(user: UserModel) {
    this.selectedUser = user;
  }

  deleteUser(user: UserModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.userAdministrationHttpService.deleteUser(user.id!).subscribe(
            response => {
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          );
        }
      });
  }

  suspendUser(user: UserModel): void {
    this.messageService.suspendUser({})
      .then((result) => {
        if (result.isConfirmed) {
          this.userAdministrationHttpService.suspendUser(user.id!).subscribe(
            response => {
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          );
        }
      });
  }

  reactiveUser(user: UserModel): void {
    this.userAdministrationHttpService.reactiveUser(user.id!).subscribe(
      response => {
        this.messageService.success(response);
      },
      error => {
        this.messageService.error(error);
      }
    );
  }

  deleteUsers(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          const ids = this.selectedUsers.map(element => element.id);
          this.userAdministrationHttpService.deleteUsers(ids).subscribe(
            response => {
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          );
        }
      });

  }

  changePassword() {

  }

  filter(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadUsers();
    }
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadUsers(this.paginator.current_page);
  }
}
