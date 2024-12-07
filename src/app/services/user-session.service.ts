import { Injectable } from '@angular/core';
import { UserDTO } from '../models/user-dto.model';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private storage: Storage;

  constructor() {
    const isRemembered = localStorage.getItem('isRemembered') === 'true';
    this.storage = isRemembered ? localStorage : sessionStorage;
  }

  setRememberMe(remember: boolean): void {
    localStorage.setItem('isRemembered', remember.toString());
    this.storage = remember ? localStorage : sessionStorage;
  }

  setToken(token: string): void {
    this.storage.setItem('token', token);
  }

  getToken(): string | null {
    return this.storage.getItem('token');
  }

  setRefreshToken(refreshToken: string): void {
    this.storage.setItem('refreshToken', refreshToken);
  }

  getRefreshToken(): string | null {
    return this.storage.getItem('refreshToken');
  }

  setUserData(userData: UserDTO): void {
    this.storage.setItem('userData', JSON.stringify(userData));
  }

  getUserData(): UserDTO | null {
    const data = this.storage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }

  clearSession(): void {
    this.storage.removeItem('token');
    this.storage.removeItem('refreshToken');
    this.storage.removeItem('userData');
    localStorage.removeItem('isRemembered'); 
  }
}
