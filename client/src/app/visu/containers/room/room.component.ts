import { Component, OnInit, Inject, ChangeDetectionStrategy, HostBinding, OnDestroy } from '@angular/core';
import { ContentOverlayRef, CONTENT_OVERLAY_DATA } from '../../services/content-overlay.service';
import { Room, ControlDef, GroupSocketMessage } from '../../models';
import { Store, select } from '@ngrx/store';
import * as fromVisu from '../../reducers';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { SocketService } from '../../services/socket.service';

@Component({
    selector: 'visu-room',
    templateUrl: 'room.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class RoomComponent implements OnInit, OnDestroy {
    controlDefs$ = this.store.pipe(select(fromVisu.selectAllControlDefs));
    controlValues$ = this.store.pipe(select(fromVisu.selectAllControlValues));

    activeTabIndex$ = new BehaviorSubject<number>(0);

    private controlDefs: ControlDef[];
    private subscriptions: Subscription[] = [];

    constructor(
        private store: Store<fromVisu.AppState>,
        private sockerService: SocketService,
        private overlayRef: ContentOverlayRef,
        @Inject(CONTENT_OVERLAY_DATA) public data: {
            room: Room,
            rooms: Room[]
        }
    ) {
        /// Set initial Active TAB Index
        this.activeTabIndex$.next(
            this.data.rooms.findIndex(r => r.name === this.data.room.name)
        );
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.controlDefs$.subscribe(x => this.controlDefs = x)
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    dismiss(): void {
        this.overlayRef.close();
    }

    getControlDef(gads: string | string[]): ControlDef {
        return this.getControlDefs(gads)[0];
    }

    getControlDefs(gads: string | string[]): ControlDef[] {
        const gadArray: string[] = Array.isArray(gads) ? gads : [ gads ];
        return (this.controlDefs || []).filter(controlDef => {
            return gadArray.some(gad => controlDef.gad === gad)
        });
    }

    groupSocketMessage(msg: GroupSocketMessage): void {
        this.sockerService.groupSocketMessage(msg);
    }

    prevRoom(): void {    
        const prevIndex = (this.activeTabIndex$.getValue() - 1 + this.data.rooms.length) % this.data.rooms.length;
        this.activeTabIndex$.next(prevIndex);
    }

    nextRoom(): void {
        const nextIndex = (this.activeTabIndex$.getValue() + 1) % this.data.rooms.length;
        this.activeTabIndex$.next(nextIndex);
    }
}
