import { Component, OnInit, Output, EventEmitter, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/core/services/storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResetPasswordVm } from 'src/app/shared/models/base.model';
import Swal from 'sweetalert2';
import { of, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

/**
 * Topbar component
 */
export class TopbarComponent implements OnInit {

  element;
  cookieValue;
  flagvalue;
  countryName;
  valueset;

  currentUser: any = {};
  userName: string = "";
  @ViewChild('content') content;
  passModel: ResetPasswordVm;
  formGroup!: FormGroup;
  constructor(@Inject(DOCUMENT) private document: any, private router: Router, private authService: AuthenticationService,
    public languageService: LanguageService,
    public translate: TranslateService,
    public _cookiesService: CookieService,
    private modalService: NgbModal,
    private userService: UserService,
    private fb: FormBuilder,
    public storageService: StorageService,) {
    this.passModel = new ResetPasswordVm();    
  }

  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  openMobileMenu: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  openModal() {
    this.loadFormGroup();
    this.modalService.open(this.content, { centered: true });
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
  ngOnInit() {
    this.element = document.documentElement;
    this.currentUser = this.storageService.getUser();
    this.userName = JSON.parse(this.currentUser).username;

    this.openMobileMenu = false;
    this.element = document.documentElement;

    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
  }

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/account/login']);
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
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
