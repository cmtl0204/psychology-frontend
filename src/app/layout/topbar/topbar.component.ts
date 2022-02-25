import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {MenuHttpService} from '@services/core/menu-http.service';
import {AuthHttpService, AuthService, MessageService} from "@services/core";
import {Router} from "@angular/router";
import {RoleModel} from '@models/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  itemsRight: MenuItem[] = [];
  itemsLeft: MenuItem[] = [];
  role: RoleModel = {};

  constructor(private menuHttpService: MenuHttpService,
              private authHttpService: AuthHttpService,
              private messageService: MessageService,
              private authService: AuthService,
              private router: Router) {
    this.itemsRight = [{
      label: `${authService.user.name} ${authService.user.lastname}`,
      items: [
        {
          label: 'Cerrar Sesión',
          icon: 'pi pi-power-off',
          command: () => {
            this.logout();
          }
        }
      ]
    }
    ];
    this.role = authService.role;
  }

  ngOnInit(): void {
    this.getMenus();
  }

  getMenus() {
    this.menuHttpService.getMenus(this.authService.role).subscribe(
      response => {
        console.log(response);
        this.itemsLeft = response.data;
      }, error => {
        console.log(error);
      }
    )
  }

  logout() {
    this.messageService.showLoading();
    this.authHttpService.logout().subscribe(response => {
      this.messageService.success(response);
      this.messageService.hideLoading();
      this.router.navigate(['/authentication/login'])
    }, error => {
      this.messageService.hideLoading();
      this.messageService.error(error);
      this.router.navigate(['/authentication/login'])
    });
  }
}
