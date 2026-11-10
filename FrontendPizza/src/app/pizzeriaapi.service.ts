// src/app/pizzeriaapi.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Pedido, DetallePizza } from './pedido';

@Injectable({
  providedIn: 'root'
})
export class PizzeriaapiService {
  private apiUrl = 'http://127.0.0.1:5001/api';

  private pizzasSource = new BehaviorSubject<DetallePizza[]>([]);
  public pizzas$ = this.pizzasSource.asObservable();

  constructor(private http: HttpClient) {}

  agregarPizzaTemporal(pizza: DetallePizza) {
    const actual = this.pizzasSource.value;
    this.pizzasSource.next([...actual, pizza]);
  }

  quitarPizzaTemporal(index: number) {
    const actual = [...this.pizzasSource.value];
    actual.splice(index, 1);
    this.pizzasSource.next(actual);
  }
  
  limpiarPizzasTemporales() {
    this.pizzasSource.next([]);
  }

  registrarPedido(datos: Pedido): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos`, datos);
  }

  consultarVentasPorDia(fecha: string): Observable<any> {
    let params = new HttpParams().set('fecha', fecha);
    return this.http.get(`${this.apiUrl}/ventas/dia`, { params });
  }

  consultarVentasPorMes(mes: string, anio: string): Observable<any> {
    let params = new HttpParams().set('mes', mes).set('anio', anio);
    return this.http.get(`${this.apiUrl}/ventas/mes`, { params });
  }
}