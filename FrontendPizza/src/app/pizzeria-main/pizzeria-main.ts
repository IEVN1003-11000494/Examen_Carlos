import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapturaDatosComponent } from '../captura-datos/captura-datos';
import { DetallePedidoComponent } from '../detalle-pedido/detalle-pedido';
import { ResumenVentasComponent } from '../resumen-ventas/resumen-ventas';

@Component({
  standalone: true,
  imports: [CommonModule, CapturaDatosComponent, DetallePedidoComponent, ResumenVentasComponent],
  selector: 'app-pizzeria-main',
  templateUrl: './pizzeria-main.html'
})
export class PizzeriaMainComponent implements AfterViewInit {
  @ViewChild(CapturaDatosComponent) capturaComponent!: CapturaDatosComponent;
  formularioPrincipal: any;

  ngAfterViewInit() {
    setTimeout(() => { this.formularioPrincipal = this.capturaComponent.formulario; });
  }
}