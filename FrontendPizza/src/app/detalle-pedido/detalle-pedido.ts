import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PizzeriaService } from '../pizzeria';
import { DetallePizza, Pedido } from '../pedido';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.html'
})
export class DetallePedidoComponent implements OnInit, OnDestroy {
  @Input() formularioCliente!: FormGroup; 
  pizzas: DetallePizza[] = [];
  totalPedido: number = 0;
  private sub!: Subscription;

  // Inyectamos ChangeDetectorRef para controlar el renderizado de la pantalla
  constructor(private pizzeriaService: PizzeriaService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sub = this.pizzeriaService.pizzas$.subscribe(pizzas => {
      this.pizzas = [...pizzas];
      this.totalPedido = this.pizzas.reduce((acc, pizza) => acc + pizza.subtotal, 0);
      
      // ESTA LÍNEA ES LA SOLUCIÓN: Obliga a Angular a redibujar el recuadro azul de inmediato
      this.cdr.detectChanges(); 
    });
  }

  ngOnDestroy(): void {
    if (this.sub) { this.sub.unsubscribe(); }
  }

  quitarPizza(index: number) {
    this.pizzeriaService.quitarPizzaTemporal(index);
  }

  terminarPedido() {
    if (this.pizzas.length === 0) { alert("Agrega al menos una pizza al pedido."); return; }
    if (!this.formularioCliente || this.formularioCliente.invalid) { alert("Llena los datos del cliente (Nombre, Dirección, Teléfono)."); return; }

    const formValues = this.formularioCliente.value;
    const nuevoPedido: Pedido = {
        cliente: formValues.cliente,
        direccion: formValues.direccion,
        telefono: formValues.telefono,
        fecha_pedido: formValues.fecha_pedido,
        total: this.totalPedido,
        detalles: this.pizzas
    };


    this.pizzeriaService.registrarPedido(nuevoPedido).subscribe({
        next: () => {
            alert(`¡Pedido Terminado y Guardado en Base de Datos!\nTotal a pagar: $${this.totalPedido}`);
            this.pizzeriaService.limpiarPizzasTemporales(); 
            
            if (this.formularioCliente) {
                this.formularioCliente.reset({ fecha_pedido: formValues.fecha_pedido, cantidad: 1, tamano: 'Chica' }); 
            }
        },
        error: (err) => {
            console.error(err);
            alert("Error al guardar en la Base de Datos. Revisa tu backend.");
        }
    });
  }
}