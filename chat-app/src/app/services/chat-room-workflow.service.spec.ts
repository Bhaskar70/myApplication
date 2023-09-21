import { TestBed } from '@angular/core/testing';

import { ChatRoomWorkflowService } from './chat-room-workflow.service';

describe('ChatRoomWorkflowService', () => {
  let service: ChatRoomWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatRoomWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
