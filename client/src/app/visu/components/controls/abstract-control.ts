import { Input, HostBinding, Output, EventEmitter } from '@angular/core';
import { ControlDef, ControlValue, GroupSocketMessage } from '../../models';
import * as _ from 'lodash';

export abstract class AbstractControl {
    @HostBinding('class') class = 'w-100';

    @Input() controlDef: ControlDef;
    @Input() controlValues: ControlValue[];
    @Output() groupSocketMessage = new EventEmitter<GroupSocketMessage>();
    
    value: any;

    get formattedValue(): string {
        return this.value;
    }

    ngOnChanges(): void {
        const controlValue = (this.controlValues || []).find(cv => cv.gad === this.controlDef?.gad);
        
        switch (this.controlDef?.type) {
            case 'DPT1':
                this.value = controlValue ? !!parseInt(controlValue.val) : null;
                break;
            default:
                this.value = controlValue?.val;
        }
        
    }
}
