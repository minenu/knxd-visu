import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { GroupSocketMessage, ControlDef } from '../models';
import { ContentOverlayService } from './content-overlay.service';
import { ControlDefFormComponent } from '../components/control-def-form/control-def-form.component';
import { Store, select } from '@ngrx/store';
import * as fromVisu from '../reducers';
import * as ControlDefActions from '../actions/control-def.actions';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class CoreService {
    /**
     * Returns an Observable of MobileApplication
     */
    isMobile$ = this.breakpointObserver.observe([
        Breakpoints.Small,
        Breakpoints.Handset
    ]).pipe(
        map(result => result.matches)
    );

    /**
     * Returns the isMobile$ Snapshot
     */
    get isMobile(): boolean {
        return this._isMobile;
    }
    private _isMobile: boolean;

    private controlDefs: ControlDef[];

    constructor(
        private store: Store<fromVisu.AppState>,
        private breakpointObserver: BreakpointObserver,
        private contentOverlay: ContentOverlayService,
        private dialog: MatDialog
    ) {
        this.isMobile$.subscribe(isMobile => this._isMobile = isMobile);

        /// Create Snapshot
        this.store.pipe(select(fromVisu.selectAllControlDefs))
            .subscribe(x => this.controlDefs = x);
    }

    controlDefForm(controlDef: ControlDef): void {
        this.dialog.open(ControlDefFormComponent, {
            data: {
                controlDef,
                controlDefs: this.controlDefs
            }
        }).beforeClosed().subscribe(result => {
            if (result) {
                this.store.dispatch(ControlDefActions.save({ controlDef: result }));
            }
        });
    }
}
