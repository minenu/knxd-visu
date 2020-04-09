import { Component, ChangeDetectionStrategy, Input, HostBinding, Output, EventEmitter } from '@angular/core';
import { ControlDef, ControlValue, GroupSocketMessage } from '../../../models';

@Component({
    selector: 'visu-control-wrapper',
    templateUrl: 'control-wrapper.component.html',
    changeDetection: ChangeDetectionStrategy.Default
})

export class ControlWrapperComponent {
    @HostBinding('class') private c = 'w-100';
    @Input() controlDef: ControlDef;
    @Input() controlValues: ControlValue[];
    @Output() groupSocketMessage = new EventEmitter<GroupSocketMessage>();
}
