import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  
})
export class VerifyCodeComponent {
  verifyCodeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: LoginService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.verifyCodeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  verifyCode() {
    if (this.verifyCodeForm.valid) {
      const email = sessionStorage.getItem("reset-email"); // Pegando o email salvo
      const code = this.verifyCodeForm.value.code!;

      if (!email) {
        this.toastr.error("Erro: Email não encontrado. Tente novamente.");
        return;
      }

      this.authService.verifyResetCode(email, code).subscribe({
        next: () => {
          this.toastr.success("Código verificado! Redefina sua senha.");
          this.router.navigate(['/reset-password']);
        },
        error: () => this.toastr.error("Código inválido! Tente novamente.")
      });
    }
  }
}
