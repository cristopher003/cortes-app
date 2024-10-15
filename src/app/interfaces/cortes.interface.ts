export interface DataCortes {
    resp: string
    mensaje: any
    mensajeError: any
    extra: any
    notificaciones: Notificacione[]
  }
  
  export interface Notificacione {
    idUnidadNegocios: number
    cuentaContrato: string
    alimentador: string
    cuen: string
    direccion: string
    fechaRegistro: string
    detallePlanificacion: DetallePlanificacion[]
  }
  
  export interface DetallePlanificacion {
    alimentador: string
    fechaCorte: string
    horaDesde: string
    horaHasta: string
    comentario: string
    fechaRegistro: string
    fechaHoraCorte: string
  }
  