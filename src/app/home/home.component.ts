import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isHovering : boolean = false;
  
  hoverStart(){
    this.isHovering = true;
  }

  hoverEnd(){
    this.isHovering = false;
  }
}
