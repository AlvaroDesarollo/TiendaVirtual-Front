import { Injectable } from '@angular/core';
import { AlertsService } from './alerts.service';
import { Router } from '@angular/router';
import { PeticionesService } from './peticiones.service';
import { GlobalService } from './global.service';

interface IType {
  type: 'proveedor' | 'admin';
  doc: string;
}
@Injectable({
  providedIn: 'root',
})
export class ValidarUsuarioService {
  constructor(
    private alertService: AlertsService,
    private router: Router,
    private petitionService: PeticionesService,
    private globalService: GlobalService
  ) {}

  public async validarUsuario(data: IType) {
    const popUpResult = await this.popUpDocumento(data);

    if (popUpResult.role === 'cancel') {
      this.router.navigateByUrl('pages/productos', { replaceUrl: true });
      return;
    }
    const numDoc = popUpResult.data.values.numDocumento;
    if (!numDoc) {
      const loading = await this.alertService.loadingSimple({
        msg: 'Número de documento inválido..!',
      });
      setTimeout(() => {
        loading.dismiss();
        this.validarUsuario(data);
      }, 1200);
      return;
    }
    return await this.getPeticionServer(numDoc, data.type);
  }

  private getPeticionServer(
    doc: string,
    type: IType['type']
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.petitionService.comprobarUser(type, doc).subscribe(
        async ({ nombre, correo }) => {
          if (!nombre && !correo) {
            const loading = await this.alertService.loadingSimple({
              msg: ` ${
                type === 'admin' ? 'Administrador' : 'Proveedor'
              } inválido..!`,
              duration: 1000,
            });
            this.router.navigateByUrl('pages/productos', { replaceUrl: true });
            return;
          }
          this.globalService.correoo = correo;
          this.globalService.usuarioo = nombre;
          this.globalService.usuario = doc;
          const loading = await this.alertService.loadingSimple({
            msg: 'Login completo!',
            duration: 1000,
          });
          resolve(true);
        },
        async (error) => {
          console.log;
          const loading = await this.alertService.loadingSimple({
            msg: 'Error login!',
            duration: 1000,
          });
          this.router.navigateByUrl('pages/productos', { replaceUrl: true });
        }
      );
    });
  }

  private async popUpDocumento(data: IType): Promise<any> {
    const documento = await this.alertService.alertWhitInput({
      header: `Ingrese el número de documento como ${
        data.type === 'admin' ? 'administrador' : 'proveedor'
      }`,
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
          placeholder: 'número documento proveedor',
        },
      ],
    });

    return documento;
  }
}
