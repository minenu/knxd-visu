import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as LoggingActions from '../actions/logging.actions';
import { switchMap, map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LoggingEffects {

    loadLoggingGads$ = createEffect(() => this.actions$.pipe(
        ofType(LoggingActions.loadLoggingGads),
        switchMap(() => this.api.getLoggingGads().pipe(
            map(gads => LoggingActions.loadLoggingGadsSuccess({ gads }))
        ))
    ));

    add$ = createEffect(() => this.actions$.pipe(
        ofType(LoggingActions.addLoggingGad),
        switchMap(({ gad }) => this.api.addLoggingGad(gad).pipe(
            map(res => LoggingActions.addLoggingGadSuccess({ gad: res }))
        ))
    ));

    remove$ = createEffect(() => this.actions$.pipe(
        ofType(LoggingActions.removeLoggingGad),
        switchMap(({ gad }) => this.api.removeLoggingGad(gad).pipe(
            map(res => LoggingActions.removeLoggingGadSuccess({ gad: res[0] }))
        ))
    ));

    constructor(
        private actions$: Actions,
        private api: ApiService
    ) {
    }
}
