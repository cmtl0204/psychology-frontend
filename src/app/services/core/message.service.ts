import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';
import {PaginatorModel, ServerResponse} from '@models/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ValidationErrors} from '@angular/forms';
import {LoginResponse} from '@models/core/login.response';
import {Message} from "primeng/api";
import {MessageService as MessagePNService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private messageService: MessagePNService) {
  }

  error(error: HttpErrorResponse) {
    if (error.status === 400) {
      if (error.error.msg.code === '23505') {
        return Swal.fire({
          title: 'El registro ya existe',
          text: error.error.data,
          icon: 'error'
        });
      }
    }
    if (error.status === 404) {
      return Swal.fire({
        title: error.error.msg.summary,
        text: error.error.msg.detail,
        icon: 'warning'
      });
    }
    if (error.status === 422) {
      let i;
      const fields = Object.values(error.error.msg.detail).toString().split('.,');
      let html = '<ul>';
      for (i = 0; i < fields.length - 1; i++) {
        html += `<li>${fields[i]}.</li>`;
      }
      html += `<li>${fields[i]}</li>`;
      html += '</ul>';
      return Swal.fire({
        title: error.error.msg.summary,
        html,
        icon: 'error'
      });
    }

    return Swal.fire({
      title: error.error.msg.summary,
      text: error.error.msg.detail,
      icon: 'error'
    });
  }

  success(serverResponse: ServerResponse | LoginResponse | undefined) {
    return Swal.fire({
      title: serverResponse?.msg?.summary,
      text: serverResponse?.msg?.detail,
      icon: 'info'
    });
  }

  finishTest() {
    return Swal.fire({
      title: 'Gracias por participar!',
      text: 'Se enviará un correo electrónico con los resultados',
      icon: 'info'
    });
  }

  showLoading() {
    return Swal.showLoading();
  }

  hideLoading() {
    return Swal.hideLoading();
  }

  successToast() {
    this.messageService.add({severity: 'success', summary: 'Procesado Correctamente', detail: ''});
  }

  errorToast() {
    this.messageService.add({severity: 'error', summary: 'Error al procesar su petición', detail: 'Vuelva a intentar por favor'});
  }

  errorRequired() {
    this.messageService.add({severity: 'error', summary: 'No se puede eliminar', detail: 'El campo es requerido'});
  }

  questionCloseTest({title = '¿Está seguro de cerrar el caso?', text = ''}) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#EEEEEE',
      confirmButtonText: '<i class="pi pi-lock"> Si, cerrar</i>'
    });
  }

  questionDeleteAssignment({title = '¿Está seguro de quitar la asignación?', text = ''}) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#EEEEEE',
      confirmButtonText: '<i class="pi pi-lock"> Si, quitar</i>'
    });
  }

  suspendUser({title = '¿Está seguro de suspender al usuario?', text = 'El usuario no tendrá acceso al sistema!'}) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#eeeeee',
      confirmButtonText: '<i class="pi pi-ban"> Si, suspender</i>'
    });
  }
  questionDelete({title = '¿Está seguro de eliminar?', text = 'No podrá recuperar esta información!'}) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#eeeeee',
      confirmButtonText: '<i class="pi pi-trash"> Si, eliminar</i>'
    });
  }

  questionOnExit({title = '¿Está seguro de salir?', text = 'Se perderá la información que no haya guardado!'}) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '<i class="pi pi-sign-out"> Si, salir</i>'
    });
  }

  get fieldRequired(): string {
    return 'El campo es obligatorio.';
  }

  get fieldEmail(): string {
    return 'Correo electrónico no válido.';
  }

  get fieldWeb(): string {
    return 'Página web no válida.';
  }

  get fieldNumber(): string {
    return 'El campo solo debe contener numeros.';
  }

  fieldMinLength(errors: ValidationErrors) {
    return `Debe contener como mínimo de caracteres ${errors['minlength']['requiredLength']}.`;
  }

  fieldMaxLength(errors: ValidationErrors): string {
    return `Debe contener como máximo de caracteres ${errors['maxlength']['requiredLength']}.`;
  }

  fieldMin(errors: ValidationErrors) {
    return `Numero mínimo permitido es ${errors['min']['requiredMin']}.`;
  }

  fieldMax(errors: ValidationErrors): string {
    return `Numero maximo permitido es ${errors['max']['requiredMax']}.`;
  }

  get fieldPattern() {
    return `No cumple con el formato.`;
  }

  get fieldIdentification() {
    return `No cumple con el formato de una cédula Ecuatoriana.`;
  }

  get fieldNoPasswordMatch(): string {
    return 'Las contraseñas no coinciden.';
  }

  get fieldUserNotAvailable(): string {
    return 'Este usuario ya se encuentra registrado.';
  }

  get fieldEmailNotAvailable(): string {
    return 'Este correo electrónico no está disponible.';
  }

  get fieldPhoneNotAvailable(): string {
    return 'Este teléfono no está disponible.';
  }

  paginatorTotalRegisters(paginator: PaginatorModel): string {
    return 'En total hay ' + (paginator?.total ? paginator.total : 0) + ' registros.';
  }

  get paginatorNoRecordsFound(): string {
    return 'No se encontraron registros.';
  }

  get buttonFormSaveOrUpdate(): string {
    return `Guardar`;
  }

  get buttonFormClose(): string {
    return `Cerrar`;
  }

  get progressBarProcess(): string {
    return `Procesando...`;
  }

  get progressBarSaveOrUpdate(): string {
    return `Guardando...`;
  }

  get progressBarDownload(): string {
    return `Descargando...`;
  }

  get progressBarUpload(): string {
    return `Cargando...`;
  }

  get progressBarLogin(): string {
    return `Ingresando...`;
  }

  get progressBarRequestPasswordReset(): string {
    return `Enviando correo...`;
  }

  get progressBarDelete(): string {
    return `Eliminando...`;
  }

  get messagesDelete(): Message[] {
    return [{
      severity: 'success', summary: 'Success', detail: 'Message Content'
    }];
  }


  get messageSuccessDelete(): string {
    return `Se eliminó correctamente`;
  }
}
