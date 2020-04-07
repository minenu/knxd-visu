import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromVisu from '../../reducers';
import * as LoggingActions from '../../actions/logging.actions';
import * as ControLDefActions from '../../actions/control-def.actions';
import { CoreService } from '../../services/core.service';
import { ControlDef } from '../../models';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../components/confirm/confirm.component';

@Component({
    selector: 'visu-control-definitions',
    templateUrl: './control-definitions.component.html'
})

export class ControlDefinitionsComponent implements OnInit, OnDestroy {
    controlDefs$ = this.store.pipe(select(fromVisu.selectAllControlDefs));
    loggingGads$ = this.store.pipe(select(fromVisu.selectLoggingGads));

    expandedGad: string;
    private loggingGads: string[];
    private subscriptions: Subscription[] = [];

    constructor(
        private store: Store<fromVisu.AppState>,
        private coreService: CoreService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.loggingGads$.subscribe(x => this.loggingGads = x)
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    showForm(controlDef?: ControlDef) {
        this.coreService.controlDefForm(controlDef);
    }

    delete(controlDef: ControlDef): void {
        this.dialog.open(ConfirmComponent, {
            data: {
                title: 'Confirm Delete',
                message: `Do you really want to delete the Control Definition for <b>${controlDef.gad}</b>?`
            }
        }).beforeClosed().subscribe(result => {
                if (result) {
                    this.store.dispatch(ControLDefActions.del({ controlDef }));
                }
            });
    }

    isLogged(controlDef: ControlDef): boolean {
        return this.loggingGads.some(gad => controlDef.gad === gad);
    }

    toggleLogged(controlDef: ControlDef): void {
        if (this.isLogged(controlDef)) {
            this.store.dispatch(LoggingActions.removeLoggingGad({ gad: controlDef.gad }));
        } else {
            this.store.dispatch(LoggingActions.addLoggingGad({ gad: controlDef.gad }));
        }
    }
}
