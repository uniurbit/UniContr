import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';
import { AuthGuard } from '../core/auth.guard';
import { AuthService } from 'src/app/core';

// UNICONTRACT APP COMPONENTS
import { ListaInsegnComponent } from '../components/p1_insegnamento/lista-insegn/lista-insegn.component';
import { InsegnDetailComponent } from '../components/p1_insegnamento/insegn-detail/insegn-detail.component';
import { InsegnFormComponent } from '../components/p1_insegnamento/insegn-form/insegn-form.component';
import { ListaInsegnamentiUgovComponent } from './../components/insegn_Ugov/lista-insegnamenti-ugov/lista-insegnamenti-ugov.component';
import { InsegnUgovDetailComponent } from './../components/insegn_Ugov/insegn-ugov-detail/insegn-ugov-detail.component';
import { P2PosizioneInsComponent } from './../components/p2_posizione/p2-posizione-ins/p2-posizione-ins.component';
import { P2DetailsComponent } from './../components/p2_posizione/p2-details/p2-details.component';
import { AnagraficaDetailsComponent } from './../components/anagrafica/anagrafica-details/anagrafica-details.component';
import { PagamentoDetailsComponent } from './../components/pagamento/pagamento-details/pagamento-details.component';
import { AnagraficaLocalDetailsComponent } from './../components/anagrafica/anagrafica-local-details/anagrafica-local-details.component';
import { PagamentoLocalDetailsComponent } from './../components/pagamento/pagamento-local-details/pagamento-local-details.component';
import { PagamentoLocalUpdateComponent } from './../components/pagamento/pagamento-local-update/pagamento-local-update.component';
import { B1ConflittoComponent } from './../components/b1_conflitto/b1-conflitto/b1-conflitto.component';
import { B1ConflittoDetailsComponent } from './../components/b1_conflitto/b1-conflitto-details/b1-conflitto-details.component';
import { B2IncompatibilitaComponent } from './../components/b2_incompatibilita/b2-incompatibilita/b2-incompatibilita.component';
// tslint:disable-next-line:max-line-length
import { B2IncompatibilitaDetailsComponent } from './../components/b2_incompatibilita/b2-incompatibilita-details/b2-incompatibilita-details.component';
import { B3RappStudioUnivComponent } from './../components/b3_rapp_studio_univ/b3-rapp-studio-univ/b3-rapp-studio-univ.component';
// tslint:disable-next-line:max-line-length
import { B3RappStudioUnivDetailsComponent } from './../components/b3_rapp_studio_univ/b3-rapp-studio-univ-details/b3-rapp-studio-univ-details.component';
import { B4RappPaComponent } from './../components/b4_rapp_pa/b4-rapp-pa/b4-rapp-pa.component';
import { B4RappPaDetailsComponent } from '../components/b4_rapp_pa/b4-rapp-pa-details/b4-rapp-pa-details.component';
import { B5StatoPensionComponent } from './../components/b5_stato_pensionam/b5-stato-pension/b5-stato-pension.component';
// tslint:disable-next-line:max-line-length
import { B5StatoPensionDetailsComponent } from '../components/b5_stato_pensionam/b5-stato-pension-details/b5-stato-pension-details.component';
import { B6PrivacyComponent } from '../components/b6_privacy/b6-privacy/b6-privacy.component';
import { B6PrivacyDetailsComponent } from '../components/b6_privacy/b6-privacy-details/b6-privacy-details.component';
import { CPrestazProfessComponent } from '../components/c_prestaz_profess/c-prestaz-profess/c-prestaz-profess.component';
// tslint:disable-next-line:max-line-length
import { CPrestazProfessDetailsComponent } from '../components/c_prestaz_profess/c-prestaz-profess-details/c-prestaz-profess-details.component';
import { D1InpsComponent } from '../components/d1_inps/d1-inps/d1-inps.component';
import { D1InpsDetailsComponent } from '../components/d1_inps/d1-inps-details/d1-inps-details.component';
import { D2InailComponent } from '../components/d2_inail/d2-inail/d2-inail.component';
import { D2InailDetailsComponent } from '../components/d2_inail/d2-inail-details/d2-inail-details.component';
import { D3TributariComponent } from '../components/d3_tributari/d3-tributari/d3-tributari.component';
import { D3TributariDetailsComponent } from '../components/d3_tributari/d3-tributari-details/d3-tributari-details.component';
import { EOccasionaleComponent } from '../components/e_rapporto_occasionale/e-occasionale/e-occasionale.component';
import { EOccasionaleDetailsComponent } from '../components/e_rapporto_occasionale/e-occasionale-details/e-occasionale-details.component';

import { BlankComponent } from '../shared/layouts/blank/blank.component';
import { FullComponent } from '../shared/layouts/full/full.component';
import { NotFoundComponentComponent } from './../components/not-found-component/not-found-component.component';
import { LoginActivate } from '../core/login.activate';
import { environment } from 'src/environments/environment';

import { UserComponent } from '../components/user/user.component';
import { UsersComponent } from '../components/user/users.component';
import { RoleComponent } from '../components/user/role.component';
import { RolesComponent } from '../components/user/roles.component';
import { PermissionComponent } from '../components/user/permission.component';
import { PermissionsComponent } from '../components/user/permissions.component';

import { NgxPermissionsGuard } from 'ngx-permissions';
import { PersoneinterneTitulus } from '../pages/personeinterne-titulus.component';
import { StruttureInterneTitulus } from '../pages/struttureinterne-titulus.component';
import { StruttureEsterneTitulus } from '../pages/struttureesterne-titulus.component';
import { DocumentiTitulus } from '../pages/documenti-titulus.component';
import { MappingRuoli } from '../components/mappingruoli/mappingruoli.component';
import { MappingRuolo } from '../components/mappingruoli/mappingruolo.component';
import { ListaInsegnQueryComponent } from '../components/p1_insegnamento/lista-insegn-query/lista-insegn-query.component';
import { ListaPrecontrQueryComponent } from '../components/p1_insegnamento/lista-precontr-query/lista-precontr-query.component';
import { QuadroRiepilogativoComponent } from '../components/quadro_riepilogativo/quadro-riepilogativo/quadro-riepilogativo.component';
import { D4FiscaliDetailsComponent } from '../components/d4_fiscali/d4-fiscali-details/d4-fiscali-details.component';
import { D4FiscaliComponent } from '../components/d4_fiscali/d4-fiscali/d4-fiscali.component';
import { D5FiscaliesteroComponent } from '../components/d5_fiscali_estero/d5-fiscaliestero/d5-fiscaliestero.component';
// tslint:disable-next-line:max-line-length
import { D5FiscaliesteroDetailsComponent } from '../components/d5_fiscali_estero/d5-fiscaliestero-details/d5-fiscaliestero-details.component';
import { D6DetrazionifamiliariComponent } from '../components/d6_detrazioni_familiari/d6-detrazionifamiliari/d6-detrazionifamiliari.component';
import { D6DetrazionifamiliariDetailsComponent } from '../components/d6_detrazioni_familiari/d6-detrazionifamiliari-details/d6-detrazionifamiliari-details.component';
import { StoryProcessComponent } from '../components/story_process/story-process/story-process.component';
import { SystemErrorComponent } from '../shared/system-error-component/system-error.component';
import { SommarioComponent } from '../components/documentazione/sommario/sommario.component';
import { ProceduraComponent } from '../components/documentazione/procedura/procedura.component';
import { LinkEsterniComponent } from '../components/link-esterni/link-esterni.component';
import { EmailListComponent } from '../components/email_list/email-list/email-list.component';
import { MappingUfficiTitulus } from '../components/mapping/mappinguffici.component';
import { MappingUfficioTitulus } from '../components/mapping/mappingufficio.component';
import { ListaContrugovQueryComponent } from '../components/p1_insegnamento/lista-contrugov-query/lista-contrugov-query.component';
import { LogAttivitaComponent } from '../components/user/logattivita.component';
import { NotificheComponent } from '../components/user/notifiche.component';
import { NotificaComponent } from '../components/user/notifica.component';
import { WrapperNotificheComponent } from '../components/wrapper-notifiche/wrapper-notifiche.component';


const externalLoginUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  {
    path: '',
    component: BlankComponent
  },

  {
    path: 'externallogin',
    resolve: {
      url: externalLoginUrlProvider,
    },
    canActivate: [externalLoginUrlProvider],
    component: NotFoundComponentComponent,
  },

  {
    path: 'home',
    component: FullComponent,
    canActivate: [LoginActivate],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboards/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'copertura-ugov',
        component: ListaInsegnamentiUgovComponent, canActivate: [AuthGuard],
        data: {
          title: 'Seleziona insegnamento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuovo contratto' }
          ]
        }
      },

      {
        path: 'ugov-insegn-detail/:coper_id/:aa_off_id',
        component: InsegnUgovDetailComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Importazione insegnamento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista insegnamenti', url: '/home/copertura-ugov' },
            { title: 'Import insegnamento' }
          ]
        }
      },

      {
        path: 'lista-insegn-query',
        component: ListaInsegnQueryComponent, canActivate: [AuthGuard],
        data: {
          title: 'Seleziona insegnamento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuovo contratto' }
          ]
        }
      },

      {
        path: 'lista-precontr-query',
        component: ListaPrecontrQueryComponent, canActivate: [AuthGuard],
        data: {
          title: 'Lista precontrattuali',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali' }
          ]
        }
      },

      {
        path: 'lista-contrugov-query',
        component: ListaContrugovQueryComponent, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca stato contratti in contabilità',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca stato contratti in contabilità' }
          ]
        }
      },

      {
        path: 'lista-insegn',
        component: ListaInsegnComponent, canActivate: [AuthGuard],
        data: {
          title: 'Lista precontrattuali',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali' }
          ]
        }
      },
      //VIEW
      {
        path: '',
        component: WrapperNotificheComponent,
        children: [

          {
            path: 'detail-insegn/:id',
            component: InsegnDetailComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Parte 1: Dati relativi all\'insegnamento (precompilata)',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Parte 1' }
              ]
            }
          },
          {
            path: 'p2rapporto/details/:id',
            component: P2DetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Parte 2: Posizione del collaboratore e natura del rapporto',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Parte 2' }
              ]
            }
          },
          {
            path: 'anagrafica/local/:id',
            component: AnagraficaLocalDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro A.1: Dati anagrafici',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro A.1' }
              ]
            }
          },
          {
            path: 'pagamento/local/:id',
            component: PagamentoLocalDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro A.2: Modalità di pagamento',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro A.2' }
              ]
            }
          },
          {
            path: 'conflitto/details/:id',
            component: B1ConflittoDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro B.1: Dichiarazione sul conflitto di interessi',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro B.1' }
              ]
            }
          },
          {
            path: 'incompat/details/:id',
            component: B2IncompatibilitaDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro B.2: Dichiarazione sulla incompatibilità',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro B.2' }
              ]
            }
          },
          {
            path: 'studio/details/:id',
            component: B3RappStudioUnivDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro B.3: Rapporto di studio o lavoro con l\'Università',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro B.3' }
              ]
            }
          },
          {
            path: 'rapppa/details/:id',
            component: B4RappPaDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro B.4: Rapporto di lavoro con la Pubblica Amministrazione',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro B.4' }
              ]
            }
          },
          {
            path: 'pension/details/:id',
            component: B5StatoPensionDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro B.5: Stato di pensionamento',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro B.5' }
              ]
            }
          },
          {
            path: 'privacy/details/:id',
            component: B6PrivacyDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro B.6: Trattamento dati e Informativa sulla privacy',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro B.6' }
              ]
            }
          },
          {
            path: 'cpiva/details/:id',
            component: CPrestazProfessDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro C: Prestazione Professionale (art. 53, comma 1, D.P.R. 917/1986)',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro C' }
              ]
            }
          },
          {
            path: 'inps/details/:id',
            component: D1InpsDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro D.1 - Dichiarazione ai fini previdenziali',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro D.1' }
              ]
            }
          },
          {
            path: 'inail/details/:id',
            component: D2InailDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro D.2 - Dichiarazione ai fini assicurativi INAIL',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro D.2' }
              ]
            }
          },
          {
            path: 'tributari/details/:id',
            component: D3TributariDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro D.3 - Dichiarazione ai fini tributari',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro D.3' }
              ]
            }
          },
          {
            path: 'fiscali/details/:id',
            component: D4FiscaliDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro D.4 - Richiesta ai fini fiscali',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro D.4' }
              ]
            }
          },
          {
            path: 'fiscaliestero/details/:id',
            component: D5FiscaliesteroDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro D.5: Dichiarazione ai fini fiscali per i residenti all\'estero',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro D.5' }
              ]
            }
          },
          {
            path: 'familiari/details/:id',
            component: D6DetrazionifamiliariDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro D.6: Richiesta detrazioni fiscali per familiari a carico',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro D.6' }
              ]
            }
          },
          {
            path: 'occasionale/details/:id',
            component: EOccasionaleDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Quadro E - Prestazione di Lavoro Autonomo Occasionale',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Quadro E' }
              ]
            }
          },
        ]
      },

      {
        path: 'p2rapporto/:id',
        component: P2PosizioneInsComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Parte 2: Posizione del collaboratore e natura del rapporto',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Parte 2' }
          ]
        }
      },
      {
        path: 'anagrafica/:id_ab',
        component: AnagraficaDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro A.1: Dati anagrafici',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro A.1' }
          ]
        }
      },     
      {
        path: 'pagamento/:id_ab',
        component: PagamentoDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro A.2: Modalità di pagamento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro A.2' }
          ]
        }
      },  
      {
        path: 'pagamento/update/:id',
        component: PagamentoLocalUpdateComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro A.2: Modalità di pagamento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro A.2' }
          ]
        }
      },
      {
        path: 'conflitto/:id',
        component: B1ConflittoComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro B.1: Dichiarazione sul conflitto di interessi',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro B.1' }
          ]
        }
      },
      {
        path: 'incompat/:id',
        component: B2IncompatibilitaComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro B.2: Dichiarazione sulla incompatibilità',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro B.2' }
          ]
        }
      },
      {
        path: 'studio/:id',
        component: B3RappStudioUnivComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro B.3: Rapporto di studio o lavoro con l\'Università',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro B.3' }
          ]
        }
      },
      {
        path: 'rapppa/:id',
        component: B4RappPaComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro B.4: Rapporto di lavoro con la Pubblica Amministrazione',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro B.4' }
          ]
        }
      },
      {
        path: 'pension/:id',
        component: B5StatoPensionComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro B.5: Stato di pensionamento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro B.5' }
          ]
        }
      },
      {
        path: 'privacy/:id',
        component: B6PrivacyComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro B.6: Trattamento dati e Informativa sulla privacy',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro B.6' }
          ]
        }
      },
      {
        path: 'cpiva/:id',
        component: CPrestazProfessComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro C: Prestazione Professionale (art. 53, comma 1, D.P.R. 917/1986)',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro C' }
          ]
        }
      },
      {
        path: 'inps/:id',
        component: D1InpsComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro D.1 - Dichiarazione ai fini previdenziali',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro D.1' }
          ]
        }
      },
      // MODELLO D.2
      {
        path: 'inail/:id',
        component: D2InailComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro D.2 - Dichiarazione ai fini assicurativi INAIL',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro D.2' }
          ]
        }
      },
    
      // MODELLO D.3
      {
        path: 'tributari/:id',
        component: D3TributariComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro D.3 - Dichiarazione ai fini tributari',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro D.3' }
          ]
        }
      },
   

      // MODELLO D.4
      {
        path: 'fiscali/:id',
        component: D4FiscaliComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro D.4 - Richiesta ai fini fiscali',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro D.4' }
          ]
        }
      },
     

      // MODELLO D.5
      {
        path: 'fiscaliestero/:id',
        component: D5FiscaliesteroComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro D.5: Dichiarazione ai fini fiscali per i residenti all\'estero',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro D.5' }
          ]
        }
      },
  

      // MODELLO D.6
      {
        path: 'familiari/:id',
        component: D6DetrazionifamiliariComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro D.6: Richiesta detrazioni fiscali per familiari a carico',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro D.6' }
          ]
        }
      },
    

      // MODELLO E
      {
        path: 'occasionale/:id',
        component: EOccasionaleComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Quadro E - Prestazione di Lavoro Autonomo Occasionale',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Quadro E' }
          ]
        }
      },
      

      // SOMMARIO : QUADRO RIEPILOGATIVO
      {
        path: '',
        component: WrapperNotificheComponent,
        children: [
          {
            path: 'summary/:id',
            component: QuadroRiepilogativoComponent, canActivate: [AuthGuard], pathMatch: 'full',
            data: {
              title: 'Sommario precontrattuale',
              urls: [
                { title: 'Home', url: '/home' },
                { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
                { title: 'Sommario' }
              ]
            }
          },
        ]
      },

      // LINK AI DOCUMENTI
      {
        path: 'lineeguida/:val',
        component: LinkEsterniComponent, canActivate: [AuthGuard], pathMatch: 'full',
      },
      // LINK al contratto
      {
        path: 'contratto/:val/:id',
        component: LinkEsterniComponent, canActivate: [AuthGuard], pathMatch: 'full',
      },

      // STORY PROCESS
      {
        path: 'story/:id',
        component: StoryProcessComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Storia del processo',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Story process' }
          ]
        }
      },

      // EMAIL LIST
      {
        path: 'emaillist/:id',
        component: EmailListComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Email list',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Email list' }
          ]
        }
      },

      // DOCUMENTAZIONE
      {
        path: 'sommario',
        component: SommarioComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Sommario modulistica precontrattuale',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Sommario' }
          ]
        }
      },
      {
        path: 'procedura',
        component: ProceduraComponent, canActivate: [AuthGuard], pathMatch: 'full',
        data: {
          title: 'Proceduralizzazione e dematerializzazione dei contratti di docenza',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Lista precontrattuali', url: '/home/lista-precontr-query' },
            { title: 'Proceduralizzazione' }
          ]
        }
      },

      // MAPPING RUOLI
      {
        path: 'mappingruoli', component: MappingRuoli, canActivate: [AuthGuard],
        data: {
          title: 'Associazioni ruoli per primo inserimento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca associazione ruoli' }
          ]
        }
      },
      {
        path: 'mappingruoli/:id', component: MappingRuolo, canActivate: [AuthGuard],
        data: {
          title: 'Associazioni ruoli per primo inserimento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca associazioni ruoli' }
          ]
        }
      },
      {
        path: 'mappingruoli/new', component: MappingRuolo, canActivate: [AuthGuard],
        data: {
          title: 'Nuova associazione ruolo per primo inserimento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuova associazione ruolo' }
          ]
        }
      },

      {
        path: 'users', component: UsersComponent, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca utenti',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Utenti' }
          ]
        }
      }, // canActivate:[AuthGuard]
      {
        path: 'users/:id', component: UserComponent, canActivate: [AuthGuard],
        data: {
          title: 'Utente',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Utente' }
          ]
        }
      },
      {
        path: 'roles/new', component: RoleComponent, canActivate: [AuthGuard],
        data: {
          title: 'Nuovo ruolo',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuovo ruolo' }
          ]
        }
      },
      {
        path: 'roles/:id', component: RoleComponent, canActivate: [AuthGuard],
        data: {
          title: 'Ruolo',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ruolo' }
          ]
        }
      },
      {
        path: 'roles', component: RolesComponent, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca ruoli',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca ruoli' }
          ]
        }
      },
      {
        path: 'permissions/new', component: PermissionComponent, canActivate: [AuthGuard],
        data: {
          title: 'Nuovo permesso',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuovo permesso' }
          ]
        }
      },
      {
        path: 'permissions/:id', component: PermissionComponent, canActivate: [AuthGuard],
        data: {
          title: 'Permesso',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Permesso' }
          ]
        }
      },

      {
        path: 'notifiche/new', component: NotificaComponent, canActivate: [AuthGuard],
        data: {
          title: 'Nuova notifica',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuova notifica' }
          ]
        }
      },
      {
        path: 'notifiche/:id', component: NotificaComponent, canActivate: [AuthGuard],
        data: {
          title: 'Notifica',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Notifica' }
          ]
        }
      },
      {
        path: 'notifiche', component: NotificheComponent, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca notifiche',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca notifiche' }
          ]
        }
      },


      {
        path: 'logattivita', component: LogAttivitaComponent, canActivate: [AuthGuard],
        data: {
          title: 'Log attività',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Log attività' }
          ]
        }
      },

      {
        path: 'permissions', component: PermissionsComponent, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca permessi',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca permessi' }
          ]
        }
      },

      {
        path: 'personeinterne', component: PersoneinterneTitulus, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca persone interne',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca persone interne' }
          ]
        }
      },
      {
        path: 'struttureinterne', component: StruttureInterneTitulus, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca strutture interne',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca strutture interne' }
          ]
        }
      },
      {
        path: 'struttureesterne', component: StruttureEsterneTitulus, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca strutture esterne',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca strutture esterne' }
          ]
        }
      },
      {
        path: 'documenti', component: DocumentiTitulus, canActivate: [AuthGuard],
        data: {
          title: 'Ricerca documenti',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca documenti' }
          ]
        }
      },
      {
        path: 'mappinguffici', component: MappingUfficiTitulus, canActivate: [AuthGuard],
        data: {
          title: 'Mapping uffici',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca associazione uffici' }
          ]
        }
      },
      {
        path: 'mappinguffici/:id', component: MappingUfficioTitulus, canActivate: [AuthGuard],
        data: {
          title: 'Mapping uffici',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca mapping uffici' }
          ]
        }
      },
      {
        path: 'mappinguffici/new', component: MappingUfficioTitulus, canActivate: [AuthGuard],
        data: {
          title: 'Nuova associazione uffici',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuova associazione uffici' }
          ]
        }
      },

    ]
  },
  { path: 'error', component: SystemErrorComponent },
  {
    path: '**',
    component: NotFoundComponentComponent
  }

];

@NgModule({
  providers: [
    {
      provide: externalLoginUrlProvider,
      useValue: (route: ActivatedRouteSnapshot) => {
        const externalUrl = route.queryParams['redirect'];
        console.log(externalUrl);
        if (externalUrl) {
          window.open(environment.API_URL + 'api/loginSaml?redirect=' + externalUrl, '_self');
        } else {
          window.open(environment.API_URL + 'api/loginSaml');
        }
      },
    },
  ],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})

export class RoutingModuleModule { }
