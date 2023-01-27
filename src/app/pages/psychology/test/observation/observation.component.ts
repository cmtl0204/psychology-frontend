import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TestModel} from '@models/psychology';
import {Subject} from 'rxjs';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService, UserAdministrationHttpService} from '@services/core';
import {TestHttpService} from '@services/psychology/test-http.service';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.scss']
})
export class ObservationComponent implements OnInit {
  @Output() dialogForm = new EventEmitter<boolean>();
  @Input() test: TestModel = {};
  private unsubscribe$ = new Subject<void>();
  public form: FormGroup = this.newForm;
  public progressBar: boolean = false;
  public observationControl: FormControl = new FormControl('', [Validators.required]);

  constructor(private formBuilder: FormBuilder,
              private userAdministrationHttpService: UserAdministrationHttpService,
              private testHttpService: TestHttpService,
              public messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
    this.form.patchValue(this.test);
    this.test.observations?.forEach(observation => {
      this.addObservation(observation);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get newForm(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      observations: this.formBuilder.array([], Validators.required),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.observe();
    } else {
      this.form.markAllAsTouched();
    }
  }

  observe(): void {
    this.progressBar = true;
    this.testHttpService.observe(this.form.value).subscribe(
      response => {
        this.messageService.successToast();
        this.progressBar = false;
        this.observationControl.setValue('');
        // this.dialogForm.emit(false);
      },
      error => {
        this.messageService.errorToast();
        // this.dialogForm.emit(false);
        this.progressBar = false;
      }
    );
  }

  addObservation(data: string = '') {
    this.observationsField.push(new FormControl(data));
  }

  saveObservation(data: string = '') {
    if (this.observationControl.valid) {
      this.observationsField.push(new FormControl(data));
      this.observe();
    } else {
      this.form.markAllAsTouched();
    }
  }

  removeObservation(index: number) {
    if (this.observationsField.length > 1) {
      this.observationsField.removeAt(index);
      this.observe();
    } else {
      this.observationsField.markAllAsTouched();
      this.messageService.errorRequired();
    }
  }

  isRequired(field: AbstractControl): boolean {
    return field.hasValidator(Validators.required);
  }

  // Getters
  get observationsField(): FormArray {
    return this.form.controls['observations'] as FormArray;
  }
}
