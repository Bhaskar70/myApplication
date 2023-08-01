import {createFeatureSelector , createSelector} from '@ngrx/store'

export interface Data {
    data:any
}
const featureKey = createFeatureSelector<Data>('data')

export const UserData = createSelector(featureKey , state => state.data)