import { Component, OnInit, ChangeDetectionStrategy, Input, HostBinding, OnDestroy, ChangeDetectorRef, forwardRef } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SocketService } from '../../../services/socket.service';
import { GroupSocketMessage, ControlDef } from '../../../models';
import { AbstractControl } from '../abstract-control';

@Component({
    selector: 'visu-switch-control',
    templateUrl: 'switch-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [{
        provide: AbstractControl,
        useExisting: forwardRef(() => SwitchControlComponent)
    }]
})

export class SwitchControlComponent extends AbstractControl {
    @HostBinding('class') class = 'w-100';

    constructor(
        public socketService: SocketService,
        public cdr: ChangeDetectorRef
    ) {
        super(socketService, cdr);
    }

    toggle(value: MatSlideToggleChange): void {
        const groupSocketMessage = new GroupSocketMessage({
            dest: this.controlDef.gad,
            type: this.controlDef.type,
            val: value.checked ? 1 : 0
        });

        this.socketService.groupSocketMessage(groupSocketMessage);
    }
}
