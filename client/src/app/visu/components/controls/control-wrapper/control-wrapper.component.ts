import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { ControlDef } from '../../../models';

@Component({
    selector: 'visu-control-wrapper',
    templateUrl: 'control-wrapper.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})

export class ControlWrapperComponent {
    @HostBinding('class') private c = 'w-100';
    @Input() controlDef: ControlDef;
}
