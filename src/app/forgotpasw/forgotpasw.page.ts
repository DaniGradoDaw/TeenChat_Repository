import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, 
  IonList, IonItem, IonInput, IonButton, IonIcon, AlertController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockOpenOutline, mailOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpasw',
  templateUrl: './forgotpasw.page.html',
  styleUrls: ['./forgotpasw.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonInput, IonButton, IonIcon,
    CommonModule, FormsModule
  ]
})
export class ForgotpaswPage {

  emailRecuperacion: string = '';

  constructor(private alertCtrl: AlertController, private router: Router) {
    // Registramos los iconos visuales
    addIcons({ lockOpenOutline, mailOutline });
  }

  async enviarCorreo() {
    // Validación simple: que no esté vacío
    if (!this.emailRecuperacion || this.emailRecuperacion.trim() === '') {
      const errorAlert = await this.alertCtrl.create({
        header: 'Campo vacío',
        message: 'Por favor, escribe tu correo electrónico.',
        buttons: ['OK']
      });
      await errorAlert.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: '¡Correo enviado!',
      message: `Hemos enviado un enlace de recuperación a ${this.emailRecuperacion}. Revisa tu bandeja de entrada.`,
      buttons: [
        {
          text: 'Entendido',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }
}