import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbSource = new BehaviorSubject<any>([]); // Default breadcrumb
  breadcrumb$ = this.breadcrumbSource.asObservable(); // Observable to listen for changes

  // Method to update breadcrumb data
  updateBreadcrumb(breadcrumb: any) {
    this.breadcrumbSource.next(breadcrumb);
  }

   // Method to append id dynamically
   updateWithId(id: string) {
    const breadcrumb = this.breadcrumbSource.getValue();
    if (breadcrumb.title && id) {      
        breadcrumb.title = `${breadcrumb.title} (#${id})`; // Append ID to the last breadcrumb
        this.updateBreadcrumb(breadcrumb);      
    }
  }
}