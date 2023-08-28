import { Component, Input } from '@angular/core';
import { Link, links } from '../links';

@Component({
   selector: 'app-header',
   templateUrl: './header.component.html',
   styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
   links: Link[] = links;

   isNavbarExpanded: boolean = false;

   toggleNavbar() {
      this.isNavbarExpanded = !this.isNavbarExpanded;
   }
}
