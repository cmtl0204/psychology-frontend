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
  results: any[] = [];
  actualQuestion: number = 1;

  constructor(private formBuilder: FormBuilder) {
    this.formChat = this.newFormChat;

    this.questions = [
      {
        id: 1, value: 'En las últimas dos semanas, ¿te has sentido triste, deprimido o sin esperanzas?',
        answers: [
          {id: 1, value: 'SI', score: 1, class: 'p-button-info', icon: 'pi pi-thumbs-up'},
          {id: 2, value: 'NO', score: 0, class: 'p-button-help', icon: 'pi pi-thumbs-down'},
        ]
      },
      {
        id: 2,
        value: 'En las últimas dos semanas, ¿Has perdido el interés o placer en hacer cosas que te hacían sentir bien?',
        answers: [
          {id: 3, value: 'SI', score: 1, class: 'p-button-info', icon: 'pi pi-thumbs-up'},
          {id: 4, value: 'NO', score: 0, class: 'p-button-help', icon: 'pi pi-thumbs-down'},
        ]
      },
      {
        id: 3,
        value: 'En las últimas dos semanas, ¿Has perdido el interés o placer en hacer cosas que te hacían sentir bien?',
        answers: [
          {id: 3, value: 'SI', score: 1, class: 'p-button-info', icon: 'pi pi-thumbs-up'},
          {id: 4, value: 'NO', score: 0, class: 'p-button-help', icon: 'pi pi-thumbs-down'},
        ]
      },
      {
        id: 4,
        value: 'En las últimas dos semanas, ¿Has perdido el interés o placer en hacer cosas que te hacían sentir bien?',
        answers: [
          {id: 3, value: 'SI', score: 1, class: 'p-button-info', icon: 'pi pi-thumbs-up'},
          {id: 4, value: 'NO', score: 0, class: 'p-button-help', icon: 'pi pi-thumbs-down'},
        ]
      },
    ]
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.scroll();
    }, 20);

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
      this.actualQuestion = question.id + 1;
      this.progressBarAnswer = false;
    }, 1000);
    this.results.push({

    });
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
}
