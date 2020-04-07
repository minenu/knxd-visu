import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { GroupSocketMessage, ControlDef } from '../../models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CoreService } from '../../services/core.service';

@Component({
    selector: 'visu-group-socket-message-list',
    templateUrl: 'group-socket-message-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class GroupSocketMessageListComponent implements OnInit {
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    @Input() set groupSocketMessages(value: GroupSocketMessage[]) {
        this.dataSource.data = value;
    }
    @Input() controlDefs: ControlDef[];

    @Output() clearGroupSocketMessages = new EventEmitter<void>();
    @Output() createControlDef = new EventEmitter<GroupSocketMessage>();

    displayedColumns: string[] = ['datetime', 'action', 'src', 'dest', 'type', 'val'];
    dataSource = new MatTableDataSource<GroupSocketMessage>();

    constructor(
        public coreService: CoreService
    ) { }

    ngOnInit(): void {
        if (this.paginator) {
            this.dataSource.paginator = this.paginator;
        }
    }

    getIcon(groupSocketMessage: GroupSocketMessage): string {
        switch (groupSocketMessage.action) {
            case 'write':
                return 'keyboard_return';
            case 'read':
                return 'chevron_left';
            case 'response':
                return 'chevron_right';
            default:
                return 'angry';
        }
    }

    getGadName(groupSocketMessage: GroupSocketMessage): string {
        const controlDef = (this.controlDefs || []).find(cd => cd.gad === groupSocketMessage.dest);
        return controlDef ? controlDef.label : groupSocketMessage.dest;
    }

    isMapped(msg: GroupSocketMessage): boolean {
        return (this.controlDefs || [])
            .map(contolDef => contolDef.gad)
            .includes(msg.dest);
    }
}
