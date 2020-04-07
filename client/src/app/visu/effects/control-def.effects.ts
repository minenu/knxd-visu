import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ControlDefActions from '../actions/control-def.actions';
import { switchMap, map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { Injectable } from '@angular/core';
import { ControlDef } from '../models';
import { of } from 'rxjs';

@Injectable()
export class ControlDefEffects {

    load$ = createEffect(() => this.actions$.pipe(
        ofType(ControlDefActions.load),
        switchMap(() => this.api.getControlDefs().pipe(
            map((res: any[]) => res.map(x => new ControlDef(x))),
            map((controlDefs: ControlDef[]) => controlDefs.sort((a, b) => a.label.localeCompare(b.label))),
            map(controlDefs => ControlDefActions.loadSuccess({ controlDefs }))
        ))
    ));

    save$ = createEffect(() => this.actions$.pipe(
        ofType(ControlDefActions.save),
        switchMap(({ controlDef }) => this.api.setControlDef(controlDef).pipe(
            map(res => ControlDefActions.saveSuccess({ controlDef: new ControlDef(res) }))
        ))
    ));

    delete$ = createEffect(() => this.actions$.pipe(
        ofType(ControlDefActions.del),
        switchMap(({ controlDef }) => this.api.delControlDef(controlDef).pipe(
            map(() => ControlDefActions.delSuccess({ controlDef }))
        ))
    ));

    constructor(
        private actions$: Actions,
        private api: ApiService
    ) {
    }
}
