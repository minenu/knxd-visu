import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ContentOverlayRef } from '../../services/content-overlay.service';

@Component({
    selector: 'visu-connection-lost',
    templateUrl: 'connection-lost.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConnectionLostComponent implements OnInit {
    constructor(
        private contentOverlayRef: ContentOverlayRef
    ) { }

    ngOnInit(): void { }
}
