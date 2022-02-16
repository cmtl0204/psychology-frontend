import {Component, OnInit} from '@angular/core';
import {ColModel, PaginatorModel} from '@models/core';
import {MenuItem} from 'primeng/api';
import {FormControl} from '@angular/forms';
import {TestModel} from '@models/psychology';
import {MessageService} from '@services/core';
import {TestHttpService} from '@services/psychology/test-http.service';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit {
  tests$ = this.psychologyHttpService.tests$;
  test$ = this.psychologyHttpService.test$;
  loaded$ = this.psychologyHttpService.loaded$;
  paginator$ = this.psychologyHttpService.paginator$;
  selectedTests: TestModel[] = [];
  selectedTest: TestModel = {};
  cols: ColModel[];
  items: MenuItem[] = [];
  dialogForm: boolean = false;
  progressBarDelete: boolean = false;
  search: FormControl = new FormControl('');
  paginator: PaginatorModel = {};

  states: any[] = [{name: 'TODOS'}, {name: 'SIN ASIGNAR'}, {name: 'ASIGNADO'}, {name: 'FINALIZADO'}];
  rangeDates: Date[] = [new Date(), new Date()];

  constructor(private psychologyHttpService: TestHttpService,
              public messageService: MessageService) {
    this.cols = [
      {field: 'code', header: 'Test'},
      {field: 'user', header: 'Usuario'},
      {field: 'assignment', header: 'Institución'},
      {field: 'priority', header: 'Prioridad'},
      {field: 'state', header: 'Estado'},
      {field: 'createdAt', header: 'Fecha'},
    ];
    this.items = [
      {
        label: 'Ver Informe', icon: 'pi pi-eye', command: () => {
          this.assignmentForm();
        }
      },
      {
        label: 'Asignar', icon: 'pi pi-share-alt', command: () => {
          this.assignmentForm();
        }
      },
      {
        label: 'Descargar Informe', icon: 'pi pi-download', command: () => {
          this.deleteTest(this.selectedTest);
        }
      },
      {
        label: 'Eliminar', icon: 'pi pi-trash', command: () => {
          this.deleteTest(this.selectedTest);
        }
      },
    ];

    this.paginator$.subscribe(response => {
      this.paginator = response;
    });
  }

  ngOnInit(): void {
    this.loadTests();
  }

  loadTests(page: number = 1) {
    this.tests$ = this.psychologyHttpService.getTests(page, this.search.value);
  }

  selectTest(test: TestModel) {
    this.selectedTest = test;
  }

  deleteTest(test: TestModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.psychologyHttpService.deleteTest(test.id!).subscribe(
            response => {
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          );
        }
      });
  }

  deleteTests(): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          const ids = this.selectedTests.map(element => element.id);
          this.psychologyHttpService.deleteTests(ids).subscribe(
            response => {
              this.messageService.success(response);
            },
            error => {
              this.messageService.error(error);
            }
          );
        }
      });

  }

  filter(event: any) {
    if (event.key === 'Enter' || event.type === 'click') {
      this.loadTests();
    }
  }

  paginate(event: any) {
    this.paginator.current_page = event.page + 1;
    this.loadTests(this.paginator.current_page);
  }

  assignmentForms() {
    this.dialogForm = true;
  }

  assignmentForm() {
    this.selectedTests = [this.selectedTest];

    this.dialogForm = true;
  }
}
