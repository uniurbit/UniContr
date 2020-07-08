
export class InsegnamTools {

  static termina(data: any) {
    if (data.natura_rapporto === 'PRPR') {
      if (data.p2_natura_rapporto_id !== 0 &&
          data.a1_anagrafica_id !== 0 &&
          data.a2_mod_pagamento_id !== 0 &&
          data.b1_confl_interessi_id !== 0 &&
          data.b2_incompatibilita_id !== 0 &&
          ((data.flag_rapp_studio_univ === 1 && data.b3_rapp_studio_univ_id !== 0) || data.flag_rapp_studio_univ === 0 ) &&
          ((data.flag_dipend_pubbl_amm === 1 && data.b4_rapp_pubbl_amm_id !== 0) || data.flag_dipend_pubbl_amm === 0 ) &&
          ((data.flag_titolare_pensione === 1 && data.b5_stato_pensionam_id !== 0) || data.flag_titolare_pensione === 0 ) &&
          data.b6_trattamento_dati_id !== 0 &&
          data.c_prestaz_profess_id !== 0) {
        return true;
      }
      return false;
    } else if (data.natura_rapporto === 'COCOCO') {
      if (data.p2_natura_rapporto_id !== 0 &&
        data.a1_anagrafica_id !== 0 &&
        data.a2_mod_pagamento_id !== 0 &&
        data.b1_confl_interessi_id !== 0 &&
        data.b2_incompatibilita_id !== 0 &&
        ((data.flag_rapp_studio_univ === 1 && data.b3_rapp_studio_univ_id !== 0) || data.flag_rapp_studio_univ === 0 ) &&
        ((data.flag_dipend_pubbl_amm === 1 && data.b4_rapp_pubbl_amm_id !== 0) || data.flag_dipend_pubbl_amm === 0 ) &&
        ((data.flag_titolare_pensione === 1 && data.b5_stato_pensionam_id !== 0) || data.flag_titolare_pensione === 0 ) &&
        data.b6_trattamento_dati_id !== 0 &&
        data.d1_inps_id !== 0 &&
        data.d2_inail_id !== 0 &&
        data.d3_tributari_id !== 0 &&
        data.d4_fiscali_id !== 0 &&
        ((data.provincia_residenza === 'EE' && data.d5_fiscali_resid_estero_id !== 0) || data.provincia_residenza !== 'EE') &&
        data.d6_detraz_fam_carico_id !== 0) {
        return true;
      }
      return false;
    } else if (data.natura_rapporto === 'PLAO') {
      if (data.p2_natura_rapporto_id !== 0 &&
        data.a1_anagrafica_id !== 0 &&
        data.a2_mod_pagamento_id !== 0 &&
        data.b1_confl_interessi_id !== 0 &&
        data.b2_incompatibilita_id !== 0 &&
        ((data.flag_rapp_studio_univ === 1 && data.b3_rapp_studio_univ_id !== 0) || data.flag_rapp_studio_univ === 0 ) &&
        ((data.flag_dipend_pubbl_amm === 1 && data.b4_rapp_pubbl_amm_id !== 0) || data.flag_dipend_pubbl_amm === 0 ) &&
        ((data.flag_titolare_pensione === 1 && data.b5_stato_pensionam_id !== 0) || data.flag_titolare_pensione === 0 ) &&
        data.b6_trattamento_dati_id !== 0 &&
        data.e_autonomo_occasionale_id !== 0) {
        return true;
      }
      return false;
    } else if (data.natura_rapporto === 'PTG' || data.natura_rapporto === 'ALD') {
      if (data.p2_natura_rapporto_id !== 0 &&
        data.a1_anagrafica_id !== 0 &&
        data.a2_mod_pagamento_id !== 0 &&
        data.b1_confl_interessi_id !== 0 &&
        data.b2_incompatibilita_id !== 0 &&
        ((data.flag_rapp_studio_univ === 1 && data.b3_rapp_studio_univ_id !== 0) || data.flag_rapp_studio_univ === 0 ) &&
        ((data.flag_dipend_pubbl_amm === 1 && data.b4_rapp_pubbl_amm_id !== 0) || data.flag_dipend_pubbl_amm === 0 ) &&
        ((data.flag_titolare_pensione === 1 && data.b5_stato_pensionam_id !== 0) || data.flag_titolare_pensione === 0 ) &&
        data.b6_trattamento_dati_id !== 0) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  termina(data: any) {
    return InsegnamTools.termina(data);
  }

  tipoContratto(value) {
      if (value === 'ALTQG' || value === 'ALTQC' || value === 'ALTQU') {
          return 'CONTRATTO DI ALTA QUALIFICAZIONE';
      } else if (value === 'CONTC' || value === 'CONTU') {
          return 'CONTRATTO DI DIDATTICA UFFICIALE';
      } else if (value === 'INTC'
                || value === 'INTU'
                || value === 'INTXU'
                || value === 'INTXC') {
          return 'CONTRATTO DI DIDATTICA INTEGRATIVA';
      } else if (value === 'SUPPU' || value === 'SUPPC') {
          return 'CONTRATTO DI SUPPORTO ALLA DIDATTICA';
      } else {
          return 'TIPOLOGIA DI CONTRATTO NON DEFINITA';
      }
  }

  tipoConferimento(value) {
      if (value === 'BAN_INC' || value === 'APPR_INC') {
          return 'NUOVO CONTRATTO';
      } else if (value === 'CONF_INC') {
          return 'RINNOVO CONTRATTO';
      }
  }

  formatoPeriodo(value) {
      value = value.replace('GEN', 'JAN');
      value = value.replace('MAG', 'MAY');
      value = value.replace('GIU', 'JUN');
      value = value.replace('LUG', 'JUL');
      value = value.replace('AGO', 'AUG');
      value = value.replace('SET', 'SEP');
      value = value.replace('OTT', 'OCT');
      value = value.replace('DIC', 'DEC');
      return value;
  }

  annoAccademico(anno) {
    return +anno + 1;
  }

  naturaRapporto(value: string) {
    if (value === 'PRPR') {
        return 'PRESTAZIONE PROFESSIONALE';
    } else if (value === 'COCOCO') {
        return 'COLLABORAZIONE DI NATURA AUTONOMA';
    } else if (value === 'PLAO') {
        return 'PRESTAZIONE DI LAVORO AUTONOMO OCCASIONALE';
    } else if (value === 'PTG') {
        return 'PRESTAZIONE A TITOLO GRATUITO';
    } else if (value === 'ALD') {
        return 'ASSIMILATO A LAVORO DIPENDENTE';
    } else {
        return 'NON DEFINITO';
    }
  }

  descrizioneRapporto(value: string) {
    if (value === 'PRPR') {
      return 'Per possessori di Partita IVA utilizzabile ai fini del contratto';
    } else if (value === 'PLAO') {
        return 'Artt. 2222 e ss. del Codice Civile';
    } else if (value === 'PTG') {
        return 'Solo contratti di Alta Qualificazione o contratti per i quali è intervenuta espressa rinuncia al compenso';
    } else if (value === 'ALD') {
        return 'Per dipendenti dell\'Ateneo PTA e CEL';
    }
  }

  controlloCNA(tipo, ore) {
    if (tipo === 'CONTC' || tipo === 'CONTU') {
        return true;
    } else if ((tipo === 'INTC' || tipo === 'INTU' || tipo === 'INTXU'  || tipo === 'INTXC') && ore > 15) {
        return true;
    } else if ((tipo === 'ALTQG' || tipo === 'ALTQC' || tipo === 'ALTQU') && ore > 15) {
        return true;
    } else {
        return false;
    }
  }

  controlloPLAO(tipo, ore) {
    if (tipo === 'SUPPU' || tipo === 'SUPPC') {
        return true;
    } else if ((tipo === 'INTC' || tipo === 'INTU' || tipo === 'INTXU'  || tipo === 'INTXC') && ore <= 15) {
        return true;
    } else if ((tipo === 'ALTQG' || tipo === 'ALTQC' || tipo === 'ALTQU') && ore <= 15) {
        return true;
    } else {
        return false;
    }
  }

  statoCivile(value: string, sesso: string) {
    if (value === 'C' && sesso === 'M') {
      return 'Coniugato';
    } else if (value === 'C' && sesso === 'F') {
      return 'Coniugata';
    } else if (value === 'D' && sesso === 'M') {
      return 'Divorziato';
    } else if (value === 'D' && sesso === 'F') {
      return 'Divorziata';
    } else if (value === 'L' && sesso === 'M') {
      return 'Libero da impedimenti coniugali';
    } else if (value === 'L' && sesso === 'F') {
      return 'Libera da impedimenti coniugali';
    } else if (value === 'N' && sesso === 'M') {
      return 'Celibe';
    } else if (value === 'N' && sesso === 'F') {
      return 'Nubile';
    } else if (value === 'R' && sesso === 'M') {
      return 'Celibe con figli riconosciuti';
    } else if (value === 'R' && sesso === 'F') {
      return 'Nubile con figli riconosciuti';
    } else if (value === 'S' && sesso === 'M') {
      return 'Separato';
    } else if (value === 'S' && sesso === 'F') {
      return 'Separata';
    } else if (value === 'T') {
      return 'Con figli non riconosciuti';
    } else if (value === 'U') {
      return 'Con figli a carico condiviso';
    } else if (value === 'V' && sesso === 'M') {
      return 'Vedovo';
    } else if (value === 'V' && sesso === 'F') {
      return 'Vedova';
    } else if (value === 'W' && sesso === 'M') {
      return 'Celibe con figli riconosciuti a carico';
    } else if (value === 'W' && sesso === 'F') {
      return 'Nubile con figli riconosciuti a carico';
    } else if (value === 'X' && sesso === 'M') {
      return 'Separato con figli a carico';
    } else if (value === 'X' && sesso === 'F') {
      return 'Separata con figli a carico';
    } else if (value === 'Y' && sesso === 'M') {
      return 'Divorziato con figli a carico';
    } else if (value === 'Y' && sesso === 'F') {
      return 'Divorziata con figli a carico';
    } else if (value === 'Z' && sesso === 'M') {
      return 'Coniugato: detrazioni doppie';
    } else if (value === 'Z' && sesso === 'F') {
      return 'Coniugata: detrazioni doppie';
    } else if (value === 'O' || value === '0' || value === null) {
      return 'Non assegnato';
    } else if (value === 'M' && sesso === 'M') {
      return 'Deceduto';
    } else if (value === 'M' && sesso === 'F') {
      return 'Deceduta';
    } else if (value === 'E' && sesso === 'M') {
      return 'Tutelato';
    } else if (value === 'E' && sesso === 'F') {
      return 'Tutelata';
    } else if (value === 'Q' && sesso === 'M' ) {
      return 'Unito civilmente';
    } else if (value === 'Q' && sesso === 'F') {
      return 'Unita civilmente';
    }
  }
 

}
