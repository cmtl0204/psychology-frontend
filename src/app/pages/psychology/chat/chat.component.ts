import {AfterViewChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  activatedTest: boolean = false;
  progressBarAnswer: boolean = false;
  @ViewChild("appMessages") appMessagesContainer: ElementRef = new ElementRef(undefined);

  constructor() {
    // setInterval(() => {
    //   this.scroll();
    // }, 2000);
  }

  ngAfterViewChecked() {
    this.appMessagesContainer.nativeElement.scrollTop = this.appMessagesContainer.nativeElement.scrollHeight;
  }

  ngOnInit(): void {
  }

  scroll() {
    const elements = document.getElementsByClassName('panel-answer');
    const last: any = elements[elements.length - 1];
    console.log(last);
    //@ts-ignore
    document.getElementById('app-messages').scrollTop = last.offsetTop;
  }
}
