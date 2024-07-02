import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user$: Observable<User | null>;

  constructor(private authService: AuthService,
              private router: Router) {
    this.user$ = this.authService.getUser();
  }

  ngOnInit(): void {
  }

  logout() {
    this.authService.signOut().subscribe(() => {
      this.router.navigate(['/auth']);
    });
  }
}
