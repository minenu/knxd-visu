import { ControlDef } from '../models';
import * as _ from 'lodash';

export const controlValueFormatter = (controlDef: ControlDef): Function => {
    switch (controlDef.type) {
        case 'DPT1':
            return (value: any) => !!value;
        default:
            return (value: any) => {
                return _.isNumber(value) ? Math.round(value * 10) / 10 : value;
            }
    }
};