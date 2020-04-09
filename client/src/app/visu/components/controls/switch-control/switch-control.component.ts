import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { GroupSocketMessage } from '../../../models';
import { AbstractControl } from '../abstract-control';

@Component({
    selector: 'visu-switch-control',
    templateUrl: 'switch-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SwitchControlComponent extends AbstractControl {
    toggle(value: MatSlideToggleChange): void {
        const groupSocketMessage = new GroupSocketMessage({
            dest: this.controlDef.gad,
            type: this.controlDef.type,
            val: value.checked ? 1 : 0
        });

        this.groupSocketMessage.emit(groupSocketMessage);
    }
}
