import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SummaryService } from './quadro-riepilogativo.service';
import { MessageService } from '../shared/message.service';
import { provideHttpClient } from '@angular/common/http';



class MockMessageService {
  info() {}
  error() {}
  clear() {}
}

class MockConfirmationDialogService {
  confirm() { return Promise.resolve(true); }
}

describe('SummaryService', () => {
  let service: SummaryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({      
      providers: [provideHttpClient(), provideHttpClientTesting(), SummaryService, { provide: MessageService, useClass: MockMessageService }]
    });
    service = TestBed.inject(SummaryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should call API in getSummary()', () => {
    (service as any).getSummary('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in download()', () => {
    (service as any).download('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/attachments/download/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in getTitulusDocumentURL()', () => {
    (service as any).getTitulusDocumentURL('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/precontrattuale/gettitulusdocumenturl/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in previewcontratto()', () => {
    (service as any).previewContratto('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/precontrattuale/previewcontratto/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in modulisticaprecontr()', () => {
    (service as any).modulisticaPrecontr('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/precontrattuale/modulisticaprecontr/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in validazioneAmm()', () => {
    (service as any).validazioneAmm({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/validazioneamm'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in validazioneEconomica()', () => {
    (service as any).validazioneEconomica({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/validazioneeconomica'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in annullaAmm()', () => {
    (service as any).annullaAmm({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/annullaamm'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in annullaEconomica()', () => {
    (service as any).annullaEconomica({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/annullaeconomica'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in presaVisioneAccettazione()', () => {
    (service as any).presaVisioneAccettazione({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/presavisioneaccettazione'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in firmaGrafometrica()', () => {
    (service as any).firmaGrafometrica({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/firmagrafometrica'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in richiestafirmaio()', () => {
    (service as any).richiestafirmaio({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/richiestafirmaio'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in richiestafirmausign()', () => {
    (service as any).richiestafirmausign({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/richiestafirmausign'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in cancellazioneIstanzaFirmaUtente()', () => {
    (service as any).cancellazioneIstanzaFirmaUtente({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/cancellazioneistanzafirmautente'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in annullaContratto()', () => {
    (service as any).annullaContratto({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/annullacontratto'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in annullaAnnullaContratto()', () => {
    (service as any).annullaAnnullaContratto({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/annullaannullacontratto'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in rinunciaCompenso()', () => {
    (service as any).rinunciaCompenso({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/rinunciacompenso'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in annullaRinuncia()', () => {
    (service as any).annullaRinuncia({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/annullarinuncia'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in richiestaInformazioni()', () => {
    (service as any).richiestaInformazioni({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/maillist'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in sendInfoEmail()', () => {
    (service as any).sendInfoEmail({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/sendinfoemail/'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in getIddg()', () => {
    (service as any).getIddg('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/iddg/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});