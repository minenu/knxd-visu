import { createSelector } from '@ngrx/store';
import * as fromControlDef from './control-def.reducer';
import * as fromLogging from './logging.reducer';
import * as fromSocket from './socket.reducer';

export interface VisuState {
    controlDef: fromControlDef.State;
    logging: fromLogging.State;
    socket: fromSocket.State;
}

export interface AppState {
    visu: VisuState;
}

export const reducers = {
    controlDef: fromControlDef.reducer,
    logging: fromLogging.reducer,
    socket: fromSocket.reducer
};

/**************************************************************
 * MAIN FEATURE SELECTOR
 **************************************************************/
export const selectVisuState = (state: AppState) => state.visu;

/**************************************************************
 * CONTROL DEF
 **************************************************************/
const selectControlDefState = createSelector(
    selectVisuState,
    (state: VisuState) => state.controlDef
);

/// Map EntityAdapter
export const {
    selectEntities: selectControlDefEntities,
    selectAll: selectAllControlDefs
} = fromControlDef.adapter.getSelectors(selectControlDefState);

export const selectSelectedControlDef = createSelector(
    selectControlDefEntities,
    createSelector(selectControlDefState, (state: fromControlDef.State) => state.selectedGad),
    (entities, gad) => entities[gad]
);

/**************************************************************
 * LOGGING
 **************************************************************/
const selectLoggingState = createSelector(
    selectVisuState,
    (state: VisuState) => state.logging
);

export const selectLoggingGads = createSelector(
    selectLoggingState,
    (state: fromLogging.State) => state.loggingGads
);

/**************************************************************
 * SOCKETS
 **************************************************************/
const selectSocketState = createSelector(
    selectVisuState,
    (state: VisuState) => state.socket
);

export const selectSystemEvents = createSelector(
    selectSocketState,
    (state: fromSocket.State) => state.systemEvents
);

export const selectGroupSocketMessages = createSelector(
    selectSocketState,
    (state: fromSocket.State) => state.groupSocketMessages
);

export const selectGroupSocketMessage = createSelector(
    selectSocketState,
    (state: fromSocket.State) => state.groupSocketMessage
);

export const selectBusMonitorLimit = createSelector(
    selectSocketState,
    (state: fromSocket.State) => state.busMonitorLimit
);
