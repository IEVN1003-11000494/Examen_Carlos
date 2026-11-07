import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PizzeriaMainComponent } from './pizzeria-main/pizzeria-main';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PizzeriaMainComponent],
  templateUrl: './app.html'
})
export class App {
  title = 'FrontendPizza';
}