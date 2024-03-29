import {Component, OnInit} from '@angular/core';
import {TestHttpService} from '@services/psychology/test-http.service';
import {TestModel} from '@models/psychology';
import {ActivatedRoute} from '@angular/router';
import {ColModel, PaginatorModel} from '@models/core';
import {MessageService} from '@services/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  test: TestModel = {};
  loaded$ = this.testHttpService.loaded$;
  paginator$ = this.testHttpService.paginator$;
  paginator: PaginatorModel = {};
  cols: ColModel[];
  dialogForm: boolean = false;
  selectedTests: TestModel[] = [];

  constructor(private testHttpService: TestHttpService, private activatedRoute: ActivatedRoute,
              public messageService: MessageService) {
    this.cols = [
      {field: 'question', header: 'Pregunta'},
      {field: 'answer', header: 'Respuesta'},
    ];

  }

  ngOnInit(): void {
    this.loadTest();
  }

  loadTest() {
    this.testHttpService.getTest(this.activatedRoute.snapshot.params['testId']).subscribe(response => {
      this.test = response.data;
    });
  }

  download() {
    this.testHttpService.downloadTestResults(this.test.id!);
  }

  assignmentForm() {
    this.selectedTests = [this.test];
    this.dialogForm = true;
  }

  closeTest() {
    this.messageService.questionCloseTest({})
      .then((result) => {
        if (result.isConfirmed) {
          this.testHttpService.closeTest(this.test.id!).subscribe(
            response => {
              console.log(response);
              this.messageService.success(response);
              // this.loadTest();
            },
            error => {
              console.log(error);
              this.messageService.error(error);
            }
          );
        }
      });
  }
}
