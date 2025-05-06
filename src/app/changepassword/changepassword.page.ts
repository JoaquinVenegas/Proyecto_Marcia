import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
  standalone: false,
})
export class ChangepasswordPage implements OnInit {
  changepassForm!: FormGroup;
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

  ngOnInit() {
  }

  initializeForm(): void {
    this.changepassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
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

  async changepassword() {
    if (this.changepassForm.valid) {
      const userData = this.changepassForm.value;
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
    const control = this.changepassForm.get(field);
    return Boolean(control?.touched && control.invalid); 
  }

  getErrorMessage(field: string): string {
    const control = this.changepassForm.get(field);
    
    if (!control) return '';
    
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
