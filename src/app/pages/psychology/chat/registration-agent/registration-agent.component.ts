import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CoreHttpService, MessageService} from '@services/core';
import {TestHttpService} from '@services/psychology/test-http.service';
import {LocationModel} from '@models/core';
import {RegularExpresions} from '@shared/regular-expresions/regular-expresions';

@Component({
  selector: 'app-registration-agent',
  templateUrl: './registration-agent.component.html',
  styleUrls: ['./registration-agent.component.scss']
})
export class RegistrationAgentComponent implements OnInit {
  @Output() progressBarAnswerOut = new EventEmitter<boolean>();
  @Output() stepsOut = new EventEmitter<number>();
  @Output() codeVerifiedOut = new EventEmitter<string>();
  formAgent: FormGroup;
  progressBarAnswer: boolean = false;
  steps: number = 1;
  provinces: LocationModel[] = [];
  cantons: LocationModel[] = [];
  verifiedCode: string = '';

  constructor(private formBuilder: FormBuilder,
              private coreHttpService: CoreHttpService,
              private testHttpService: TestHttpService,
              public messageService: MessageService,
  ) {
    this.formAgent = this.newFormAgent;
  }

  ngOnInit(): void {
    this.loadLocations();
    this.loadCantons();
  }

  get newFormAgent(): FormGroup {
    return this.formBuilder.group({
      // identification: ['1234567890', [Validators.required]],
      // name: ['CHRISTOPHER DE LAS MERCEDES', [Validators.required]],
      // phone: ['0987654321', [Validators.required]],
      // email: ['mayrapaulinaquinatoagomez@yahoo.com', [Validators.required, Validators.email]],
      // lastname: ['VILLAVICENCIO QUINCHIGUANGO', [Validators.required]],
      identification: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.pattern(RegularExpresions.alphaSpaces())]],
      lastname: [null, [Validators.required, Validators.pattern(RegularExpresions.alphaSpaces())]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
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
    if (this.identificationField.valid) {
      this.progressBarAnswer = true;
      this.progressBarAnswerOut.emit(true);
      setTimeout(() => {
        this.progressBarAnswer = false;
        this.progressBarAnswerOut.emit(false);
        // this.steps = 4;
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

  saveEmail() {
    if (this.emailField.valid) {
      this.progressBarAnswer = true;
      this.progressBarAnswerOut.emit(true);
      this.testHttpService.requestTransactionalCode(this.formAgent.value).subscribe(
        response => {
          this.progressBarAnswer = false;
          this.progressBarAnswerOut.emit(false);
          this.steps++;
        }, error => {
          this.progressBarAnswer = false;
          this.progressBarAnswerOut.emit(false);
          this.messageService.error(error);
        }
      );
    }
  }

  resendEmail() {
    if (this.emailField.valid) {
      this.progressBarAnswer = true;
      this.progressBarAnswerOut.emit(true);
      this.testHttpService.requestTransactionalCode(this.formAgent.value).subscribe(
        response => {
          this.progressBarAnswer = false;
          this.progressBarAnswerOut.emit(false);
        }, error => {
          this.progressBarAnswer = false;
          this.progressBarAnswerOut.emit(false);
          this.messageService.error(error);
        }
      );
    }
  }

  saveCode() {
    if (this.codeField.valid) {
      this.progressBarAnswer = true;
      this.progressBarAnswerOut.emit(true);
      this.testHttpService.verifyTransactionalCode(this.codeField.value).subscribe(
        response => {
          this.progressBarAnswer = false;
          this.progressBarAnswerOut.emit(false);
          this.stepsOut.emit(4);
          this.codeVerifiedOut.emit('valid');
          this.verifiedCode = 'valid';
          this.steps++;
          this.testHttpService.saveAgent(this.formAgent.value);
        }, error => {
          this.progressBarAnswer = false;
          this.progressBarAnswerOut.emit(false);
          this.codeVerifiedOut.emit('invalid');
          this.verifiedCode = 'invalid';
          // this.messageService.error(error);
        }
      );

    }
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
