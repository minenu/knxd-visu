import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DATA_POINT_TYPES, SOCKET_ACTIONS } from '../../helpers/constants';
import { GroupSocketMessage, ControlDef } from '../../models';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { gadValidator } from '../../helpers/validators';

@Component({
    selector: 'visu-bus-controller',
    templateUrl: 'bus-controller.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BusControllerComponent implements OnInit, OnDestroy {
    @Input() controlDefs: ControlDef[];
    @Output() groupSocketMessage = new EventEmitter<GroupSocketMessage>();

    form = new FormGroup({
        dest: new FormControl('0/0/3', [ Validators.required, gadValidator() ]),
        val: new FormControl(null, [ Validators.required ]),
        type: new FormControl('DPT1', [ Validators.required ]),
        action: new FormControl('write')
    });

    dptOptions: string[] = DATA_POINT_TYPES;
    actions: string[] = SOCKET_ACTIONS;
    filteredControlDefs$: Observable<ControlDef[]>;

    private subscriptions: Subscription[] = [];

    constructor() { }

    ngOnInit(): void {
        this.filteredControlDefs$ = this.form.get('dest').valueChanges.pipe(
            map(searchText => this.filter(searchText))
        );

        this.subscriptions.push(
            this.form.get('action').valueChanges.subscribe(action => {
                const type = this.form.get('type');
                const val = this.form.get('val');

                if (action === 'read') {
                    setTimeout(() => {
                        type.clearValidators();
                        val.clearValidators();
                        type.disable();
                        val.disable();
                    });
                } else {
                    setTimeout(() => {
                        type.setValidators([ Validators.required ]);
                        val.setValidators([ Validators.required ]);
                        type.enable();
                        val.enable();
                    });
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    send(): void {
        this.groupSocketMessage.emit(this.form.value);
        this.form.patchValue({
            val: null
        });
    }

    private filter(searchText: string): ControlDef[] {
        const lowerSearchText = searchText ? searchText.toLowerCase() : '';
        return (this.controlDefs || []).filter(controlDef => {
            return controlDef.label.toLowerCase().includes(lowerSearchText);
        });
    }
}
