import { Injectable } from '@angular/core';
import { connect } from 'socket.io-client';
import { Store } from '@ngrx/store';
import * as fromVisu from '../reducers';
import * as SocketActions from '../actions/socket.actions';
import { environment } from '../../../environments/environment';
import { GroupSocketMessage } from '../models';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket;

    connected$ = new BehaviorSubject<boolean>(false);
    groupSocketMessage$ = new BehaviorSubject<GroupSocketMessage>(null);

    constructor(
        private store: Store<fromVisu.AppState>
    ) {
        this.socket = connect(environment.knxdServerUrl);

        /// Sends system Messages
        this.socket.on('systemEvent', (systemEvent: any) => {
            this.store.dispatch(SocketActions.systemEvent({ systemEvent }));
        });

        /// GroupSocketListener
        this.socket.on('groupSocketMessage', (groupSocketMessage: GroupSocketMessage) => {
            this.store.dispatch(SocketActions.groupSocketMessage({ groupSocketMessage }));
            this.groupSocketMessage$.next(groupSocketMessage);
        });

        /// Main Internals
        this.socket.on('connect', () => {
            setTimeout(() => { this.connected$.next(true); }, 500);
        });
        this.socket.on('disconnect', () => this.connected$.next(false));
    }

    public groupSocketMessage(data: any): void {
        console.log('send:msg', data);
        this.socket.emit('groupSocketMessage', data);
    }

    public groupRead(gad: string): void {
        console.log('groupRead', gad);
        this.socket.emit('groupRead', gad);
    }

    /**
     * Emit groupRead any wait until response
     */
    public read(gad: string): Observable<any> {
        this.socket.emit('groupRead', gad);
        return this.groupSocketMessage$.pipe(
            filter(msg => msg?.action === 'response' && msg?.dest === gad),
            first()
        );
    }
}
