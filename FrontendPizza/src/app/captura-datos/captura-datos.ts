import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PizzeriaService } from '../pizzeria';
import { DetallePizza } from '../pedido';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-captura-datos',
  templateUrl: './captura-datos.html'
})
export class CapturaDatosComponent implements OnInit {
  formulario!: FormGroup;
  preciosTamano: any = { Chica: 40, Mediana: 80, Grande: 120 };

  constructor(private fb: FormBuilder, private pizzeriaService: PizzeriaService) {}

  ngOnInit(): void {
    const fechaHoy = new Date().toISOString().split('T')[0];
    this.formulario = this.fb.group({
      cliente: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      fecha_pedido: [fechaHoy, [Validators.required]],
      tamano: ['Chica', [Validators.required]],
      jamon: [false],
      pina: [false],
      champinones: [false],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  agregarPizza(): void {
    const formValues = this.formulario.value;
    let ingredientesSeleccionados = [];
    let costoIngredientes = 0;

    if (formValues.jamon) { ingredientesSeleccionados.push('Jamón'); costoIngredientes += 10; }
    if (formValues.pina) { ingredientesSeleccionados.push('Piña'); costoIngredientes += 10; }
    if (formValues.champinones) { ingredientesSeleccionados.push('Champiñones'); costoIngredientes += 10; }

    const subtotal = (this.preciosTamano[formValues.tamano] + costoIngredientes) * formValues.cantidad;

    const nuevaPizza: DetallePizza = {
      tamano: formValues.tamano,
      ingredientes: ingredientesSeleccionados.length > 0 ? ingredientesSeleccionados.join(', ') : 'Sin extra',
      cantidad: formValues.cantidad,
      subtotal: subtotal
    };

    // Esto añade la pizza a la lista visual de la tabla azul al instante
    this.pizzeriaService.agregarPizzaTemporal(nuevaPizza);
    
    // Reseteamos solo los campos de la pizza, manteniendo los datos del cliente
    this.formulario.patchValue({ tamano: 'Chica', jamon: false, pina: false, champinones: false, cantidad: 1 });
  }
}