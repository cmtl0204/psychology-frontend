import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild("appMessages") appMessagesContainer: ElementRef = new ElementRef(undefined);
  activatedTest: boolean = false;
  progressBarAnswer: boolean = false;

  constructor() {

  }

  ngAfterViewChecked() {
    this.appMessagesContainer.nativeElement.scrollTop = this.appMessagesContainer.nativeElement.scrollHeight;
  }

  ngOnInit(): void {
  }
}
