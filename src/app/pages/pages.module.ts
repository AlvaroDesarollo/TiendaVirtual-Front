import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PagesRoutingModule } from './pages-routing.module';
import { ComponentsModule } from '../components/components.module';
import { ProductosComponent } from './productos/productos.component';
import { ResumenCompraComponent } from './resumen-compra/resumen-compra.component';
import { LoginComponent } from './login/login.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [ProductosComponent, ResumenCompraComponent, LoginComponent, ProveedoresComponent, AdminComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ReactiveFormsModule,
  ],
})
export class PagesModule {}
