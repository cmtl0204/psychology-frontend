import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PrimeIcons} from 'primeng/api';
import {CoreHttpService} from '@services/core';
import {LocationModel} from '@models/core';
import {TestHttpService} from '@services/psychology/test-http.service';

@Component({
  selector: 'app-registration-patient',
  templateUrl: './registration-patient.component.html',
  styleUrls: ['./registration-patient.component.scss']
})
export class RegistrationPatientComponent implements OnInit {
  formPatient: FormGroup;
  primeIcons = PrimeIcons;
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
  public allCantons: LocationModel[] = [];

  constructor(private formBuilder: FormBuilder,
              private coreHttpService: CoreHttpService,
              private psychologyHttpService: TestHttpService) {
    this.formPatient = this.newFormPatient;
    this.provinceField.valueChanges.subscribe(province => {
      console.log(province);
      console.log(this.allCantons);
      this.cantons = this.allCantons.filter(canton => canton.parent?.id === province.id)
      console.log(this.cantons);
    });
  }

  ngOnInit(): void {
    this.loadLocations();
    this.loadCantons();
  }

  get newFormPatient(): FormGroup {
    return this.formBuilder.group({
      // username: ['1234567890', [Validators.required]],
      // name: ['CHRISTOPHER DE LAS MERCEDES', [Validators.required]],
      // lastname: ['VILLAVICENCIO QUINCHIGUANGO', [Validators.required]],
      // email: ['mayrapaulinaquinatoagomez@yahoo.com', [Validators.required, Validators.email]],
      // phone: ['0987654321', [Validators.required]],
      // province: [{id: 265}, [Validators.required]],
      // canton: [{id: 451}, [Validators.required]],
      username: [null, [Validators.required]],
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
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
        this.allCantons = response.data;
        console.log(this.allCantons);
      }, error => {
        // this.messageService.error(error);
      }
    );
  }

  saveUsername() {
    if (this.usernameField.valid) {
      this.progressBarAnswer = true;
      this.progressBarAnswerOut.emit(true);
      setTimeout(() => {
        this.progressBarAnswer = false;
        this.progressBarAnswerOut.emit(false);
        // this.steps = 5;
        this.steps++;
      }, Math.random() * (2000 - 1000) + 1000);
    }
  }

  saveName() {
    if (this.nameField.valid) {
      this.progressBarAnswer = true;
      this.progressBarAnswerOut.emit(true);
      setTimeout(() => {
        this.progressBarAnswer = false;
        this.progressBarAnswerOut.emit(false);
        this.steps++;
      }, Math.random() * (2000 - 1000) + 1000);
    }
  }

  saveLastname() {
    if (this.lastnameField.valid) {
      this.progressBarAnswer = true;
      this.progressBarAnswerOut.emit(true);
      setTimeout(() => {
        this.progressBarAnswer = false;
        this.progressBarAnswerOut.emit(false);
        this.steps++;
      }, Math.random() * (2000 - 1000) + 1000);
    }
  }

  saveEmail() {
    if (this.emailField.valid) {
      this.progressBarAnswer = true;
      this.progressBarAnswerOut.emit(true);
      setTimeout(() => {
        this.progressBarAnswer = false;
        this.progressBarAnswerOut.emit(false);
        this.steps++;
      }, Math.random() * (2000 - 1000) + 1000);
    }
  }

  savePhone() {
    if (this.phoneField.valid) {
      this.progressBarAnswer = true;
      this.progressBarAnswerOut.emit(true);
      setTimeout(() => {
        this.progressBarAnswer = false;
        this.progressBarAnswerOut.emit(false);
        this.steps++;
      }, Math.random() * (2000 - 1000) + 1000);
    }
  }

  saveAddress() {
    if (this.provinceField.valid && this.cantonField.valid) {
      this.progressBarAnswer = true;
      this.progressBarAnswerOut.emit(true);
      setTimeout(() => {
        this.progressBarAnswer = false;
        this.progressBarAnswerOut.emit(false);
        this.steps++;
      }, Math.random() * (2000 - 1000) + 1000);
    }
  }

  startTest() {
    this.progressBarAnswer = true;
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      this.stepsOut.emit(4);
      this.activatedTest.emit(true);
      this.progressBarAnswer = false;
      this.progressBarAnswerOut.emit(false);
      this.steps++;
      this.psychologyHttpService.savePatient(this.formPatient.value);
    }, Math.random() * (2000 - 1000) + 1000);
  }

  get usernameField() {
    return this.formPatient.controls['username'];
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
