import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }
  registerForm!: FormGroup;
  message: string = '';


  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { username, password, name } = this.registerForm.value;  
    this.authService.register({ username, password, name }).subscribe({
      next: (res: any) => {
        this.message = res.message;
        console.log("Registration successful: ", res);
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
