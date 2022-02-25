import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {
  AuthHttpService,
  AuthService,
  CoreHttpService,
  MessageService,
  UserAdministrationHttpService
} from '@services/core';
import {CatalogueModel, LocationModel, PhoneModel, RoleModel, UserModel} from '@models/core';

@Component({
  selector: 'app-user-administration-form',
  templateUrl: './user-administration-form.component.html',
  styleUrls: ['./user-administration-form.component.scss']
})

export class UserAdministrationFormComponent implements OnInit, OnDestroy {
  private user$ = this.userAdministrationHttpService.user$;
  private unsubscribe$ = new Subject<void>();
  @Output() dialogForm = new EventEmitter<boolean>();
  public formUser: FormGroup = this.newFormUser;
  public automaticPassword: FormControl = new FormControl(false);
  public progressBar: boolean = false;
  public identificationTypes: CatalogueModel[] = [];
  public phoneOperators: CatalogueModel[] = [];
  public phoneTypes: CatalogueModel[] = [];
  public phoneLocations: LocationModel[] = [];
  public roles: RoleModel[] = [];

  constructor(private formBuilder: FormBuilder,
              private userAdministrationHttpService: UserAdministrationHttpService,
              private coreHttpService: CoreHttpService,
              private authHttpService: AuthHttpService,
              public messageService: MessageService,
  ) {
    this.user$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response.id !== undefined) {
          this.formUser.reset(response);
          if (response?.roles) {
            this.roleField.patchValue(response?.roles[0]);
          }
        }

        if (this.idField.value) {
          this.passwordField.clearValidators();
        }

        if (response.phones?.length) {
          // this.phonesField.clear();
        }

        response.phones?.forEach(phone => {
          // this.addPhone(phone);
        });
      });
  }

  ngOnInit(): void {
    this.loadIdentificationTypes();
    this.loadPhoneOperators();
    this.loadPhoneTypes();
    this.loadPhoneLocations();
    this.loadRoles();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get newFormUser(): FormGroup {
    return this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      id: [null],
      identificationType: [null, [Validators.required]],
      role: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      name: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      passwordChanged: [true],
      // phones: this.formBuilder.array([this.newFormPhone], Validators.required),
      username: [null, [Validators.required]]
    });
  }

  get newFormPhone(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      location: [null, [Validators.required]],
      number: [null, [Validators.required]],
      operator: [null, [Validators.required]],
      type: [null, [Validators.required]],
    });
  }

  loadIdentificationTypes() {
    this.coreHttpService.getCatalogues('IDENTIFICATION_PROFESSIONAL_TYPE').subscribe(
      response => {
        this.identificationTypes = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  loadPhoneOperators() {
    this.coreHttpService.getCatalogues('PHONE_OPERATOR').subscribe(
      response => {
        this.phoneOperators = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  loadPhoneTypes() {
    this.coreHttpService.getCatalogues('PHONE_TYPE').subscribe(
      response => {
        this.phoneTypes = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  loadPhoneLocations() {
    this.coreHttpService.getLocations('COUNTRY').subscribe(
      response => {
        this.phoneLocations = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  loadRoles() {
    this.authHttpService.getRoles().subscribe(
      response => {
        this.roles = response.data;
        console.log(this.roles);
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  onSubmit() {
    if (this.formUser.valid) {
      if (this.idField.value) {
        this.updateUser(this.formUser.value);
      } else {
        this.storeUser(this.formUser.value);
      }
    } else {
      this.formUser.markAllAsTouched();
    }
  }

  storeUser(user: UserModel): void {
    this.progressBar = true;
    this.userAdministrationHttpService.storeUser(user).subscribe(
      response => {
        this.messageService.success(response);
        this.progressBar = false;
        this.dialogForm.emit(false);
      },
      error => {
        this.messageService.error(error);
        this.progressBar = false;
      }
    );
  }

  updateUser(user: UserModel): void {
    this.progressBar = true;
    this.userAdministrationHttpService.updateUser(user.id!, user).subscribe(
      response => {
        this.messageService.success(response);
        this.progressBar = false;
        this.dialogForm.emit(false);
      },
      error => {
        this.messageService.error(error);
        this.progressBar = false;
      }
    );
  }

  generateAutomaticPassword(event: any) {
    this.automaticPassword.setValue(event.checked);
    if (event.checked) {
      this.passwordField.setValue(Math.random().toString(36).slice(-8));
    } else {
      this.passwordField.setValue(null);
    }
  }

  addPhone(data: PhoneModel = {}) {
    const formPhone = this.newFormPhone;
    if (data.id !== undefined) {
      formPhone.patchValue(data);
    }
    this.phonesField.push(formPhone);
  }

  removePhone(index: number) {
    if (this.phonesField.length > 1) {
      this.phonesField.removeAt(index);
    } else {
      this.phonesField.markAllAsTouched();
      this.messageService.errorRequired();
    }
  }

  isRequired(field: AbstractControl): boolean {
    return field.hasValidator(Validators.required);
  }

  // Getters
  get emailField() {
    return this.formUser.controls['email'];
  }

  get idField() {
    return this.formUser.controls['id'];
  }

  get identificationTypeField() {
    return this.formUser.controls['identificationType'];
  }

  get lastnameField() {
    return this.formUser.controls['lastname'];
  }

  get nameField() {
    return this.formUser.controls['name'];
  }

  get passwordField() {
    return this.formUser.controls['password'];
  }

  get passwordChangedField() {
    return this.formUser.controls['passwordChanged'];
  }

  get phonesField(): FormArray {
    return this.formUser.controls['phones'] as FormArray;
  }

  get usernameField() {
    return this.formUser.controls['username'];
  }

  get roleField() {
    return this.formUser.controls['role'];
  }
}
