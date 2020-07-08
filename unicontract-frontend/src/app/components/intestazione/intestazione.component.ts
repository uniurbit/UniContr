import { Component, OnInit, Input } from '@angular/core';
import { InsegnamTools } from 'src/app/classes/insegnamTools';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-intestazione',
  templateUrl: './intestazione.component.html',
  styleUrls: ['./intestazione.component.css']
})
// ng g c components/intestazione -s true --skipTests false
export class IntestazioneComponent implements OnInit {

  @Input() item:any;
  @Input() dettagli : boolean = false;
  
  tools = new InsegnamTools();

  constructor() { }

  ngOnInit() {    
  }

  get dateInfo(){
    return this.item.createdDate!=null ? this.item.createdDate : this.item.submitDate
  }
  
}
