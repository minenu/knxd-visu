import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl } from '../abstract-control';
import { GroupSocketMessage } from 'src/app/visu/models';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
    selector: 'visu-up-down-control',
    templateUrl: 'up-down-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UpDownControlComponent extends AbstractControl {
    write(value: number): void {
        const groupSocketMessage = new GroupSocketMessage({
            dest: this.controlDef.gad,
            type: this.controlDef.type,
            val: value
        });

        this.groupSocketMessage.emit(groupSocketMessage);
    }

    change(event: MatButtonToggleChange): void {
        this.write(event.value);
    }
}