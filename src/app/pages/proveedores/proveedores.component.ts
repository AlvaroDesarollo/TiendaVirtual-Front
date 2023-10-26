import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { ICategoria } from 'src/app/models/categoria.model';
import { AlertsService } from 'src/app/services/alerts.service';
import { GlobalService } from 'src/app/services/global.service';
import { PeticionesService } from 'src/app/services/peticiones.service';
import { ValidarUsuarioService } from 'src/app/services/validar-usuario.service';
@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss'],
})
export class ProveedoresComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal | undefined;
  public show: boolean = false;
  public titulo: string = '';
  public categorias: ICategoria[] = [];
  public formulario!: FormGroup;
  public formularioCategoria!: FormGroup;
  customPopoverOptions = {
    header: 'Categorias',
    subHeader: 'Selecciones una categoría para el producto',
  };
  categoriaNueva: string = '';
  isModalOpen: boolean = false;

  constructor(
    private alertService: AlertsService,
    private petitionService: PeticionesService,
    private formBuilder: FormBuilder,
    private validarUsuarioService: ValidarUsuarioService
  ) {}

  ngOnInit() {
    this.titulo = 'Proveedor';

    this.verificarProveedor();

    this.setRules();
    this.getCategorias();
  }

  setRules() {
    this.formularioCategoria = this.formBuilder.group({
      nombreCategoria: ['', [Validators.required]],
    });
    this.formulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      cantidad: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.min(1),
          Validators.max(100),
        ],
      ],
      precio: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      url: ['', [Validators.required]],
    });
  }
  getCategorias(): void {
    this.petitionService
      .getCategorias()
      .subscribe((categorias: ICategoria[]) => {
        this.categorias = categorias;
      });
  }
  async verificarProveedor() {
    const result = await this.validarUsuarioService.validarUsuario({ doc: '', type: 'proveedor' });
    if(result){
      this.show = true;
    }
  }
  openModal() {
    this.isModalOpen = true;
  }

  onWillDismiss(ev: any) {
    if (ev.detail.role === 'confirm') {
      this.categoriaNueva = ev.detail.data;
      this.crearCategoria();
    }
  }
  cerrar() {
    const { nombreCategoria } = this.formularioCategoria?.getRawValue();
    const filter = this.categorias.filter(
      (categoria) => categoria.nombreCategoria === nombreCategoria
    );
    if (filter.length > 0) {
      this.alertService.alertSimple({
        header: 'Categoría existente',
        msg: `La categoría que se esta creando ya existe: ${nombreCategoria}`,
        buttons: ['Aceptar'],
      });
      return;
    }
    this.modal?.dismiss({ nombreCategoria }, 'confirm');
  }

  async crearCategoria() {
    const loading = await this.alertService.loadingSimple({
      msg: 'Creando categoria..',
    });

    this.petitionService
      .crearCategoria(this.categoriaNueva)
      .subscribe((result) => {
        loading.dismiss();
        this.getCategorias();
      });
  }
  crearProducto() {
    const { nombre, cantidad, precio, categoria, url } =
      this.formulario.getRawValue();
    const payload = {
      valor_pesos_colombianos: precio,
      nombre_producto: nombre,
      idCategoria: categoria,
      cantidad_stock: cantidad,
      imagen: url,
    };
    console.log(payload);
    this.petitionService.crearProducto(payload).subscribe(
      (result) => {
        this.alertService.alertSimple({
          header: 'Producto Creado',
          msg: `Se creo correctamente el producto ${nombre}`,
          buttons: ['Aceptar'],
        });
        this.setRules();
      },
      (err) => {
        console.log('Error crear producto', err);
        this.alertService.alertSimple({
          header: 'Error',
          msg: `Error al crear el producto`,
          buttons: ['Aceptar'],
        });
      }
    );
  }
}
