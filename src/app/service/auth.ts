import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiURL = 'https://localhost:7086/api/User';

  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();


  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    this.loggedIn.next(!!user);
  }

  login(user: User) {
    return this.http.post(`${this.apiURL}/login`, user);
  }

  register(user: User) {
    return this.http.post(`${this.apiURL}/register`, user)
  }

  logout(): void {
    localStorage.removeItem('user');
    this.loggedIn.next(false);
  }
}
