import {Component, Input, OnInit} from '@angular/core';
import {IMenuNavigationItem} from "../../interfaces/Common";
import {SystemService} from "../../services/system.service";

@Component({
  selector: 'app-complex-navigation',
  templateUrl: './complex-navigation.component.html',
  styleUrls: ['./complex-navigation.component.less']
})
export class ComplexNavigationComponent implements OnInit{

  constructor(public systemService: SystemService) {
  }
  @Input() items: IMenuNavigationItem[] = [];
  @Input() header = '';
  @Input() icon = '';

  expanded = false;
  itemsCount = '';

  ngOnInit(): void {
  }


  switch(main: HTMLDivElement) {
    this.expanded = !this.expanded;
    main.style.height = this.expanded ? `${2.75 * (this.items.length + 1)}rem` : '2.75rem';
  }
}
