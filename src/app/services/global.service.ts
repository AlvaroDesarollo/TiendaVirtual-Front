import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  public usuario: string = 'id';
  public correo: string = '';
  public carritoCompras: any[] = [];

  public nombreObser: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public correoObser: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {}

  public get usuarioo() {
    return this.usuario;
  }
  public set usuarioo(value: string) {
    this.correo = value;
    this.nombreObser.next(value);
  }

  public get correoo() {
    return this.usuario;
  }
  public set correoo(value: string) {
    this.correo = value;
    this.correoObser.next(value);
  }
}
