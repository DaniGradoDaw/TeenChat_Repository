import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput,
  IonButtons, IonMenu, IonMenuButton, IonAccordion, IonAccordionGroup, 
  IonButton, IonLabel, ModalController 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from '../login/login.page';
import { Router } from '@angular/router';
import { Tab3Page } from '../tab3/tab3.page';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { AccesosPage } from '../accesos/accesos.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, 
    IonToolbar, IonTitle, IonInput, FormsModule, CommonModule, 
    IonAccordion, IonAccordionGroup, IonButton, IonItem, IonLabel
  ],
  providers: [ModalController],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab1Page {
  texto: string = 'Este texto viene del ts';

  @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;

  constructor(private modalCtrl: ModalController, private router: Router) {}

  async abrirTab2() {
    const modal = await this.modalCtrl.create({
      component: Tab2Page,
      componentProps: {
        nombre: 'Alfonso',
        id: 1204
      }
    });
    await modal.present();
  }

  async abrirTab3() {
    const modal = await this.modalCtrl.create({
      component: Tab3Page,
      componentProps: {
        id: 1204
      }
    });
    await modal.present();
  }

  toggleAccordionF() {
    this.accordionGroup.value = this.accordionGroup.value === 'first' ? undefined : 'first';
  }

  toggleAccordionS() {
    this.accordionGroup.value = this.accordionGroup.value === 'second' ? undefined : 'second';
  }

  toggleAccordionT() {
    this.accordionGroup.value = this.accordionGroup.value === 'third' ? undefined : 'third';
  }
  
  abrirdarkmode() {
    this.router.navigate(['/darkmode']);
  }
  
  async testLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      console.log('Posición encontrada:', position);
      alert(`Tu latitud es: ${position.coords.latitude}`);
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      alert('Asegúrate de dar permisos en el navegador');
    }
  }

  async registros() {
    const modal = await this.modalCtrl.create({
      component: AccesosPage,
      componentProps: {
        id: 1204
      }
    });
    await modal.present();
  }

  abrirCamara() {
    this.router.navigate(['/camara']);
  }

}