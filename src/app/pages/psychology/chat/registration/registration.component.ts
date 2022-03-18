import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PrimeIcons} from 'primeng/api';
import {CoreHttpService} from '@services/core';
import {LocationModel} from '@models/core';
import {TestHttpService} from '@services/psychology/test-http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  @Output() activatedTestOut = new EventEmitter<boolean>();
  @Output() progressBarAnswerOut = new EventEmitter<boolean>();
  loaded$ = this.testHttpService.loaded$;
  formChat: FormGroup;
  progressBarAnswer: boolean = false;
  steps: number = 1;
  stepsTemp: number = 0;
  ageValid: boolean = false;
  younger: boolean = false;
  codeVerified: string = '';

  public provinces: LocationModel[] = [];
  public cantons: LocationModel[] = [];

  constructor(private formBuilder: FormBuilder,
              private coreHttpService: CoreHttpService,
              private testHttpService: TestHttpService) {
    this.formChat = this.newFormChat;
  }

  ngOnInit(): void {
    this.testHttpService.removeAge();
    this.testHttpService.removeAgent();
    this.testHttpService.removePatient();
    this.loadLocations();
    this.loadCantons();
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      this.stepsTemp++;
      this.progressBarAnswerOut.emit(false);
    }, 2000);
    setTimeout(() => {
      this.progressBarAnswerOut.emit(true);
      this.stepsTemp++;
    }, 4000);
    setTimeout(() => {
      this.progressBarAnswerOut.emit(false);
      this.stepsTemp++;
    }, 6000);
  }

  get newFormChat(): FormGroup {
    return this.formBuilder.group({
      termsConditions: [null, [Validators.required]],
      age: [null, [Validators.required]],
    });
  }

  loadLocations() {
    this.coreHttpService.getLocations('PROVINCE').subscribe(
      response => {
        this.provinces = response.data;
      }, error => {
        // this.messageService.error(error);
      }
    );
  }

  loadCantons() {
    this.coreHttpService.getLocations('CANTON').subscribe(
      response => {
        this.cantons = response.data;
      }, error => {
        // this.messageService.error(error);
      }
    );
  }

  saveTermsConditions(value: boolean) {
    this.progressBarAnswer = true;
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      this.termsConditionField.setValue(value);
      if (this.termsConditionField.valid) {
        if (value) {
          this.steps++;
        } else {
          this.steps = 0;
        }
        this.progressBarAnswer = false;
        this.progressBarAnswerOut.emit(false);
      }
    }, Math.random() * (2000 - 1000) + 1000);
  }

  saveAge() {
    this.progressBarAnswer = true;
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      if (this.ageField.value >= 12 && this.ageField.value <= 18) {
        this.steps++;
        this.testHttpService.saveAge(this.ageField.value)
        if (this.ageField.value < 18) {
          this.younger = true;
        } else {
          this.younger = false;
          this.codeVerified = 'valid';
        }
      } else {
        this.ageValid = true;
      }
      this.progressBarAnswer = false;
      this.progressBarAnswerOut.emit(false);
    }, Math.random() * (2000 - 1000) + 1000);
  }

  get termsConditionField() {
    return this.formChat.controls['termsConditions'];
  }

  get ageField() {
    return this.formChat.controls['age'];
  }
}
