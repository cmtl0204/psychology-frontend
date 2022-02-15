import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PrimeIcons} from 'primeng/api';
import {CoreHttpService} from '@services/core';
import {LocationModel} from '@models/core';
import {PsychologyHttpService} from '@services/psychology/psychology-http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  @Output() activatedTestOut = new EventEmitter<boolean>();
  @Output() progressBarAnswerOut = new EventEmitter<boolean>();
  formChat: FormGroup;
  primeIcons = PrimeIcons;
  progressBar: boolean = false;
  progressBarAnswer: boolean = false;
  steps: number = 1;
  currentDate: Date = new Date();
  ageValid: boolean = false;
  younger: boolean = false;
  codeVerified: string = '';

  public provinces: LocationModel[] = [];
  public cantons: LocationModel[] = [];

  constructor(private formBuilder: FormBuilder,
              private coreHttpService: CoreHttpService,
              private psychologyHttpService: PsychologyHttpService) {
    this.formChat = this.newFormChat;
  }

  ngOnInit(): void {
    this.loadLocations();
    this.loadCantons();
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
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      this.termsConditionField.setValue(value);
      if (value) {
        this.steps++;
      } else {
        this.steps = 0;
      }
      this.progressBarAnswerOut.emit(false);
    }, Math.random() * (2000 - 1000) + 1000);
  }

  saveAge() {
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      if (this.ageField.value >= 12 && this.ageField.value <= 18) {
        this.steps++;
        this.psychologyHttpService.saveAge(this.ageField.value)
        if (this.ageField.value < 18) {
          this.younger = true;
        } else {
          this.younger = false;
          this.codeVerified = 'valid';
        }
      } else {
        this.ageValid = true;
      }
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
