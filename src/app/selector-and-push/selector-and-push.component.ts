import {Component, ViewEncapsulation} from '@angular/core';

export interface Lifetime {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'select-and-push',
  templateUrl: './selector-and-push.component.html',
  styleUrls: ['./selector-and-push.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectorAndPushComponent {
  lifetimes: Lifetime[] = [
    {value: '15', viewValue: '15 minutes'},
    {value: '60', viewValue: '1 hour'},
    {value: '180', viewValue: '3 hours'},
    {value: '360', viewValue: '6 hours'},
  ];
}
