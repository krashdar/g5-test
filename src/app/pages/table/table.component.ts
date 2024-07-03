import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TABLE_COLUMNS, TableColumn } from './table.config';
import { Unsubscriber } from '../../core/unsubscriber';
import { GithubService } from '../../core/services/github-service/github.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { SearchStateService } from '../../core/services/search-state-service/search-state.service';
import { SearchBarComponent } from '../../core/search-bar/search-bar.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SearchBarComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent extends Unsubscriber implements OnInit {
  @ViewChild('resultsContainer') resultsContainer!: ElementRef;

  users: any[] = [];
  columns: TableColumn[] = TABLE_COLUMNS;

  constructor(private githubService: GithubService,
              public searchStateService: SearchStateService,
              private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.githubService.searchResult$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response?.items) {
          this.users = response.items;
        }
      });

    this.searchStateService.currentPage$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        if (this.resultsContainer && this.resultsContainer.nativeElement) {
          this.resultsContainer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
        }
      });
  }

  onSelectUser(login: string) {
    this.router.navigate(['/detail', login]);
  }

  onViewProfile(event: Event) {
    event.stopPropagation();
  }

  onPageChange(direction: 'prev' | 'next') {
    const currentPage = this.searchStateService.getCurrentPage();
    const newCurrentPage = direction === 'prev' && currentPage > 1
      ? currentPage - 1
      : direction === 'next' && currentPage < this.searchStateService.getTotalPagesCount()
        ? currentPage + 1
        : currentPage;

    this.searchStateService.setCurrentPage(newCurrentPage);
  }
}
