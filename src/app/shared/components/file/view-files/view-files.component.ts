import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ColModel, FileModel, PaginatorModel} from "@models/core";
import {CoreHttpService, MessageService} from "@services/core";
import {FormBuilder, FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-view-files',
  templateUrl: './view-files.component.html',
  styleUrls: ['./view-files.component.scss']
})

export class ViewFilesComponent implements OnInit, OnDestroy {
  @Input() filesIn: FileModel[] = [];
  @Input() acceptAttributes = '.pdf,.txt,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.zip,.rar,.7z,.tar, image/*';
  @Input() loadingUpload: boolean = false;
  @Input() loadingFiles: boolean = false;
  @Input() title: string = '';
  @Output() filesOut = new EventEmitter<FileModel[]>();
  @Output() files = new EventEmitter<any[]>();
  @Input() paginatorIn: PaginatorModel = {current_page: 1, per_page: 5, total: 0};
  @Output() paginatorOut = new EventEmitter<PaginatorModel>();
  @Output() searchOut = new EventEmitter<string>();
  private subscriptions: Subscription[] = [];
  selectedFiles: any[] = [];
  selectedFile: any = null;
  clonedFiles: { [s: string]: FileModel; } = {};
  cols: ColModel[] = [];
  progressBarDelete: boolean = false;
  messageDelete: boolean = false;
  timerMessageDelete: number = 0;
  filter: FormControl;

  constructor(
    private formBuilder: FormBuilder,
    private coreHttpService: CoreHttpService,
    public messageService: MessageService) {
    this.filter = new FormControl(null);
    this.filter.valueChanges
      .pipe(
        debounceTime(1000)
      )
      .subscribe(value => {
        this.searchOut.emit(value);
      })
  }

  ngOnInit(): void {
    this.loadCols();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    clearTimeout(this.timerMessageDelete);
  }

  upload(event: any) {
    this.files.emit(event);
  }

  download(file: FileModel) {
    this.coreHttpService.downloadFile(file);
  }

  delete(file = null, op: any = null) {
    if (file) {
      this.selectedFiles = [];
      this.selectedFiles.push(file);
      op.hide();
    }
    const ids = this.selectedFiles.map(element => element.id);
    this.progressBarDelete = true;
    this.subscriptions.push(
      this.coreHttpService.deleteFiles(ids)
        .subscribe(response => {
          this.remove(ids);
          this.selectedFiles = [];
          this.progressBarDelete = false;
          this.messageDelete = true;
          this.timerMessageDelete = setTimeout(() => this.messageDelete = false, 2000);

        }, error => {
          this.messageService.error(error);
          this.progressBarDelete = false;
        }));
  }

  remove(ids: (number | undefined)[]) {
    for (const id of ids) {
      this.filesIn = this.filesIn.filter(element => element.id !== id);
      this.paginatorIn.total = this.paginatorIn.total - 1;
    }
    this.filesOut.emit(this.filesIn);
  }

  paginate(event: any) {
    this.paginatorIn.current_page = event.page + 1;
    this.paginatorOut.emit(this.paginatorIn);
  }

  searchFiles(event: any) {
    if (event.type === 'click' || event.keyCode === 13 || event.target.value.length === 0) {
      this.searchOut.emit(event.target.value);
    }
  }

  changeFile(file: FileModel, value: string) {
    file.fullName = value + '.' + file.extension;
  }

  onRowEditInit(file: FileModel) {
    this.clonedFiles[file.id!] = {...file};
  }

  onRowEditSave(file: FileModel, index: number) {
    this.messageService.showLoading();
    this.subscriptions.push(
      this.coreHttpService.updateFile(file).subscribe(response => {
        this.messageService.hideLoading();
        this.messageService.success(response);
      }, error => {
        this.onRowEditCancel(file, index);
        this.messageService.hideLoading();
        this.messageService.error(error);
      }));
  }

  onRowEditCancel(file: FileModel, index: number) {
    this.filesIn[index] = this.clonedFiles[file.id!];
    delete this.clonedFiles[file.id!];
  }

  loadCols() {
    this.cols = [
      {field: 'name', header: 'Nombre'},
      {field: 'description', header: 'Descripción'},
      {field: 'extension', header: 'Tipo'},
    ];
  }
}
