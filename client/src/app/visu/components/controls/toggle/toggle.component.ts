import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl } from '../abstract-control';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { GroupSocketMessage } from 'src/app/visu/models';

@Component({
    selector: 'visu-toggle',
    templateUrl: 'toggle.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ToggleComponent extends AbstractControl {
    
    toggle(value: MatSlideToggleChange): void {
        const groupSocketMessage = new GroupSocketMessage({
            dest: this.controlDef.gad,
            type: this.controlDef.type,
            val: value.checked ? 1 : 0
        });

        this.groupSocketMessage.emit(groupSocketMessage);
    }
}
