import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'visu-confirm',
    templateUrl: 'confirm.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConfirmComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string; }
    ) { }

    ngOnInit(): void { }
}
