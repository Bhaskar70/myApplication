import { createAction , props} from '@ngrx/store';

export const userData = createAction('[app component]  users data' , props<{data:any}>() )