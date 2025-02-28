import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EventService } from '../core/services/event.service';
import Swal from 'sweetalert2';
import { Router, NavigationEnd } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';
import {
  LAYOUT_VERTICAL, LAYOUT_HORIZONTAL, LAYOUT_WIDTH, TOPBAR
} from './layouts.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit, AfterViewInit {

  // layout related config
  layoutType: string;
  layoutwidth: string;
  topbar: string;
  currentUser1: any;
  id: string = "";
  constructor(private eventService: EventService,  private router: Router, public storageService: StorageService) { }

  ngOnInit() {
    this.currentUser1 = this.storageService.getUser();
    this.id = JSON.parse(this.currentUser1).id;    
    // default settings
    this.layoutType = LAYOUT_VERTICAL;
    this.layoutwidth = LAYOUT_WIDTH;
    this.topbar = TOPBAR;

    // listen to event and change the layout, theme, etc
    this.eventService.subscribe('changeLayout', (layout) => {
      this.layoutType = layout;
    });

    this.LayoutWidth(this.layoutwidth);

    this.eventService.subscribe('changeWidth', (width) => {
      this.layoutwidth = width;
      this.LayoutWidth(this.layoutwidth);
    });
  }
  
  ngAfterViewInit() {
  }

  LayoutWidth(width: string) {
    switch (width) {
      case "fluid":
        document.body.setAttribute("data-layout-size", "fluid");
        document.body.classList.remove("vertical-collpsed");
        document.body.removeAttribute("data-layout-scrollable");
        break;
      case "boxed":
        document.body.setAttribute("data-layout-size", "boxed");
        document.body.classList.add("vertical-collpsed");
        document.body.removeAttribute("data-layout-scrollable");
        break;
      case "scrollable":
        document.body.removeAttribute("data-layout-size");
        document.body.setAttribute("data-layout-scrollable", "true");
        document.body.setAttribute("data-layout-size", "fluid");
        document.body.classList.remove("right-bar-enabled", "vertical-collpsed");
      default:
        document.body.setAttribute("data-layout-size", "fluid");
        break;
    }
  }

  /**
   * Check if the vertical layout is requested
   */
  isVerticalLayoutRequested() {
    return this.layoutType === LAYOUT_VERTICAL;
  }

  /**
   * Check if the horizontal layout is requested
   */
  isHorizontalLayoutRequested() {
    return this.layoutType === LAYOUT_HORIZONTAL;
  }
}
