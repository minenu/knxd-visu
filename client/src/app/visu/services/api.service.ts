import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ControlDef } from '../models';

@Injectable({providedIn: 'root'})
export class ApiService {
    private baseUrl: string;

    constructor(
        private httpClient: HttpClient,
    ) {
        if (environment.production) {
            this.baseUrl = window.location.origin;
        } else {
            this.baseUrl = environment.knxdServerUrl;
        }
    }

    /**
     * ControlDefs
     */
    getControlDefs(): Observable<any[]> {
        return this.httpClient.get<any[]>(`${this.baseUrl}/api/control-def`);
    }

    setControlDef(controlDef: ControlDef): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl}/api/control-def`, controlDef);
    }

    delControlDef(controlDef: ControlDef): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl}/api/control-def/delete`, controlDef);
    }

    /**
     * Logging
     */
    getLoggingGads(): Observable<string[]> {
        return this.httpClient.get<string[]>(`${this.baseUrl}/api/logging-gads`);
    }

    addLoggingGad(gad: string): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl}/api/logging-gad/add`, { gad });
    }

    removeLoggingGad(gad: string): Observable<any> {
        return this.httpClient.post<any>(`${this.baseUrl}/api/logging-gad/remove`, { gad });
    }

    getLogs(query: any): Observable<any> {
        return this.httpClient.post(`${this.baseUrl}/api/logs`, query);
    }

}
