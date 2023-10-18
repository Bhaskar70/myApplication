import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserData, getMobileNumber } from '../state/app.selector';
import { combineLatest, map, mergeMap, of } from 'rxjs';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
// import { userData } from '../state/app.action';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomWorkflowService implements CanActivate {

  constructor(private store: Store , private router:Router ) { }
  canActivate() {
    return this.store.select(getMobileNumber).pipe(
      mergeMap((mobileno) => {
        return this.store.select(UserData).pipe(map((userData) => {
          console.log(userData.filter((val: any) => val.phone == mobileno.toString()), "18::::")
          if (userData.filter((val: any) => val.phone == mobileno.toString()).length) {
            return true
          } else {
            this.router.navigate(['error'])
            return false
          }
        }))
      })
    )
  }
}
