import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RoomActions from '../actions/room.actions';
import { switchMap, map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { Injectable } from '@angular/core';
import { Room } from '../models';
import { of } from 'rxjs';
import { DEFAULT_ROOMS } from '../helpers/constants';

@Injectable()
export class RoomEffects {

    load$ = createEffect(() => this.actions$.pipe(
        ofType(RoomActions.load),
        switchMap(() => of(RoomActions.loadSuccess({ rooms: DEFAULT_ROOMS })))
    ));

    constructor(
        private actions$: Actions,
        private api: ApiService
    ) {
    }
}
