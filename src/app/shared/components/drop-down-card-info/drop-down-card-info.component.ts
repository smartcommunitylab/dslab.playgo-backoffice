import { Component, Input, OnInit } from "@angular/core";
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: "drop-down-card-info",
  templateUrl: "./drop-down-card-info.component.html",
  styleUrls: ["./drop-down-card-info.component.scss"],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class DropDownCardInfoComponent implements OnInit {
  @Input() title:string;
  @Input() content:string;
  state: string="collapsed";
  constructor() {}

  ngOnInit() {
  }

  toggle(){
    this.state = this.state === 'collapsed' ? 'expanded' : 'collapsed';
  }
}
