import { createReducer, on } from '@ngrx/store';
import { userData } from './app.action'

export const initialState = {
    data: []
}
const reducer = createReducer(
    initialState,
    on(userData, (state: any, action: any) => ({ ...state, data: action.data }))
)
export function reducerData(state: any, action: any) {
    return reducer(state, action)
}