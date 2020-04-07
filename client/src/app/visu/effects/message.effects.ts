import * as MessageActions from '../actions/message.actions';
import * as ControlDefActions from '../actions/control-def.actions';
import * as LoggingActions from '../actions/logging.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable()
export class MessageEffects {

    emit$ = createEffect(() => this.actions$.pipe(
        ofType(MessageActions.emit),
        map(({ message, type }) => {
            this.snackbar.open(message, null, { duration: 2000 });
        })
    ), { dispatch: false });

    /**
     * Intercept Actions
     */
    saveControlDef$ = createEffect(() => this.actions$.pipe(
        ofType(ControlDefActions.saveSuccess),
        map(() => MessageActions.emit({ message: 'Control Definition saved!' }))
    ));

    addLoggingGad$ = createEffect(() => this.actions$.pipe(
        ofType(LoggingActions.addLoggingGadSuccess),
        map(({ gad }) => MessageActions.emit({ message: `${gad} added for logging.` }))
    ));

    removeLoggingGad$ = createEffect(() => this.actions$.pipe(
        ofType(LoggingActions.removeLoggingGadSuccess),
        map(({ gad }) => MessageActions.emit({ message: `${gad} removed from logging.` }))
    ));

    constructor(
        private actions$: Actions,
        private snackbar: MatSnackBar
    ) {}
}
