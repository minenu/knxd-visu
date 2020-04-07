import { Input, HostBinding, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { Subscription, BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { GroupSocketMessage, ControlDef } from '../../models';
import * as _ from 'lodash';

export abstract class AbstractControl implements OnDestroy {
    @HostBinding('class') class = 'w-100';

    @Input() set controlDef(value: ControlDef) {
        this._controlDef = value;
        if (this.controlDef) {
            this.gad$.next(this.controlDef.gad);
        }
    }
    get controlDef(): ControlDef {
        return this._controlDef;
    }
    private _controlDef: ControlDef;

    value: any;

    get valueChanges$(): Observable<any> {
        return this.valueChanges.asObservable();
    }

    get icon(): string {
        return this.controlDef?.icon;
    }

    get hasValue(): boolean {
        return _.isNumber(this.value) || _.isString(this.value) || _.isBoolean(this.value);
    }

    private gad$ = new BehaviorSubject<string>(null);
    private subscriptions: Subscription[] = [];
    private valueChanges = new Subject<any>();

    constructor(
        public socketService: SocketService,
        public cdr: ChangeDetectorRef
    ) {
        const validMessageAction = (msg: GroupSocketMessage): boolean => {
            return ['response', 'write'].some(action => msg.action === action);
        };

        /// Subscribe to GroupSocketMessages
        this.subscriptions.push(
            this.socketService.groupSocketMessage$.pipe(
                distinctUntilChanged(),
                filter(msg => !!msg),
                filter((msg: GroupSocketMessage) => msg.dest === this.gad$.getValue()),
                filter(validMessageAction)
            ).subscribe(msg => {
                this.setValue(msg.val);
            })
        );

        /// Subscribe to ListenerGads
        this.subscriptions.push(
            this.socketService.groupSocketMessage$.pipe(
                filter(msg => !!msg && !!this.controlDef),
                filter((msg: GroupSocketMessage) => (this.controlDef.listenerGads || []).some(lg => lg === msg.dest)),
                filter(validMessageAction)
            ).subscribe(msg => {
                console.log('listener:', msg);
                this.setValue(msg.val);
            })
        );

        /// Subscribe to SocketConnection and GAD
        /// Read when connection is established
        this.subscriptions.push(
            combineLatest([
                this.gad$,
                this.socketService.connected$
            ]).subscribe(([gad, connected]) => {
                if (connected && gad) {
                    this.socketService.groupRead(gad);
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.valueChanges.complete();
    }

    protected setValue(value: any): void {
        if (this.controlDef && value !== this.value) {
            switch (this.controlDef.type) {
                case 'DPT1':
                    this.value = !!value;
                    break;

                default:
                    this.value = value;
            }
            this.valueChanges.next(this.value);
            this.cdr.markForCheck();
        }
    }
}
