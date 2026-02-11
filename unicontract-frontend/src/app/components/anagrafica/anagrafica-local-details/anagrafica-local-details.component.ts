import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnagraficaLocal } from './../../../classes/anagrafica-local';
import { AnagraficaLocalService } from './../../../services/anagrafica-local.service';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { encode, decode } from 'base64-arraybuffer';
import { FormGroup } from '@angular/forms';
import { tipotitoli } from '../anagrafica-details/anagrafica-details.component';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-anagrafica-local-details',
    templateUrl: './anagrafica-local-details.component.html',
    styleUrls: ['./anagrafica-local-details.component.css'],
    standalone: false
})
export class AnagraficaLocalDetailsComponent extends BaseComponent {

  title1 = '';
  title2 = '';

  item: AnagraficaLocal;
  model: any = {};

  constructor(private route: ActivatedRoute,
              private router: Router,
              private anagraficaLocalService: AnagraficaLocalService,
              public messageService: MessageService,
              private tools: InsegnamTools,
              private goto: RouteMetods) {
                super(messageService);
              }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.anagraficaLocalService.getAnagraficaLocal(params.get('id')).subscribe(
          response => this.item = response['datiAnagrafica'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  updateA1(idA1: number) {
    this.router.navigate(['home/anagrafica', idA1, {upd: 'on'}]);
  }

  onSelectCurrentFile(currentSelFile, field: FormlyFieldConfig) {
    const currentAttachment = field.formControl.parent.value;
    if (currentSelFile == null) {
      // caso di cancellazione
      currentAttachment.filevalue = null;
      return;
    }

    this.isLoading = true;
    currentAttachment.model_type = 'user';

    const reader = new FileReader();

    reader.onload = async (e: any) => {
      this.isLoading = true;
      field.formControl.parent.get('filevalue').setValue(encode(e.target.result));
      if (currentSelFile.name.search('pdf') > 0) {
        try {
          field.formControl.markAsDirty();
        } catch (error) {
          console.log(error);
          this.isLoading = false;
        }
      }

      if (!currentAttachment.filevalue) {
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
    };
    reader.readAsArrayBuffer(currentSelFile);
  }

  download(code) {
    // implementare api
    const attach = this.item['attachments'].find(x => x.attachmenttype_codice === code);
    if (attach) {
      this.isLoading = true;
      this.anagraficaLocalService.download(attach.id).subscribe(file => {
        this.isLoading = false;
        if (file.filevalue) {
          const blob = new Blob([decode(file.filevalue)]);
          saveAs(blob, file.filename);
        }
      },
        e => {
          this.isLoading = false;
          console.log(e);
        }
      );
    } else {
      this.messageService.error('Allegato non presente');
    }
  }

  isLoadingChange(event) {
    this.isLoading = event;
  }

  checkTitoloStudio(titolo_studio){
    return tipotitoli.includes(titolo_studio)
  }
}
