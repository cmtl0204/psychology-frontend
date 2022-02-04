import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthHttpService, AuthService, MessageService} from "@services/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomValidators} from "@shared/validators/custom-validators";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  form: FormGroup;
  progressBar: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private authHttpService: AuthHttpService,
              public messageService: MessageService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.form = this.newForm();
    console.log('entro');
  }

  ngOnInit(): void {
    this.form.patchValue({
      username: this.activatedRoute.snapshot.queryParams['username'],
      token: this.activatedRoute.snapshot.queryParams['token']
    });
  }

  newForm(): FormGroup {
    return this.formBuilder.group({
      username: [{value: null, disabled: true}, [Validators.required]],
      token: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: [null, [Validators.required]],
    }, {validators: CustomValidators.passwordMatchValidator});
  }

  onSubmit() {
    if (this.form.valid) {
      this.resetPassword();
    } else {
      this.form.markAllAsTouched();
    }
  }

  isRequired(field: AbstractControl): boolean {
    return field.hasValidator(Validators.required);
  }

  resetPassword() {
    this.progressBar = true;
    this.authHttpService.resetPassword(this.form.value)
      .subscribe(
        response => {
          this.messageService.success(response);
          this.progressBar = false;
          this.redirect();
        }, error => {
          this.messageService.error(error);
          this.progressBar = false;
        });
  }

  redirect() {
    this.router.navigate(['/authentication/login']);
  }

  get usernameField() {
    return this.form.controls['username'];
  }

  get passwordField() {
    return this.form.controls['password'];
  }

  get passwordConfirmationField() {
    return this.form.controls['passwordConfirmation'];
  }
}
