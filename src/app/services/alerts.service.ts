import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';

interface IAlert {
  header: string;
  subHeader?: string | '';
  msg?: string | '';
  buttons: any[] | ['aceptar'];
  inputs?: any[];
}

interface IToast {
  msg: string;
  duration?: number | 500;
  position?: 'top' | 'middle' | 'bottom';
}
interface ILoading {
  msg: string;
  duration?: number;
}
@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async alertSimple(data: IAlert): Promise<HTMLIonAlertElement> {
    const alert = await this.alertController.create({
      header: data.header,
      subHeader: data.subHeader,
      message: data.msg,
      buttons: data.buttons,
      mode: 'ios',
    });

    await alert.present();
    return alert;
  }

  async alertWhitInput(data: IAlert): Promise<any> {
    const alert = await this.alertController.create({
      header: data.header,
      buttons: data.buttons,
      inputs: data.inputs,
      mode: 'ios',
      backdropDismiss: false,
    });

    await alert.present();
    return alert.onDidDismiss();
  }

  async toastSimple(data: IToast): Promise<HTMLIonToastElement> {
    const toast = await this.toastController.create({
      message: data.msg,
      duration: data.duration ?? 800,
      position: data.position ?? 'bottom',
      mode: 'ios',
      color: 'medium',
    });

    await toast.present();
    return toast;
  }

  async loadingSimple(data: ILoading): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create({
      message: data.msg,
      duration: data.duration,
      mode: 'ios',
    });

    loading.present();
    return loading;
  }
}
