import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, Action, on } from '@ngrx/store';
import { ControlValue } from '../models';
import * as ControlValueActions from '../actions/control-value.actions';

export interface State extends EntityState<ControlValue> {}

export const adapter: EntityAdapter<ControlValue> = createEntityAdapter<ControlValue>({
    selectId: (entity: ControlValue) => entity.gad
});

export const initialState = adapter.getInitialState();

const controlValueReducer = createReducer(
    initialState,
    on(ControlValueActions.set, (state, { controlValue }) => adapter.upsertOne(controlValue, state))
);

export function reducer(state: State | undefined, action: Action) {
    return controlValueReducer(state, action);
}
