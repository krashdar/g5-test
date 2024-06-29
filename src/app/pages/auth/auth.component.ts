import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  authForm: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private toast: ToastrService) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  createUser() {
    if (this.authForm.valid) {
      const { email, password } = this.authForm.value;
      this.authService.signUp(email, password).subscribe({
        next: () => this.router.navigate(['/blocks']),
        error: (error) => this.toast.error(error)
      });
    }
  }

  loginWithEmail() {
    if (this.authForm.valid) {
      const { email, password } = this.authForm.value;
      this.authService.signInWithEmail(email, password).subscribe({
        next: () => this.router.navigate(['/blocks']),
        error: (error) => this.toast.error(error)
      });
    }
  }

  loginWithGitHub() {
    this.authService.signInWithGitHub().subscribe({
      next: () => this.router.navigate(['/blocks']),
      error: (error) => this.toast.error(error)
    });
  }
}
