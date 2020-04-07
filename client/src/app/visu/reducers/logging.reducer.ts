import { createReducer, Action, on } from '@ngrx/store';
import * as LoggingActions from '../actions/logging.actions';

export interface State {
    loggingGads: string[];
}

export const initialState: State = {
    loggingGads: []
};

const loggingReducer = createReducer(
    initialState,
    on(LoggingActions.loadLoggingGadsSuccess, (state, { gads }) => ({ ...state, loggingGads: gads })),
    on(LoggingActions.addLoggingGadSuccess, (state, { gad }) => ({
        ...state,
        loggingGads: [...state.loggingGads, gad ]
    })),
    on(LoggingActions.removeLoggingGadSuccess, (state, { gad }) => ({
        ...state,
        loggingGads: state.loggingGads.filter(lg => lg !== gad )
    }))
);

export function reducer(state: State | undefined, action: Action) {
    return loggingReducer(state, action);
}
