import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { GroupSocketMessage } from '../models';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class LogService {
    constructor(
        private api: ApiService
    ) { }

    getLogs(query: Partial<GroupSocketMessage>): Observable<GroupSocketMessage[]> {
        return this.api.getLogs(query).pipe(
            map(res => res.map(x => new GroupSocketMessage(x)))
        );
    }
}
