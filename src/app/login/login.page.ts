import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // <--- 1. IMPORTANTE: Importar Router

@Component({
  selector: 'app-tab2',
  templateUrl: 'login.page.html', // Asegúrate de que este nombre sea correcto
  standalone: true,
  imports: [IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonList, FormsModule, CommonModule]
})
export class Tab2Page {
  
  loginData = {
    email: '',
    password: ''
  };

  // 2. IMPORTANTE: Añadir 'private router: Router' al constructor
  constructor(private modalCtrl: ModalController, private router: Router) {}

  async intentarLogin() {
    // Validamos los datos (puedes cambiar 'af@gmail' por lo que quieras)
    if (this.loginData.email === 'af@gmail' && this.loginData.password === '1234') {
      
      console.log('Login correcto. Redirigiendo...');
      
      // Cerramos el modal de login primero
      await this.modalCtrl.dismiss();

      // 3. IMPORTANTE: Navegar a la página 'usuario'
      // Esto fallará hasta que crees la página, pero el código ya está listo.
      this.router.navigate(['/usuario']); 

    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }

  async tab1() {
    await this.modalCtrl.dismiss();
  }
}