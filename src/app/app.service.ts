import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private apiUrl = 'https://api.cnelep.gob.ec/servicios-linea/v1/notificaciones/consultar';

  constructor(private http: HttpClient) { }

  consultar(consulta: string, criterio: string): Observable<any> {
    const url = `${this.apiUrl}/${encodeURIComponent(consulta)}/${encodeURIComponent(criterio)}`;
    
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado.';

    if (error.error instanceof ErrorEvent) {
      // Errores del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Errores del lado del servidor
      errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
    }

    console.error(errorMessage); // Puedes loguear el error en un servicio de monitoreo
    return throwError(() => new Error(errorMessage));
  }
}
