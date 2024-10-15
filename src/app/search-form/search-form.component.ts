import { Component, EventEmitter, Output } from '@angular/core';
import { AppService } from '../app.service';
import { DataCortes } from '../interfaces/cortes.interface';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css'
})
export class SearchFormComponent {
  consulta: string = '';
  criterio: string = '';
  alertaVisible: boolean = false;
  alertaMensaje: string = '';
  @Output() buscar = new EventEmitter<DataCortes>();
  
  criterios = [
    { value: 'CUEN', label: 'CODIGO ÚNICO (CUEN)' },
    { value: 'CUENTA_CONTRATO', label: 'CUENTA CONTRATO' },
    { value: 'IDENTIFICACION', label: 'NÚMERO DE IDENTIFICACION' },
  ];

  constructor(private consultaService: AppService) {}

  consultaCuen() {
    if (this.consulta.trim() === '' || !this.criterio) {
      this.alertaMensaje = 'Por favor complete todos los campos.';
      this.alertaVisible = true;
      return;
    }

    this.consultaService.consultar(this.consulta, this.criterio).subscribe({
      next: (data) => {
        console.log('Respuesta de la API:', data);
        this.buscar.emit(data);
      },
      error: (error) => {
        this.alertaMensaje = error.message; // Mensaje del servicio
        this.alertaVisible = true;
      }
    });
  }

  ocultarAlerta() {
    this.alertaVisible = false;
  }
}
