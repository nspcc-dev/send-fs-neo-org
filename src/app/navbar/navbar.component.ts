import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navbarOpen = false;
  constructor(private router: Router) { }

  ngOnInit() {
    
  }

  toggleNavbar() {
      this.navbarOpen = !this.navbarOpen;
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
