import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, Action, on } from '@ngrx/store';
import { ControlDef } from '../models';
import * as ControlDefActions from '../actions/control-def.actions';

export interface State extends EntityState<ControlDef> {
    selectedGad: string;
}

export const adapter: EntityAdapter<ControlDef> = createEntityAdapter<ControlDef>({
    selectId: (entity: ControlDef) => entity.gad,
    sortComparer: (a: ControlDef, b: ControlDef) => a.label.localeCompare(b.label)
});

export const initialState = adapter.getInitialState({
    selectedGad: null
});

const controlDefReducer = createReducer(
    initialState,
    on(ControlDefActions.loadSuccess, (state, { controlDefs }) => adapter.setAll(controlDefs, state)),
    on(ControlDefActions.saveSuccess, (state, { controlDef }) => adapter.upsertOne(controlDef, state)),
    on(ControlDefActions.delSuccess, (state, { controlDef }) => adapter.removeOne(controlDef.gad, state)),
    on(ControlDefActions.select, (state, { gad }) => ({ ...state, selectedGad: gad }))
);

export function reducer(state: State | undefined, action: Action) {
    return controlDefReducer(state, action);
}
