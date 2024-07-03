import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Unsubscriber } from '../../unsubscriber';

@Injectable({
  providedIn: 'root'
})
export class SearchStateService extends Unsubscriber {

  private searchQuerySubject = new BehaviorSubject<string>('');
  private sortSubject = new BehaviorSubject<string>('');
  private orderSubject = new BehaviorSubject<string>('desc');
  private currentPageSubject = new BehaviorSubject<number>(1);
  private totalResultsCountSubject = new BehaviorSubject<number>(0);
  private totalPagesCountSubject = new BehaviorSubject<number>(1);

  public searchQuery$ = this.searchQuerySubject.asObservable();
  public sort$ = this.sortSubject.asObservable();
  public order$ = this.orderSubject.asObservable();
  public currentPage$ = this.currentPageSubject.asObservable();
  public totalResultsCount$ = this.totalResultsCountSubject.asObservable();

  constructor() {
    super();

    this.totalResultsCount$.subscribe(totalResultsCount => {
      this.setTotalPagesCount(totalResultsCount);
    });
  }

  setSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }

  setSort(sort: string) {
    this.sortSubject.next(sort);
  }

  setOrder(order: string) {
    this.orderSubject.next(order);
  }

  getCurrentPage(): number {
    return this.currentPageSubject.value;
  }

  setCurrentPage(currentPage: number) {
    this.currentPageSubject.next(currentPage);
  }

  getTotalResultsCount(): number {
    return this.totalResultsCountSubject.value;
  }

  setTotalResultsCount(totalResultsCount: number) {
    this.totalResultsCountSubject.next(totalResultsCount);
  }

  getTotalPagesCount(): number {
    return this.totalPagesCountSubject.value;
  }

  setTotalPagesCount(totalResultsCount: number) {
    this.totalPagesCountSubject.next(
      totalResultsCount / 20 > Math.floor(totalResultsCount / 20)
        ? Math.floor(totalResultsCount / 20) + 1
        : totalResultsCount / 20
    );
  }
}
