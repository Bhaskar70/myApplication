import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { ChatRoomComponent } from './chat-room.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatService } from 'src/app/services/chat/chat.service';
import { of } from 'rxjs';

describe('ChatRoomComponent', () => {
    let component: ChatRoomComponent;
    // let fixture: ComponentFixture<ChatRoomComponent>;
    let mockservice: jasmine.SpyObj<ChatService>;
    let mockUserData = [
        {
            "id": 1,
            "name": "The Swag Coder",
            "phone": "9876598765",
            "image": "assets/user/user-1.png",
            "roomId": {
                "2": "room-1",
                "3": "room-2",
                "4": "room-3",
                "5": "room-4",
                "6": "room-11",
                "7": "room-13"
            }
        },
        {
            "id": 2,
            "name": "Wade Warren",
            "phone": "9876543210",
            "image": "assets/user/user-2.png",
            "roomId": {
                "1": "room-1",
                "3": "room-5",
                "4": "room-6",
                "5": "room-7",
                "6": "room-12",
                "7": "room-14"
            }
        },
        {
            "id": 3,
            "name": "Albert Flores",
            "phone": "9988776655",
            "image": "assets/user/user-3.png",
            "roomId": {
                "1": "room-2",
                "2": "room-5",
                "4": "room-8",
                "5": "room-9",
                "6": "room-13",
                "7": "room-15"
            }
        },
        {
            "id": 4,
            "name": "Dianne Russell",
            "phone": "9876556789",
            "image": "assets/user/user-4.png",
            "roomId": {
                "1": "room-3",
                "2": "room-6",
                "3": "room-8",
                "5": "room-10",
                "6": "room-14",
                "7": "room-16"
            }
        },
        {
            "id": 5,
            "name": "Vinay Russell",
            "phone": "9876556733",
            "image": "assets/user/user-5.png",
            "roomId": {
                "1": "room-4",
                "2": "room-7",
                "3": "room-9",
                "4": "room-10",
                "6": "room-15",
                "7": "room-17"
            }
        },
        {
            "id": 6,
            "name": "Bhasker",
            "phone": "9988663311",
            "image": "",
            "roomId": {
                "1": "room-11",
                "2": "room-12",
                "3": "room-13",
                "4": "room-14",
                "5": "room-15",
                "7": "room-18"
            }
        },
        {
            "id": 7,
            "name": "Bhasker",
            "phone": "9999999999",
            "image": "",
            "roomId": {
                "1": "room-13",
                "2": "room-14",
                "3": "room-15",
                "4": "room-16",
                "5": "room-17",
                "6": "room-18"
            }
        }
    ]
    let mockStorageArray = [
        {
            roomId: "room-1",
            chats: [
                {
                    user: "Wade Warren",
                    message: "HOI"
                },
                {
                    user: "Wade Warren",
                    "message": ""
                },
                {
                    user: "Wade Warren",
                    message: "HI"
                },
                {
                    user: "Wade Warren",
                    message: "HIO"
                }
            ]
        },
        {
            roomId: "room-11",
            chats: [
                {
                    user: "The Swag Coder",
                    message: "hbjfghjdg"
                },
                {
                    user: "The Swag Coder",
                    message: "dgdfgf"
                },
                {
                    user: "Bhasker",
                    message: "gggg"
                }
            ]
        }
    ]
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ChatRoomComponent],
            imports: [HttpClientModule],
            providers: [ChatService]
        });
        mockservice = jasmine.createSpyObj('ChatService', ['getMessage', 'getStorage', 'updateChats', 'sendMessage', 'getChatData','joinRoom','setStorage'])
        component = new ChatRoomComponent(
            mockservice
        )
        mockservice.getMessage.and.returnValue(of({ user: 'test', message: 'dummy' }))
        mockservice.getChatData.and.returnValue(of([]) as any);
        mockservice.getStorage.and.returnValue(mockStorageArray)


      
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be called ngOnInit', fakeAsync(() => {
        component.roomId = 'room-1';
        component.ngOnInit();
        mockservice.getStorage.and.returnValue(mockStorageArray)
        tick(500);
        flush()
    }))
    it('should call selectUserHandler', () => {
        component.userList = mockUserData
        component.currentUser = {
            "id": 2,
            "name": "Wade Warren",
            "phone": "9876543210",
            "image": "assets/user/user-2.png",
            "roomId": {
                "1": "room-1",
                "3": "room-5",
                "4": "room-6",
                "5": "room-7",
                "6": "room-12",
                "7": "room-14"
            }
        }
        component.selectUserHandler('9876598765')
    })
    it('should call sendMessage' , fakeAsync(()=>{
        component.roomId ='room-1'
        component.currentUser = {
            "id": 2,
            "name": "Wade Warren",
            "phone": "9876543210",
            "image": "assets/user/user-2.png",
            "roomId": {
                "1": "room-1",
                "3": "room-5",
                "4": "room-6",
                "5": "room-7",
                "6": "room-12",
                "7": "room-14"
            }
        }
        mockservice.getStorage.and.returnValue(mockStorageArray)
        component.sendMessage()
        expect(mockservice.sendMessage).toHaveBeenCalled()
        expect(mockservice.setStorage).toHaveBeenCalled()
        flush()
    }))
    it('should call send message else part',()=>{
        component.roomId = ''
        component.currentUser = {
            "id": 2,
            "name": "Wade Warren",
            "phone": "9876543210",
            "image": "assets/user/user-2.png",
            "roomId": {
                "1": "room-1",
                "3": "room-5",
                "4": "room-6",
                "5": "room-7",
                "6": "room-12",
                "7": "room-14"
            }
        }
        component.sendMessage()
    })
    it('should call searchUser' , ()=>{
        component.mockUserList = mockUserData
        component.searchUser({target : { value :'Test'}})
        //expect(component.mockUserList).toEqual(mockStorageArray)
    })
});
