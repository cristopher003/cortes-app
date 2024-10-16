import {  ChangeDetectorRef, Component, ElementRef, Input, OnChanges } from '@angular/core';
import {  CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import moment from 'moment';
import { DataCortes, DetallePlanificacion } from '../interfaces/cortes.interface';
import { differenceInMinutes, isSameDay, isSameMonth, startOfDay, startOfHour } from 'date-fns';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements OnChanges     {
  viewDate: Date = new Date();
  view: 'month' | 'week' | 'day' = 'month';
  events: CalendarEvent[] = [];
  cutsByDay: Record<string, CalendarEvent[]> = {};
  nextCut: string = '';
  nextCutTime: string = '';
  private intervalId: any;
  @Input() searchData: DataCortes = {} as DataCortes;
  hasData: boolean = false;
  activeDayIsOpen: boolean=false;
 
  constructor(private cdr: ChangeDetectorRef, private el: ElementRef) {this.hasData=false;}

  ngOnChanges() {
  
    if (this.searchData && Object.keys(this.searchData).length > 0) {
      this.prepareEvents();
      this.calculateNextCut();
      this.cdr.detectChanges();
      this.hasData=true; // Forzar la detección de cambios
    }else{ this.hasData = this.searchData ? Object.keys(this.searchData).length > 0 : false;}
   
  }

 

  prepareEvents() {
    const  notificaciones  = this.searchData.notificaciones;
    
    notificaciones.forEach(notificacion => {
     
      notificacion.detallePlanificacion.forEach(corte => {
     
        const {start,end}=this.caculateStartEnd(corte);

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


caculateStartEnd(corte:DetallePlanificacion) {
  const fechaCorte = moment(corte.fechaHoraCorte);
  var end= new Date();
  // Crea el objeto de inicio
  const start = moment(fechaCorte).set({
    hour: parseInt(corte.horaDesde.split(':')[0], 10),
    minute: parseInt(corte.horaDesde.split(':')[1], 10),
    second: 0,
    millisecond: 0
  }).toDate();
  
  
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

  return { start, end };
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


beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
  body.forEach((day) => {
    day.badgeTotal = day.events.filter(
      (event) => event.meta.incrementsBadgeTotal
    ).length;
  });
}



dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  if (isSameMonth(date, this.viewDate)) {
    if (
      (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
      events.length === 0
    ) {
      this.activeDayIsOpen = false;
    } else {
      this.activeDayIsOpen = true;
      this.viewDate = date;
    }
  }
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
