
import { createAction, props } from '@ngrx/store';
import { ControlValue } from '../models';

const actionName = (identifier: string): string => {
    return `[ControlValue] ${identifier}`;
};

export const set = createAction(actionName('Set'), props<{ controlValue: ControlValue }>());
