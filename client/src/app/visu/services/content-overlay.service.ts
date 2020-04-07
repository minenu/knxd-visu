import { Injectable, Injector, ComponentRef, Type, InjectionToken } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Observable, Observer } from 'rxjs';

interface ContentOverlayConfig {
    panelClass?: string;
    hasBackdrop?: boolean;
    backdropClass?: string;
    closeOnBackdropClick?: boolean;
    component?: Type<any>;
    data?: any;
}

const DEFAULT_CONFIG: ContentOverlayConfig = {
    hasBackdrop: true,
    closeOnBackdropClick: false,
    panelClass: 'visu-content-overlay-panel',
};

/**
 * Create Custom TOKEN for sharing Data
 */
export const CONTENT_OVERLAY_DATA = new InjectionToken<any>('CONTENT_OVERLAY_DATA');

/**
 * Create Custom OverlayRef
 */
export class ContentOverlayRef {
    private closedObserver: Observer<any>;
    private closedObservable = new Observable<any>(observer => this.closedObserver = observer);

    constructor(private overlayRef: OverlayRef) { }

    close(returnValue?: any): void {
        this.overlayRef.dispose();
        if (this.closedObserver) {
            this.closedObserver.next(returnValue);
            this.closedObserver.complete();
        }
    }

    closed(): Observable<any> {
        return this.closedObservable;
    }
}

/**
 * Main Service Class
 */
@Injectable()
export class ContentOverlayService {

    constructor(
        private injector: Injector,
        private overlay: Overlay
    ) { }

    open(config: ContentOverlayConfig = {}) {
        // Override default configuration
        const dialogConfig = { ...DEFAULT_CONFIG, ...config };

        // Returns an OverlayRef which is a PortalHost
        const overlayRef = this.createOverlay(dialogConfig);

        // Instantiate remote control
        const dialogRef = new ContentOverlayRef(overlayRef);

        const overlayComponent = this.attachDialogContainer(overlayRef, dialogConfig, dialogRef);

        if (config.closeOnBackdropClick) {
            overlayRef.backdropClick().subscribe(_ => dialogRef.close());
        }

        return dialogRef;
    }

    private createOverlay(config: ContentOverlayConfig) {
        const overlayConfig = this.getOverlayConfig(config);
        return this.overlay.create(overlayConfig);
    }

    private attachDialogContainer(overlayRef: OverlayRef, config: ContentOverlayConfig, dialogRef: ContentOverlayRef) {
        const injector = this.createInjector(config, dialogRef);

        const containerPortal = new ComponentPortal(config.component, null, injector);
        const containerRef: ComponentRef<any> = overlayRef.attach(containerPortal);

        return containerRef.instance;
    }

    private createInjector(config: ContentOverlayConfig, dialogRef: ContentOverlayRef): PortalInjector {
        const injectionTokens = new WeakMap();

        injectionTokens.set(ContentOverlayRef, dialogRef);
        injectionTokens.set(CONTENT_OVERLAY_DATA, config.data);

        return new PortalInjector(this.injector, injectionTokens);
  }

  private getOverlayConfig(config: ContentOverlayConfig): OverlayConfig {
        const positionStrategy = this.overlay.position()
            .global()
            .centerHorizontally()
            .centerVertically();

        const overlayConfig = new OverlayConfig({
            hasBackdrop: config.hasBackdrop,
            backdropClass: config.backdropClass,
            panelClass: config.panelClass,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy
        });

        return overlayConfig;
    }
}
