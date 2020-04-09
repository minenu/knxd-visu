import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './containers/home/home.component';
import { MasterDataComponent } from './containers/masterdata/masterdata.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { BusMonitorComponent } from './containers/bus-monitor/bus-monitor.component';
import { VisuComponent } from './containers/visu/visu.component';
import { LoggingComponent } from './containers/logging/logging.component';
import { ControlDefinitionsComponent } from './containers/control-definitions/control-definitions.component';

const routes: Routes = [
    {
        path: 'visu',
        component: VisuComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'bus-monitor', component: BusMonitorComponent },
            {
                path: 'masterdata',
                component: MasterDataComponent,
                children: [
                    { path: '', redirectTo: 'control-definitions', pathMatch: 'full' },
                    { path: 'logging', component: LoggingComponent },
                    { path: 'control-definitions', component: ControlDefinitionsComponent }
                ]
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VisuRoutingModule { }
