import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  c_email = '';
  c_email_hash = '';
  c_bearer = '';
 
  constructor( private cookieService: CookieService ) { }
 
  ngOnInit(): void {
    this.c_email = this.cookieService.get('Email');
    this.c_email_hash = this.cookieService.get('X-Attribute-Email');
    this.c_bearer = this.cookieService.get('Bearer');
    
  }
}