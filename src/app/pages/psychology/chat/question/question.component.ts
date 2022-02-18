import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PrimeIcons} from 'primeng/api';
import {MessageService} from '@services/core';
import {TestHttpService} from '@services/psychology/test-http.service';
import {AnswerModel, PatientModel, QuestionModel, TestModel} from '@models/psychology';
import {QuestionHttpService} from '@services/psychology/question-http.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})

export class QuestionComponent implements OnInit, OnDestroy {
  @Output() progressBarAnswerOut = new EventEmitter<boolean>();
  questions$ = this.questionHttpService.questions$;
  question$ = this.questionHttpService.question$;
  loaded$ = this.questionHttpService.loaded$;
  paginator$ = this.questionHttpService.paginator$;
  questions: QuestionModel[] = [];
  formChat: FormGroup;
  primeIcons = PrimeIcons;
  progressBar: boolean = false;
  progressBarAnswer: boolean = false;
  baseQuestions: any[] = [];
  flagDuel: boolean = false;
  results: any[] = [];
  actualQuestion: number = 1;
  currentDate: Date = new Date();
  time: any;
  patient: PatientModel = {};
  agent: PatientModel = {};
  test: TestModel = {};
  age: number = 0;
  testType: string = '';
  questionSteps: number = 0;

  constructor(private formBuilder: FormBuilder,
              private messageService: MessageService,
              private questionHttpService: QuestionHttpService,
              private testHttpService: TestHttpService,
  ) {
    this.formChat = this.newFormChat;
    this.time = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);

    this.patient = this.testHttpService.patient;
    this.patient.age = this.testHttpService.age;
    this.agent = this.testHttpService.agent;
  }

  ngOnInit(): void {
    this.loadQuestions();
    this.loadWelcome();
  }

  ngOnDestroy(): void {

  }

  loadQuestions() {
    this.questionHttpService.all().subscribe(
      response => {
        this.baseQuestions = response.data;
        this.questions = this.baseQuestions.filter(question => question.type === 'phq2');
        console.log(this.questions);
      }
    );
  }

  get newFormChat(): FormGroup {
    return this.formBuilder.group({
      username: ['1234567890', [Validators.required]],
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

  reply(question: QuestionModel, answer: AnswerModel) {
    if (this.questions.find(question => question.type == 'duel')) {
      this.results.push({
        question, answer, registeredAt: new Date()
      });
      clearInterval(this.time);
      this.saveTest();
    }

    this.progressBarAnswerOut.emit(true);
    this.progressBarAnswer = true;
    setTimeout(() => {
      this.results.push({
        question, answer, registeredAt: new Date()
      });
      this.actualQuestion = question?.order! + 1;
      this.progressBarAnswer = false;
      this.progressBarAnswerOut.emit(false);

      if (this.results.length == 2) {
        this.actualQuestion = 1;
        const scorePhq2 = this.validatePhq2();

        if (scorePhq2 > 0) {
          this.testType = 'phq9a';
          this.questions = this.baseQuestions.filter(question => question.type == 'phq9a');
        }

        if (scorePhq2 == 0) {
          this.testType = 'psc17';
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
    this.test.type = this.testType;
    this.progressBarAnswerOut.emit(true);
    this.testHttpService.storeTest(this.test).subscribe(
      response => {

        this.progressBarAnswerOut.emit(false);
      }, error => {
        this.messageService.error(error);
        this.progressBarAnswerOut.emit(false);
      });
  }

  loadWelcome() {
    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      this.questionSteps++;
      this.progressBarAnswerOut.emit(false);
    }, 1000);

    setTimeout(() => {
      this.progressBarAnswerOut.emit(true);
    }, 2000);
    setTimeout(() => {
      this.questionSteps++;
      this.progressBarAnswerOut.emit(false);
    }, 3000);

    setTimeout(() => {
      this.progressBarAnswerOut.emit(true);
    }, 4000);

    this.progressBarAnswerOut.emit(true);
    setTimeout(() => {
      this.questionSteps++;
      this.progressBarAnswerOut.emit(false);
    }, 5000);

    setTimeout(() => {
      this.progressBarAnswerOut.emit(true);
    }, 6000);

    setTimeout(() => {
      this.questionSteps++;
      this.progressBarAnswerOut.emit(false);
    }, 7000);
  }
}
