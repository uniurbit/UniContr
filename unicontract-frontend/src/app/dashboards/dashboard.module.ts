import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DashboardRoutes } from './dashboard.routing';
import { InfocardComponent } from './dashboard-components/info-card/info-card.component';
import { DashboardService } from './dashboard.service';

import { NotificationsComponent } from './dashboard-components/notifications/notifications.component';
import { SharedModule } from '../shared';
import { TableTypeComponent } from '../shared/dynamic-form/table-type.component';
import { NotificationService } from './notification.service';
import { DashboardUffDocentiComponent } from './dashboard-uff-docenti/dashboard-uff-docenti.component';
import { DashboardUffTrattamentiComponent } from './dashboard-uff-trattamenti/dashboard-uff-trattamenti.component';
import { ConvenzioniresultComponent } from './dashboard-components/contrattiresult/contrattiresult.component';
import { DashboardDipartimentiComponent } from './dashboard-dipartimenti/dashboard-dipartimenti.component';
import { NgxLoadingModule } from 'ngx-loading';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    NgxLoadingModule.forRoot({}),
    RouterModule.forChild(DashboardRoutes),
    PerfectScrollbarModule,
    NgxDatatableModule,
    SharedModule.forRoot(),
  ],
  declarations: [
    InfocardComponent,
    NotificationsComponent,
    DashboardUffDocentiComponent,
    DashboardUffTrattamentiComponent,
    ConvenzioniresultComponent,
    DashboardDipartimentiComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    DashboardService,
    NotificationService,
    DatePipe,
  ]
})
export class DashboardModule {}
