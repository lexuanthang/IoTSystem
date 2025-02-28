import { Component, OnInit, OnChanges,
  Input,
  Output,
  EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';

import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import {CaptchaService} from './captcha.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;

  password;

  show = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  captchaStatus:any = '';
  config: any = {
    type:1, 
    length:6, 
    cssClass:'custom',
    back: {
     stroke:"#2F9688",
     solid:"#f2efd2"
    } , 
    font:{
      color:"#000000", 
      size:"35px"
    }
  };
  captch_input:any = null;
  code: any = null;
  resultCode:any = null;

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService, private captchService:CaptchaService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      captch_input: ['', [Validators.required]],
      
    });

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.password = 'password' ;
    this.ngOnChanges();
  }
  
 
  ShowPass(){
    
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  
  
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
           //Check captcha
           if (this.f.captch_input.value != this.resultCode) {
            alert("Nhập sai mã Captcha");
            return;      
          }
           else{
            this.authenticationService.login(this.f.email.value, this.f.password.value).subscribe((res: any) => {
              debugger;
              if(res.token){
                debugger;
                this.router.navigate(['/dashboard'] );
                // if(res.resultCode == 205){
                //   Swal.fire('Thông báo', 'Vui lòng đổi mật khẩu lần đầu đăng nhập.', 'error');
                //   this.router.navigate(['/changepassword'] );
                // }else if(res.resultCode == 210){
                //   Swal.fire('Thông báo', 'Hết thời hạn mật khẩu, cần đổi mật khẩu mới.', 'error');
                //   this.router.navigate(['/changepassword'] );
                // }else{
                //   this.router.navigate(['/home'] );
                // }
                
              }else{
                this.error = res.messages
              }
            })
           }

      
    }
  }

  ngOnChanges() {
    if (this.config) {
      if (!this.config.font || !this.config.font.size) {
        this.config["font"]["size"] = "40px";
      }
      if (!this.config.font || !this.config.font.family) {
        this.config["font"]["family"] = "Arial";
      }
      if (!this.config.strokeColor) {
        this.config["strokeColor"] = "#f20c6c";
      }
      if (!this.config.length) {
        this.config["length"] = 6;
      }
      if (!this.config.cssClass) {
        this.config["cssClass"] = '';
      }

      if (!this.config.type) {
        this.config["type"] = 1;
      }
      
      if (!this.config.back || !this.config.back.stroke) {
        this.config["back"]["stroke"] = "";
      }
      if (!this.config.back || !this.config.back.solid) {
        this.config["back"]["solid"] = "#f2efd2";
      }

      this.createCaptcha();
    }
  }
  createCaptcha() {

    switch(this.config.type) {
      case 1: // only alpha numaric degits to type
  
      let char =
      Math.random()
        .toString(24)
        .substring(2, this.config.length) +
      Math.random()
        .toString(24)
        .substring(2, 4);
      this.code = this.resultCode = char.toUpperCase();
      break;
      case 2: // solve the calculation 
      let num1 = Math.floor(Math.random() * 99);
      let num2 = Math.floor(Math.random() * 9);
      let operators = ['+','-'];
      let operator = operators[(Math.floor(Math.random() * operators.length))];
      this.code =  num1+operator+num2+'=?';
      this.resultCode = (operator == '+')? (num1+num2):(num1-num2);
      break;
    }
    

    setTimeout(() => {
      let captcahCanvas: any = document.getElementById("captcahCanvas");
      var ctx = captcahCanvas.getContext("2d");
      ctx.fillStyle = this.config.back.solid;
      ctx.fillRect(0, 0, captcahCanvas.width, captcahCanvas.height);

      ctx.beginPath();

      captcahCanvas.style.letterSpacing = 15 + "px";
      ctx.font = this.config.font.size + " " + this.config.font.family;
      ctx.fillStyle = this.config.font.color;
      ctx.textBaseline = "middle";
      ctx.fillText(this.code, 40, 50);
      if (this.config.back.stroke) {
        ctx.strokeStyle = this.config.back.stroke;
        for (var i = 0; i < 150; i++) {
          ctx.moveTo(Math.random() * 300, Math.random() * 300);
          ctx.lineTo(Math.random() * 300, Math.random() * 300);
        }
        ctx.stroke();
      }
       
      // this.captchaCode.emit(char);
    }, 100);
  }
  checkCaptcha() {    
    if (this.f.captch_input.value != this.resultCode) {     
      alert("Nhập sai mã Captcha")      
    } else  {      
      alert("Mã Captcha đúng")
    }
  }
  
}
