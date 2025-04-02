import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'; // ✅ Certifique-se de importar ReactiveFormsModule
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DefaultLoginLayoutComponent,
    PrimaryInputComponent
  ], // ✅ Corrigido aqui
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(
    private fb: FormBuilder, 
    private authService: LoginService, 
    private toastr: ToastrService,
    private router: Router,
  ) {}

  sendResetCode() {
    if (this.forgotPasswordForm.valid) {
        const email = this.forgotPasswordForm.value.email;
        if (!email) {
            this.toastr.error("Por favor, insira um e-mail válido.");
            return;
        }

        this.authService.sendPasswordResetCode(email).subscribe({
            next: () => {
                sessionStorage.setItem("reset-email", email); // 🔹 Salva o e-mail no sessionStorage
                this.toastr.success("Código enviado para seu e-mail!");
                this.router.navigate(['verify-code']); // 🔹 Agora navega para a tela de verificação
            },
            error: (err) => {
                if (err.status === 404) {
                    this.toastr.error("E-mail não cadastrado! Tente outro.");
                } else {
                    this.toastr.error("Erro inesperado! Tente novamente mais tarde.");
                }
            }
        });
    }
}

  navigate(){
    this.router.navigate(["login"])
  }
}

