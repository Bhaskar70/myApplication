import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-errors-page',
  templateUrl: './errors-page.component.html',
  styleUrls: ['./errors-page.component.scss']
})
export class ErrorsPageComponent {
  @ViewChild('error')  error : any 
  constructor (private modalService: NgbModal) { }

  ngAfterViewInit(): void {
    this.openPopup(this.error);
  }
  openPopup(content: any): void {
    this.modalService.open(content, { backdrop: 'static', centered: true });
  }
}
