import { Component, inject } from '@angular/core'; // Añadimos inject aquí
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth'; 
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html', 
  standalone: true,
  imports: [IonList, IonItem, IonInput, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, FormsModule, CommonModule]
})
export class Tab3Page { 

  // Inyectamos los servicios correctamente
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  datosRegistro = {
    nombre: '',
    email: '',
    password: ''
  };

  constructor(private modalCtrl: ModalController) {}

  async registro() {
    try {
      // 1. Creamos el usuario en Firebase Authentication (opcional pero recomendado)
      const userCredential = await createUserWithEmailAndPassword(
        this.auth, 
        this.datosRegistro.email, 
        this.datosRegistro.password
      );

      // 2. Guardamos los datos adicionales en la colección 'usuarios' de Firestore
      const col = collection(this.firestore, 'usuarios');
      await addDoc(col, { 
        uid: userCredential.user.uid, // ID único del usuario
        nombre: this.datosRegistro.nombre, 
        email: this.datosRegistro.email,
        fechaCreacion: new Date() 
      });

      console.log('¡Usuario registrado y guardado en base de datos!');
      this.tab1(); // Cerramos el modal tras el éxito

    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Error: ' + error);
    }
  }

  async tab1() {
    await this.modalCtrl.dismiss();
  }
}