import { NgModule, Type } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { VisuRoutingModule } from './visu-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromVisu from './reducers';
import { SocketService } from './services/socket.service';
import { ApiService } from './services/api.service';
import { LogService } from './services/log.service';
import { CoreService } from './services/core.service';
import { ContentOverlayService } from './services/content-overlay.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

/// EFFECTS
import { ControlDefEffects } from './effects/control-def.effects';
import { LoggingEffects } from './effects/logging.effects';
import { MessageEffects } from './effects/message.effects';
import { RoomEffects } from './effects/room.effects';

/// CONTAINERS
import { VisuComponent } from './containers/visu/visu.component';
import { BusMonitorComponent } from './containers/bus-monitor/bus-monitor.component';
import { ControlDefinitionsComponent } from './containers/control-definitions/control-definitions.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { HomeComponent } from './containers/home/home.component';
import { LoggingComponent } from './containers/logging/logging.component';
import { MasterDataComponent } from './containers/masterdata/masterdata.component';
import { RoomComponent } from './containers/room/room.component';
import { RoomsComponent } from './containers/rooms/rooms.component';
const CONTAINERS: Type<any>[] = [
    VisuComponent,
    BusMonitorComponent,
    ControlDefinitionsComponent,
    DashboardComponent,
    HomeComponent,
    LoggingComponent,
    MasterDataComponent,
    RoomComponent,
    RoomsComponent
];

/// COMPONENTS
import { BusControllerComponent } from './components/bus-controller/bus-controller.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ConnectionLostComponent } from './components/connection-lost/connection-lost.component';
import { ControlDefFormComponent } from './components/control-def-form/control-def-form.component';
import { ControlHistoryComponent } from './components/control-history/control-history.component';
import { GroupSocketMessageListComponent } from './components/group-socket-message-list/group-socket-message-list.component';
import { ControlWrapperComponent } from './components/controls/control-wrapper/control-wrapper.component';
import { SlideControlComponent } from './components/controls/slide-control/slide-control.component';
import { SwitchControlComponent } from './components/controls/switch-control/switch-control.component';
import { ToggleComponent } from './components/controls/toggle/toggle.component';
import { UpDownControlComponent } from './components/controls/up-down-control/up-down-control.component';
import { ValueControlComponent } from './components/controls/value-control/value-control.component';
const COMPONENTS: Type<any>[] = [
    BusControllerComponent,
    ConfirmComponent,
    ConnectionLostComponent,
    ControlDefFormComponent,
    ControlHistoryComponent,
    GroupSocketMessageListComponent,

    /// Controls
    ControlWrapperComponent,
    SlideControlComponent,
    SwitchControlComponent,
    ToggleComponent,
    UpDownControlComponent,
    ValueControlComponent
];

@NgModule({
    imports: [
        SharedModule,
        VisuRoutingModule,

        StoreModule.forFeature('visu', fromVisu.reducers),
        EffectsModule.forFeature([
            ControlDefEffects,
            LoggingEffects,
            MessageEffects,
            RoomEffects
        ])
    ],
    declarations: [
        ...CONTAINERS,
        ...COMPONENTS
    ],
    entryComponents: [
        ConfirmComponent,
        ConnectionLostComponent,
        ControlDefFormComponent,
        RoomComponent
    ],
    providers: [
        ApiService,
        LogService,
        ContentOverlayService,
        CoreService,
        SocketService,
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' }}
    ],
})
export class VisuModule { }
