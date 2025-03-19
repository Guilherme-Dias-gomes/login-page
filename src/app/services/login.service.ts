import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl: string = "http://localhost:8080/auth";

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string){
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/login", { email, password }).pipe(
      tap((value) => {
        sessionStorage.setItem("auth-token", value.token);
        sessionStorage.setItem("username", value.name);
      })
    );
  }

  signup(name: string, email: string, password: string){
    return this.httpClient.post<LoginResponse>(this.apiUrl + "/register", { name, email, password }).pipe(
      tap((value) => {
        sessionStorage.setItem("auth-token", value.token);
        sessionStorage.setItem("username", value.name);
      })
    );
  }

  // 🔹 Enviar código para e-mail
  sendPasswordResetCode(email: string){
    return this.httpClient.post(this.apiUrl + "/forgot-password", { email });
  }

  // 🔹 Verificar código recebido por e-mail
  verifyResetCode(email: string, code: string){
    return this.httpClient.post(this.apiUrl + "/verify-reset-code", { email, code });
  }

  // 🔹 Redefinir senha
  resetPassword(email: string, newPassword: string) {
    return this.httpClient.post(`${this.apiUrl}/reset-password`, { email, newPassword });
  }  
}
