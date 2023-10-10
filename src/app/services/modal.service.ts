import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../components/modal/modal.component';

interface iModalSimple {
  show: boolean;
  title: string;
  content: any;
}
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private modalCtrl: ModalController) {}

  async createModalSimple(data: iModalSimple): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: data,
      mode: 'ios',
      backdropDismiss: true
    });
    modal.present();
    return await modal.onWillDismiss();
  }
}
