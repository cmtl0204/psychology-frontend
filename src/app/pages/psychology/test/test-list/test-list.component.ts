import {Component, OnInit} from '@angular/core';
import {ColModel, LocationModel, PaginatorModel} from '@models/core';
import {MenuItem} from 'primeng/api';
import {FormControl} from '@angular/forms';
import {isDate, isBefore, isAfter, format} from 'date-fns';
import {PriorityModel, TestModel} from '@models/psychology';
import {CoreHttpService, MessageService} from '@services/core';
import {TestHttpService} from '@services/psychology/test-http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit {
  tests$ = this.testHttpService.tests$;
  test$ = this.testHttpService.test$;
  loaded$ = this.testHttpService.loaded$;
  paginator$ = this.testHttpService.paginator$;
  selectedTests: TestModel[] = [];
  selectedTest: TestModel = {};
  cols: ColModel[];
  items: MenuItem[] = [];
  dialogForm: boolean = false;
  progressBarDelete: boolean = false;
  search: FormControl = new FormControl('');
  paginator: PaginatorModel = {};
  countPriorities: PriorityModel[] = [];
  countAllPriorities: PriorityModel[] = [];
  countAllTests: string = '0';
  states: any[] = [{id: 1, name: 'SIN ASIGNAR'}, {id: 2, name: 'ASIGNADO'}, {
    id: 3,
    name: 'CERRADO'
  }];
  priorities: any[] = [{id: 1, name: 'Alta Intensidad'}, {id: 2, name: 'Media Intesidad'},
    {
      id: 3,
      name: 'Baja Intensidad'
    }, {
      id: 4,
      name: 'Sin Sroblemas'
    }];
  rangeDates: Date[] = [new Date(), new Date()];
  currentDate: Date = new Date();
  state: FormControl = new FormControl(null);
  provinces: LocationModel[] = [];
  selectedProvinces: any[] = [];
  selectedStates: any[] = [];
  selectedPriorities: any[] = [];

  constructor(private testHttpService: TestHttpService,
              private coreHttpService: CoreHttpService,
              public messageService: MessageService,
              private router: Router) {
    this.cols = [
      {field: 'code', header: 'Test'},
      {field: 'user', header: 'Usuario'},
      {field: 'province', header: 'Provincia'},
      {field: 'assignment', header: 'Institución'},
      {field: 'priority', header: 'Prioridad'},
      {field: 'state', header: 'Estado'},
      {field: 'createdAt', header: 'Fecha'},
    ];
    this.items = [
      {
        label: 'Ver Informe', icon: 'pi pi-eye', command: () => {
          this.router.navigate(['/test/result', this.selectedTest.id]);
        }
      },
      {
        label: 'Asignar', icon: 'pi pi-share-alt', command: () => {
          this.assignmentForm();
        }
      },
      {
        label: 'Cerrar Caso', icon: 'pi pi-lock', command: () => {
          this.closeTest();
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
    this.loadCountPriorities()
    this.loadCountAllPriorities()
    this.loadLocations();
    this.loadCountAllTests();
  }

  loadTests(page: number = 1) {
    if (this.rangeDates[1]) {
      const startedAt = format(this.rangeDates[0].setHours(0, 0, 0), 'yyyy-MM-dd HH:mm:ss')
      const endedAt = format(this.rangeDates[1].setHours(23, 59, 59), 'yyyy-MM-dd HH:mm:ss');
      const provinceIds = this.selectedProvinces.map(province => province.id);
      const stateIds = this.selectedStates.map(state => state.id);
      const priorityIds = this.selectedPriorities.map(priority => priority.id);

      this.tests$ = this.testHttpService.getTests(page, this.search.value, priorityIds, stateIds, provinceIds, startedAt, endedAt);
    }
  }

  loadCountPriorities() {
    if (this.rangeDates[1]) {
      const startedAt = format(this.rangeDates[0].setHours(0, 0, 0), 'yyyy-MM-dd HH:mm:ss')
      const endedAt = format(this.rangeDates[1].setHours(23, 59, 59), 'yyyy-MM-dd HH:mm:ss');
      const ids = this.selectedProvinces.map(province => province.id);
      this.testHttpService.countPriorities(ids, startedAt, endedAt).subscribe(
        response => {
          this.countPriorities = response.data;
        }
      );
    }
  }

  loadCountAllPriorities() {
    const ids = this.selectedProvinces.map(province => province.id);
    this.testHttpService.countAllPriorities(ids).subscribe(
      response => {
        this.countAllPriorities = response.data;
      }
    );
  }

  loadCountAllTests() {
    if (this.rangeDates[1]) {
      const startedAt = format(this.rangeDates[0].setHours(0, 0, 0), 'yyyy-MM-dd HH:mm:ss')
      const endedAt = format(this.rangeDates[1].setHours(23, 59, 59), 'yyyy-MM-dd HH:mm:ss');
      const ids = this.selectedProvinces.map(province => province.id);
      this.testHttpService.countAllTests(ids, startedAt, endedAt).subscribe(
        response => {
          this.countAllTests = response.data.toString();
        }
      );
    }
  }

  loadLocations() {
    this.coreHttpService.getLocations('PROVINCE').subscribe(
      response => {
        this.provinces = response.data;
        // this.selectedProvinces = response.data;
      }, error => {
        // this.messageService.error(error);
      }
    );
  }

  loadAllMethods(page: number = 1) {
    this.loadTests(page);
    this.loadCountPriorities();
    this.loadCountAllTests();
    this.loadCountAllPriorities();
  }

  selectTest(test: TestModel) {
    this.selectedTest = test;
    this.testHttpService.selectTest(test);
  }

  deleteTest(test: TestModel): void {
    this.messageService.questionDelete({})
      .then((result) => {
        if (result.isConfirmed) {
          this.testHttpService.deleteTest(test.id!).subscribe(
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
          this.testHttpService.deleteTests(ids).subscribe(
            response => {
              this.selectedTests = [];
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

  closeTest(){
    this.messageService.questionCloseTest({})
      .then((result) => {
        if (result.isConfirmed) {
          this.testHttpService.closeTest(this.selectedTest.id!).subscribe(
            response => {
              this.messageService.success(response);
              this.loadAllMethods(this.paginator.current_page);
            },
            error => {
              this.messageService.error(error);
            }
          );
        }
      });
  }
}
