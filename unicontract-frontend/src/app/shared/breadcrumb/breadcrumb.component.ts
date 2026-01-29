import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    standalone: false
})
export class BreadcrumbComponent implements OnInit {
  @Input() layout;
  pageInfo;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private breadcrumbService: BreadcrumbService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .pipe(filter(route => route.outlet === 'primary'))
      .pipe(mergeMap(route => route.data))
      .subscribe(event => {
        this.titleService.setTitle(event['title']);
        this.breadcrumbService.updateBreadcrumb(event);
        //this.pageInfo = event;
      });
  }
  ngOnInit() {
      // Subscribe to breadcrumb updates from the service
      this.breadcrumbService.breadcrumb$.subscribe(breadcrumb => {
        this.pageInfo = breadcrumb; // Update breadcrumbUrls with the new data
      });
  }
}
