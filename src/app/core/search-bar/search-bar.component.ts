import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { skip, takeUntil, tap } from 'rxjs';
import { SearchStateService } from '../services/search-state-service/search-state.service';
import { GithubService } from '../services/github-service/github.service';
import { Unsubscriber } from '../unsubscriber';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent extends Unsubscriber implements OnInit {

  searchForm: FormGroup;

  constructor(private fb: FormBuilder,
              private searchStateService: SearchStateService,
              private githubService: GithubService,
              private toast: ToastrService) {
    super();

    this.searchForm = this.fb.group({
      query: '',
      sort: '',
      order: 'desc'
    });

    this.searchForm.controls['sort'].valueChanges
      .pipe(tap(() => this.onSearch()))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();

    this.searchForm.controls['order'].valueChanges
      .pipe(tap(() => this.onSearch()))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  ngOnInit(): void {
    this.searchStateService.searchQuery$.subscribe(query => {
      this.searchForm.controls['query'].setValue(query, { emitEvent: false });
    });

    this.searchStateService.sort$.subscribe(sort => {
      this.searchForm.controls['sort'].setValue(sort, { emitEvent: false });
    });

    this.searchStateService.order$.subscribe(order => {
      this.searchForm.controls['order'].setValue(order, { emitEvent: false });
    });

    this.searchStateService.currentPage$
      .pipe(skip(1))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.onSearch());
  }

  onSearch() {
    const req = this.searchForm.getRawValue();
    const currentPage = this.searchStateService.getCurrentPage();

    this.searchStateService.setSearchQuery(req.query);
    this.searchStateService.setSort(req.sort);
    this.searchStateService.setOrder(req.order);

    if (req.query) {
      this.search(req.query, currentPage, req.sort, req.order);
    } else {
      this.toast.error('Пожалуйста введите поисковой запрос');
    }
  }

  private search(query: string, currentPage: number, sort: string, order: string) {
    this.githubService.searchUsers(query, currentPage, sort, order)
      .subscribe();
  }
}
