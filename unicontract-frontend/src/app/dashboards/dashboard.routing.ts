import { Routes } from '@angular/router';
import { AuthGuard } from '../core/auth.guard';
import { DashboardUffDocentiComponent } from './dashboard-uff-docenti/dashboard-uff-docenti.component';
import { DashboardUffTrattamentiComponent } from './dashboard-uff-trattamenti/dashboard-uff-trattamenti.component';
import { DashboardDipartimentiComponent } from './dashboard-dipartimenti/dashboard-dipartimenti.component';


export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboarduffdocenti',
        component: DashboardUffDocentiComponent,
        canActivate:[AuthGuard],
        data: {
          title: 'Dashboard Ufficio Amm.ne e Reclutamento Personale Docente',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Dashboard Ufficio Amm.ne e Reclutamento Personale Docente' }
          ]
        }
      },     
      {
        path: 'dashboardufftrattamenti',
        component: DashboardUffTrattamentiComponent,
        canActivate:[AuthGuard],
        data: {
          title: 'Dashboard Ufficio Trattamenti Economici e Previdenziali',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Dashboard Ufficio Trattamenti Economici e Previdenziali' }
          ]
        }
      }, 
      {
        path: 'dashboarddipartimento',
        component: DashboardDipartimentiComponent,
        canActivate:[AuthGuard],
        data: {
          title: 'Dashboard Dipartimentale',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Dashboard Dipartimentale' }
          ]
        }
      }, 
               
  
    ]
  }
];
