import { createAction, props } from '@ngrx/store';
import { Room } from '../models';

const actionName = (identifier: string): string => {
    return `[Room] ${identifier}`;
};

export const load = createAction(actionName('Load'));
export const loadSuccess = createAction(actionName('LoadSuccess'), props<{ rooms: Room[] }>());
