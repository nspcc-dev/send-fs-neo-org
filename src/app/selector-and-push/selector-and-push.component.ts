import { Component } from '@angular/core';

export interface Lifetime {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'select-and-push',
  templateUrl: './selector-and-push.component.html',
  styleUrls: ['./selector-and-push.component.css']
})
export class SelectorAndPushComponent {
  lifetimes: Lifetime[] = [
    {value: '12h', viewValue: '12 hours'},
    {value: '24h', viewValue: '1 day'},
    {value: '2d', viewValue: '2 days'}
  ];
}
