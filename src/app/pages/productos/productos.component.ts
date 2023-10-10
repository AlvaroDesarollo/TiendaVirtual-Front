import { Component, OnInit } from '@angular/core';

import { PeticionesService } from '../--/../../services/peticiones.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

export interface IProducto {
  stock: number;
  flagStock: boolean;
  categoria: string;
  image: string;
  nombre: string;
  valor: number;
  id: number;
  cantidadVendida: number;
}
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  public titulo: string = '';
  public textoVacio: string = '213124';
  public productos: IProducto[] = [];
  public carritoGlobal = 0;
  public carrito: IProducto[] = [];
  constructor(
    private peticiones: PeticionesService,
    private alertService: AlertsService,
    private router: Router,
    private globalService: GlobalService
  ) {
    this.titulo = 'Productos';
  }

  ngOnInit() {
    console.log('Productos Page Tienda.......')
    this.traerProductos();
  }

  traerProductos() {
    this.carritoGlobal = 0;

    this.peticiones.getProductos().subscribe((productos: IProducto[]) => {
      this.productos = productos.map((producto) => {
        producto.cantidadVendida = 0;
        return producto;
      });
    });
  }
  agregarCarrito(productoAgg: IProducto) {
    this.alertService.toastSimple({
      msg: `${productoAgg.nombre} agregado correctamente..`,
      position: 'top',
      duration: 1500,
    });
    this.carritoGlobal = this.carritoGlobal + 1;
    this.productos.map((producto) => {
      if (producto.id === productoAgg.id) {
        producto.stock = producto.stock - 1;
        producto.flagStock = producto.stock < 4;
      }
      return producto;
    });
    let flagAgregarCar = false;
    if (this.carrito.length === 0) {
      productoAgg.cantidadVendida = 1;
      this.carrito.push(productoAgg);
      return;
    }
    this.carrito.map((producto: IProducto) => {
      if (producto.id === productoAgg.id) {
        flagAgregarCar = true;
        producto.cantidadVendida = producto.cantidadVendida + 1;
      }
      return producto;
    });
    if (!flagAgregarCar) {
      productoAgg.cantidadVendida = 1;
      this.carrito.push(productoAgg);
    }
  }
  clickCarrito(ev: boolean) {
    this.globalService.carritoCompras = this.carrito;
    this.router.navigateByUrl('pages/resumen', { replaceUrl: true });
  }
}
