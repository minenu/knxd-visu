import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, forwardRef, Input } from '@angular/core';
import { AbstractControl } from '../abstract-control';
import { SocketService } from '../../../services/socket.service';
import * as _ from 'lodash';
import { MatSliderChange } from '@angular/material/slider';

@Component({
    selector: 'visu-slide-control',
    templateUrl: 'slide-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [{
        provide: AbstractControl,
        useExisting: forwardRef(() => SlideControlComponent)
    }]
})

export class SlideControlComponent extends AbstractControl implements OnInit, OnDestroy {
    @Input() suffix: string;

    constructor(
        public socketService: SocketService,
        public cdr: ChangeDetectorRef
    ) {
        super(socketService, cdr);
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    change(value: MatSliderChange): void {
        this.socketService.groupSocketMessage({
            dest: this.controlDef.gad,
            type: this.controlDef.type,
            val: value.value
        });
    }

    /**
     * Normalize Value
     */
    protected setValue(value: any): void {
        if (this.controlDef) {
            if (_.isNumber(value)) {
                this.value = value;
            }

            this.cdr.detectChanges();
        }
    }
}
