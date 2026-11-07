import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PizzeriaService } from '../pizzeria';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-resumen-ventas',
  templateUrl: './resumen-ventas.html'
})
export class ResumenVentasComponent {
  fechaFiltro: string = '';
  mesFiltro: string = '';
  anioFiltro: string = '2026';
  ventas: any[] = [];
  totalVentas: number = 0;
  vista: 'dia' | 'mes' = 'dia';
  

  ventaSeleccionada: any = null; 

  constructor(private pizzeriaService: PizzeriaService) {}

  cambiarVista(v: 'dia' | 'mes') { 
    this.vista = v; 
    this.ventas = []; 
    this.totalVentas = 0; 
    this.ventaSeleccionada = null;
  }

  consultar() {
    this.ventaSeleccionada = null; 
    if (this.vista === 'dia' && this.fechaFiltro) {
      this.pizzeriaService.consultarVentasPorDia(this.fechaFiltro).subscribe(res => {
        this.ventas = res.ventas; 
        this.totalVentas = res.total_dia;
      });
    } else if (this.vista === 'mes' && this.mesFiltro && this.anioFiltro) {
      this.pizzeriaService.consultarVentasPorMes(this.mesFiltro, this.anioFiltro).subscribe(res => {
        this.ventas = res.ventas; 
        this.totalVentas = res.total_mes;
      });
    }
  }

  verDetalles(venta: any) {
    this.ventaSeleccionada = venta;
  }

  cerrarDetalles() {
    this.ventaSeleccionada = null;
  }
}