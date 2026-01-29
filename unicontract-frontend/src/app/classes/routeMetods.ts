import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()

export class RouteMetods {

    constructor(private router: Router) {}

    summary(idins: number) {
        this.router.navigate(['home/summary', idins]);
    }

    gotoP1(value: number) {
        this.router.navigate(['home/detail-insegn', value]);
    }

    gotoP2(value: number) {
        this.router.navigate(['home/p2rapporto/details', value]);
    }

    gotoA1(value: number) {
        this.router.navigate(['home/anagrafica/local', value]);
    }

    gotoA2(value: number) {
        this.router.navigate(['home/pagamento/local', value]);
    }

    gotoB1(value: number) {
        this.router.navigate(['home/conflitto/details', value]);
    }

    gotoB2(value: number) {
        this.router.navigate(['home/incompat/details', value]);
    }

    gotoB3(value: number) {
        this.router.navigate(['home/studio/details', value]);
    }

    gotoB4(value: number) {
        this.router.navigate(['home/rapppa/details', value]);
    }

    gotoB5(value: number) {
        this.router.navigate(['home/pension/details', value]);
    }

    gotoB6(value: number) {
        this.router.navigate(['home/privacy/details', value]);
    }

    gotoC(value: number) {
        this.router.navigate(['home/cpiva/details', value]);
    }

    gotoD1(value: number) {
        this.router.navigate(['home/inps/details', value]);
    }

    gotoD2(value: number) {
        this.router.navigate(['home/inail/details', value]);
    }

    gotoD3(value: number) {
        this.router.navigate(['home/tributari/details', value]);
    }

    gotoD4(value: number) {
        this.router.navigate(['home/fiscali/details', value]);
    }

    gotoD5(value: number) {
        this.router.navigate(['home/fiscaliestero/details', value]);
    }

    gotoD6(value: number) {
        this.router.navigate(['home/familiari/details', value]);
    }

    gotoE(value: number) {
        this.router.navigate(['home/occasionale/details', value]);
    }

    // METODI DI SWITCH
    switchB3(id: number, idb3: number) {
    if (idb3 === 0) {
        this.router.navigate(['home/studio', id]);
    } else {
        this.router.navigate(['home/studio/details', idb3]);
    }
    }

    switchB4(id: number, idb4: number) {
        if (idb4 === 0) {
            this.router.navigate(['home/rapppa', id]);
        } else {
            this.router.navigate(['home/rapppa/details', idb4]);
        }
    }

    switchB5(id: number, idb5: number) {
        if (idb5 === 0) {
            this.router.navigate(['home/pension', id]);
        } else {
            this.router.navigate(['home/pension/details', idb5]);
        }
    }

    switchB6(id: number, idb6: number) {
        if (idb6 === 0) {
            this.router.navigate(['home/privacy', id]);
        } else {
            this.router.navigate(['home/privacy/details', idb6]);
        }
    }

    switchC(idins: number, idC: number) {
        if (idC === 0) {
          this.router.navigate(['home/cpiva', idins]);
        } else {
          this.router.navigate(['home/cpiva/details', idC]);
        }
    }

    switchD1(idins: number, idD1: number) {
        if (idD1 === 0) {
          this.router.navigate(['home/inps', idins]);
        } else {
          this.router.navigate(['home/inps/details', idD1]);
        }
    }

    switchD2(idins: number, idD2: number) {
        if (idD2 === 0) {
          this.router.navigate(['home/inail', idins]);
        } else {
          this.router.navigate(['home/inail/details', idD2]);
        }
    }

    switchD3(idins: number, idD3: number) {
        if (idD3 === 0) {
          this.router.navigate(['home/tributari', idins]);
        } else {
          this.router.navigate(['home/tributari/details', idD3]);
        }
    }

    switchD4(idins: number, idD4: number) {
        if (idD4 === 0) {
          this.router.navigate(['home/fiscali', idins]);
        } else {
          this.router.navigate(['home/fiscali/details', idD4]);
        }
    }

    switchD5(idins: number, idD5: number) {
        if (idD5 === 0) {
          this.router.navigate(['home/fiscaliestero', idins]);
        } else {
          this.router.navigate(['home/fiscaliestero/details', idD5]);
        }
    }

    switchD6(idins: number, idD6: number) {
        if (idD6 === 0) {
          this.router.navigate(['home/familiari', idins]);
        } else {
          this.router.navigate(['home/familiari/details', idD6]);
        }
    }

    switchE(idins: number, idE: number) {
        if (idE === 0) {
          this.router.navigate(['home/occasionale', idins]);
        } else {
          this.router.navigate(['home/occasionale/details', idE]);
        }
    }

    // RAPPORTO DI STUDIO CON UNIVERSITA', SE IN P2 E' TRUE
    controlButtonB3(p2_RS: number) {
        if (p2_RS === 1) {
            return true;
        } else {
            return false;
        }
    }

    controlButtonB4(p2_RS: number, p2_PA: number, id_B3: number, id_B4: number) {
        if (p2_RS === 0 && p2_PA === 1) {
            return true;
        } else if (p2_RS === 1 && id_B3 !== 0 && p2_PA === 1 && id_B4 !== 0) {
            return true;
        } else {
            return false;
        }
    }

    controlButtonB5(p2_RS: number, p2_PA: number, p2_PNS: number, id_B3: number, id_B4: number, id_B5: number) {
        if (p2_RS === 0 && p2_PA === 0 && p2_PNS === 1) {
            return true;
        } else if (p2_RS === 1 && id_B3 !== 0 && p2_PA === 1 && id_B4 !== 0 && p2_PNS === 1 && id_B5 !== 0) {
            return true;
        } else {
            return false;
        }
    }

    controlButtonB6(p2_RS: number, p2_PA: number, p2_PNS: number, id_B3: number, id_B4: number, id_B5: number) {
        if (p2_RS === 0 && p2_PA === 0 && p2_PNS === 0) {
            return true;
        } else if (p2_RS === 1 && id_B3 !== 0 && p2_PA === 0 && p2_PNS === 0) {
            return true;
        } else if (p2_RS === 1 && id_B3 !== 0 && p2_PA === 1 && id_B4 !== 0 && p2_PNS === 0) {
            return true;
        } else if (p2_RS === 1 && id_B3 !== 0 && p2_PA === 1 && id_B4 !== 0 && p2_PNS === 1 && id_B5 !== 0) {
            return true;
        } else if (p2_RS === 1 && id_B3 !== 0 && p2_PA === 1 && id_B4 === 0 && p2_PNS === 1 && id_B5 === 0) {
            return true;
        } else if (p2_RS === 1 && id_B3 !== 0 && p2_PA === 1 && id_B4 !== 0 && p2_PNS === 1 && id_B5 === 0) {
            return true;
        } else if (p2_RS === 1 && id_B3 !== 0 && p2_PA === 0 && p2_PNS === 1 && id_B5 !== 0) {
            return true;
        } else if (p2_RS === 0 && p2_PA === 1 && id_B4 !== 0 && p2_PNS === 0 ) {
            return true;
        } else if (p2_RS === 0 && p2_PA === 1 && id_B4 === 0 && p2_PNS === 0 ) {
            return true;
        } else if (p2_RS === 0 && p2_PA === 1 && id_B4 !== 0 && p2_PNS === 1 && id_B5 !== 0) {
            return true;
        } else if (p2_RS === 0 && p2_PA === 0 && p2_PNS === 1 && id_B5 !== 0) {
            return true;
        } else {
            return false;
        }
    }

    fromB3toB4(p2_PA: number) {
        if (p2_PA === 1) {
            return true;
        } else {
            return false;
        }
    }

    fromB3toB5(p2_PA: number, p2_PNS: number) {
        if (p2_PA === 0 && p2_PNS === 1) {
            return true;
        } else {
            return false;
        }
    }

    fromB3toB6(p2_PA: number, p2_PNS: number, id_b6: number) {
        if (p2_PA === 0 && p2_PNS === 0) {
            return true;
        } else if (id_b6 !== 0) {
            return true;
        } else {
            return false;
        }
    }

    fromB4toB5(p2_PNS: number) {
        if (p2_PNS === 1) {
            return true;
        } else {
            return false;
        }
    }

    fromB4toB6(p2_PNS: number, id_b6: number) {
        if (p2_PNS === 0) {
            return true;
        } else if (id_b6 !== 0) {
            return true;
        } else {
            return false;
        }
    }

    story(value: number) {
        this.router.navigate(['home/story', value]);
    }

    emaillist(value: number) {
        this.router.navigate(['home/emaillist', value]);
    }
   
    attivaPulsanteB3(item) {
        if (item.flag_rapp_studio_univ == 1 && item.b2_incompatibilita_id !== 0 && item.b3_rapp_studio_univ_id === 0) {
            return true;
        }
        return false;
    }

    attivaPulsanteB4(item) {
        if (item.flag_dipend_pubbl_amm == 1 && 
            item.b2_incompatibilita_id !== 0 && 
            item.b4_rapp_pubbl_amm_id === 0 && 
            (item.flag_rapp_studio_univ == 0 || item.b3_rapp_studio_univ_id !== 0)) {

            return true;
        }
        return false;
    }


    attivaPulsanteB5(item) {
        if (item.flag_titolare_pensione == 1 && 
            item.b2_incompatibilita_id !== 0 && 
            item.b5_stato_pensionam_id === 0 && 
            ( item.flag_rapp_studio_univ == 0 || item.b3_rapp_studio_univ_id !== 0) && 
            (item.flag_rapp_studio_univ == 0 || item.b4_rapp_pubbl_amm_id !== 0)) {
            return true;
        }
        return false;
    }

    attivaPulsanteD5(item){
        if (item.provincia_fiscale === 'EE' && item.d5_fiscali_resid_estero_id == 0 && item.d4_fiscali_id !== 0 && item.natura_rapporto === 'COCOCO'){
            return true;
        }
        return false;
    }
}
