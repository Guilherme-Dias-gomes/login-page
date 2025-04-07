import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { DefaultLoginLayoutComponent } from "../../components/default-login-layout/default-login-layout.component";
import { PrimaryInputComponent } from "../../components/primary-input/primary-input.component";

interface ResetForm {
  password: FormControl;
  passwordConfirm: FormControl;
}

@Component({
  standalone: true,
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  imports: [
    DefaultLoginLayoutComponent,
    PrimaryInputComponent,
    ReactiveFormsModule
  ],
})
export class ResetPasswordComponent {
  resetForm: FormGroup<ResetForm>;

  constructor(
    private fb: FormBuilder,
    private authService: LoginService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.resetForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  resetPassword() {
    if (this.resetForm.valid) {
      const email = sessionStorage.getItem("reset-email");
      const resetCode = sessionStorage.getItem("reset-code");
      const newPassword = this.resetForm.value.password!;
      const confirmPassword = this.resetForm.value.passwordConfirm!;
  
      if (!email || !resetCode) {
        this.toastr.error("Informações de recuperação não encontradas.");
        return;
      }
      console.log("payload sendo enviado:", {
        email,
        password: newPassword,
        passwordConfirm: confirmPassword,
        code: resetCode
      });
  
      this.authService.resetPassword(email, newPassword, confirmPassword, resetCode).subscribe({
        next: () => {
          this.toastr.success("Senha redefinida com sucesso!");
          const email = sessionStorage.getItem("reset-email");
          const resetCode = sessionStorage.getItem("reset-code");
          this.router.navigate(['/login']);
        },
        error: (err) => {
          if (err.status === 400) {
            this.toastr.error("As senhas não coincidem!");
          } else if (err.status === 401) {
            this.toastr.error(err.error); // <- mostra a mensagem vinda do back!
          } else {
            this.toastr.error("Erro inesperado! Tente novamente mais tarde.");
          }
        }        
      });
    }
  }
  

  navigate() {
    this.router.navigate(["verify-code"]);
  }
}
