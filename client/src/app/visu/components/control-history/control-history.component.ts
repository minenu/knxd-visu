import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy } from '@angular/core';
import { GroupSocketMessage, ControlDef } from '../../models';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as _ from 'lodash';
import * as d3Shape from 'd3-shape';

@Component({
    selector: 'visu-control-history',
    templateUrl: 'control-history.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ControlHistoryComponent implements OnInit, OnDestroy {
    /**
     * Filter Log Inputs by current ControlDef and val
     * -> READ does not have a valid val
     */
    @Input() set logs(value: GroupSocketMessage[]) {
        this.logs$.next(value.filter(rec => {
            return rec.dest === this._controlDef?.gad && _.isNumber(rec.val);
        }));
    }
    private logs$ = new BehaviorSubject<GroupSocketMessage[]>([]);

    @Input() set controlDef(value: ControlDef) {
        this._controlDef = value;

        /// Set Chart Properties
        switch (this._controlDef?.type) {
            case 'DPT1':
                this.curve = d3Shape.curveStepAfter;
                break;
            default:
                this.curve = d3Shape.curveBasis;
        }

        /// Tick ChartData
        this.controlDef$.next(this._controlDef);
    }
    private _controlDef: ControlDef;

    controlDef$ = new BehaviorSubject<ControlDef>(null);

    chartData: any[];
    curve: d3Shape.CurveFactory;
    colorScheme: any = {
        domain: [ '#3f51b5', '#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    };

    private subscriptions: Subscription[] = [];

    constructor() { }

    ngOnInit(): void {
        this.subscriptions.push(
            combineLatest([
                this.controlDef$,
                this.logs$
            ]).pipe(
                filter(([controlDef, logs]) => !!controlDef && logs.length > 0)
            ).subscribe(([controlDef, logs]) => {
                const series = logs.map(log => ({
                    value: log.val,
                    name: log.datetime,
                }));

                this.chartData = [{
                    name: controlDef.label,
                    series
                }];
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
