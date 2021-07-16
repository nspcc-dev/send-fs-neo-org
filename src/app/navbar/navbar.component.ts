import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navbarOpen = false;
  constructor(public router: Router, private cookieService: CookieService) { }
  cookieValue = '';
  ngOnInit() {
    this.cookieValue = this.cookieService.get('Bearer');
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  onClick() {
    this.navbarOpen = false;
  }

  logout() {
    this.cookieService.delete('Email');
    this.cookieService.delete('X-Attribute-Email');
    this.cookieService.delete('Bearer');
    window.location.reload();
  }

}
