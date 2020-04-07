import { createAction, props } from '@ngrx/store';

export const emit = createAction('[Message] Emit', props<{ message: string, type?: string }>());
