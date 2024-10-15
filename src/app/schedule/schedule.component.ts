import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CalendarDateFormatter, CalendarEvent } from 'angular-calendar';
import moment from 'moment';
import { DataCortes } from '../interfaces/cortes.interface';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements OnChanges   {
  viewDate: Date = new Date();
  view: 'month' | 'week' | 'day' = 'month';
  events: CalendarEvent[] = [];
  cutsByDay: Record<string, CalendarEvent[]> = {};
  nextCut: string = '';
  nextCutTime: string = '';
  private intervalId: any;
  @Input() searchData: DataCortes = {} as DataCortes;
  
  // Simulación de tu JSON
  // data = {
  //   resp: "OK",
  //   mensaje: null,
  //   mensajeError: null,
  //   extra: null,
  //   notificaciones: [
  //     {
  //       idUnidadNegocios: 6,
  //       cuentaContrato: "201011988049",
  //       alimentador: "04ML390T13",
  //       cuen: "0410264098",
  //       direccion: "VILLA ESPAÑA II...",
  //       fechaRegistro: "2024-09-23 11:19:59.0",
  //       detallePlanificacion: [
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "lunes, 14 de octubre de 2024",
  //           horaDesde: "05:00",
  //           horaHasta: "07:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-13 00:43:56.0",
  //           fechaHoraCorte: "2024-10-14 05:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "lunes, 14 de octubre de 2024",
  //           horaDesde: "12:00",
  //           horaHasta: "16:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-13 00:43:56.0",
  //           fechaHoraCorte: "2024-10-14 12:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "lunes, 14 de octubre de 2024",
  //           horaDesde: "20:00",
  //           horaHasta: "00:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-13 00:43:56.0",
  //           fechaHoraCorte: "2024-10-14 20:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "martes, 15 de octubre de 2024",
  //           horaDesde: "05:00",
  //           horaHasta: "07:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-13 00:44:16.0",
  //           fechaHoraCorte: "2024-10-15 05:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "martes, 15 de octubre de 2024",
  //           horaDesde: "12:00",
  //           horaHasta: "16:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-13 00:44:16.0",
  //           fechaHoraCorte: "2024-10-15 12:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "martes, 15 de octubre de 2024",
  //           horaDesde: "20:00",
  //           horaHasta: "00:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-13 00:44:16.0",
  //           fechaHoraCorte: "2024-10-15 20:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "miércoles, 16 de octubre de 2024",
  //           horaDesde: "05:00",
  //           horaHasta: "07:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-13 00:44:35.0",
  //           fechaHoraCorte: "2024-10-16 05:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "miércoles, 16 de octubre de 2024",
  //           horaDesde: "12:00",
  //           horaHasta: "16:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-13 00:44:35.0",
  //           fechaHoraCorte: "2024-10-16 12:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "miércoles, 16 de octubre de 2024",
  //           horaDesde: "20:00",
  //           horaHasta: "00:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-13 00:44:35.0",
  //           fechaHoraCorte: "2024-10-16 20:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "jueves, 17 de octubre de 2024",
  //           horaDesde: "05:00",
  //           horaHasta: "07:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-13 00:46:16.0",
  //           fechaHoraCorte: "2024-10-17 05:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "jueves, 17 de octubre de 2024",
  //           horaDesde: "12:00",
  //           horaHasta: "16:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-13 00:46:16.0",
  //           fechaHoraCorte: "2024-10-17 12:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "jueves, 17 de octubre de 2024",
  //           horaDesde: "20:00",
  //           horaHasta: "00:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-13 00:46:16.0",
  //           fechaHoraCorte: "2024-10-17 20:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "viernes, 18 de octubre de 2024",
  //           horaDesde: "05:00",
  //           horaHasta: "07:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-13 00:46:37.0",
  //           fechaHoraCorte: "2024-10-18 05:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "viernes, 18 de octubre de 2024",
  //           horaDesde: "12:00",
  //           horaHasta: "16:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-13 00:46:37.0",
  //           fechaHoraCorte: "2024-10-18 12:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "viernes, 18 de octubre de 2024",
  //           horaDesde: "20:00",
  //           horaHasta: "00:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-13 00:46:37.0",
  //           fechaHoraCorte: "2024-10-18 20:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "sábado, 19 de octubre de 2024",
  //           horaDesde: "12:00",
  //           horaHasta: "16:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-14 09:07:22.0",
  //           fechaHoraCorte: "2024-10-19 12:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "sábado, 19 de octubre de 2024",
  //           horaDesde: "20:00",
  //           horaHasta: "00:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-14 09:07:22.0",
  //           fechaHoraCorte: "2024-10-19 20:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "domingo, 20 de octubre de 2024",
  //           horaDesde: "12:00",
  //           horaHasta: "16:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-14 09:08:47.0",
  //           fechaHoraCorte: "2024-10-20 12:00"
  //         },
  //         {
  //           alimentador: "04ML390T13",
  //           fechaCorte: "domingo, 20 de octubre de 2024",
  //           horaDesde: "20:00",
  //           horaHasta: "00:00",
  //           comentario: "El corte se ha programado",
  //           fechaRegistro: "2024-10-14 09:08:47.0",
  //           fechaHoraCorte: "2024-10-20 20:00"
  //         }
  //       ]
  //     }
  //   ]
  // };

  ngOnChanges() {
    if (this.searchData) {
      this.prepareEvents();
      this.calculateNextCut();
    }
  }

  // ngOnInit() {
  //   // moment.locale('fr');
  //   this.prepareEvents();
  //   this.calculateNextCut();
  // }

  prepareEvents() {
    const  notificaciones  = this.searchData.notificaciones;
    notificaciones.forEach(notificacion => {
      const { detallePlanificacion } = notificacion;

      detallePlanificacion.forEach(corte => {


        const fechaCorte = moment(corte.fechaHoraCorte);

        // Crea el objeto de inicio
        const start = moment(fechaCorte).set({
          hour: parseInt(corte.horaDesde.split(':')[0], 10),
          minute: parseInt(corte.horaDesde.split(':')[1], 10),
          second: 0,
          millisecond: 0
        }).toDate();
        
        // Inicializa el objeto de fin
        let end;
        
        if (corte.horaHasta === "00:00") {
          // Si la hora de fin es 00:00, termina justo antes de la medianoche del día siguiente
          end = moment(fechaCorte).add(1, 'day').set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0
          }).subtract(1, 'second').toDate(); // Termina a 23:59:59
        } else {
          // De lo contrario, establece el fin normalmente
          end = moment(fechaCorte).set({
            hour: parseInt(corte.horaHasta.split(':')[0], 10),
            minute: parseInt(corte.horaHasta.split(':')[1], 10),
            second: 0,
            millisecond: 0
          }).toDate();
        }



        this.events.push({
          start,
          end,
          title: `${corte.comentario} (${corte.horaDesde} - ${corte.horaHasta})`,
          color: {
            primary: '#ad2121', // Color rojo
            secondary: '#FAE3E3' // Color más claro para el fondo
          },
          meta: {
            alimentador: notificacion.alimentador,
            cuentaContrato: notificacion.cuentaContrato,
            horaDesde: corte.horaDesde,
            horaHasta: corte.horaHasta,
            fechaCorte: corte.fechaCorte
          },
          resizable: {
            beforeStart: true,
            afterEnd: true
          }
        });

        const day = moment(start).format('YYYY-MM-DD');
        if (!this.cutsByDay[day]) {
          this.cutsByDay[day] = [];
        }
        this.cutsByDay[day].push(this.events[this.events.length - 1]);
      });
    });
}

calculateNextCut() {
  const now = moment();
  const nextEvent = this.events.find(event => moment(event.start).isAfter(now));

  if (nextEvent) {
    this.nextCut = `Próximo corte: ${nextEvent.title}`;
    this.updateNextCutTime(nextEvent.start);
  } else {
    this.nextCut = 'No hay cortes programados.';
    this.nextCutTime = '';
  }
}

updateNextCutTime(nextCutDate: Date) {
  const now = moment();
  const duration = moment.duration(moment(nextCutDate).diff(now));
  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.asMinutes()) % 60;

  this.nextCutTime = `Faltan ${hours} horas y ${minutes} minutos.`;
}

startTimer() {
  this.intervalId = setInterval(() => {
    this.calculateNextCut();
  }, 60000); // Actualizar cada minuto
}
changeView(view: 'month' | 'week' | 'day') {
  this.view = view;
}
}
