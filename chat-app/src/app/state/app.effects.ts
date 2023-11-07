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

    loadUserData$ = createEffect(()=> this.action$.pipe(
        ofType(setUserData),
        concatMap(() => {
             return this.service.getRegisterData().pipe(map((res=>{
                return userData({data: JSON.parse(JSON.stringify(res))})
             })))
        })
    ))
    
    // loadUserData$ = createEffect(() => this.action$.pipe(
    //     ofType(setUserData),
    //     concatMap(() =>
    //         this.service.getRegisterData().pipe(map((res: any) => {
    //             console.log(res,"28::::")
    //             return res.length ? userData({ data: res.map(({ _id, ...rest }: any) => rest) }) : userData({ data: [] })
    //         })
    //         ))
    // )
    // )
}