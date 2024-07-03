import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GithubService } from '../../core/services/github-service/github.service';
import { Router, RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Unsubscriber } from '../../core/unsubscriber';
import { SearchStateService } from '../../core/services/search-state-service/search-state.service';
import { SearchBarComponent } from '../../core/search-bar/search-bar.component';

@Component({
  selector: 'app-blocks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SearchBarComponent],
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css']
})
export class BlocksComponent extends Unsubscriber implements OnInit {
  @ViewChild('resultsContainer') resultsContainer!: ElementRef;

  users: any[] = [];

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
