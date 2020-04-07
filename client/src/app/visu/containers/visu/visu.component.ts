import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Store, select } from '@ngrx/store';
import { first, map } from 'rxjs/operators';
import * as fromVisu from '../../reducers';
import * as ControlDefActions from '../../actions/control-def.actions';
import * as LoggingActions from '../../actions/logging.actions';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreService } from '../../services/core.service';
import { ContentOverlayRef, ContentOverlayService } from '../../services/content-overlay.service';
import { ConnectionLostComponent } from '../../components/connection-lost/connection-lost.component';
import { Title } from '@angular/platform-browser';
import { timer } from 'rxjs';

@Component({
    selector: 'visu-visu',
    templateUrl: 'visu.component.html',
    styleUrls: [ 'visu.component.scss' ]
})

export class VisuComponent implements OnInit, OnDestroy {
    @ViewChild(MatSidenav) private sidenav: MatSidenav;

    loggingGads$ = this.store.pipe(select(fromVisu.selectLoggingGads));
    controlDefs$ = this.store.pipe(select(fromVisu.selectAllControlDefs));
    now$ = timer(0, 1000).pipe(map(() => new Date()));

    mobileQuery: MediaQueryList;
    connected: boolean;

    private mobileQueryListener: () => void;
    private subscriptions: Subscription[] = [];
    private overlayRef: ContentOverlayRef;

    constructor(
        private socketService: SocketService,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private store: Store<fromVisu.AppState>,
        private router: Router,
        private route: ActivatedRoute,
        private coreService: CoreService,
        private contentOverlay: ContentOverlayService,
        private titleService: Title,
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
        this.mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this.mobileQueryListener);

        this.titleService.setTitle('KNXD Visu');
    }

    ngOnInit(): void {
        /// Load Loggings
        this.loggingGads$.pipe(first()).subscribe(loggingGads => {
            if (!loggingGads.length) {
                this.store.dispatch(LoggingActions.loadLoggingGads())
            }
        });

        /// Load ControlDefs
        this.store.dispatch(ControlDefActions.load());

        /// Check for Connection
        this.subscriptions.push(
            this.socketService.connected$.subscribe(c => {
                this.connected = c;
                this.changeDetectorRef.detectChanges();
            })
        );

        /// Show Connecting Overlay
        this.subscriptions.push(
            this.socketService.connected$.subscribe(connected => {
                if (!connected) {
                    if (this.overlayRef) {
                        this.closeOverlay();
                    }
                    this.overlayRef = this.contentOverlay.open({ component: ConnectionLostComponent });
                } else if (this.overlayRef) {
                    this.closeOverlay();
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this.mobileQueryListener);
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    /**
     * Main Menu Navigation
     */
    navigate(segments: string[]): void {
        this.router.navigate(segments, {
            relativeTo: this.route
        });

        if (this.sidenav && this.sidenav.opened && this.coreService.isMobile) {
            this.sidenav.close();
        }
    }

    /**
     * Close ContentOverlay
     */
    private closeOverlay(): void {
        this.overlayRef.close();
        this.overlayRef = null;
    }
}
