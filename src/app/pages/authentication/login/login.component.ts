import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PrimeIcons} from 'primeng/api';
import {AuthHttpService, AuthService, MessageService} from '@services/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  primeIcons = PrimeIcons;
  progressBar: boolean = false;
  progressBarRequestPasswordReset: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private authHttpService: AuthHttpService,
              public messageService: MessageService,
              private authService: AuthService,
              private router: Router) {
    this.formLogin = this.newFormLogin();
  }

  ngOnInit(): void {

  }

  newFormLogin(): FormGroup {
    return this.formBuilder.group({
      username: ['1234567890', [Validators.required]],
      // username: [null, [Validators.required]],
      password: ['12345678', [Validators.required]],
      // password: [null, [Validators.required]],
    });
  }

  isRequired(field: AbstractControl): boolean {
    return field.hasValidator(Validators.required);
  }

  onSubmit() {
    if (this.formLogin.valid) {
      this.login();
    } else {
      this.formLogin.markAllAsTouched();
    }
  }

  login() {
    this.progressBar = true;
    this.authHttpService.login(this.formLogin.value)
      .subscribe(
        response => {
          this.messageService.success(response);
          this.progressBar = false;
          switch (this.authService.role?.name) {
            case 'admin':
              this.redirectAdmin();
              break;
            case 'support':
            case 'viewer':
              this.redirectSupport();
              break;
            default:
              this.redirectChat();
          }
        }, error => {
          this.messageService.error(error);
          this.progressBar = false;
        });
  }

  requestPasswordReset() {
    if (this.usernameField.valid) {
      this.progressBarRequestPasswordReset = true;
      this.authHttpService.requestPasswordReset(this.usernameField.value)
        .subscribe(
          response => {
            this.messageService.success(response);
            this.progressBarRequestPasswordReset = false;
          }, error => {
            this.messageService.error(error);
            this.progressBarRequestPasswordReset = false;
          });
    } else {
      this.usernameField.markAsTouched();
    }
  }

  requestUserUnlock() {
    this.progressBar = true;
    this.authHttpService.login(this.usernameField.value)
      .subscribe(
        response => {
          this.messageService.success(response);
          this.progressBar = false;
          // this.redirect();
        }, error => {
          this.messageService.error(error);
          this.progressBar = false;
        });
  }

  redirectAdmin() {
    this.router.navigate(['/user-administration']);
  }

  redirectSupport() {
    this.router.navigate(['/test']);
  }

  redirectChat() {
    this.router.navigate(['/']);
  }

  get usernameField() {
    return this.formLogin.controls['username'];
  }

  get passwordField() {
    return this.formLogin.controls['password'];
  }

  get deviceNameField() {
    return this.formLogin.controls['deviceName'];
  }

}
