import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PeticionesService {
  private urlBase: string = `http://localhost:5021/tienda/v1/`;
  constructor(private http: HttpClient) {}

  getProductos(): Observable<any> {
    return this.http.get(`${this.urlBase}/products`).pipe(
      map((productos: any) => {
        const result: any = [];
        productos.map((producto: any) => {
          result.push({
            stock: producto.cantidad_stock,
            flagStock: producto.cantidad_stock < 4,
            categoria: producto.categoria,
            image: producto.imagen,
            nombre: producto.nombre_producto,
            valor: producto.valor_pesos_colombianos,
            id: producto.id,
          });
        });
        return result;
      })
    );
  }

  createVenta(payload: any): Observable<any> {
    return this.http.post(`${this.urlBase}/ventas/crearVenta`, payload);
  }

  getCliente(idCliente: string): Observable<any> {
    return this.http.get(`${this.urlBase}/cliente/${idCliente}`);
  }
  crearCliente(cliente: object): Observable<any> {
    return this.http.post(`${this.urlBase}/cliente/crearCliente`, cliente);
  }
}
