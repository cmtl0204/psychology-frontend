import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  activatedTest: boolean = false;
  progressBarAnswer: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
