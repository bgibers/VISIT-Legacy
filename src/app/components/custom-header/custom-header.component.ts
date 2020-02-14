import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
})

export class CustomHeaderComponent implements OnInit {

  @Input() headerText: string;
  constructor() { }

  ngOnInit() {}

}
