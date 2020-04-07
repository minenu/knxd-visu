import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromVisu from '../../reducers';
import * as LoggingActions from '../../actions/logging.actions';
import * as ControlDefActions from '../../actions/control-def.actions';
import { ControlDef, GroupSocketMessage } from '../../models';
import { Subscription, combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormArray, FormGroup } from '@angular/forms';
import { LogService } from '../../services/log.service';

@Component({
    selector: 'visu-logging',
    templateUrl: './logging.component.html'
})

export class LoggingComponent implements OnInit, OnDestroy {
    controlDefs$ = this.store.pipe(select(fromVisu.selectAllControlDefs));
    selectedControlDef$ = this.store.pipe(select(fromVisu.selectSelectedControlDef));

    loggingGads$ = this.store.pipe(select(fromVisu.selectLoggingGads));
    loggingControlDefs$ = combineLatest([
        this.controlDefs$,
        this.loggingGads$
    ]).pipe(
        map(([ controlDefs, loggingGads ]) => {
            return controlDefs.filter(controlDef => {
                return loggingGads.some(gad => controlDef.gad === gad);
            });
        })
    );

    logData$ = new BehaviorSubject<GroupSocketMessage[]>([]);

    loggingGads: string[];
    selectedControlDef: ControlDef;

    private subscriptions: Subscription[] = [];

    constructor(
        private store: Store<fromVisu.AppState>,
        private logService: LogService
    ) { }

    ngOnInit(): void {
        /// Load Data
        this.store.dispatch(LoggingActions.loadLoggingGads());
        this.store.dispatch(ControlDefActions.load());

        this.subscriptions.push(
            this.selectedControlDef$.subscribe(x => this.selectedControlDef = x)
        );

        /// Create LoggingGads Snapshot
        this.subscriptions.push(
            this.loggingGads$.subscribe(loggingGads => {
                this.loggingGads = loggingGads;
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    panelOpened(controlDef: ControlDef): void {
        this.logData$.next([]);
        this.logService.getLogs({ dest: controlDef.gad })
            .subscribe({
                next: (msgs: GroupSocketMessage[]) => this.logData$.next(msgs),
            });
    }
}
