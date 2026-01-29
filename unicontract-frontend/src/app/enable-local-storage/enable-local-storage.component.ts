import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../core';

@Component({
    selector: 'app-enable-local-storage',
    templateUrl: './enable-local-storage.component.html',
    styleUrls: ['./enable-local-storage.component.css'],
    standalone: false
})
export class EnableLocalStorageComponent implements OnInit {

  localStorageAvailable: boolean = false;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    //crea il loop perchè c'è una ulteriore indirezione
    this.localStorageAvailable = this.checkLocalStorage();
  }

  checkLocalStorage(): boolean {
    return this.auth.isLocalStorageAvailable();
  }

  retry() {    
    window.location.href = environment.baseHref; // Force a full page reload
  }
}
