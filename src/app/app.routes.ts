import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'usuario',
    loadComponent: () => import('./usuario/usuario.page').then( m => m.UsuarioPage)
  },
  {
    path: 'forgotpasw',
    loadComponent: () => import('./forgotpasw/forgotpasw.page').then( m => m.ForgotpaswPage)
  },
  {
    path: 'darkmode',
    loadComponent: () => import('./darkmode/darkmode.page').then( m => m.DarkmodePage)
  },
  {
    path: 'accesos',
    loadComponent: () => import('./accesos/accesos.page').then( m => m.AccesosPage)
  },
  {
    path: 'camara',
    loadComponent: () => import('./camara/camara.page').then( m => m.CamaraPage)
  },
  
  
];
