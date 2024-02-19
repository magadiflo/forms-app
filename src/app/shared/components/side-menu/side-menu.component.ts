import { Component } from '@angular/core';

interface MenuItem {
  title: string;
  route: string;
}

@Component({
  selector: 'shared-side-menu',
  templateUrl: './side-menu.component.html',
  styles: [
  ]
})
export class SideMenuComponent {

  public reactiveMenu: MenuItem[] = [
    { title: 'Básicos', route: './reactive/basic', },
    { title: 'Dinámicos', route: './reactive/dynamic', },
    { title: 'Switches', route: './reactive/switches', },
  ];
  public authMenu: MenuItem[] = [
    { title: 'Registro', route: './auth/register', },
    { title: 'Inscripción', route: './auth/inscription', },
  ];
  public countriesMenu: MenuItem[] = [
    { title: 'Selectores', route: './countries/selector', },
  ];

}
