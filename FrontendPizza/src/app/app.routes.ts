import { Routes } from '@angular/router';
import { PizzeriaMainComponent } from './pizzeria-main/pizzeria-main';

export const routes: Routes = [
    { path: '', component: PizzeriaMainComponent },
    { path: 'pizzeria', component: PizzeriaMainComponent },
    { path: '**', redirectTo: '' }
];