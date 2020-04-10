import { createSelector } from '@ngrx/store';
import * as fromControlDef from './control-def.reducer';
import * as fromControlValue from './control-value.reducer';
import * as fromLogging from './logging.reducer';
import * as fromRoom from './room.reducer';
import * as fromSocket from './socket.reducer';

export interface VisuState {
    controlDef: fromControlDef.State;
    controlValue: fromControlValue.State;
    logging: fromLogging.State;
    room: fromRoom.State;
    socket: fromSocket.State;
}

export interface AppState {
    visu: VisuState;
}

export const reducers = {
    controlDef: fromControlDef.reducer,
    controlValue: fromControlValue.reducer,
    logging: fromLogging.reducer,
    room: fromRoom.reducer,
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
 * CONTROL VALUE
 **************************************************************/
const selectControlValueState = createSelector(
    selectVisuState,
    (state: VisuState) => state.controlValue
);

/// Map EntityAdapter
export const {
    selectAll: selectAllControlValues
} = fromControlValue.adapter.getSelectors(selectControlValueState);


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
 * ROOM
 **************************************************************/
const selectRoomState = createSelector(
    selectVisuState,
    (state: VisuState) => state.room
);

/// Map EntityAdapter
export const {
    selectAll: selectAllRooms
} = fromRoom.adapter.getSelectors(selectRoomState);

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
