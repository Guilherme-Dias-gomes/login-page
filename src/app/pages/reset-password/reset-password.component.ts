import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder, // ✅ Injetando FormBuilder
    private authService: LoginService, // ✅ Injetando AuthService
    private toastr: ToastrService, // ✅ Injetando ToastrService
    private router: Router // ✅ Injetando Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  resetPassword() {
    if (this.resetForm.valid) {
      const email = sessionStorage.getItem("reset-email"); // Pegando o email armazenado na etapa anterior
      const newPassword = this.resetForm.value.newPassword!;
      
      if (!email) {
        this.toastr.error("Erro: Email não encontrado. Tente novamente.");
        return;
      }
  
      this.authService.resetPassword(email, newPassword).subscribe({
        next: () => {
          this.toastr.success("Senha redefinida com sucesso!");
          this.router.navigate(['/login']);
        },
        error: () => this.toastr.error("Erro ao redefinir senha! Verifique o código e tente novamente.")
      });
    }
  }
}
