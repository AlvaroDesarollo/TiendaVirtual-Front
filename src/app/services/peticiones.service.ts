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
            categoria: producto.idCategoria,
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
  getCategorias(): Observable<any> {
    return this.http.get(`${this.urlBase}/categoria`);
  }

  comprobarUser(type: 'proveedor' | 'admin', doc: string): Observable<any> {
    return this.http.get(`${this.urlBase}/${type}/${doc}`);
  }

  crearProducto(payload: any): Observable<any> {
    return this.http.post(`${this.urlBase}/products/crearProducto`, payload);
  }
  crearCategoria(payload: any): Observable<any> {
    return this.http.post(`${this.urlBase}/categoria/crearCategoria`, payload);
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

  crearProveedor(proveedor: object): Observable<any> {
    return this.http.post(`${this.urlBase}/proveedor/crearProveedor`, proveedor);
  }

  traerVenta(venta: object): Observable<any> {
    return this.http.post(`${this.urlBase}/ventas/reporte`, venta);
  }
}
