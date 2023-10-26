import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { IProducto } from '../productos/productos.component';
import { AlertsService } from 'src/app/services/alerts.service';
import * as moment from 'moment';
import { PeticionesService } from 'src/app/services/peticiones.service';
import { ModalService } from 'src/app/services/modal.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-resumen-compra',
  templateUrl: './resumen-compra.component.html',
  styleUrls: ['./resumen-compra.component.scss'],
})
export class ResumenCompraComponent implements OnInit {
  public titulo: string = '';
  public carrito: IProducto[] = [];
  public totalProductos: number = 0;
  public cantidadProductosComprados: number = 0;

  constructor(
    private globalService: GlobalService,
    private alertService: AlertsService,
    private petitionService: PeticionesService,
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('resumen page')
    this.titulo = 'Resumen de Compra';
    this.carrito = this.globalService.carritoCompras;
    this.setVariables();
  }

  setVariables(): void {
    this.carrito.map((producto: IProducto) => {
      this.totalProductos =
        this.totalProductos + producto.valor * producto.cantidadVendida;
      this.cantidadProductosComprados =
        this.cantidadProductosComprados + producto.cantidadVendida;
    });
  }

  async verificarUsuario() {
    const documento = await this.alertService.alertWhitInput({
      header: 'Ingrese el número de documento',
      buttons: [
        'Aceptar',
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
      inputs: [
        {
          name: 'numDocumento',
          placeholder: 'número documento',
        },
      ],
    });
    if (documento.role === 'cancel') {
      return;
    }
    const numDoc = documento.data.values.numDocumento;
    if (!numDoc) {
      const loading = await this.alertService.loadingSimple({
        msg: 'Número de dcumento inválido..!',
        duration: 1000,
      });
      return;
    }
    this.verificarUsuarioService(numDoc);
  }

  verificarUsuarioService(numDoc: string) {
    this.petitionService.getCliente(numDoc).subscribe(
      ({ nombre, correo }) => {
        if (!nombre && !correo) {
          console.log('Usuario no existe se pediran datos');
          this.crearUsuario();
          return;
        }
        this.globalService.correoo = correo
        this.globalService.usuarioo = nombre
        this.globalService.usuario = numDoc
        this.comprando();
      },
      (error) => {
        console.log;
      }
    );
  }
  async crearUsuario() {
    const documento = await this.alertService.alertWhitInput({
      header: 'Ingrese el número de documento',
      buttons: [
        'Aceptar',
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
      inputs: [
        {
          name: 'id',
          placeholder: 'número documento',
        },
        {
          name: 'nombre',
          placeholder: 'nombre y apellido',
        },
        {
          name: 'correo',
          placeholder: 'correo electrónico',
          type: 'email',
        },
        {
          name: 'telefono',
          placeholder: 'número de telefono',
          type: 'number',
        },
      ],
    });
    if (documento.role === 'cancel') {
      return;
    }
    const numDoc = documento.data.values.id;
    const nombre = documento.data.values.nombre;
    const correo = documento.data.values.correo;
    const telefono = documento.data.values.telefono;

    if (!numDoc || !nombre || !correo || !telefono) {
      this.alertService
        .loadingSimple({
          msg: 'datos inválidos..!',
          duration: 1000,
        })
        .finally(() => {
          setTimeout(() => {
            this.crearUsuario();
          }, 1200);
        });
      return;
    }
    this.petitionService.crearCliente(documento.data.values).subscribe(
      (result) => {
        if (!result) {
          this.alertService.loadingSimple({
            msg: 'Error al crear usuario..!',
            duration: 1000,
          });
          return;
        }
        this.globalService.correoo = correo
        this.globalService.usuarioo = nombre
        this.globalService.usuario = numDoc

        this.comprando();
      },
      (error) => console.log
    );
  }

  async comprando() {
    const loading = await this.alertService.loadingSimple({
      msg: 'Procesando compra...',
    });
    const idVentas: any[] = [];
    this.carrito.map((producto: IProducto) => {
      idVentas.push({
        id: producto.id,
        cantidadComprada: producto.cantidadVendida,
      });
    });

    const payloadVenta = {
      productos: idVentas,
      valorVenta: this.totalProductos,
      clienteId: this.globalService.usuario,
      fecha: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    };

    this.petitionService.createVenta(payloadVenta).subscribe(
      async (result) => {
        setTimeout(async () => {
          loading.dismiss();
          await this.verFactura(result.factura);
          this.finalizarCompra();
        }, 2500);
      },
      (error) => {
        console.log;
      }
    );
  }

  async finalizarCompra() {
    this.globalService.carritoCompras = [];
    this.carrito = [];
    const loading = await this.alertService.loadingSimple({
      msg: 'Compra Exitosa...',
      duration: 1000,
    });
    this.router.navigateByUrl('pages/productos', { skipLocationChange: true, replaceUrl: true });
  }

  async verFactura(factura: string) {
    const modal = await this.modalService.createModalSimple({
      show: true,
      title: 'Factura de Venta',
      content: factura,
    });
    return;
  }
}
