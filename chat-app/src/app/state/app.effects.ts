import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";
import { ChatService } from "../services/chat/chat.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { setUserData, userData } from "./app.action";
import { concatMap, map, mergeMap } from "rxjs";
import { Data } from "./data";



@Injectable()
export class AppEffects {
    constructor(private action$: Actions, private service: ChatService) { }

    // loadUserData$ = createEffect(()=> this.action$.pipe(
    //     ofType(setUserData),
    //     map(() => {
    //          console.log(this.service.getUserData())
    //          this.service.getUserData().length ? '' : localStorage.setItem("userData", JSON.stringify(Data)) 
    //          return this.service.getUserData().length ? userData({data :this.service.getUserData()}) : userData({data :Data})
    //     })
    // ))
    // }
    loadUserData$ = createEffect(() => this.action$.pipe(
        ofType(setUserData),
        concatMap(() =>
            this.service.getRegisterData().pipe(map((res: any) => {
                console.log(res,"28::::")
                return res.length ? userData({ data: res.map(({ _id, ...rest }: any) => rest) }) : userData({ data: [] })
            })
            ))
    )
    )
}