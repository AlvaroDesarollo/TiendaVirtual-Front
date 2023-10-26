import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/services/alerts.service';
import { ModalService } from 'src/app/services/modal.service';
import { PeticionesService } from 'src/app/services/peticiones.service';
import { ValidarUsuarioService } from 'src/app/services/validar-usuario.service';
import { IProducto } from '../productos/productos.component';

let that: any;
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  public titulo: string = '';
  public show: boolean = false;
  public proveedor: boolean = false;
  public ventas: boolean = false;
  public tipoDeVenta: 'total' | 'totalProducto' | 'producto' | undefined;
  public prodcutoSelect: string = '';
  public formulario!: FormGroup;
  customPopoverOptions = {
    header: 'Productos',
    subHeader: 'Seleccione un producto',
  };
  // that: any
  public productos: Array<{ nombre: string; id: string }> = [];
  constructor(
    private validarUsuarioService: ValidarUsuarioService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private alertService: AlertsService,
    private petitionService: PeticionesService
  ) {}

  ngOnInit() {
    this.titulo = 'Módulo Admin';
    this.setRules();
    this.traerProductos();
    that = this;
    // this.verificarAdmin();
  }
  traerProductos() {
    this.petitionService.getProductos().subscribe((productos: IProducto[]) => {
      productos.map((producto: IProducto) => {
        this.productos.push({
          nombre: producto.nombre,
          id: producto.id.toString(),
        });
      });
    });
  }
  setRules() {
    this.formulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      id: ['', [Validators.required]],
    });
  }

  setVariable(variable: 'ventas' | 'proveedor'): void {
    this[variable] = !this[variable];
    this.ngOnInit();
  }

  trearVentas() {
    const payload = {
      tipo: this.tipoDeVenta,
      producto: this.prodcutoSelect,
    };
    console.log('Traer venta: ', payload);
    this.petitionService.traerVenta(payload).subscribe(this.verReporte);
  }
  crearProveedor() {
    const payload = this.formulario.getRawValue();
    console.log('Crear Proveedor', payload);
    this.petitionService.crearProveedor(payload).subscribe(
      async (result) => {
        const loading = await this.alertService.loadingSimple({
          msg: result.result
            ? 'Proveedor creado correctamente'
            : 'Error al crear proveedor',
          duration: 1000,
        });
        this.setRules();
      },
      (err) => {
        console.error('Error al crear Proveedor', err);
        this.popUpError({
          header: 'Error',
          msg: 'Error al crear Proveedor',
          buttons: ['Aceptar'],
        });
      }
    );
  }

  async verReporte(reporte: any) {
    console.log('Ver reporte', reporte.reporte, that.modalService);
    const modal = await that.modalService.createModalSimple({
      show: true,
      title: 'Reporte',
      content: reporte.reporte,
    });
    return;
  }

  async verificarAdmin() {
    const result = await this.validarUsuarioService.validarUsuario({
      doc: '',
      type: 'admin',
    });
    if (result) {
      this.show = true;
    }
  }

  async popUpError(data: { header: string; msg: string; buttons: [string] }) {
    await this.alertService.alertSimple(data);
  }
}
