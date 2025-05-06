import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {

  registerForm!: FormGroup;
  storageData: any = null;
  storageStatus: string = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private storage: Storage,
    private router: Router
  ) {
    this.initializeForm();
    this.initializeStorage();
  }

  ngOnInit() {}

  passwordMatchValidator(formGroup: FormGroup): { mismatchedPasswords: boolean } | null {
    const password = formGroup.get('password')?.value;
    const repeatPassword = formGroup.get('repeatpassword')?.value;
  
    if (password && repeatPassword && password !== repeatPassword) {
      return { mismatchedPasswords: true };
    }
    return null;
  }

  initializeForm(): void {
    this.registerForm = this.formBuilder.group({
      login: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatpassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validators: [this.passwordMatchValidator]
    });
  }

  async initializeStorage() {
    try {
      await this.storage.create();
      console.log('Almacenamiento inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar almacenamiento:', error);
    }
  }

  async register() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      this.storageData = userData;
      this.storageStatus = 'guardando';
      console.log('Datos del formulario:', userData);
      // Guardar datos en almacenamiento local

      try{
        await this.storage.set('userData', userData);
        this.storageStatus = 'exitoso';
        console.log('Datos guardados exitosamente');

        // Verificar que los datos se guardaron
        const storedData = await this.storage.get('userData');
        console.log('Datos almacenados:', storedData);

        // Redireccionar después del login exitoso
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.router.navigate(['/calendario']);
      }catch(error){
        console.error('Error al guardar datos:', error);
      }
      
    }
  }

  // Métodos auxiliares para validación
  isValidField(field: string): boolean {
    const control = this.registerForm.get(field);
    return Boolean(control?.touched && control.invalid); 
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    if (!control) return '';
  
    if (field === 'repeatpassword') {
      if (this.registerForm.errors?.['mismatchedPasswords']) {
        return 'Las contraseñas no coinciden';
      }
    }
  
    if (control.errors?.['required']) {
      return 'Este campo es obligatorio';
    }
    if (control.errors?.['email']) {
      return 'Por favor ingrese un email válido';
    }
    if (control.errors?.['minlength']) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    return '';
  }
}
