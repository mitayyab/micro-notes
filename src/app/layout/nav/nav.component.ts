import { Component, Input } from '@angular/core';
import { Link } from '../links';

@Component({
   selector: 'app-nav',
   templateUrl: './nav.component.html',
   styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
   @Input() links: Link[] = [];
}
