import { createAction, props } from '@ngrx/store';
import { ControlDef } from '../models';

const actionName = (identifier: string): string => {
    return `[ControlDef] ${identifier}`;
};

export const load = createAction(actionName('Load'));
export const loadSuccess = createAction(actionName('LoadSuccess'), props<{ controlDefs: ControlDef[] }>());
export const save = createAction(actionName('Save'), props<{ controlDef: ControlDef }>());
export const saveSuccess = createAction(actionName('SaveSuccess'), props<{ controlDef: ControlDef }>());
export const del = createAction(actionName('Delete'), props<{ controlDef: ControlDef }>());
export const delSuccess = createAction(actionName('DeleteSuccess'), props<{ controlDef: ControlDef }>());
export const select = createAction(actionName('Select'), props<{ gad: string; }>());
