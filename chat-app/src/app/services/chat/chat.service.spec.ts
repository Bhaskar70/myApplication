import { TestBed } from '@angular/core/testing';

import { ChatService } from './chat.service';
import { HttpClientModule } from '@angular/common/http';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule]
    });
    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
