import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth';
import { ToastrService } from 'ngx-toastr';
import { errorContext } from 'rxjs/internal/util/errorContext';

@Component({
  selector: 'app-login',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toastr: ToastrService) { }
  loginForm!: FormGroup;
  message: string = '';


  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;
    this.authService.login({ username, password }).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message, 'Success');
        localStorage.setItem('user', JSON.stringify(res.data));
        this.loginForm.reset();
        this.router.navigate(['/']);

      },
      error: (err) => {
        console.log(err)
        this.toastr.error(err.error.message || 'Login fallido', 'Error');
      }
    })

  }
}
