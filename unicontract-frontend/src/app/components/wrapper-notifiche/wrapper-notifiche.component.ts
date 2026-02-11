import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NotificaService } from 'src/app/shared/notifica.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
    selector: 'app-wrapper-notifiche',
    templateUrl: './wrapper-notifiche.component.html',
    styleUrls: ['./wrapper-notifiche.component.css'],
    standalone: false
})
export class WrapperNotificheComponent implements OnInit {

  private prefix='notifiche';
  private id = null;

  constructor(private route: ActivatedRoute, private router: Router, private sessionStorageService: SessionStorageService, private notificaService: NotificaService) { }

  ngOnInit() {    
  }

  public onRouterOutletActivate(event : any) {           
    const id = this.route.firstChild.snapshot.params['id'];
    if(id){      
      const value = this.sessionStorageService.getItem(this.getKey(id));
      if (value){
        this.notificaService.newNotifiche(value,'contratto');   
      }
    }     
  }
  
  @HostListener("window:beforeunload", ["$event"]) 
  unloadHandler(event: Event) {
    const id = this.route.firstChild.snapshot.params['id'];
    if(id){
      if (this.notificaService.currentNotifiche)
        this.sessionStorageService.setItem(this.getKey(id),this.notificaService.currentNotifiche)
    }
  }

  getKey(id){
    return this.prefix+'_'+id;
  }

}
