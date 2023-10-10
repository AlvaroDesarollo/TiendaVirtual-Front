import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { Components } from '@ionic/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input('show') show: boolean = false;
  @Input('title') title: string = '';
  @Input('content') content: any;
  @Output('close') close: EventEmitter<any> = new EventEmitter();
  @Input() modal: Components.IonModal | undefined;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}
  cerrarModal() {
    this.dismiss();
    this.close.emit(true);
  }
  dismiss() {
    this.modal?.dismiss('Cerro');
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
}
