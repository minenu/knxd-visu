import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { Subscription, Observable, merge } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromVisu from '../../reducers';
import * as ControlDefActions from '../../actions/control-def.actions';
import { map, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { ControlDef, GroupSocketMessage } from '../../models';
import { FormGroup, FormControl } from '@angular/forms';
import { SocketService } from '../../services/socket.service';

@Component({
    selector: 'visu-dashboard',
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit, OnDestroy {
    controlDefs$ = this.store.pipe(select(fromVisu.selectAllControlDefs));
    controlValues$ = this.store.pipe(select(fromVisu.selectAllControlValues));

    form = new FormGroup({
        groupBy: new FormControl('room')
    });

    controlGroups$: Observable<string[]> = merge(
        this.form.valueChanges,
        this.controlDefs$
    ).pipe(
        switchMap(() => this.controlDefs$.pipe(
            map(controlDefs => Object.keys(_.groupBy(controlDefs, this.form.get('groupBy').value))
                .sort((a, b) => a.localeCompare(b))
            )
        ))
    );

    private subscriptions: Subscription[] = [];
    private controlDefs: ControlDef[];

    constructor(
        private store: Store<fromVisu.AppState>,
        public coreService: CoreService,
        private socketService: SocketService
    ) {}

    ngOnInit(): void {
        /// Create a ControlDef Snapshot
        this.subscriptions.push(
            this.controlDefs$.subscribe(x => this.controlDefs = x)
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getControlDefs(groupName: string): ControlDef[] {
        return (this.controlDefs || []).filter(controlDef => controlDef[this.form.get('groupBy').value] === groupName);
    }

    groupSocketMessage(msg: GroupSocketMessage): void {
        this.socketService.groupSocketMessage(msg);
    }
}
