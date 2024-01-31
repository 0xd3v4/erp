import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import Storage from '../tools/Storage';
import {Observable} from "rxjs";
import {ApiService} from "./api-service.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private token = null;

  constructor(private apiService: ApiService) {
    const potentialToken = Storage.getItem('x-auth-token'); // localStorage.getItem('x-auth-token');

    if (potentialToken) {
      this.setToken(potentialToken);
    }
  }

  setToken(token: string): void {
    // @ts-ignore
    this.token = token;
    Storage.setItem('x-auth-token', token); // localStorage.setItem('x-auth-token', token);
  }

  getToken(): string {
    // @ts-ignore
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
  public getUserRole(): Observable<any> {
    return this.apiService.get<any>(`api/admin/userRole/`)
  }
}
