import { AuthService } from './core/auth.service';
import { CommonModule, DatePipe, LOCATION_INITIALIZED } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { RoutingModuleModule } from './routing-module/routing-module.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component, LOCALE_ID, Injector, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { JwtModule } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbModule, NgbDateParserFormatter, NgbDateAdapter, NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { APP_BASE_HREF } from '@angular/common';

// SERVICES
import { ConfirmationDialogService } from './shared/confirmation-dialog/confirmation-dialog.service';

// LAYOUT
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponentComponent } from './components/not-found-component/not-found-component.component';

// COMPONENTS APPLICATION
import { HomeComponent } from './home/home.component';
import { RoleService } from '../app/services/role.service';
import { PermissionService } from '../app/services/permission.service';
import { UnitaOrganizzativaService } from '../app/services/unitaorganizzativa.service';
import { MappingUfficioService } from '../app/services/mappingufficio.service';

import { ListaInsegnComponent } from './components/p1_insegnamento/lista-insegn/lista-insegn.component';
import { InsegnamentoComponent } from './components/p1_insegnamento/insegnamento/insegnamento.component';
import { InsegnamentoService } from './services/insegnamento.service';
import { InsegnDetailComponent } from './components/p1_insegnamento/insegn-detail/insegn-detail.component';
import { InsegnFormComponent } from './components/p1_insegnamento/insegn-form/insegn-form.component';
import { InsegnamTools } from './classes/insegnamTools';
import { RouteMetods } from './classes/routeMetods';

import { InsegnUgovService } from './services/insegn-ugov.service';
import { ListaInsegnamentiUgovComponent } from './components/insegn_Ugov/lista-insegnamenti-ugov/lista-insegnamenti-ugov.component';
import { InsegnamentoUgovComponent } from './components/insegn_Ugov/insegnamento-ugov/insegnamento-ugov.component';
import { InsegnUgovDetailComponent } from './components/insegn_Ugov/insegn-ugov-detail/insegn-ugov-detail.component';

import { DocenteService } from './services/docente.service';
import { RuoloDocenteService } from './services/ruoloDocente.service';

import { PrecontrattualeService } from './services/precontrattuale.service';
import { ValidazioneService } from './services/validazione.service';

import { P2PosizioneInsComponent } from './components/p2_posizione/p2-posizione-ins/p2-posizione-ins.component';
import { P2rapportoService } from './services/p2rapporto.service';
import { P2DetailsComponent } from './components/p2_posizione/p2-details/p2-details.component';

import { AnagraficaDetailsComponent } from './components/anagrafica/anagrafica-details/anagrafica-details.component';
import { AnagraficaService } from './services/anagrafica.service';
import { AnagraficaLocalDetailsComponent } from './components/anagrafica/anagrafica-local-details/anagrafica-local-details.component';
import { AnagraficaLocalService } from './services/anagrafica-local.service';

import { PagamentoDetailsComponent } from './components/pagamento/pagamento-details/pagamento-details.component';
import { PagamentoService } from './services/pagamento.service';
import { PagamentoLocalDetailsComponent } from './components/pagamento/pagamento-local-details/pagamento-local-details.component';
import { PagamentoLocalUpdateComponent } from './components/pagamento/pagamento-local-update/pagamento-local-update.component';

import { B1ConflittoComponent } from './components/b1_conflitto/b1-conflitto/b1-conflitto.component';
import { B1ConflittoService } from './services/b1conflitto.service';
import { B1ConflittoDetailsComponent } from './components/b1_conflitto/b1-conflitto-details/b1-conflitto-details.component';

import { B2IncompatibilitaService } from './services/b2incompatibilita.service';
import { B2IncompatibilitaComponent } from './components/b2_incompatibilita/b2-incompatibilita/b2-incompatibilita.component';
// tslint:disable-next-line:max-line-length
import { B2IncompatibilitaDetailsComponent } from './components/b2_incompatibilita/b2-incompatibilita-details/b2-incompatibilita-details.component';

import { B3RappStudioUnivService } from './services/b3rappStudio.service';
import { B3RappStudioUnivComponent } from './components/b3_rapp_studio_univ/b3-rapp-studio-univ/b3-rapp-studio-univ.component';
import { B3JoinRapportoService } from './services/b3joinRapporto.service';
// tslint:disable-next-line:max-line-length
import { B3RappStudioUnivDetailsComponent } from './components/b3_rapp_studio_univ/b3-rapp-studio-univ-details/b3-rapp-studio-univ-details.component';

import { B4RappPAService } from './services/b4rappPA.service';
import { B4RappPaComponent } from './components/b4_rapp_pa/b4-rapp-pa/b4-rapp-pa.component';
import { B4RappPaDetailsComponent } from './components/b4_rapp_pa/b4-rapp-pa-details/b4-rapp-pa-details.component';

import { B5StatoPensionamentoService } from './services/b5statoPensionam.service';
import { B5StatoPensionComponent } from './components/b5_stato_pensionam/b5-stato-pension/b5-stato-pension.component';
// tslint:disable-next-line:max-line-length
import { B5StatoPensionDetailsComponent } from './components/b5_stato_pensionam/b5-stato-pension-details/b5-stato-pension-details.component';

import { B6PrivacyComponent } from './components/b6_privacy/b6-privacy/b6-privacy.component';
import { B6InformativaService } from './services/b6informativa.service';
import { B6PrivacyDetailsComponent } from './components/b6_privacy/b6-privacy-details/b6-privacy-details.component';

import { CPrestazProfessService } from './services/cPrestazProfess.service';
// tslint:disable-next-line:max-line-length
import { CPrestazProfessDetailsComponent } from './components/c_prestaz_profess/c-prestaz-profess-details/c-prestaz-profess-details.component';
import { CPrestazProfessComponent } from './components/c_prestaz_profess/c-prestaz-profess/c-prestaz-profess.component';

import { D1InpsService } from './services/d1inps.service';
import { D1InpsComponent } from './components/d1_inps/d1-inps/d1-inps.component';
import { D1InpsDetailsComponent } from './components/d1_inps/d1-inps-details/d1-inps-details.component';

import { D2InailComponent } from './components/d2_inail/d2-inail/d2-inail.component';
import { D2InailDetailsComponent } from './components/d2_inail/d2-inail-details/d2-inail-details.component';
import { D2InailService } from './services/d2Inail.service';

import { D3TributariService } from './services/d3tributari.service';
import { D3TributariDetailsComponent } from './components/d3_tributari/d3-tributari-details/d3-tributari-details.component';
import { D3TributariComponent } from './components/d3_tributari/d3-tributari/d3-tributari.component';

import { D4FiscaliService } from './services/d4fiscali.service';
import { D4FiscaliComponent } from './components/d4_fiscali/d4-fiscali/d4-fiscali.component';
import { D4FiscaliDetailsComponent } from './components/d4_fiscali/d4-fiscali-details/d4-fiscali-details.component';

import { D5FiscaliEsteroService } from './services/d5fiscaliEstero.service';
// tslint:disable-next-line:max-line-length
import { D5FiscaliesteroDetailsComponent } from './components/d5_fiscali_estero/d5-fiscaliestero-details/d5-fiscaliestero-details.component';
import { D5FiscaliesteroComponent } from './components/d5_fiscali_estero/d5-fiscaliestero/d5-fiscaliestero.component';

import { D6DetrazioniFamiliariService } from './services/d6detrazioniFamiliari.service';
// tslint:disable-next-line:max-line-length
import { D6DetrazionifamiliariComponent } from './components/d6_detrazioni_familiari/d6-detrazionifamiliari/d6-detrazionifamiliari.component';
// tslint:disable-next-line:max-line-length
import { D6DetrazionifamiliariDetailsComponent } from './components/d6_detrazioni_familiari/d6-detrazionifamiliari-details/d6-detrazionifamiliari-details.component';

import { EOccasionaleService } from './services/eOccasionale.service';
import { EOccasionaleComponent } from './components/e_rapporto_occasionale/e-occasionale/e-occasionale.component';
import { EOccasionaleDetailsComponent } from './components/e_rapporto_occasionale/e-occasionale-details/e-occasionale-details.component';


// AUTENTICAZIONE
import { UserComponent } from './components/user/user.component';
import { UsersComponent } from './components/user/users.component';
import { PermissionComponent } from './components/user/permission.component';
import { PermissionsComponent } from './components/user/permissions.component';
import { RoleComponent } from './components/user/role.component';
import { RolesComponent } from './components/user/roles.component';

// CORE
import { MessageCacheService } from './core/message.service';
import { AuthGuard } from './core/auth.guard';
import { CoreModule } from './core/core.module';
import { LoginActivate } from './core/login.activate';
import { HttpInterceptorProviders, GlobalErrorHandlerProviders } from './core/index';
import { RequestCache, RequestCacheWithMap } from './core/request-cache.service';

import { UserService } from './services/user.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule, HttpLoaderFactory } from './shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ToastrModule } from 'ngx-toastr';

import { NgxLoadingModule } from 'ngx-loading';

import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { MessageService } from './shared';

// PIPE
import { MycurrencyPipe } from './shared/pipe/custom.currencypipe';
import { UniqueName } from './shared/pipe/unique-name';
import { UniqueYear } from './shared/pipe/unique-year';

import { NgSelectModule } from '@ng-select/ng-select';

import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
// import { ApplicationService } from './application/application.service';

import { StorageServiceModule } from 'ngx-webstorage-service';
import { TranslateModule, TranslateLoader, TranslateService, MissingTranslationHandler } from '@ngx-translate/core';
import { PersonaInternaService } from './services/personainterna.service';
import { StrutturaInternaService } from './services/strutturainterna.service';
import { StrutturaEsternaService } from './services/strutturaesterna.service';
import { DocumentoService } from './services/documento.service';
import { DocumentiTitulus } from './pages/documenti-titulus.component';
import { StruttureEsterneTitulus } from './pages/struttureesterne-titulus.component';
import { StruttureInterneTitulus } from './pages/struttureinterne-titulus.component';
import { PersoneinterneTitulus } from './pages/personeinterne-titulus.component';
import { MappingRuolo } from './components/mappingruoli/mappingruolo.component';
import { MappingRuoli } from './components/mappingruoli/mappingruoli.component';
import { MappingRuoloService } from './services/mappingruolo.service';

import { ListaInsegnQueryComponent } from './components/p1_insegnamento/lista-insegn-query/lista-insegn-query.component';
import { ListaPrecontrQueryComponent } from './components/p1_insegnamento/lista-precontr-query/lista-precontr-query.component';
import { NgbStringAdapter } from './NgbStringAdapter';
import { NgbDateCustomParserFormatter } from './NgbDateCustomParserFormatter';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { QuadroRiepilogativoComponent } from './components/quadro_riepilogativo/quadro-riepilogativo/quadro-riepilogativo.component';
import { SummaryService } from './services/quadro-riepilogativo.service';
import { BarraComandiComponent } from './components/barra-comandi/barra-comandi.component';
import { TerminaButtonComponent } from './components/barra-comandi/termina-button/termina-button.component';
import { StoryProcessComponent } from './components/story_process/story-process/story-process.component';
import { StoryProcessService } from './services/storyProcess.service';
import { SommarioComponent } from './components/documentazione/sommario/sommario.component';
import { ProceduraComponent } from './components/documentazione/procedura/procedura.component';
import { ProseguiButtonComponent } from './components/barra-comandi/prosegui-button/prosegui-button.component';
import { LinkEsterniComponent } from './components/link-esterni/link-esterni.component';
import { EmailListComponent } from './components/email_list/email-list/email-list.component';
import { EmailListService } from './services/emailList.service';
import { InputConfirmationDialogComponent } from './shared/input-confirmation-dialog/input-confirmation-dialog.component';
import { IntestazioneComponent } from './components/intestazione/intestazione.component';
import { SalvaAnnullaButtonComponent } from './components/barra-comandi/salva-annulla-button/salva-annulla-button.component';
import { MappingUfficioTitulus } from './components/mapping/mappingufficio.component';
import { MappingUfficiTitulus } from './components/mapping/mappinguffici.component';
import { ListaContrugovQueryComponent } from './components/p1_insegnamento/lista-contrugov-query/lista-contrugov-query.component';
import { ContrUgovService } from './services/contr-ugov.service';
import { MyMissingTranslationHandler } from './shared/MyMissingTranslationHandler';
import { LogAttivitaComponent } from './components/user/logattivita.component';
import { LogAttivitaService } from './services/logattivita.service';
import { SettingsService } from './services/settings.service';
import { SessionStorageService } from './services/session-storage.service';
import { NotificaService } from './shared/notifica.service';
import { NotificaComponent } from './components/user/notifica.component';
import { NotificheComponent } from './components/user/notifiche.component';
import { WrapperNotificheComponent } from './components/wrapper-notifiche/wrapper-notifiche.component';
import { AppConstants } from './app-constants';
import { FormlyModule } from '@ngx-formly/core';
import { PrecontrattualeDocenteService } from './services/precontrattualedocente.service';
import { BreadcrumbService } from './services/breadcrumb.service';



const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20
};


export function tokenGetter() {
  return localStorage.getItem(AuthService.TOKEN);
}

registerLocaleData(localeIt);

export function appInitializerFactory(translate: TranslateService, injector: Injector) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const langToSet = 'it';
      translate.setDefaultLang('it');
      translate.use(langToSet).subscribe(() => {
        // tslint:disable-next-line:no-console
        console.info(`Successfully initialized '${langToSet}' language.'`);
      }, err => {
        console.error(`Problem with '${langToSet}' language initialization.'`);
      }, () => {
        resolve(null);
      });
    });
  });
}

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        ListaInsegnComponent,
        InsegnamentoComponent,
        InsegnDetailComponent,
        InsegnFormComponent,
        ListaInsegnamentiUgovComponent,
        InsegnamentoUgovComponent,
        InsegnUgovDetailComponent,
        P2PosizioneInsComponent,
        P2DetailsComponent,
        HomeComponent,
        NotFoundComponentComponent,
        UserComponent,
        UsersComponent,
        PermissionComponent,
        PermissionsComponent,
        RoleComponent,
        RolesComponent,
        MappingRuolo,
        MappingRuoli,
        NotificaComponent,
        NotificheComponent,
        PersoneinterneTitulus,
        StruttureEsterneTitulus,
        StruttureInterneTitulus,
        DocumentiTitulus,
        AnagraficaDetailsComponent,
        PagamentoDetailsComponent,
        AnagraficaLocalDetailsComponent,
        PagamentoLocalDetailsComponent,
        PagamentoLocalUpdateComponent,
        B1ConflittoComponent,
        B1ConflittoDetailsComponent,
        B2IncompatibilitaComponent,
        B2IncompatibilitaDetailsComponent,
        B3RappStudioUnivComponent,
        B3RappStudioUnivDetailsComponent,
        ListaInsegnQueryComponent,
        ListaPrecontrQueryComponent,
        ListaContrugovQueryComponent,
        B4RappPaComponent,
        B4RappPaDetailsComponent,
        B5StatoPensionComponent,
        B5StatoPensionDetailsComponent,
        B6PrivacyComponent,
        B6PrivacyDetailsComponent,
        CPrestazProfessDetailsComponent,
        CPrestazProfessComponent,
        D1InpsComponent,
        D1InpsDetailsComponent,
        QuadroRiepilogativoComponent,
        EOccasionaleComponent,
        EOccasionaleDetailsComponent,
        D2InailComponent,
        D2InailDetailsComponent,
        D3TributariDetailsComponent,
        D3TributariComponent,
        D4FiscaliComponent,
        D4FiscaliDetailsComponent,
        BarraComandiComponent,
        D5FiscaliesteroDetailsComponent,
        D5FiscaliesteroComponent,
        D6DetrazionifamiliariComponent,
        D6DetrazionifamiliariDetailsComponent,
        TerminaButtonComponent,
        StoryProcessComponent,
        SommarioComponent,
        ProceduraComponent,
        ProseguiButtonComponent,
        LinkEsterniComponent,
        EmailListComponent,
        IntestazioneComponent,
        SalvaAnnullaButtonComponent,
        MappingUfficiTitulus,
        MappingUfficioTitulus,
        LogAttivitaComponent,
        WrapperNotificheComponent,
    ],
    imports: [
        SharedModule.forRoot(),
        NgxLoadingModule.forRoot({}),
        NgxPermissionsModule.forRoot(),
        CommonModule,
        NgbModule,
        NgbTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        NgxDatatableModule,
        RouterModule,
        PerfectScrollbarModule,
        NgSelectModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        SharedModule,
        RoutingModuleModule,
        CoreModule,
        NgxPermissionsModule.forRoot(),
        PerfectScrollbarModule,
        ToastrModule.forRoot(),
        StorageServiceModule,
        PdfViewerModule,
        FormlyModule.forRoot({
          extras: {
            checkExpressionOn: 'changeDetectionCheck',
            resetFieldOnHide: false,
            lazyRender: true
          },
          types: [
            {
              name: 'formly-group',
              defaultOptions: {
                defaultValue: {}
              }
            },
            {
              name: 'repeattable',
              defaultOptions: {
                defaultValue: []
              }
            },
            {
              name: 'repeatviewtable',
              defaultOptions: {
                defaultValue: []
              }
            },
            {
              name: 'repeat',
              defaultOptions: {
                defaultValue: []
              }
            },
          ],
    
        }),
        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGetter,
            allowedDomains: environment.whitelistedDomains, //PER Bearer 
            disallowedRoutes: environment.blacklistedRoutes,
          }
        }),
        TranslateModule.forRoot({
          missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler },
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
    ],
    exports: [
        HomeComponent,
        UserComponent,
        UsersComponent,
        RoleComponent,
        RolesComponent,
        PermissionComponent,
        PermissionsComponent,
        MappingRuolo,
        MappingRuoli,
        LogAttivitaComponent,
    ],
    providers: [
        AuthService,
        NgbActiveModal,
        AuthGuard,
        LoginActivate,
        InsegnamentoService,
        InsegnUgovService,
        ContrUgovService,
        P2rapportoService,
        PrecontrattualeService,
        PrecontrattualeDocenteService,
        ValidazioneService,
        SummaryService,
        AnagraficaService,
        PagamentoService,
        DocenteService,
        RuoloDocenteService,
        AnagraficaLocalService,
        B1ConflittoService,
        B2IncompatibilitaService,
        B3RappStudioUnivService,
        B3JoinRapportoService,
        B4RappPAService,
        B5StatoPensionamentoService,
        B6InformativaService,
        CPrestazProfessService,
        D1InpsService,
        D2InailService,
        D3TributariService,
        D4FiscaliService,
        D5FiscaliEsteroService,
        D6DetrazioniFamiliariService,
        EOccasionaleService,
        StoryProcessService,
        EmailListService,
        ConfirmationDialogService,
        // ApplicationService,
        UserService,
        MessageService,
        MessageCacheService,
        RoleService,
        PermissionService,
        LogAttivitaService,
        HttpInterceptorProviders,
        GlobalErrorHandlerProviders,
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
        { provide: RequestCache, useClass: RequestCacheWithMap },
        // { provide: 'InsegnamentoService', useClass: InsegnamentoService },
        { provide: 'userService', useClass: UserService },
        { provide: 'unitaorganizzativaService', useClass: UnitaOrganizzativaService },
        { provide: 'roleService', useClass: RoleService },
        { provide: 'precontrattualeService', useClass: PrecontrattualeService },
        { provide: LOCALE_ID, useValue: 'it' },
        // { provide: 'applicationService', useClass: ApplicationService },
        // { provide: NgbDateAdapter, useClass: NgbStringAdapter },
        // { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
        { provide: APP_BASE_HREF, useValue: environment.baseHref },
        PersonaInternaService,
        StrutturaInternaService,
        StrutturaEsternaService,
        DocumentoService,
        MappingRuoloService,
        MappingUfficioService,
        SettingsService,
        SessionStorageService,
        { provide: 'personainternaService', useClass: PersonaInternaService },
        { provide: 'strutturainternaService', useClass: StrutturaInternaService },
        { provide: 'strutturaesternaService', useClass: StrutturaEsternaService },
        { provide: 'mappingufficititulusService', useClass: MappingUfficioService },
        { provide: 'documentoService', useClass: DocumentoService },
        { provide: 'mappingruoloService', useClass: MappingRuoloService },
        { provide: NgbDateAdapter, useClass: NgbStringAdapter },
        { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [TranslateService, Injector],
            multi: true
        },
        InsegnamTools,
        RouteMetods,
        DatePipe,
        BreadcrumbService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
  constructor(router: Router) {

    window['initAsync'] = function () {
      console.log('app initSDK');
      // PLACE HERE CONFIGURATION CODE (eg. API keys, tokens, etc..)
      var BASE_URL = AppConstants.baseApiURL; //'https://uniurb.webfirma.cineca.it/my-web-firma' ;
      var API_URL = "/sdk/";
      var OTP_API_URL = '/firma/sendOtp/'; //"http://localhost:8080/firma/sendOtp/";
      var OTP_API_FEA_URL = '/firma/sendFilesToFEA/'; //"http://localhost:8080/firma/sendOtp/";
      var OTP_API_ARUBA_URL = '/firma/sendArubaOtp';
      var SIGN_API_URL = '/firma/signProcess/'; //"http://localhost:8080/firma/signProcess/";
      var CERT_OTP_URL = '/firma/certificato/otpType/';

      window['SDK'].init(
        {
          'BASE_URL': BASE_URL,
          'API_URL': BASE_URL + API_URL,
          'OTP_API_URL': BASE_URL + OTP_API_URL,
          'OTP_API_FEA_URL': BASE_URL + OTP_API_FEA_URL,
          'OTP_API_ARUBA_URL': BASE_URL + OTP_API_ARUBA_URL,
          'SIGN_API_URL': BASE_URL + SIGN_API_URL,
          'CERT_OTP_URL': BASE_URL + CERT_OTP_URL,
          'FORM_URL': AppConstants.baseURL+'otp/sdk/',
          'language': 'IT',
          useIFrame: false,
          apiToken: ""//"0123456790abcdefghijklmnopqrstuvxwz"
        }
      );
    };

  }
 }
