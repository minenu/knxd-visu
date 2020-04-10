import { Input, HostBinding, Output, EventEmitter } from '@angular/core';
import { ControlDef, ControlValue, GroupSocketMessage } from '../../models';
import * as _ from 'lodash';

export abstract class AbstractControl {
    @HostBinding('class.w-100') w100 = true;

    @Input() controlDef: ControlDef;
    @Input() controlValues: ControlValue[];
    @Output() groupSocketMessage = new EventEmitter<Partial<GroupSocketMessage>>();

    @Input() set hideLabel(val: boolean) {
        this._hideLabel = true;
    }
    get hideLabel(): boolean {
        return this._hideLabel;
    }
    private _hideLabel = false;

    @Input() set hideIcon(val: boolean) {
        this._hideIcon = true;
    }
    get hideIcon(): boolean {
        return this._hideIcon;
    }
    private _hideIcon = false;
    
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
