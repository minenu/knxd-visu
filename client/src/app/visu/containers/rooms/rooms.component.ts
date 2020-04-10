import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromVisu from '../../reducers';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription, Observable } from 'rxjs';
import { ControlValue, ControlDef, Room, GroupSocketMessage } from '../../models';
import { controlValueFormatter } from '../../helpers/utilities';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SocketService } from '../../services/socket.service';

@Component({
    selector: 'visu-rooms',
    templateUrl: 'rooms.component.html'
})

export class RoomsComponent implements OnInit {
    rooms$ = this.store.pipe(select(fromVisu.selectAllRooms));
    controlValues$ = this.store.pipe(select(fromVisu.selectAllControlValues));
    controlDefs$ = this.store.pipe(select(fromVisu.selectAllControlDefs));

    floors$ = this.rooms$.pipe(
        map(rooms => _.uniq(rooms.map(r => r.floor), 'floor'))
    );

    form = new FormGroup({
        cols: new FormControl(4, [ Validators.required ])
    });
    
    private controlValues: ControlValue[];
    private controlDefs: ControlDef[];
    private rooms: Room[];
    private subscriptions: Subscription[] = [];

    constructor(
        private store: Store<fromVisu.AppState>,
        private breakpointObserver: BreakpointObserver,
        private socketService: SocketService
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.breakpointObserver.observe([Breakpoints.Small]).subscribe(result => {
                console.log('Breakpoints.Small', result);
            })
        );

        this.subscriptions.push(
            this.controlValues$.subscribe(x => this.controlValues = x)
        );

        this.subscriptions.push(
            this.controlDefs$.subscribe(x => this.controlDefs = x)
        );

        this.subscriptions.push(
            this.rooms$.subscribe(x => this.rooms = x)
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    groupSocketMessage(msg: GroupSocketMessage): void {
        this.socketService.groupSocketMessage(msg);
    }

    getRoomsByFloor(floor: string): Room[] {
        return (this.rooms || []).filter(room => room.floor === floor);
    }

    getControlDef(gad: string): ControlDef {
        return (this.controlDefs || []).find(cd => cd.gad === gad);
    }

    getControlDefs(gads: string[] = []): ControlDef[] {
        return (this.controlDefs || []).filter(cd => gads.some(gad => cd.gad === gad));
    }

    getValue(gad: string): any {
        const controlValue = (this.controlValues || []).find(cv => cv.gad === gad);
        if (controlValue) {
            const controlDef = this.getControlDef(gad);
            return controlValueFormatter(controlDef)(controlValue.val);
        }
    }
}
