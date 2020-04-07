import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { VisuModule } from './visu/visu.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,

        SharedModule,
        VisuModule,

        /// Store
        StoreModule.forRoot({}),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
        EffectsModule.forRoot([]),
        StoreRouterConnectingModule.forRoot(),
        StoreModule.forRoot({}, {})
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        Title
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
