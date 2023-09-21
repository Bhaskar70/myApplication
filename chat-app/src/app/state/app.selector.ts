import {createFeatureSelector , createSelector} from '@ngrx/store'

export interface Data {
    data:any
    mobileNo :string
}
const featureKey = createFeatureSelector<Data>('data')

export const UserData = createSelector(featureKey , state => state.data)
export const getMobileNumber = createSelector(featureKey , state => state.mobileNo)