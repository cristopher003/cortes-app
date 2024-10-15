import { Component } from '@angular/core';
import { DataCortes } from './interfaces/cortes.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cortes-app';

  searchData: DataCortes ={} as DataCortes;

  onBuscar(data: DataCortes) {
    this.searchData = data;
  }
}
