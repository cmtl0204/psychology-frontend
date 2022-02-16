import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CatalogueModel, LocationModel, PhoneModel, UserModel} from '@models/core';
import {CoreHttpService, MessageService, UserAdministrationHttpService} from '@services/core';
import {TestModel} from '@models/psychology';
import {TestHttpService} from '@services/psychology/test-http.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss']
})
export class AssignmentComponent implements OnInit {
  @Output() dialogForm = new EventEmitter<boolean>();
  @Input() tests: TestModel[] = [];
  private unsubscribe$ = new Subject<void>();
  public form: FormGroup = this.newForm;
  public automaticPassword: FormControl = new FormControl(false);
  public progressBar: boolean = false;
  public identificationTypes: CatalogueModel[] = [];
  public phoneOperators: CatalogueModel[] = [];
  public phoneTypes: CatalogueModel[] = [];
  public phoneLocations: LocationModel[] = [];

  constructor(private formBuilder: FormBuilder,
              private userAdministrationHttpService: UserAdministrationHttpService,
              private coreHttpService: CoreHttpService,
              private testHttpService: TestHttpService,
              public messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
    this.loadIdentificationTypes();
    this.loadPhoneOperators();
    this.loadPhoneTypes();
    this.loadPhoneLocations();
    this.tests?.forEach(test => {
      this.addTest(test);
    });

    // console.log(this.testsField.value);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      id: [null],
      identificationType: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      name: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      passwordChanged: [true],
      phones: this.formBuilder.array([this.newFormPhone], Validators.required),
      tests: this.formBuilder.array([], Validators.required),
      username: [null, [Validators.required]],
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

  get newFormTest(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      user: [null, [Validators.required]],
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

  onSubmit() {
    if (this.form.valid) {
      if (this.idField.value) {
        this.updateUser(this.form.value);
      } else {
        this.storeUser(this.form.value);
      }
    } else {
      this.form.markAllAsTouched();
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

  addTest(data: TestModel = {}) {
    const formTest = this.newFormTest;
    if (data.id !== undefined) {
      formTest.patchValue(data);
    }
    this.testsField.push(formTest);
  }

  removePhone(index: number) {
    if (this.phonesField.length > 1) {
      this.phonesField.removeAt(index);
    } else {
      this.phonesField.markAllAsTouched();
      this.messageService.errorRequired();
    }
  }

  removeTest(index: number) {
    if (this.testsField.length > 1) {
      this.testsField.removeAt(index);
    } else {
      this.testsField.markAllAsTouched();
      this.messageService.errorRequired();
    }
  }

  isRequired(field: AbstractControl): boolean {
    return field.hasValidator(Validators.required);
  }

  // Getters
  get emailField() {
    return this.form.controls['email'];
  }

  get idField() {
    return this.form.controls['id'];
  }

  get identificationTypeField() {
    return this.form.controls['identificationType'];
  }

  get lastnameField() {
    return this.form.controls['lastname'];
  }

  get nameField() {
    return this.form.controls['name'];
  }

  get passwordField() {
    return this.form.controls['password'];
  }

  get passwordChangedField() {
    return this.form.controls['passwordChanged'];
  }

  get phonesField(): FormArray {
    return this.form.controls['phones'] as FormArray;
  }

  get testsField(): FormArray {
    return this.form.controls['tests'] as FormArray;
  }

  get usernameField() {
    return this.form.controls['username'];
  }
}
