import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router: Router) {
  }

  routeHome() {
    this.router.navigateByUrl("/")
  }

  routeMedium() {
    window.location.href = "https://medium.com/@neospcc";
  }

  routeToToS() {
    this.router.navigateByUrl("/tos")
  }
}
