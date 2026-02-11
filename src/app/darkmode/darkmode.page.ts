import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRange,
  IonText,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { personCircle, personCircleOutline, sunny, sunnyOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-darkmode',
  templateUrl: 'darkmode.page.html',
  styleUrls: ['darkmode.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonRange,
    IonText,
    IonTitle,
    IonToggle,
    IonToolbar,
  ],
})
export class DarkmodePage implements OnInit {
  paletteToggle = false;

  constructor() {
    addIcons({ personCircle, personCircleOutline, sunny, sunnyOutline });
  }

  ngOnInit() {
    // Verificar si ya hay una preferencia guardada
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedTheme !== null) {
      // Si hay preferencia guardada, usarla
      this.paletteToggle = savedTheme === 'true';
      this.toggleDarkPalette(this.paletteToggle);
    } else {
      // Si no, usar la preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.initializeDarkPalette(prefersDark.matches);
      
      // Escuchar cambios en la preferencia del sistema
      prefersDark.addEventListener('change', (mediaQuery) => 
        this.initializeDarkPalette(mediaQuery.matches)
      );
    }
  }

  initializeDarkPalette(isDark: boolean) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }

  toggleChange(event: any) {
    const isDark = event.detail.checked;
    this.toggleDarkPalette(isDark);
    // Guardar preferencia
    localStorage.setItem('darkMode', String(isDark));
  }

  toggleDarkPalette(shouldAdd: boolean) {
  // Probamos con la clase moderna de Ionic
  document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  
  // Por si acaso tu CSS usa la clase antigua, mantenemos esta también
  document.documentElement.classList.toggle('dark', shouldAdd);
}
}