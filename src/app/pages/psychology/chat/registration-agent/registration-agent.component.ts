import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PrimeIcons} from 'primeng/api';
import {CoreHttpService} from '@services/core';
import {LocationModel} from '@models/core';
import {Subject, takeUntil} from 'rxjs';
import {PsychologyHttpService} from '@services/psychology/psychology-http.service';

@Component({
  selector: 'app-registration-agent',
  templateUrl: './registration-agent.component.html',
  styleUrls: ['./registration-agent.component.scss']
})
export class RegistrationAgentComponent implements OnInit {
  formAgent: FormGroup;
  primeIcons = PrimeIcons;
  progressBar: boolean = false;
  progressBarAnswer: boolean = false;
  @Output() progressBarAnswerOut = new EventEmitter<boolean>();
  @Output() stepsOut = new EventEmitter<number>();
  @Output() codeVerifiedOut = new EventEmitter<string>();
  steps: number = 1;
  currentDate: Date = new Date();
  ageValid: boolean = false;
  adult: boolean = false;
  public provinces: LocationModel[] = [];
  public cantons: LocationModel[] = [];

  constructor(private formBuilder: FormBuilder, private coreHttpService: CoreHttpService,
              private psychologyHttpService: PsychologyHttpService) {
    this.formAgent = this.newFormAgent;
  }

  ngOnInit(): void {
    this.loadLocations();
    this.loadCantons();
  }

  get newFormAgent(): FormGroup {
    return this.formBuilder.group({
      identification: ['1234567890', [Validators.required]],
      name: ['CHRISTOPHER DE LAS MERCEDES', [Validators.required]],
      lastname: ['VILLAVICENCIO QUINCHIGUANGO', [Validators.required]],
      email: ['mayrapaulinaquinatoagomez@yahoo.com', [Validators.required, Validators.email]],
      phone: ['0987654321', [Validators.required]],
      code: [null, [Validators.required]],
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
      // this.steps = 5;
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

  saveCode() {
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      this.progressBarAnswerOut.emit(false);
      if (this.codeField.value === 1234) {
        this.stepsOut.emit(4);
        this.codeVerifiedOut.emit('valid');
        this.steps++;
        this.psychologyHttpService.saveAgent(this.formAgent.value);
      } else {
        this.codeVerifiedOut.emit('invalid');
      }
    }, Math.random() * (2000 - 1000) + 1000);
  }

  get identificationField() {
    return this.formAgent.controls['identification'];
  }

  get lastnameField() {
    return this.formAgent.controls['lastname'];
  }

  get nameField() {
    return this.formAgent.controls['name'];
  }

  get emailField() {
    return this.formAgent.controls['email'];
  }

  get phoneField() {
    return this.formAgent.controls['phone'];
  }

  get codeField() {
    return this.formAgent.controls['code'];
  }
}
