import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PrimeIcons} from 'primeng/api';
import {CoreHttpService} from '@services/core';
import {LocationModel} from '@models/core';
import {PsychologyHttpService} from '@services/psychology/psychology-http.service';

@Component({
  selector: 'app-registration-patient',
  templateUrl: './registration-patient.component.html',
  styleUrls: ['./registration-patient.component.scss']
})
export class RegistrationPatientComponent implements OnInit {
  formPatient: FormGroup;
  primeIcons = PrimeIcons;
  progressBar: boolean = false;
  progressBarAnswer: boolean = false;
  @Output() progressBarAnswerOut = new EventEmitter<boolean>();
  @Output() stepsOut = new EventEmitter<number>();
  @Output() activatedTest = new EventEmitter<boolean>();
  steps: number = 1;
  currentDate: Date = new Date();
  ageValid: boolean = false;
  adult: boolean = false;

  public provinces: LocationModel[] = [];
  public cantons: LocationModel[] = [];

  constructor(private formBuilder: FormBuilder,
              private coreHttpService: CoreHttpService,
              private psychologyHttpService: PsychologyHttpService) {
    this.formPatient = this.newFormPatient;
  }

  ngOnInit(): void {
    this.loadLocations();
    this.loadCantons();
  }

  get newFormPatient(): FormGroup {
    return this.formBuilder.group({
      identification: ['1234567890', [Validators.required]],
      name: ['CHRISTOPHER DE LAS MERCEDES', [Validators.required]],
      lastname: ['VILLAVICENCIO QUINCHIGUANGO', [Validators.required]],
      email: ['mayrapaulinaquinatoagomez@yahoo.com', [Validators.required, Validators.email]],
      phone: ['0987654321', [Validators.required]],
      code: [null, [Validators.required]],
      province: [null, [Validators.required]],
      canton: [null, [Validators.required]],
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

  saveIdentification() {
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      this.progressBarAnswerOut.emit(false);
      this.steps = 5;
      this.steps++;
    }, Math.random() * (2000 - 1000) + 1000);
  }

  saveName() {
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      this.progressBarAnswerOut.emit(false);
      this.steps++;
    }, Math.random() * (2000 - 1000) + 1000);
  }

  saveLastname() {
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      this.progressBarAnswerOut.emit(false);
      this.steps++;
    }, Math.random() * (2000 - 1000) + 1000);
  }

  saveEmail() {
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      this.progressBarAnswerOut.emit(false);
      this.steps++;
    }, Math.random() * (2000 - 1000) + 1000);
  }

  savePhone() {
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      this.progressBarAnswerOut.emit(false);
      this.steps++;
    }, Math.random() * (2000 - 1000) + 1000);
  }

  saveAddress() {
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      this.progressBarAnswerOut.emit(false);
      this.steps++;
    }, Math.random() * (2000 - 1000) + 1000);
  }

  startTest() {
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      this.stepsOut.emit(4);
      this.activatedTest.emit(true);
      this.progressBarAnswerOut.emit(false);
      this.steps++;
      this.psychologyHttpService.savePatient(this.formPatient.value);
    }, Math.random() * (2000 - 1000) + 1000);
  }

  get identificationField() {
    return this.formPatient.controls['identification'];
  }

  get lastnameField() {
    return this.formPatient.controls['lastname'];
  }

  get nameField() {
    return this.formPatient.controls['name'];
  }

  get emailField() {
    return this.formPatient.controls['email'];
  }

  get phoneField() {
    return this.formPatient.controls['phone'];
  }

  get provinceField() {
    return this.formPatient.controls['province'];
  }

  get cantonField() {
    return this.formPatient.controls['canton'];
  }
}
