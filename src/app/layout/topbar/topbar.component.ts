import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {MenuHttpService} from '@services/core/menu-http.service';
import {AuthHttpService, MessageService} from "@services/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  itemsRight: MenuItem[] = [];
  itemsLeft: MenuItem[] = [];

  constructor(private menuHttpService: MenuHttpService,
              private authHttpService: AuthHttpService, private messageService: MessageService,
              private router: Router) {
    this.itemsRight = [{
      label: 'Cesar Tamayo',
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
  }

  ngOnInit(): void {
    this.getMenus();
  }

  getMenus() {
    this.menuHttpService.getMenus().subscribe(
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
