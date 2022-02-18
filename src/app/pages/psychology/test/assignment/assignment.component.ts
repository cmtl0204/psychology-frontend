import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CatalogueModel, LocationModel, PhoneModel, UserModel} from '@models/core';
import {CoreHttpService, MessageService, UserAdministrationHttpService} from '@services/core';
import {InstitutionModel, TestModel} from '@models/psychology';
import {TestHttpService} from '@services/psychology/test-http.service';
import {InstitutionHttpService} from '@services/psychology/institution-http.service';

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
  public progressBar: boolean = false;
  public institutions: InstitutionModel[] = [];
  public phoneTypes: CatalogueModel[] = [];

  constructor(private formBuilder: FormBuilder,
              private userAdministrationHttpService: UserAdministrationHttpService,
              private institutionHttpService: InstitutionHttpService,
              public messageService: MessageService,
  ) {
    this.testsField.clear();
  }

  ngOnInit(): void {
    this.loadInstitutions();
    this.tests?.forEach(test => {
      this.addTest(test);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      tests: this.formBuilder.array([], Validators.required),
      institution: [null, [Validators.required]],
    });
  }

  get newFormTest(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      name: [null],
      user: [null],
    });
  }

  loadInstitutions() {
    this.institutionHttpService.all().subscribe(
      response => {
        this.institutions = response.data;
      }, error => {
        this.messageService.error(error);
      }
    );
  }

  onSubmit() {
    console.log(this.institutionField.valid);
    console.log(this.institutionField);
    console.log(this.testsField.valid);
    console.log(this.testsField);
    if (this.form.valid) {
      this.assignment();
    } else {
      this.form.markAllAsTouched();
    }
  }

  assignment(): void {
    this.progressBar = true;
    this.institutionHttpService.assignment(this.institutionField.value, this.testsField.value).subscribe(
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

  addTest(data: TestModel = {}) {
    const formTest = this.newFormTest;
    if (data.id !== undefined) {
      formTest.patchValue(data);
    }
    this.testsField.push(formTest);
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
  get testsField(): FormArray {
    return this.form.controls['tests'] as FormArray;
  }

  get institutionField() {
    return this.form.controls['institution'];
  }
}
