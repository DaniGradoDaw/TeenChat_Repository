import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para *ngFor
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonList, IonItem, IonLabel, IonThumbnail } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';
import { FilePicker } from '@capawesome/capacitor-file-picker';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.page.html',
  styleUrls: ['./camara.page.scss'],
  standalone: true,
  // Asegúrate de importar IonList, IonItem, etc. si usas la lista bonita, o solo CommonModule
  imports: [IonButton, IonContent, CommonModule, FormsModule, IonList, IonItem, IonLabel, IonThumbnail] 
})
export class CamaraPage implements OnInit {

  // CAMBIO 1: Variable para guardar la lista de archivos (Array vacío al inicio)
  public selectedFiles: any[] = []; 
  
  public selectedImage: string | undefined; 

  constructor(private router: Router) {}

  ngOnInit() {}

  // ... (Tus funciones takePicture y selectImage se quedan igual para la cámara) ...
  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    this.selectedImage = image.webPath;
  };
  
  selectImage = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false, 
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos 
    });
    this.selectedImage = image.webPath;
  };

  // CAMBIO 2: Lógica corregida para múltiples archivos
  pickFiles = async () => {
    const result = await FilePicker.pickFiles({
      types: ['image/png', 'image/jpeg'],
      readData: true, // Asegúrate de leer los datos para obtener el contenido del archivo
    });
debugger
    // Guardamos TODOS los archivos, no solo el [0]
    for (const file of result.files) {

    }
    this.selectedFiles = result.files || [];

    //modifica la variable data para incluir el mymeType y el nombre del archivo
    this.selectedFiles = this.selectedFiles.map(file => ({
      name: file.name,  
      type: file.mimeType,
      size: file.size,
      data:`data:image/${file.mimeType};base64,${file.data}`// Asegúrate de que 'data' contenga la información del archivo
    }));
    
    console.log('Archivos seleccionados:', this.selectedFiles);
  };

  async tab1() {
    this.router.navigate(['/tabs/tab1']); 
  }
}