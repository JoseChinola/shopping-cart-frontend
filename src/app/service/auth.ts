import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiURL = 'https://localhost:7086/api/User';

  constructor(private http: HttpClient) { }

  login(user: User) {
    return this.http.post(`${this.apiURL}/login`, user);
  }

  register(user: User) {
    return this.http.post(`${this.apiURL}/register`, user)
  }
}
