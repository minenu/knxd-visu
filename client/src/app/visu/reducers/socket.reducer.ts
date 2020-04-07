import { createReducer, Action, on } from '@ngrx/store';
import * as SocketActions from '../actions/socket.actions';
import { GroupSocketMessage } from '../models';

export interface State {
    systemEvents: any[];
    groupSocketMessages: GroupSocketMessage[];
    groupSocketMessage: GroupSocketMessage;
    busMonitorLimit: number;
}

export const initialState = {
    systemEvents: [],
    groupSocketMessages: [],
    groupSocketMessage: null,
    busMonitorLimit: 30
};

const socketReducer = createReducer(
    initialState,
    on(SocketActions.systemEvent, (state, { systemEvent }) => ({
        ...state,
        systemEvents: [ systemEvent, ...state.systemEvents ]
    })),
    on(SocketActions.groupSocketMessage, (state, { groupSocketMessage }) => ({
        ...state,
        groupSocketMessages: [  groupSocketMessage, ...state.groupSocketMessages].slice(0, state.busMonitorLimit),
        groupSocketMessage
    })),
    on(SocketActions.clearGroupSocketMessages, (state) => ({ ...state, groupSocketMessages: [] }))
);

export function reducer(state: State | undefined, action: Action) {
    return socketReducer(state, action);
}
