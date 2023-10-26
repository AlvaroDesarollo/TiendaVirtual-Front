import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductosComponent } from './productos/productos.component';
import { ResumenCompraComponent } from './resumen-compra/resumen-compra.component';
import { LoginComponent } from './login/login.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full'
  },
  {
    path: 'productos',
    component: ProductosComponent,
  },
  {
    path: 'resumen',
    component: ResumenCompraComponent,
  },
  {
    path: 'proveedor',
    component: ProveedoresComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
