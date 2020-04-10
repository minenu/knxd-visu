import { Component, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { AbstractControl } from '../abstract-control';
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

export class SlideControlComponent extends AbstractControl {

    change(value: MatSliderChange): void {
        this.groupSocketMessage.emit({
            dest: this.controlDef.gad,
            type: this.controlDef.type,
            val: value.value
        });
    }
}
