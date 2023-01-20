import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AnswerModel, PatientModel, QuestionModel} from "@models/psychology";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PrimeIcons} from "primeng/api";
import {ChatModel} from "@models/psychology/chat.model";
import {MessageService} from "@services/core";
import {QuestionHttpService} from "@services/psychology/question-http.service";
import {TestHttpService} from "@services/psychology/test-http.service";

@Component({
  selector: 'app-question-adults',
  templateUrl: './question-adults.component.html',
  styleUrls: ['./question-adults.component.scss']
})
export class QuestionAdultsComponent implements OnInit {
  @Output() progressBarAnswerOut = new EventEmitter<boolean>();
  @Output() renderScrollOut = new EventEmitter<boolean>();
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
  patient: PatientModel = {};
  agent: PatientModel = {};
  chat: ChatModel = {};
  age: number = 0;
  testType: string = '';
  questionSteps: number = 0;
  finalMessage: string = '';
  totalQuestions: number = 0;

  constructor(private formBuilder: FormBuilder,
              private messageService: MessageService,
              private questionHttpService: QuestionHttpService,
              private testHttpService: TestHttpService,
  ) {
    this.formChat = this.newFormChat;
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
      }
    );
  }

  get newFormChat(): FormGroup {
    return this.formBuilder.group({
      patient: [null, [Validators.required]],
      agent: [null, [Validators.required]],
      results: [null, [Validators.required]],
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
    if (this.totalQuestions - 1 === this.results.length) {
      this.results.push({
        question, answer, registeredAt: new Date()
      });

      this.saveTest(question);
    } else {
      this.progressBarAnswerOut.emit(true);
      this.progressBarAnswer = true;
      setTimeout(() => {
        this.results.push({
          question, answer, registeredAt: new Date()
        });
        this.actualQuestion = question?.order! + 1;
        this.progressBarAnswer = false;
        this.progressBarAnswerOut.emit(false);
        console.log(this.results);
        if (this.results.length == 2) {
          this.actualQuestion = 1;
          const scorePhq2 = this.validatePhq2();

          if (scorePhq2 > 0) {
            this.testType = 'phq9';
            this.questions = this.baseQuestions.filter(question => question.type == 'phq9');
            this.totalQuestions = this.questions.length + 2;
          }

          if (scorePhq2 == 0) {
            this.testType = 'srq18';
            this.questions = this.baseQuestions.filter(question => question.type == 'srq18');
            this.totalQuestions = this.questions.length + 2;
          }
        }
      }, Math.random() * (4000 - 2000) + 2000);
    }
  }

  validatePhq2() {
    return this.results.reduce((acc, item) => {
      if (item.question.type == 'phq2') {
        acc += item.answer.score
      }
      return acc;
    }, 0);
  }

  saveTest(question: QuestionModel) {
    this.chat.patient = this.patient;
    this.chat.agent = this.agent;
    this.chat.results = this.results;
    this.chat.type = this.testType;
    this.progressBarAnswerOut.emit(true);
    this.progressBarAnswer = true;
    this.testHttpService.storeChat(this.chat).subscribe(
      response => {
        this.actualQuestion = question?.order! + 1;
        this.progressBarAnswer = false;
        if (response.data.priority.level === 4) {
          this.finalMessage = 'Muchas gracias por tu participación. TEMI, te ha escuchado y te animo a seguir cuidando de ti. Actualmente tu salud mental se encuentra en equlibrio. Recuerda que este es un servicio gratuito. ¡Hasta pronto!';
        } else {
          this.finalMessage = 'Muchas gracias por tu participación.  TEMI, te ha escuchado y ponemos a disposición nuestros servicios de atención psicológica gratuita. En las siguientes dos semanas, un psicólogo o psicóloga se comunicará contigo o con tu representante legal. En caso de que cuentes con alguna emergencia o situación que amerita una atención urgente, por favor comunícate a la línea 171 opción 2, el servicio virtual de salud mental del Ministerio de Salud Pública. Recuerda que tu bienestar es una prioridad. ¡Hasta pronto!';
        }
        this.progressBarAnswerOut.emit(false);
        this.progressBarAnswer = false;
      }, error => {
        this.messageService.error(error);
        this.progressBarAnswerOut.emit(false);
        this.progressBarAnswer = false;
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
