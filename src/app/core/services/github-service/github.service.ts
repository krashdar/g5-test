import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private readonly BASE_URL = 'https://api.github.com';

  public searchResult$: Observable<any>;
  private searchResultSubject: BehaviorSubject<any>;

  public clearSearchResultSubject(): void {
    this.searchResultSubject.next({});
  }

  constructor(private http: HttpClient,
              private toastr: ToastrService) {
    this.searchResultSubject = new BehaviorSubject<any>({});
    this.searchResult$ = this.searchResultSubject.asObservable();
  }

  searchUsers(query: string, page: number, perPage: number = 20): Observable<any> {
    return this.searchUsersReq(query, page, perPage)
      .pipe(tap(x => this.searchResultSubject.next(x)));
  }
  searchUsersReq(query: string, page: number, perPage: number = 20): Observable<any> {
    return this.http.get(`${ this.BASE_URL }/search/users?q=${ query }&page=${page}&per_page=${ perPage }`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getUser(username: string): Observable<any> {
    return this.http.get(`${ this.BASE_URL }/users/${ username }`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client-side error occurred: ${ error.error.message }`;
    } else {
      errorMessage = `Server returned code: ${ error.status }, error message is: ${ error.message }`;
    }
    this.toastr.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
