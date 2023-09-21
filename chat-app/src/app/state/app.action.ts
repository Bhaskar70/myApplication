import { createAction , props} from '@ngrx/store';

export const setUserData = createAction('[login component] set user data');

export const userData = createAction('[login component]  user data' , props<{data :any}>());

export const mobileNumber = createAction('[login component] set user data' , props<{mobileNo : string}>());