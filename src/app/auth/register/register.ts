import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toastr: ToastrService) { }
  registerForm!: FormGroup;

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
    console.log(this.registerForm.value);
    this.authService.register({ username, password, name }).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message, 'Success');
        localStorage.setItem('user', JSON.stringify(res.data));
        this.registerForm.reset();
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.log(err)
        this.toastr.error(err.error.message || 'Login fallido', 'Error');
      }
    })

  }
}
