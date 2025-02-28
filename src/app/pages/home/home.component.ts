import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    Injector,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import { Subscription, Observable, BehaviorSubject, of } from 'rxjs';
import { Router } from "@angular/router";
import { DatePipe } from '@angular/common';
import { NgbCalendar, NgbDate, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/shared/helper/datepicker-adapter';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { StorageService } from 'src/app/core/services/storage.service';
import { AdminDashboardClient } from 'src/app/shared/app-client';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [
        { provide: NgbDateAdapter, useClass: CustomAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
    ]
})
export class HomeComponent implements OnInit {
    id: string = "";
    userName: string = "";
    currentUser: any;
    role = "";
    public _tenant$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    tenantObs: Observable<any[]>;
    constructor(
        private cfr: ComponentFactoryResolver,
        private injector: Injector,
        private router: Router,
        private adminDashboardClient: AdminDashboardClient,
        private ngbCalendar: NgbCalendar,
        private dateAdapter: NgbDateAdapter<string>,
        private storageService: StorageService,
    ) {
       
        this.tenantObs = this._tenant$.asObservable();
    }
    ngOnInit() {
        this.currentUser = this.storageService.getUser();
        this.id = JSON.parse(this.currentUser).id;
        this.userName = JSON.parse(this.currentUser).username;
        this.role = JSON.parse(this.currentUser).role;
    }
   
    ConvertNameOfRole(role) {
        if (role == "SuperAdmin") {
            return "Quản trị toàn hệ thống."
        }
        if (role == "ManagerAdmin") {
            return "Quản trị khu vực."
        }
    }
   
   
}
