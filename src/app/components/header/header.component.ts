import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input('titulo') titulo: string = '';
  @Input('enableCarrito') enableCarrito: boolean = false;
  @Input('valorCarrito') valorCarrito: number = 0;
  @Output('irCarrito') irCarrito: EventEmitter<boolean> = new EventEmitter();

  constructor(private alertService: AlertsService) {}

  clickCarrito() {
    if (this.valorCarrito === 0) {
      this.alertService.alertSimple({
        header: 'Carrito vacío',
        msg: 'Su carrito se encunetra vacío',
        buttons: ['Aceptar']
      })
      return;
    }
    this.irCarrito.emit(true);
  }
}
