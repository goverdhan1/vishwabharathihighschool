import { Component, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  userRole = 'student';
  @Output() sidenavClose = new EventEmitter();
  constructor() { }

  ngOnInit() {
    if(window.localStorage.getItem("role")) {
      this.userRole = window.localStorage.getItem("role");
    }
  }
  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }
}
