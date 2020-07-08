import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './../../../shared/base-component/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { StoryProcess } from './../../../classes/storyProcess';
import { StoryProcessService } from './../../../services/storyProcess.service';

import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { encode, decode } from 'base64-arraybuffer';


@Component({
  selector: 'app-story-process',
  templateUrl: './story-process.component.html',
  styleUrls: ['./story-process.component.css']
})
export class StoryProcessComponent extends BaseComponent {

  items: any = null;
  precontr: any = null;
  idins: number;

  page = 1;
  pageSize = 15;
  totalItems: number;

  constructor(private route: ActivatedRoute,
    private router: Router,
    public messageService: MessageService,
    private storyService: StoryProcessService,
    private precontrattualeService: PrecontrattualeService,
    protected translateService: TranslateService,
    private tools: InsegnamTools) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.storyService.getStory(+params.get('id')).subscribe(
          response => {
            this.precontr = response['datiPrecontrattuale'];            
            this.items = this.precontr.story;
            this.idins = +params.get('id');
            this.totalItems = this.items.length;
          },
          (error) => this.handleError(error),
          () => this.complete()
        );
     
      }
    );
  }

  summary() {
    this.router.navigate(['home/summary', this.idins]);
  }

}
