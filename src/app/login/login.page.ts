import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth'; 
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-tab2',
  templateUrl: 'login.page.html', 
  standalone: true,
  imports: [IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonList, FormsModule, CommonModule]
})
export class Tab2Page {
  
  loginData = {
    email: '',
    password: ''
  };

  constructor(private modalCtrl: ModalController, private auth: Auth) {}

  async login() {
    try {
      // Intentamos iniciar sesión con Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        this.auth, 
        this.loginData.email, 
        this.loginData.password
      );

      console.log('¡Usuario registrado e iniciado sesión!');
      this.tab1(); // Cerramos el modal tras el éxito

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error: ' + error);
    }
  }

  async tab1() {
    await this.modalCtrl.dismiss();
  }
}