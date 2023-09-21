import { createReducer, on } from '@ngrx/store';
import { mobileNumber, userData } from './app.action'

export const initialState = {
    data: [] , 
    mobileNo : ''
}
const reducer = createReducer(
    initialState,
    on(userData, (state: any, action: any) => ({ ...state, data: action.data })), 
    on(mobileNumber , (state:any , action :any) => ({ ...state , mobileNo : action.mobileNo }))
)
export function reducerData(state: any, action: any) {
    return reducer(state, action)
}