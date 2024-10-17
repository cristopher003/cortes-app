import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppService } from '../app.service';
import { DataCortes } from '../interfaces/cortes.interface';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css'
})
export class SearchFormComponent implements OnInit {
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
        if (data.resp==="ERROR") {
          this.alertaMensaje = data.mensaje;
          this.alertaVisible = true;
          this.buscar.emit({} as DataCortes);
          return;
          
        }
        this.buscar.emit(data);
        this.alertaVisible = false;
      },
      error: (error) => {
        this.alertaMensaje = error.message; 
        this.alertaVisible = true;
      }
    });
  }

  ocultarAlerta() {
    this.alertaVisible = false;
  }


  ngOnInit() {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) {
      document.body.classList.add('dark-mode');
    }else{
      document.body.classList.remove('dark-mode');
    }
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode.toString());
  }
}
