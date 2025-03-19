import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [],
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
        this.toastr.success("Código enviado para seu e-mail!");
        this.router.navigate(['/verify-code']);
      },
      error: () => this.toastr.error("Erro ao enviar código. Verifique seu e-mail e tente novamente.")
    });
    }
  }
}
