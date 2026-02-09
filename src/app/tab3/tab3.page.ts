import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html', 
  standalone: true,
  imports: [IonList, IonItem, IonInput, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, FormsModule, CommonModule]
})
export class Tab3Page { 

  datosRegistro = {
    nombre: '',
    email: '',
    password: ''
  };

  constructor(private modalCtrl: ModalController) {}

  async registro() {
    console.log('Botón pulsado. Datos:', this.datosRegistro);

    // Quitamos espacios por si acaso con .trim()
    const nom = this.datosRegistro.nombre.trim();
    const mail = this.datosRegistro.email.trim();
    const pass = this.datosRegistro.password.trim();

    if (nom === 'Alfonso' && mail === 'af@gmail' && pass === '1234') {
      alert('¡Registro exitoso!');
      await this.modalCtrl.dismiss();
    } else {
      alert('Los datos no coinciden.\nEscribiste: ' + nom + ' / ' + mail + ' / ' + pass);
    }
  }

  async tab1() {
    await this.modalCtrl.dismiss();
  }
}