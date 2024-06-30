import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GithubService } from '../../core/services/github-service/github.service';
import { Router, RouterLink } from '@angular/router';
import { of, take, takeUntil } from 'rxjs';
import { Unsubscriber } from '../../core/unsubscriber';

@Component({
  selector: 'app-blocks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css']
})
export class BlocksComponent extends Unsubscriber implements OnInit {
  searchForm: FormGroup;
  users: any[] = [];
  totalResultCount: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private fb: FormBuilder,
              private githubService: GithubService,
              private router: Router) {
    super();

    this.searchForm = this.fb.group({
      query: ['']
    });

    this.githubService.clearSearchResultSubject();
  }

  ngOnInit(): void {
    this.githubService.searchResult$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response?.items) {
          this.totalResultCount = response.total_count;
          this.totalPages = this.totalResultCount % 20;
          this.users = response.items;
        }
      })
  }

  onSearch(){
    this.search(this.currentPage)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe()
  }
  search(currentPage: number) {
    const query = this.searchForm.get('query')?.value;
    if (query) {
      return this.githubService.searchUsers(query, currentPage)
        .pipe(take(1))
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
  }
}
