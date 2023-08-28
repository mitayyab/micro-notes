import { Component, Input } from '@angular/core';
import { Link, links } from '../links';

@Component({
   selector: 'app-footer',
   templateUrl: './footer.component.html',
   styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
   links: Link[] = links;
}
