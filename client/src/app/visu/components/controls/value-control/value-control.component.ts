import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, forwardRef, Input } from '@angular/core';
import { AbstractControl } from '../abstract-control';
import { SocketService } from '../../../services/socket.service';
import * as _ from 'lodash';

@Component({
    selector: 'visu-value-control',
    templateUrl: 'value-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [{
        provide: AbstractControl,
        useExisting: forwardRef(() => ValueControlComponent)
    }]
})

export class ValueControlComponent extends AbstractControl implements OnDestroy {
    @Input() suffix: string;

    get formattedValue(): number {
        try {
            return Math.round(+this.value * 10) / 10;
        } catch (ex) {
            return this.value;
        }
    }

    constructor(
        public socketService: SocketService,
        public cdr: ChangeDetectorRef
    ) {
        super(socketService, cdr);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
