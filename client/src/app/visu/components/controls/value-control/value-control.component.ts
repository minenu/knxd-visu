import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl } from '../abstract-control';
import * as _ from 'lodash';

@Component({
    selector: 'visu-value-control',
    templateUrl: 'value-control.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ValueControlComponent extends AbstractControl {

    get formattedValue(): string {
        return _.isNumber(this.value) ? _.round(this.value, 1) : this.value;
    }

}
