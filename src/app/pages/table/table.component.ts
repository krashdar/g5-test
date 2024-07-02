import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TABLE_COLUMNS, TableColumn } from './table.config';
import { Unsubscriber } from '../../core/unsubscriber';
import { GithubService } from '../../core/services/github-service/github.service';
import { Router } from '@angular/router';
import { of, switchMap, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent extends Unsubscriber implements OnInit {
  @ViewChild('resultsContainer') resultsContainer!: ElementRef;

  searchForm: FormGroup;
  users: any[] = [];
  errorMessage: string | null = null;
  totalResultCount: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  columns: TableColumn[] = TABLE_COLUMNS;

  constructor(private fb: FormBuilder,
              private githubService: GithubService,
              private router: Router) {
    super();

    this.searchForm = this.fb.group({
      query: [''],
      sort: [''],
      order: ['desc']
    });

    this.searchForm.controls['sort'].valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(() => this.currentPage = 1),
        switchMap(() => this.search(this.currentPage)
          .pipe(takeUntil(this.unsubscribe$)))
      )
      .subscribe();

    this.searchForm.controls['order'].valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(() => this.currentPage = 1),
        switchMap(() => this.search(this.currentPage)
          .pipe(takeUntil(this.unsubscribe$)))
      )
      .subscribe();

    this.githubService.clearSearchResultSubject();
  }

  ngOnInit(): void {
    this.githubService.searchResult$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response?.items) {
          this.totalResultCount = response.total_count;
          this.totalPages = this.totalResultCount / 20 > Math.floor(this.totalResultCount / 20)
            ? Math.floor(this.totalResultCount / 20) + 1
            : this.totalResultCount / 20;
          this.users = response.items;
        }
      });
  }

  onSearch() {
    this.search(1)
      .subscribe();
  }

  search(currentPage: number) {
    const req = this.searchForm.getRawValue();
    if (req.query) {
      return this.githubService.searchUsers(
        req.query,
        currentPage,
        undefined,
        req.sort || undefined,
        req.order || undefined
      )
        .pipe(take(1));
    } else return of();
  }

  onSelectUser(login: string) {
    this.router.navigate(['/detail', login]);
  }

  onViewProfile(event: Event) {
    event.stopPropagation();
  }

  onPageChange(direction: 'prev' | 'next') {
    const newCurrentPage = direction === 'prev' && this.currentPage > 1
      ? this.currentPage - 1
      : direction === 'next' && this.currentPage < this.totalPages
        ? this.currentPage + 1
        : this.currentPage;
    this.search(newCurrentPage)
      .pipe(takeUntil(this.unsubscribe$))
      // safe change currentPage when error occurred
      .subscribe(() => this.currentPage = newCurrentPage);

    if (this.resultsContainer && this.resultsContainer.nativeElement) {
      this.resultsContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
    }
  }
}
