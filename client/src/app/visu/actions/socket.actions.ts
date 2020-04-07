import { createAction, props } from '@ngrx/store';
import { GroupSocketMessage } from '../models';

const actionName = (identifier: string): string => {
    return `[Socket] ${identifier}`;
};

export const groupSocketMessage = createAction(actionName('GroupSocketMessage'), props<{ groupSocketMessage: GroupSocketMessage }>());
export const systemEvent = createAction(actionName('SystemEvent'), props<{ systemEvent: any }>());
export const clearGroupSocketMessages = createAction(actionName('ClearGroupSocketMessage'));
