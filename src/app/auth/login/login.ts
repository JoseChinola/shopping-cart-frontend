import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-login',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }
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
        this.message = res.message;
        console.log("Login successful: ", res);
        setTimeout(() => {
          this.message = '';
          this.router.navigate(["/"]);
        }, 2000);

      },
      error: (err) => {
        this.message = err.error.message;
        setTimeout(() => {
          this.message = "";
        }, 2000);
      }
    })

  }
}
