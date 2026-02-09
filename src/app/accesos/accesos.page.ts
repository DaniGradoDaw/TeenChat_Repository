import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonButton, IonItem, IonLabel, IonList, IonIcon, IonListHeader } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; // Necesario para los iconos en standalone
import { locationOutline, refreshOutline, timeOutline } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-accesos',
  templateUrl: './accesos.page.html',
  styleUrls: ['./accesos.page.scss'],
  standalone: true,
  imports: [IonListHeader, 
    IonIcon, IonList, IonLabel, IonItem, IonButton, 
    IonContent, IonHeader, IonToolbar, 
    CommonModule, FormsModule
  ]
})
export class AccesosPage implements OnInit {
  // 1. Declaramos la variable de la lista
  listaAccesos: any[] = [];

  constructor(private modalCtrl: ModalController) {
    // 2. Registramos los iconos 
    addIcons({ locationOutline, refreshOutline, timeOutline });
  }

  ngOnInit() {
    // 3. Cargamos los datos en cuanto abra la página
    this.cargarHistorial();
  }

  // 4. Lógica para guardar
  async registrarAcceso() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const nuevaEntrada = {
        fecha: new Date().toLocaleString(),
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };

      const { value } = await Preferences.get({ key: 'historial_accesos' });
      let historial = value ? JSON.parse(value) : [];

      historial.unshift(nuevaEntrada);
      if (historial.length > 10) {
        historial = historial.slice(0, 10);
      }

      await Preferences.set({
        key: 'historial_accesos',
        value: JSON.stringify(historial)
      });

      // Actualizamos la lista en pantalla inmediatamente
      this.listaAccesos = historial;
      console.log('Acceso registrado:', nuevaEntrada);
    } catch (error) {
      console.error('Error al registrar acceso', error);
    }
  }

  // 5. Lógica para leer
  async cargarHistorial() {
    const { value } = await Preferences.get({ key: 'historial_accesos' });
    this.listaAccesos = value ? JSON.parse(value) : [];
  }

  async tab1() {
    await this.modalCtrl.dismiss();
  }
}