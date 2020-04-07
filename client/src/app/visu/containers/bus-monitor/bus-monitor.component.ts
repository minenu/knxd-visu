import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromVisu from '../../reducers';
import { Store, select } from '@ngrx/store';
import { SocketService } from '../../services/socket.service';
import * as SocketActions from '../../actions/socket.actions';
import { GroupSocketMessage, ControlDef } from '../../models';
import { CoreService } from '../../services/core.service';

@Component({
    selector: 'visu-bus-monitor',
    templateUrl: 'bus-monitor.component.html'
})

export class BusMonitorComponent implements OnInit {
    groupSocketMessages$ = this.store.pipe(select(fromVisu.selectGroupSocketMessages));
    controlDefs$ = this.store.pipe(select(fromVisu.selectAllControlDefs));
    busMonitorLimit$ = this.store.pipe(select(fromVisu.selectBusMonitorLimit));

    constructor(
        private store: Store<fromVisu.AppState>,
        private socketService: SocketService,
        private coreService: CoreService
    ) { }

    ngOnInit(): void {}

    groupSocketMessage(msg: GroupSocketMessage): void {
        this.socketService.groupSocketMessage(msg);
    }

    clearGroupSocketMessages(): void {
        this.store.dispatch(SocketActions.clearGroupSocketMessages());
    }

    createControlDef(msg: GroupSocketMessage): void {
        this.coreService.controlDefForm(new ControlDef({
            gad: msg.dest,
            type: msg.type
        }));
    }
}
