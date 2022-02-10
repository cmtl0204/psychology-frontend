import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PrimeIcons} from 'primeng/api';
import {CoreHttpService} from '@services/core';
import {LocationModel} from '@models/core';

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
  questions: any[] = [];
  baseQuestions: any[] = [];
  flagDuel: boolean = false;
  results: any[] = [];
  actualQuestion: number = 1;
  numberQuestion: number = 1;
  steps: number = 1;
  currentDate: Date = new Date();
  ageValid: boolean = false;
  younger: boolean = false;
  codeVerified: string = '';

  public provinces: LocationModel[] = [];
  public cantons: LocationModel[] = [];

  constructor(private formBuilder: FormBuilder, private coreHttpService: CoreHttpService) {
    this.formChat = this.newFormChat;

    this.baseQuestions = [
      {
        id: 1,
        value: 'Hola, soy tu amigo Jorgebot, y te estaré realizando unas preguntas para conocer juntos sobre tu estado de ánimo en las últimas dos semanas. La información que me brindes será confidencial y se guardará de forma segura para proteger tu privacidad e integridad.',
        type: 'phq2',
        number: 1,
        answers: [
          {id: 1, value: 'SI', score: 1, class: 'p-button-info', icon: 'pi pi-thumbs-up'},
          {id: 2, value: 'NO', score: 0, class: 'p-button-help', icon: 'pi pi-thumbs-down'},
        ]
      },
      {
        id: 2,
        value: 'Antes de empezar, es importante que pueda saber tu edad. Selecciona la respuesta con tu edad',
        type: 'phq2',
        number: 2,
        answers: [
          {id: 3, value: 'SI', score: 1, class: 'p-button-info', icon: 'pi pi-thumbs-up'},
          {id: 4, value: 'NO', score: 0, class: 'p-button-help', icon: 'pi pi-thumbs-down'},
        ]
      },
      {
        id: 3,
        value: 'Si has perdido el interés, las ganas o el placer en hacer las cosas, ayúdame a saber ¿Cuánto días te has sentido así en las últimas dos semanas?',
        type: 'phq9a',
        number: 1,
        answers: [
          {id: 3, value: 'Para nada', score: 0, class: 'p-button-primary', icon: 'pi pi-thumbs-up'},
          {id: 4, value: 'Varios días (entre 1 a 6 días)', score: 1, class: 'p-button-info', icon: 'pi pi-thumbs-down'},
          {
            id: 5,
            value: 'La mitad de los días o más (entre 7 y 11 días)',
            score: 2,
            class: 'p-button-help',
            icon: 'pi pi-thumbs-down'
          },
          {
            id: 6,
            value: 'Casi todos los días (12 días o más)',
            score: 3,
            class: 'p-button-warn',
            icon: 'pi pi-thumbs-down'
          },
        ]
      },
      {
        id: 4,
        value: 'Si te has sentido desanimado, deprimido o triste/sin esperanza, ayúdame a saber ¿Cuánto días te has sentido así en las últimas dos semanas?',
        type: 'phq9a',
        number: 2,
        answers: [
          {id: 7, value: 'Para nada', score: 0, class: 'p-button-primary', icon: 'pi pi-thumbs-up'},
          {
            id: 8,
            value: 'Varios días (entre 1 a 6 días)',
            score: 1,
            class: 'p-button-info',
            icon: 'pi pi-thumbs-down'
          },
          {
            id: 9,
            value: 'La mitad de los días o más (entre 7 y 11 días)',
            score: 2,
            class: 'p-button-help',
            icon: 'pi pi-thumbs-down'
          },
          {
            id: 10,
            value: 'Casi todos los días (12 días o más)',
            score: 3,
            class: 'p-button-warn',
            icon: 'pi pi-thumbs-down'
          },
        ]
      },
      {
        id: 5,
        value: 'En las últimas dos semanas, ¿te has sentido inquieto o se te dificulta mantenerte sentado o calmado?',
        type: 'psc17',
        number: 1,
        answers: [
          {id: 11, value: 'Nunca', score: 0, class: 'p-button-primary', icon: 'pi pi-thumbs-up'},
          {id: 12, value: 'Algunas veces', score: 1, class: 'p-button-info', icon: 'pi pi-thumbs-down'},
          {
            id: 13,
            value: 'Frecuentemente',
            score: 2,
            class: 'p-button-help',
            icon: 'pi pi-thumbs-down'
          },
        ]
      },
      {
        id: 6,
        value: '¿Sueñas despierto demasiado?',
        type: 'psc17',
        number: 2,
        answers: [
          {id: 14, value: 'Nunca', score: 0, class: 'p-button-primary', icon: 'pi pi-thumbs-up'},
          {id: 15, value: 'Algunas veces', score: 1, class: 'p-button-info', icon: 'pi pi-thumbs-down'},
          {
            id: 16,
            value: 'Frecuentemente',
            score: 2,
            class: 'p-button-help',
            icon: 'pi pi-thumbs-down'
          },
        ]
      },
      {
        id: 7,
        value: 'Durante la pandemia, ¿alguna persona importante de tu entorno ha fallecido?',
        type: 'duel',
        number: 1,
        answers: [
          {id: 17, value: 'No', score: 0, class: 'p-button-primary', icon: 'pi pi-thumbs-up'},
          {id: 18, value: 'Si', score: 1, class: 'p-button-info', icon: 'pi pi-thumbs-down'},
        ]
      },
    ]
  }

  ngOnInit(): void {
    this.loadLocations();
    this.loadCantons();
    setTimeout(() => {
      this.scroll();
    }, 20);
    this.questions = this.baseQuestions.filter(question => question.type === 'phq2');
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

  onSubmit() {
    if (this.formChat.valid) {
      // this.login();
    } else {
      this.formChat.markAllAsTouched();
    }
  }

  reply(question: any, answer: any) {
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      this.results.push({
        question, answer, number: this.numberQuestion, registeredAt: new Date()
      });
      this.numberQuestion++;
      this.actualQuestion = question.number + 1;
      this.progressBarAnswerOut.emit(false);

      if (this.results.length == 2) {
        this.actualQuestion = 1;
        const scorePhq2 = this.validatePhq2();

        if (scorePhq2 > 0) {
          this.questions = this.baseQuestions.filter(question => question.type == 'phq9a');
        }

        if (scorePhq2 == 0) {
          this.questions = this.baseQuestions.filter(question => question.type == 'psc17');
        }
      }

      if (!this.flagDuel && this.actualQuestion > this.questions.length && this.results.length > 2) {
        this.actualQuestion = 1;
        this.flagDuel = true;
        this.questions = this.baseQuestions.filter(question => question.type == 'duel');
      }
    }, Math.random() * (2000 - 1000) + 1000);

  }

  scroll() {
    // const elements = document.getElementsByClassName('msg');
    // const last: any = elements[elements.length - 1];
    // //@ts-ignore
    // document.getElementById('container')?.scrollTop = last.offsetTop;
  }

  validatePhq2() {
    return this.results.reduce((acc, item) => {
      if (item.question.type == 'phq2') {
        acc += item.answer.score
      }
      return acc;
    }, 0);
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
