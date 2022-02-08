import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PrimeIcons} from 'primeng/api';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
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

  constructor(private formBuilder: FormBuilder) {
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
    setTimeout(() => {
      this.scroll();
    }, 20);
    this.questions = this.baseQuestions.filter(question => question.type === 'phq2');
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
    this.progressBarAnswer = true;
    setTimeout(() => {
      this.results.push({
        question, answer, number: this.numberQuestion
      });
      this.numberQuestion++;
      this.actualQuestion = question.number + 1;
      this.progressBarAnswer = false;

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
    }, 1500);

  }

  test(event: any) {
    console.log(event);
  }

  scroll() {
    const elements = document.getElementsByClassName('msg');
    const last: any = elements[elements.length - 1];
    //@ts-ignore
    document.getElementById('container')?.scrollTop = last.offsetTop;
  }

  validatePhq2() {
    return this.results.reduce((acc, item) => {
      if (item.question.type == 'phq2') {
        acc += item.answer.score
      }
      return acc;
    }, 0);
  }
}
