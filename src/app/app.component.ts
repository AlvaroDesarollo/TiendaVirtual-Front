import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { GlobalService } from './services/global.service';
import { Subscription, filter } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
  public appPages = [
    { title: 'Productos', url: '/pages/productos', icon: 'bag' },
    { title: 'Resumen', url: '/pages/resumen', icon: 'cart' },
  ];
  public labels = ['Family', 'Friends', 'Notes'];

  public nombre: string = 'nombre';
  public correo: string = 'pruebas@prueba.com';
  public showMenu: boolean = true;
  public events: Subscription = new Subscription();
  public correoSubscription: Subscription = new Subscription();
  public nombreSubscription: Subscription = new Subscription();

  constructor(private globalService: GlobalService, private router: Router) {
    this.nombre = globalService.usuarioo || 'Usuario';
    this.correo = globalService.correo || 'usuario@u.com';
    this.showMenu = true;
    this.events = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(filter((ev: any) => ev.url === '/pages/login'))
      .subscribe((event) => {
        this.showMenu = false;
      });
  }
  ngOnDestroy(): void {
    console.log('eliminando subscribción');
    this.events.unsubscribe();
    this.correoSubscription.unsubscribe();
    this.nombreSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.globalService.correoObser.subscribe((correo) => {
      console.log('llega correo nuevo::', correo);
      this.correo = correo;
    });
    this.globalService.nombreObser.subscribe((nombre) => {
      console.log('llega nombre nuevo::', nombre);
      this.nombre = nombre;
    })
  }

  theme(ev: any) {
    document.body.classList.toggle('dark', ev.detail.checked);
  }
}
