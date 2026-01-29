import { PrecontrattualeInterface,
         UpdateP2,
         UpdateA1,
         UpdateA2,
         UpdateB1,
         UpdateB2,
         UpdateB3,
         UpdateB4,
         UpdateB5,
         UpdateB6,
         UpdateC,
         UpdateD1,
         UpdateD2,
         UpdateD3,
         UpdateD4,
         UpdateD5,
         UpdateD6,
         UpdateE } from './../interface/precontrattuale';

export class Precontrattuale implements PrecontrattualeInterface {
    id: number;
    insegn_id: number;
    p2_natura_rapporto_id: number;
    a1_anagrafica_id: number;
    a2_mod_pagamento_id: number;
    b1_confl_interessi_id: number;
    b2_incompatibilita_id: number;
    b3_rapp_studio_univ_id: number;
    b4_rapp_pubbl_amm_id: number;
    b5_stato_pensionam_id: number;
    b6_trattamento_dati_id: number;
    c_prestaz_profess_id: number;
    d1_inps_id: number;
    d2_inail_id: number;
    d3_tributari_id: number;
    d4_fiscali_id: number;
    d5_fiscali_resid_estero_id: number;
    d6_detraz_fam_carico_id: number;
    e_autonomo_occasionale_id: number;
    docente_id: number;

    constructor() {
        this.id = 0;
        this.insegn_id = 0;
        this.p2_natura_rapporto_id = 0;
        this.a1_anagrafica_id = 0;
        this.a2_mod_pagamento_id = 0;
        this.b1_confl_interessi_id = 0;
        this.b2_incompatibilita_id = 0;
        this.b3_rapp_studio_univ_id = 0;
        this.b4_rapp_pubbl_amm_id = 0;
        this.b5_stato_pensionam_id = 0;
        this.b6_trattamento_dati_id = 0;
        this.c_prestaz_profess_id = 0;
        this.d1_inps_id = 0;
        this.d2_inail_id = 0;
        this.d3_tributari_id = 0;
        this.d4_fiscali_id = 0;
        this.d5_fiscali_resid_estero_id = 0;
        this.d6_detraz_fam_carico_id = 0;
        this.e_autonomo_occasionale_id = 0;
        this.docente_id = 0;
    }
}

export class Updp2 implements UpdateP2 {
    insegn_id: number;
    p2_natura_rapporto_id: number;

    constructor() {
        this.insegn_id = 0;
        this.p2_natura_rapporto_id = 0;
    }
}

export class Upda1 implements UpdateA1 {
    insegn_id: number;
    a1_anagrafica_id: number;

    constructor() {
        this.insegn_id = 0;
        this.a1_anagrafica_id = 0;
    }
}

export class Upda2 implements UpdateA2 {
    insegn_id: number;
    a2_mod_pagamento_id: number;

    constructor() {
        this.insegn_id = 0;
        this.a2_mod_pagamento_id = 0;
    }
}

export class Updb1 implements UpdateB1 {
    insegn_id: number;
    b1_confl_interessi_id: number;

    constructor() {
        this.insegn_id = 0;
        this.b1_confl_interessi_id = 0;
    }
}

export class Updb2 implements UpdateB2 {
    insegn_id: number;
    b2_incompatibilita_id: number;

    constructor() {
        this.insegn_id = 0;
        this.b2_incompatibilita_id = 0;
    }
}

export class Updb3 implements UpdateB3 {
    insegn_id: number;
    b3_rapp_studio_univ_id: number;

    constructor() {
        this.insegn_id = 0;
        this.b3_rapp_studio_univ_id = 0;
    }
}

export class Updb4 implements UpdateB4 {
    insegn_id: number;
    b4_rapp_pubbl_amm_id: number;

    constructor() {
        this.insegn_id = 0;
        this.b4_rapp_pubbl_amm_id = 0;
    }
}

export class Updb5 implements UpdateB5 {
    insegn_id: number;
    b5_stato_pensionam_id: number;

    constructor() {
        this.insegn_id = 0;
        this.b5_stato_pensionam_id = 0;
    }
}

export class Updb6 implements UpdateB6 {
    insegn_id: number;
    b6_trattamento_dati_id: number;

    constructor() {
        this.insegn_id = 0;
        this.b6_trattamento_dati_id = 0;
    }
}

export class UpdC implements UpdateC {
    insegn_id: number;
    c_prestaz_profess_id: number;

    constructor() {
        this.insegn_id = 0;
        this.c_prestaz_profess_id = 0;
    }
}

export class UpdD1 implements UpdateD1 {
    insegn_id: number;
    d1_inps_id: number;

    constructor() {
        this.insegn_id = 0;
        this.d1_inps_id = 0;
    }
}

export class UpdD2 implements UpdateD2 {
    insegn_id: number;
    d2_inail_id: number;

    constructor() {
        this.insegn_id = 0;
        this.d2_inail_id = 0;
    }
}

export class UpdD3 implements UpdateD3 {
    insegn_id: number;
    d3_tributari_id: number;

    constructor() {
        this.insegn_id = 0;
        this.d3_tributari_id = 0;
    }
}

export class UpdD4 implements UpdateD4 {
    insegn_id: number;
    d4_fiscali_id: number;

    constructor() {
        this.insegn_id = 0;
        this.d4_fiscali_id = 0;
    }
}

export class UpdD5 implements UpdateD5 {
    insegn_id: number;
    d5_fiscali_resid_estero_id: number;

    constructor() {
        this.insegn_id = 0;
        this.d5_fiscali_resid_estero_id = 0;
    }
}

export class UpdD6 implements UpdateD6 {
    insegn_id: number;
    d6_detraz_fam_carico_id: number;

    constructor() {
        this.insegn_id = 0;
        this.d6_detraz_fam_carico_id = 0;
    }
}

export class UpdE implements UpdateE {
    insegn_id: number;
    e_autonomo_occasionale_id: number;

    constructor() {
        this.insegn_id = 0;
        this.e_autonomo_occasionale_id = 0;
    }
}
