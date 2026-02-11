import { Component, OnInit } from '@angular/core'; // Añadimos OnInit
import { IonApp, IonRouterOutlet, IonContent, IonIcon, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, refreshOutline, timeOutline } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  listaAccesos: any[] = [];

  constructor(private modalCtrl: ModalController) {
    addIcons({ locationOutline, refreshOutline, timeOutline });
  }

  async ngOnInit() {
    // 1. Primero intentamos registrar el nuevo acceso (ubicación y hora)
    await this.registrarAcceso();
    
    // 2. Luego cargamos el historial actualizado
    await this.cargarHistorial();
  }

  // Lógica para guardar
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

      // Guardamos en almacenamiento local
      await Preferences.set({
        key: 'historial_accesos',
        value: JSON.stringify(historial)
      });

      console.log('Acceso automático registrado:', nuevaEntrada);
    } catch (error) {
      console.error('Error al registrar acceso automático. ¿Están los permisos de GPS activos?', error);
    }
  }

  async cargarHistorial() {
    const { value } = await Preferences.get({ key: 'historial_accesos' });
    this.listaAccesos = value ? JSON.parse(value) : [];
  }
}