import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PrimeIcons} from 'primeng/api';
import {MessageService} from '@services/core';
import {Subject, takeUntil} from 'rxjs';
import {PsychologyHttpService} from '@services/psychology/psychology-http.service';
import {PatientModel, TestModel} from '@models/psychology';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})

export class QuestionComponent implements OnInit, OnDestroy {
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
  currentDate: Date = new Date();
  time: any;
  patient: PatientModel = {};
  agent: PatientModel = {};
  test: TestModel = {};
  age: number = 0;

  constructor(private formBuilder: FormBuilder,
              private messageService: MessageService,
              private psychologyHttpService: PsychologyHttpService) {
    this.formChat = this.newFormChat;

    this.baseQuestions = [
      {
        id: 1,
        value: 'En las últimas dos semanas, ¿te has sentido triste, deprimido o sin esperanzas?',
        type: 'phq2',
        number: 1,
        answers: [
          {id: 1, value: 'SI', score: 1, class: 'p-button-info', icon: 'pi pi-thumbs-up'},
          {id: 2, value: 'NO', score: 0, class: 'p-button-help', icon: 'pi pi-thumbs-down'},
        ]
      },
      {
        id: 2,
        value: 'En las últimas dos semanas, ¿Has perdido el interés o placer en hacer cosas que te hacían sentir bien?',
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
          {id: 4, value: 'Para nada', score: 0, class: 'p-button-primary', icon: 'pi pi-thumbs-up'},
          {id: 5, value: 'Varios días (entre 1 a 6 días)', score: 1, class: 'p-button-info', icon: 'pi pi-thumbs-down'},
          {
            id: 6,
            value: 'La mitad de los días o más (entre 7 y 11 días)',
            score: 2,
            class: 'p-button-help',
            icon: 'pi pi-thumbs-down'
          },
          {
            id: 7,
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
          {id: 8, value: 'Para nada', score: 0, class: 'p-button-primary', icon: 'pi pi-thumbs-up'},
          {
            id: 9,
            value: 'Varios días (entre 1 a 6 días)',
            score: 1,
            class: 'p-button-info',
            icon: 'pi pi-thumbs-down'
          },
          {
            id: 10,
            value: 'La mitad de los días o más (entre 7 y 11 días)',
            score: 2,
            class: 'p-button-help',
            icon: 'pi pi-thumbs-down'
          },
          {
            id: 11,
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
          {id: 12, value: 'Nunca', score: 0, class: 'p-button-primary', icon: 'pi pi-thumbs-up'},
          {id: 13, value: 'Algunas veces', score: 1, class: 'p-button-info', icon: 'pi pi-thumbs-down'},
          {
            id: 14,
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
          {id: 15, value: 'Nunca', score: 0, class: 'p-button-primary', icon: 'pi pi-thumbs-up'},
          {id: 16, value: 'Algunas veces', score: 1, class: 'p-button-info', icon: 'pi pi-thumbs-down'},
          {
            id: 17,
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
          {id: 18, value: 'No', score: 0, class: 'p-button-primary', icon: 'pi pi-thumbs-up'},
          {id: 19, value: 'Si', score: 1, class: 'p-button-info', icon: 'pi pi-thumbs-down'},
        ]
      },
    ];
    this.time = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);

    this.patient = this.psychologyHttpService.patient;
    this.patient.age = this.psychologyHttpService.age;
    this.agent = this.psychologyHttpService.agent;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.scroll();
    }, 20);
    this.questions = this.baseQuestions.filter(question => question.type === 'phq2');
  }

  ngOnDestroy(): void {

  }

  get newFormChat(): FormGroup {
    return this.formBuilder.group({
      username: ['1234567890', [Validators.required]],
      // username: [null, [Validators.required]],
      password: ['12345678', [Validators.required]],
      // password: [null, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.formChat.valid) {
      // this.login();
    } else {
      this.formChat.markAllAsTouched();
    }
  }

  reply(question: any, answer: any) {
    if (this.questions.find(question => question.type == 'duel')) {
      clearInterval(this.time);
      this.saveTest();
    }

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
    }, Math.random() * (1500 - 1000) + 1000);

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

  saveTest() {
    this.test.patient = this.patient;
    this.test.agent = this.agent;
    this.test.results = this.results;
    this.progressBarAnswerOut.emit(true);
    this.psychologyHttpService.storeTest(this.test).subscribe(
      response => {
        this.progressBarAnswerOut.emit(false);
      }, error => {
        this.messageService.error(error);
        this.progressBarAnswerOut.emit(false);
      });
  }
}
