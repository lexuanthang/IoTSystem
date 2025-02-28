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
import {NgbCalendar, NgbDate, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/shared/helper/datepicker-adapter';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { AdminReportClient, BaoCaoRequest } from 'src/app/shared/app-client';
import { UserService } from 'src/app/shared/services/user.service';
import { ResetPasswordVm } from 'src/app/shared/models/base.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
    selector: 'app-changepass',
    templateUrl: './changepass.component.html',
    styleUrls: ['./changepass.component.scss'],
    providers: [
        {provide: NgbDateAdapter, useClass: CustomAdapter},
        {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
      ]
})
export class ChangePassComponent implements OnInit {
    public _reportBC$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    reportBCObs: Observable<any[]>;

    id: string = "";
    passModel: ResetPasswordVm;
    formGroup!: FormGroup;
    check : number = 0; 
    currentUser: any;
    constructor(
        private cfr: ComponentFactoryResolver,
        private injector: Injector,
        private router: Router,
        private adminReportClient: AdminReportClient,
        private ngbCalendar: NgbCalendar, 
        private dateAdapter: NgbDateAdapter<string>,    
        private modalService: NgbModal,
        private userService: UserService,
        private fb: FormBuilder,
        private storageService: StorageService,
    ) {
        this.passModel = new ResetPasswordVm();  
    }
    get today() {
        return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
      }
    ngOnInit() {
        this.currentUser = this.storageService.getUser();
        this.id = JSON.parse(this.currentUser).id;
        this.loadFormGroup();       

    }

    loadFormGroup() {
        this.formGroup = this.fb.group({
          CurrentPassword: [this.passModel.CurrentPassword, Validators.compose([Validators.required])],
          Password: [this.passModel.Password, Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#!~&%$^])(?=\\S+$).{8,}$')])],            
          ConfirmPassword: [this.passModel.ConfirmPassword, Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#!~&%$^])(?=\\S+$).{8,}$')])],      
        });
    }
    
    private preparseloaiVe() {
      const formData = this.formGroup.value;
      this.passModel.CurrentPassword = formData.CurrentPassword;
      this.passModel.Password = formData.Password;
      this.passModel.ConfirmPassword = formData.ConfirmPassword;
    }

    onSubmit(){    
        this.preparseloaiVe();
        if(this.passModel.ConfirmPassword == null || this.passModel.CurrentPassword == null || this.passModel.Password == null){
            Swal.fire('Thông báo', 'Vui lòng nhập đầy đủ thông tin.', 'error');
          }
          else if(this.passModel.CurrentPassword == this.passModel.Password)
          {
            Swal.fire('Thông báo', 'Mật khẩu mới trùng với mật khẩu cũ.', 'error');
          }
          else{
            const sbCreate = this.userService
            .changepassword(this.passModel)
            .pipe(
              tap(() => {
      
              }),
              catchError((errorMessage) => {
                Swal.fire('Thông báo', 'Có lỗi xảy ra, vui lòng thử lại.', 'error');
                return of(this.passModel);
              })
            )
            .subscribe((response: any) => {
              if (response.Status === 1) {
                Swal.fire('Thông báo', 'Đổi mật khẩu thành công.', 'success');
                this.modalService.dismissAll();
              } else {
                Swal.fire('Thông báo', response.Messages, 'error');
              }
            });
          }
    }

}
