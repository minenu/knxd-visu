import { createAction, props } from '@ngrx/store';

const actionName = (identifier: string): string => {
    return `[Logging] ${identifier}`;
};

export const loadLoggingGads = createAction(actionName('LoadLoggingGads'));
export const loadLoggingGadsSuccess = createAction(actionName('LoadLoggingGadsSuccess'), props<{ gads: string[] }>());
export const addLoggingGad = createAction(actionName('AddLoggingGad'), props<{ gad: string }>());
export const addLoggingGadSuccess = createAction(actionName('AddLoggingGadSuccess'), props<{ gad: string }>());
export const removeLoggingGad = createAction(actionName('RemoveLoggingGad'), props<{ gad: string }>());
export const removeLoggingGadSuccess = createAction(actionName('RemoveLoggingGadSuccess'), props<{ gad: string }>());

