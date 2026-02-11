import 'zone.js/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { NgxPermissionsModule } from 'ngx-permissions';
import { AnagraficaService } from './app/services/anagrafica.service';
import { EmailListService } from './app/services/emailList.service';
import { D2InailService } from './app/services/d2Inail.service';
import { PagamentoService } from './app/services/pagamento.service';
import { SettingsService } from './app/services/settings.service';
import { AnagraficaLocalService } from './app/services/anagrafica-local.service';
import { D4FiscaliService } from './app/services/d4fiscali.service';
import { InsegnamentoService } from './app/services/insegnamento.service';
import { StoryProcessService } from './app/services/storyProcess.service';
import { PrecontrattualeService } from './app/services/precontrattuale.service';
import { B6InformativaService } from './app/services/b6informativa.service';
import { B5StatoPensionamentoService } from './app/services/b5statoPensionam.service';
import { B1ConflittoService } from './app/services/b1conflitto.service';
import { B2IncompatibilitaService } from './app/services/b2incompatibilita.service';
import { D6DetrazioniFamiliariService } from './app/services/d6detrazioniFamiliari.service';
import { D5FiscaliEsteroService } from './app/services/d5fiscaliEstero.service';
import { D3TributariService } from './app/services/d3tributari.service';
import { D1InpsService } from './app/services/d1inps.service';
import { InsegnamTools } from './app/classes/insegnamTools';
import { P2rapportoService } from './app/services/p2rapporto.service';
import { SummaryService } from './app/services/quadro-riepilogativo.service';
import { B4RappPAService } from './app/services/b4rappPA.service';
import { CPrestazProfessService } from './app/services/cPrestazProfess.service';
import { InsegnUgovService } from './app/services/insegn-ugov.service';
import { B3JoinRapportoService } from './app/services/b3joinRapporto.service';
import { ConfirmationDialogService } from './app/shared/confirmation-dialog/confirmation-dialog.service';
import { RouteMetods } from './app/classes/routeMetods';
import { NotificaService } from './app/shared';
import { DocenteService } from './app/services/docente.service';
import { EOccasionaleService } from './app/services/eOccasionale.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RuoloDocenteService } from './app/services/ruoloDocente.service';
import { B3RappStudioUnivService } from './app/services/b3rappStudio.service';
import { ToDateObjPipe } from './app/shared/pipe/todateobj.pipe';
import { UniqueName } from './app/shared/pipe/unique-name';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: true } }
);

// Baseline TestBed config for all specs
beforeEach(() => {
  TestBed.configureTestingModule({
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
      // Provides 'translate' pipe globally
      TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
      }),

      // IMPORTANT: provides ngx-permissions tokens (USE_PERMISSIONS_STORE, etc.)
      NgxPermissionsModule.forRoot(),
    ],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      NgbActiveModal,
      AnagraficaService,  
      EmailListService,
      D2InailService,
      PagamentoService,
      SettingsService,
      StoryProcessService,
      AnagraficaLocalService,
      InsegnamentoService,B6InformativaService, PrecontrattualeService, 
      B5StatoPensionamentoService, B6InformativaService, B4RappPAService, B3RappStudioUnivService, B3RappStudioUnivService, B3JoinRapportoService, B1ConflittoService, B2IncompatibilitaService,
      D6DetrazioniFamiliariService, D5FiscaliEsteroService, D4FiscaliService, D3TributariService, D2InailService, D1InpsService,
      P2rapportoService, SummaryService, CPrestazProfessService, InsegnamentoService, InsegnUgovService,
      JwtHelperService,
      InsegnamTools,
      EOccasionaleService,
      ConfirmationDialogService, RouteMetods, NotificaService, DocenteService, RuoloDocenteService, 
      { provide: JWT_OPTIONS, useValue: {} },

      // ActivatedRoute default stub (safe baseline; per-spec can override)
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: convertToParamMap({}),
            queryParamMap: convertToParamMap({}),
            params: {},
            queryParams: {},
            data: {},
            url: [],
          },
          paramMap: { subscribe: () => ({ unsubscribe() {} }) },
          queryParamMap: { subscribe: () => ({ unsubscribe() {} }) },
          params: { subscribe: () => ({ unsubscribe() {} }) },
          queryParams: { subscribe: () => ({ unsubscribe() {} }) },
          data: { subscribe: () => ({ unsubscribe() {} }) },
        },
      },
    ],
  });
});
