import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';

@Component({
  selector: 'app-error-page-404',
  templateUrl: './error-page-404.component.html',
  styleUrls: ['./error-page-404.component.css'],
})
export class ErrorPageComponent404 implements OnInit {
  errorMessage: string;
  errorDetails: string;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.data
      .subscribe(
        (data: Data) => {
          this.errorMessage = data['message'];
          this.errorDetails = data['details'];
        },
      );
  }
}
