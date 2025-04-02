import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login.service';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DefaultLoginLayoutComponent,
    ReactiveFormsModule
  ],
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss']
})
export class VerifyCodeComponent {
  verifyCodeForm: FormGroup;
  codeDigits = Array(6).fill(0); // Para iterar no HTML e criar os 6 inputs

  constructor(
    private fb: FormBuilder,
    private authService: LoginService,
    private toastr: ToastrService,
    private router: Router
  ) {
    const controls: { [key: string]: FormControl } = {};
    for (let i = 0; i < 6; i++) {
      controls[`digit${i}`] = new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]') // Apenas números
      ]);
    }
    this.verifyCodeForm = this.fb.group(controls);
  }

  
  // Lida com a entrada de um número e foca no próximo campo
  handleInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && index < 5) {
      const nextInput = document.querySelectorAll('.code-input')[index + 1] as HTMLInputElement;
      nextInput.focus();
    }
  }

  // Permite voltar com o backspace
  handleKeydown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && index > 0 && input.value === '') {
      const prevInput = document.querySelectorAll('.code-input')[index - 1] as HTMLInputElement;
      prevInput.focus();
    }
  }

  // Verifica o código ao clicar no botão
  verifyCode() {
    if (this.verifyCodeForm.valid) {
      
      const email = sessionStorage.getItem("reset-email"); // Pegando o e-mail salvo
      const code = Object.values(this.verifyCodeForm.value).join(""); // Junta os 6 dígitos
  
      if (!email) {
        this.toastr.error("Erro: Email não encontrado. Tente novamente.");
        return;
      }
  
      this.authService.verifyResetCode(email, code).subscribe({
        next: () => {
          this.toastr.success("Código verificado! Redefina sua senha.");
          this.router.navigate(['/reset-password']);
        },
        error: (err) => {
          if (err.status === 403) {
              this.toastr.error("Código inválido! Tente novamente.");
          } else {
              this.toastr.error("Erro inesperado! Tente novamente mais tarde.");
          }
      }
      });
    }
  }
  navigate(){
    this.router.navigate(["forgot-password"])
  }
}
