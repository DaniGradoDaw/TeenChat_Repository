import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Para poder navegar
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonIcon, IonLabel, IonButton 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; // Para registrar los iconos
import { personOutline, mailOutline, calendarOutline, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonList, IonItem, IonIcon, IonLabel, IonButton,
    CommonModule, FormsModule
  ]
})
export class UsuarioPage implements OnInit {

  
  datosUsuario = {
    nombre: 'Alfonso',
    email: 'af@gmail',
    fechaAlta: new Date().toLocaleDateString() // Pone la fecha de hoy automáticamente
  };

  constructor(private router: Router) {
    addIcons({ personOutline, mailOutline, calendarOutline, logOutOutline });
  }

  ngOnInit() {
  }

  logout() {
    // Vuelve a inicio
    this.router.navigate(['/']);
  }

  forgotPasw() {
    this.router.navigate(['./forgotpasw']);
  }

}