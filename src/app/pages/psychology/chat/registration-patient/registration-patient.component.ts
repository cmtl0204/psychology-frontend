import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CoreHttpService} from '@services/core';
import {LocationModel} from '@models/core';
import {TestHttpService} from '@services/psychology/test-http.service';

@Component({
  selector: 'app-registration-patient',
  templateUrl: './registration-patient.component.html',
  styleUrls: ['./registration-patient.component.scss']
})
export class RegistrationPatientComponent implements OnInit {
  @Output() progressBarAnswerOut = new EventEmitter<boolean>();
  @Output() stepsOut = new EventEmitter<number>();
  @Output() activatedTest = new EventEmitter<boolean>();
  @Input() younger: boolean = false;
  formPatient: FormGroup;
  progressBarAnswer: boolean = false;
  steps: number = 1;
  filteredProvinces: any[] = [];
  filteredCantons: any[] = [];

  provinces: LocationModel[] = [];
  cantons: LocationModel[] = [];
  allCantons: LocationModel[] = [];

  constructor(private formBuilder: FormBuilder,
              private coreHttpService: CoreHttpService,
              private testHttpService: TestHttpService) {
    this.formPatient = this.newFormPatient;
    this.provinceField.valueChanges.subscribe(province => {
      if (province) {
        this.cantons = this.allCantons.filter(canton => canton.parent?.id === province.id)
      }
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

  saveName() {
    if (this.nameField.valid) {
      this.progressBarAnswer = true;
      this.progressBarAnswerOut.emit(true);
      setTimeout(() => {
        this.progressBarAnswer = false;
        this.progressBarAnswerOut.emit(false);
        if (this.younger) {
          this.steps = 6;
        } else {
          this.steps++;
        }
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

  saveProvince() {
    if (this.provinceField.valid) {
      this.progressBarAnswer = true;
      this.progressBarAnswerOut.emit(true);
      setTimeout(() => {
        this.progressBarAnswer = false;
        this.progressBarAnswerOut.emit(false);
        this.steps++;
      }, Math.random() * (2000 - 1000) + 1000);
    }
  }

  saveCanton() {
    if (this.cantonField.valid) {
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
      this.testHttpService.savePatient(this.formPatient.value);
    }, Math.random() * (2000 - 1000) + 1000);
  }

  filterProvinces(event: any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.provinces.length; i++) {
      let item = this.provinces[i];
      if (item.name?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.filteredProvinces = filtered;
  }

  filterCantons(event: any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.cantons.length; i++) {
      let item = this.cantons[i];
      if (item.name?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.filteredCantons = filtered;
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
