import { Injectable } from '@angular/core';
import {
  Auth,
  GithubAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  User
} from '@angular/fire/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { createUserWithEmailAndPassword } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private auth: Auth) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();

    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  signUp(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  signInWithEmail(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  signInWithGitHub() {
    const provider = new GithubAuthProvider();
    return from(signInWithPopup(this.auth, provider));
  }

  signOut() {
    return from(this.auth.signOut());
  }

  getUser(): Observable<User | null> {
    return this.currentUser;
  }
}


