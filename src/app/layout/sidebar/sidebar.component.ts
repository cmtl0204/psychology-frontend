import {Component, OnInit} from '@angular/core';
import {PanelMenuModule} from 'primeng/panelmenu';
import {MenuItem} from 'primeng/api';
import {MenuHttpService} from '@services/core/menu-http.service';
import {AuthService} from '@services/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  display = false;
  items: MenuItem[] = [];

  constructor(private menuHttpService: MenuHttpService, private authService: AuthService) {
  }

  ngOnInit(): void {
    // this.getMenus();
  }

  getMenus() {
    this.menuHttpService.getMenus(this.authService.role).subscribe(
      response => {
        this.items = response.data;
      }, error => {
        console.log(error);
      }
    )
  }

}
