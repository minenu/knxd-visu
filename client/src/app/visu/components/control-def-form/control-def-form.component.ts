import { Component, OnInit, ChangeDetectionStrategy, Optional, Inject } from '@angular/core';
import { ControlDef, Room } from '../../models';
import { FormGroup, FormControl, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { gadValidator, validOption, getErrorMessage, isValidGad, uniqueValidator } from '../../helpers/validators';
import { DATA_POINT_TYPES, CONTROL_DEF_ICONS } from '../../helpers/constants';
import * as _ from 'lodash';
import { Observable, Subscription, Subject, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
    selector: 'visu-control-def-form',
    templateUrl: 'control-def-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ControlDefFormComponent implements OnInit {

    form = new FormGroup({
        gad: new FormControl(null),
        label: new FormControl(null, [ Validators.required ]),
        type: new FormControl('DPT1', [ Validators.required ]),
        room: new FormControl(),
        category: new FormControl(),
        icon: new FormControl(CONTROL_DEF_ICONS[0], [ Validators.required ]),
        suffix: new FormControl()
    });

    types = DATA_POINT_TYPES;
    icons = CONTROL_DEF_ICONS;

    viewMode = 'DIALOG';    // DIALOG | OVERLAY
    filteredIcons$: Observable<string[]>;
    filteredRooms$: Observable<Room[]>;
    filteredCategories$: Observable<string[]>;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    rooms: Room[];
    private categories: string[];
    private subscriptions: Subscription[] = [];

    listenerGads: string[] = [];

    constructor(
        @Optional() private dialogRef: MatDialogRef<ControlDefFormComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) private data: {
            controlDef?: ControlDef,
            controlDefs: ControlDef[],
            rooms: Room[]
        }
    ) {
        this.rooms = Array.isArray(this.data.rooms) ? this.data.rooms : [];
        this.categories = _.uniq(this.data.controlDefs.map(cd => cd.category));

        /// Set Validator
        /*
        const existingGads = this.data.controlDefs.map(cd => cd.gad);
        let gadValidators: ValidatorFn[];
        if (this.data.controlDef) {
            gadValidators = [];
        } else {
            gadValidators = [ Validators.required, gadValidator(), uniqueValidator(existingGads)];
        }
        this.form.get('gad').setValidators(gadValidators);
        */
    }

    formError(controlName: string): string {
        return getErrorMessage(this.form.get(controlName));
    }

    ngOnInit(): void {
        this.filteredCategories$ = this.form.get('category').valueChanges.pipe(
            startWith(''),
            map(text => this.categories.filter(cat => new RegExp(text, 'ig').test(cat)))
        );

        this.filteredIcons$ = this.form.get('icon').valueChanges.pipe(
            startWith(''),
            map(text => this.icons.filter(icon => new RegExp(text, 'i').test(icon)))
        );

        /// Enable/Disable controls
        this.subscriptions.push(
            this.form.valueChanges.subscribe(() => this.setDisabledState())
        );

        /// Set Initial FormValue
        if (this.data.controlDef) {
            this.form.patchValue(this.data.controlDef, { emitEvent: false });
            if (Array.isArray(this.data.controlDef.listenerGads)) {
                this.listenerGads = [...this.data.controlDef.listenerGads];
            }
        }

        this.setDisabledState();
    }

    submit(): void {
        console.log(this.form);
        if (this.form.valid) {
            this.dialogRef.close({
                ...this.form.getRawValue(),
                listenerGads: this.listenerGads
            });
        }
    }

    dismiss(): void {
        this.dialogRef.close();
    }

    removeListenerGad(gad: string): void {
        const index = this.listenerGads.indexOf(gad);
        if (index >= 0) {
            this.listenerGads.splice(index, 1);
        }
    }

    addListenerGad(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        /// Add our Gad
        if (isValidGad(value)) {
            this.listenerGads.push(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    private setDisabledState(): void {
        /*
        setTimeout(() => {
            if (this.form.get('type').value === 'DPT9') {
                this.form.get('suffix').enable();
            } else {
                this.form.get('suffix').disable();
            }

            if (this.data.controlDef) {
                this.form.get('gad').disable();
            }
        });
        */
    }
}
