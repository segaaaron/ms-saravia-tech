'use client'

import { useEffect, useReducer, useRef, useState } from 'react'
import type { DemoLang } from '../types'
import { useVisibleInterval } from '../useVisibleInterval'

/* ============================================================
   BRASA — Panel operativo (demo). Port nativo Next.js del
   diseño original .dc.html, misma info y mismo diseño.
   Back-office de restaurante: login por rol, KDS cocina/barra,
   pedidos, cobro, arqueo, finanzas. Estado sincronizado por
   localStorage con polling (multi-pestaña), como el original.
   Bilingüe (es/en) según el idioma del sitio.
   ============================================================ */

/* ---------- i18n: todo el texto visible (es original + en natural) ---------- */
type Content = {
  numLocale: string
  guest: string
  orderWord: string
  tableWord: string
  personWord: string
  roleMeta: Record<string, string>
  roleCard: Record<string, string>
  statusLabels: Record<string, string>
  modeLabels: Record<string, string>
  pay: Record<string, string>
  expCatLabels: Record<string, string>
  menuCatLabels: Record<string, string>
  zoneLabels: Record<string, string>
  resDate: Record<string, string>
  loginErr: string
  recallDefault: string
  login: {
    kicker: string; headline: string; sub: string; statRoles: string; statSync: string; brandTag: string
    title: string; intro: string; emailLabel: string; passLabel: string; emailPh: string
    enterBtn: string; quickAccess: string; passDemo: string
  }
  live: string; refresh: string; logoutTitle: string; panelWord: string
  nav: Record<string, string>
  titles: Record<string, [string, string]>
  titleKanban: [string, string]
  titleMesero: [string, string]
  menuTitles: Record<string, [string, string]>
  kpi: {
    ventas: string; pedidos: string; activos: string; enPrep: string; ticket: string; porPedido: string
    reservas: string; proximas: string; ocupacion: string; mesasPct: string; clientes: string; registrados: string
    canceladas: string; hoy: string
  }
  resumen: { recientes: string; ultimos: string; noOrders: string; topDishes: string; noTop: string; ventasCanal: string; cocinaBarra: string; platos: string }
  station: { cocina: string; barra: string; salon: string }
  mon: {
    enCola: string; preparando: string; listo: string; masAntigua: string; flujo: string; soloLectura: string
    sinComandas: string; atencion: string; bajoControl: string; sinExceso: string
    tranquila: string; retrasada: string; cargada: string; alDia: string; unassigned: string
    stageEnCola: string; stagePrep: string; stageListo: string
    kActivas: string; kCocina: string; kBarra: string; kListo: string; kAlertas: string
    stBarra: string; stMix: string; stCocina: string
    lleva: string; minEn: string; listoSinServir: string; feedCocinaBarra: string
  }
  kds: {
    recibido: string; enPrep: string; listoServir: string; cancelado: string
    capCola: string; capPrep: string; capListo: string
    readyIn: string; aceptar: string; marcarListo: string
    regresarRecibido: string; regresarPrep: string
    cancelHint: string; motivoIntro: string; motivoPh: string; regresar: string; cancel: string
    cancelConfirm: string; siCancelar: string; no: string; cancelLink: string
    canceladoBadge: string; canceladoPor: string; empty1: string; empty2: string
  }
  mesero: {
    noOfrecer: string; sinServicios: string; sinServicios2: string
    decisionIntro: string; preguntaComensal: string; servirListo: string; esperarTodo: string
    holdMsg: string; servirYa: string
    servirListos: string; entregarRepartidor: string; entregarCliente: string
    cobrarMesa: string; cobrarPedido: string; cuentaMesa: string; totalPedido: string
    dividido: string; ea: string; recoger: string; porCobrar: string; enPrep: string
    servida: string; entregada: string; cobrar: string; comoPaga: string; cancel: string
    kindDelivery: string; kindTakeaway: string
    servido: string; entregadoBadge: string; servirBadge: string; preparandoEn: string; enEstacion: string
    chipReady: (n: number) => string; chipKitchen: (n: number) => string; chipServed: (n: number) => string
    countBar: (n: number) => string
  }
  reservas: { cliente: string; fechaHora: string; personas: string; mesa: string; codigo: string; empty: string }
  mesas: { platos: string; bebidas: string; sinBebidas: string; cuentaMesa: string; libres: string; ocupadas: string; porEntregar: string; todoEntregado: string; pend: string; servida: string; reservada: string; libre: string; entregado: string; listoServir: string; enBarra: string; enCocina: string }
  menu: { categoria: string; precio: string; disponibilidad: string; limitar: string; marcarAgotado: string; agotar: string; disponible: string; reponer: string; agotado: string; quedan: string; plato: string; trago: string; barraTag: string; cocinaTag: string }
  equipo: { tocaIntro1: string; tocaIntro2: string; desempenoHoy: string; sinActividad: string }
  histc: { intro1: string; recuperarWord: string; intro2: string; comandasDesp: string; platosDesp: string; esperaMedia: string; coccionMedia: string; empty1: string; empty2: string; espero: string; coccion: string; platos: string; recuperar: string }
  histb: { intro1: string; recuperarWord: string; intro2: string; rondasServ: string; bebidasServ: string; prepMedia: string; empty1: string; bebidas: string; recuperar: string }
  histm: { mesasCobradas: string; cobrado: string; empty: string; platos: string; bebidas: string; comensales: string }
  caja: {
    ventasCobradas: string; tickets: string; ticketProm: string; propina: string
    ventasMetodo: string; arqueoEfectivo: string; fondoInicial: string; efectivoContado: string
    fondoRow: string; ventasEfvt: string; efvtEsperado: string
    cuadrada: string; sobrante: string; faltante: string
    corteConfirm: string; siCerrar: string; cancel: string; cerrarCaja: string
    cortesHist: string; sinCortes: string; cerradoPor: string; ticketsWord: string
  }
  member: {
    cobradoHoy: string; mesasCobradas: string; ticketProm: string; comensales: string; platosEntregados: string; cobrosTurno: string; items: string
    comandasDesp: string; platosPrep: string; coccionProm: string; esperaProm: string; comandaLenta: string; platosDespHead: string; espera: string
    rondasServ: string; bebidasPrep: string; prepProm: string; rondaLenta: string; rondasHead: string; bebidas: string
  }
  fin: {
    ingresos: string; ticketsCobrados: string; gastos: string; registros: string; ganancia: string; margen: string
    registrarGasto: string; registrarSub: string; conceptoPh: string; agregarGasto: string; gastosHoy: string; sinGastos: string; eliminar: string
    gastosCategoria: string; sinDesglosar: string; inversion: string; inversionSub: string; inversionInicial: string; recuperado: string
  }
  rend: {
    empty1: string; empty2: string; despachados: string; comandas: string; prepProm: string
    meseros: string; meserosSub: string; sinMesas: string; actividad: string; acciones: string
    mesa: string; mesas: string; comensales: string
  }
  minWord: string
}

const CONTENT: Record<DemoLang, Content> = {
  es: {
    numLocale: 'es-BO', guest: 'Cliente', orderWord: 'Pedido', tableWord: 'Mesa', personWord: 'personas',
    roleMeta: { admin: 'Administrador', chef: 'Chef de cocina', bartender: 'Bartender', mesero: 'Mesero' },
    roleCard: { admin: 'Admin', chef: 'Chef', bartender: 'Bartender', mesero: 'Mesero' },
    statusLabels: { nuevo: 'Nuevo', preparando: 'En preparación', listo: 'Listo', entregado: 'Entregado' },
    modeLabels: { 'En mesa': 'En mesa', 'Para llevar': 'Para llevar', 'Delivery': 'Delivery' },
    pay: { Efectivo: 'Efectivo', Tarjeta: 'Tarjeta', QR: 'QR' },
    expCatLabels: { Insumos: 'Insumos', Sueldos: 'Sueldos', Servicios: 'Servicios', Proveedores: 'Proveedores', Otros: 'Otros' },
    menuCatLabels: { 'Platos bolivianos': 'Platos bolivianos', 'Parrilla': 'Parrilla', 'Entrantes': 'Entrantes', 'Postres': 'Postres', 'Cócteles': 'Cócteles', 'Cervezas': 'Cervezas', 'Vinos': 'Vinos', 'Sin alcohol': 'Sin alcohol', 'Bar': 'Bar' },
    zoneLabels: { 'Salón principal': 'Salón principal', 'Terraza': 'Terraza', 'Barra': 'Barra', 'Reservado': 'Reservado' },
    resDate: { 'Hoy': 'Hoy', 'Mañana': 'Mañana' },
    loginErr: 'Correo o contraseña incorrectos',
    recallDefault: 'Devuelto para corregir',
    login: {
      kicker: 'Panel de operaciones', headline: 'El pulso del restaurante, en un solo lugar.',
      sub: 'Cocina, barra, salón y administración — pedidos y reservas en tiempo real desde que el cliente los envía.',
      statRoles: 'roles operativos', statSync: 'sincronización', brandTag: 'Panel',
      title: 'Iniciar sesión', intro: 'Ingresa con tu cuenta de personal.',
      emailLabel: 'Correo', passLabel: 'Contraseña', emailPh: 'tucorreo@brasa.bo',
      enterBtn: 'Entrar al panel', quickAccess: 'Acceso rápido de demostración', passDemo: 'Contraseña demo:',
    },
    live: 'En vivo', refresh: '↻ Actualizar', logoutTitle: 'Salir', panelWord: 'Panel',
    nav: { resumen: 'Resumen', operaciones: 'Operaciones', caja: 'Caja', finanzas: 'Finanzas', rendimiento: 'Rendimiento', reservas: 'Reservas', menu: 'Menú', equipo: 'Equipo', cocina: 'Cocina', historial: 'Historial', barra: 'Barra', pedidos: 'Pedidos', mesas: 'Mesas', disponibilidad: 'Disponibilidad' },
    titles: {
      resumen: ['Resumen', 'Vista general del servicio de hoy'],
      cocina: ['Línea de cocina', 'Recibido → En preparación → Listo · avanza cada comanda de un toque'],
      barra: ['Barra', 'Recibido → En preparación → Listo · avanza cada ronda de un toque'],
      histc: ['Historial de cocina', 'Comandas despachadas hoy · toca Recuperar para devolver una a la línea'],
      histb: ['Historial de barra', 'Rondas servidas hoy · toca Recuperar para devolver una a la barra'],
      histm: ['Mi historial', 'Cuentas cobradas del turno'],
      caja: ['Arqueo de caja', 'Cuadre de efectivo y corte del día'],
      rendimiento: ['Rendimiento', 'Control de cocina, barra y salón'],
      reservas: ['Reservas', 'Reservas de los clientes'],
      mesas: ['Mesas', 'Estado del salón'],
      menu: ['Menú', 'Disponibilidad de platos'],
      equipo: ['Equipo', 'Personal del restaurante'],
    },
    titleKanban: ['Monitor de operaciones', 'Todo el servicio en vivo — supervisas, no operas'],
    titleMesero: ['Mis mesas', 'Entrega y cobro por servicio'],
    menuTitles: {
      bartender: ['Carta de barra', 'Disponibilidad de tragos y bebidas'],
      chef: ['Carta de cocina', 'Disponibilidad de platos'],
      mesero: ['Disponibilidad', 'Qué no ofrecer: agotados y por acabarse'],
      admin: ['Menú', 'Disponibilidad de la carta'],
    },
    kpi: {
      ventas: 'Ventas de hoy', pedidos: 'pedidos', activos: 'Pedidos activos', enPrep: 'en preparación',
      ticket: 'Ticket promedio', porPedido: 'por pedido', reservas: 'Reservas', proximas: 'próximas',
      ocupacion: 'Ocupación', mesasPct: '% mesas', clientes: 'Clientes', registrados: 'registrados',
      canceladas: 'Canceladas', hoy: 'hoy',
    },
    resumen: { recientes: 'Pedidos recientes', ultimos: 'Últimos', noOrders: 'Aún no hay pedidos. Cuando un cliente pida, aparecerá aquí en vivo.', topDishes: 'Platos más pedidos', noTop: 'Sin datos todavía.', ventasCanal: 'Ventas por canal', cocinaBarra: 'Cocina vs Barra', platos: 'platos' },
    station: { cocina: 'Cocina', barra: 'Barra', salon: 'Salón' },
    mon: {
      enCola: 'en cola', preparando: 'preparando', listo: 'listo', masAntigua: 'más antigua', flujo: 'Flujo en vivo', soloLectura: 'solo lectura',
      sinComandas: 'Sin comandas activas ahora mismo.', atencion: 'Requiere tu atención', bajoControl: 'Todo bajo control', sinExceso: 'Ninguna comanda excede sus tiempos.',
      tranquila: 'Tranquila', retrasada: 'Retrasada', cargada: 'Cargada', alDia: 'Al día', unassigned: 'Sin asignar',
      stageEnCola: 'En cola', stagePrep: 'En preparación', stageListo: 'Listo · sin servir',
      kActivas: 'Comandas activas', kCocina: 'En cocina', kBarra: 'En barra', kListo: 'Listo sin servir', kAlertas: 'Alertas',
      stBarra: 'Barra', stMix: 'Cocina + Barra', stCocina: 'Cocina',
      lleva: 'lleva', minEn: 'min en', listoSinServir: 'listo sin servir hace', feedCocinaBarra: 'cocina y barra',
    },
    kds: {
      recibido: 'Recibido', enPrep: 'En preparación', listoServir: 'Listo · para servir', cancelado: 'Cancelado',
      capCola: 'en cola', capPrep: 'en preparación', capListo: 'listo',
      readyIn: 'listo en', aceptar: 'Aceptar →', marcarListo: 'Marcar listo ✓',
      regresarRecibido: '↩ Regresar a Recibido', regresarPrep: '↩ Regresar a preparación',
      cancelHint: 'Cancelar comanda', motivoIntro: '— anota el motivo para el equipo:', motivoPh: 'Ej: falta término de cocción, corregir guarnición…', regresar: 'Regresar comanda', cancel: 'Cancelar',
      cancelConfirm: '¿Cancelar esta comanda? No se preparará.', siCancelar: 'Sí, cancelar', no: 'No', cancelLink: 'Cancelar comanda',
      canceladoBadge: 'CANCELADO', canceladoPor: 'Cancelado por', empty1: 'Cocina al día', empty2: 'No hay comandas pendientes. Las nuevas entran en la columna Recibido.',
    },
    mesero: {
      noOfrecer: '⚠ No ofrecer', sinServicios: 'Sin servicios activos', sinServicios2: 'Aquí verás cada mesa: cuándo recogerla y cuándo cobrarla.',
      decisionIntro: 'Hay platos listos y otros en cocina.', preguntaComensal: 'Pregunta al comensal:', servirListo: 'Servir lo listo ya', esperarTodo: 'Esperar a todo',
      holdMsg: 'Esperando a que la cocina termine — sale todo junto', servirYa: 'servir ya →',
      servirListos: 'Servir listos ✓', entregarRepartidor: 'Entregar al repartidor ✓', entregarCliente: 'Entregar al cliente ✓',
      cobrarMesa: 'Cobrar mesa →', cobrarPedido: 'Cobrar pedido →', cuentaMesa: 'Cuenta de la mesa', totalPedido: 'Total del pedido',
      dividido: 'dividido:', ea: 'c/u', recoger: 'Recoger y servir', porCobrar: 'Servida · por cobrar', enPrep: 'En preparación…',
      servida: 'servida', entregada: 'entregada', cobrar: 'Cobrar', comoPaga: '¿cómo paga?', cancel: 'Cancelar',
      kindDelivery: 'Sale con el repartidor a domicilio', kindTakeaway: 'El cliente lo recoge en el mostrador',
      servido: 'servido', entregadoBadge: 'entregado ✓', servirBadge: 'servir ✓', preparandoEn: 'preparando ·', enEstacion: 'en',
      chipReady: (n) => n + ' listo' + (n > 1 ? 's' : ''), chipKitchen: (n) => n + ' en cocina', chipServed: (n) => n + ' servido' + (n > 1 ? 's' : ''),
      countBar: (n) => n + (n === 1 ? ' bebida' : ' bebidas'),
    },
    reservas: { cliente: 'Cliente', fechaHora: 'Fecha · hora', personas: 'Personas', mesa: 'Mesa', codigo: 'Código', empty: 'No hay reservas registradas todavía.' },
    mesas: { platos: 'Platos', bebidas: 'Bebidas', sinBebidas: 'Sin bebidas', cuentaMesa: 'Cuenta de la mesa', libres: 'libres', ocupadas: 'ocupadas', porEntregar: 'por entregar', todoEntregado: 'Todo entregado', pend: 'pend.', servida: 'Servida', reservada: 'Reservada', libre: 'Libre', entregado: 'Entregado ✓', listoServir: 'Listo · servir', enBarra: 'En barra', enCocina: 'En cocina' },
    menu: { categoria: 'Categoría', precio: 'Precio', disponibilidad: 'Disponibilidad', limitar: 'Limitar #', marcarAgotado: 'Marcar agotado', agotar: 'Agotar', disponible: 'Disponible', reponer: 'Reponer', agotado: 'Agotado', quedan: 'Quedan', plato: 'Plato', trago: 'Trago / bebida', barraTag: '🍸 Barra', cocinaTag: '👨‍🍳 Cocina' },
    equipo: { tocaIntro1: 'Toca a un integrante', tocaIntro2: 'para ver su desempeño del turno — cuánto cobró cada mesero, los tiempos de cocina del chef y las rondas de la barra.', desempenoHoy: 'desempeño de hoy', sinActividad: 'Sin actividad registrada hoy.' },
    histc: { intro1: 'Comandas que ya despachaste hoy.', recuperarWord: 'Recuperar', intro2: 'si marcaste una lista por error — vuelve a la línea de cocina en “En preparación”.', comandasDesp: 'Comandas despachadas', platosDesp: 'Platos despachados', esperaMedia: 'Espera media', coccionMedia: 'Cocción media', empty1: 'Aún no despachas platos hoy', empty2: 'Cada comanda que marques lista aparecerá aquí.', espero: 'esperó', coccion: 'cocción', platos: 'platos', recuperar: '↩️ Recuperar' },
    histb: { intro1: 'Rondas que ya serviste hoy.', recuperarWord: 'Recuperar', intro2: 'si marcaste una lista por error — vuelve a la barra en “En preparación”.', rondasServ: 'Rondas servidas', bebidasServ: 'Bebidas servidas', prepMedia: 'Preparación media', empty1: 'Aún no sirves bebidas hoy', bebidas: 'bebidas', recuperar: '↩️ Recuperar' },
    histm: { mesasCobradas: 'Mesas cobradas', cobrado: 'Cobrado', empty: 'Sin movimientos en tu turno', platos: 'Platos', bebidas: 'Bebidas', comensales: 'comensales' },
    caja: {
      ventasCobradas: 'Ventas cobradas', tickets: 'Tickets', ticketProm: 'Ticket promedio', propina: 'Propina 10% est.',
      ventasMetodo: 'Ventas por método de pago', arqueoEfectivo: 'Arqueo de efectivo', fondoInicial: 'Fondo inicial (USD)', efectivoContado: 'Efectivo contado (USD)',
      fondoRow: 'Fondo inicial', ventasEfvt: '+ Ventas en efectivo', efvtEsperado: 'Efectivo esperado en caja',
      cuadrada: 'Caja cuadrada', sobrante: 'Sobrante', faltante: 'Faltante',
      corteConfirm: 'Se archivará el día, se reiniciará el historial de eventos y la caja quedará lista para el siguiente turno. ¿Confirmas el corte?', siCerrar: 'Sí, cerrar caja', cancel: 'Cancelar', cerrarCaja: '🔒 Cerrar caja · Corte Z',
      cortesHist: 'Cortes del historial', sinCortes: 'Aún no has hecho ningún corte de caja.', cerradoPor: 'Cerrado por', ticketsWord: 'tickets',
    },
    member: {
      cobradoHoy: 'Cobrado hoy', mesasCobradas: 'Mesas cobradas', ticketProm: 'Ticket promedio', comensales: 'Comensales', platosEntregados: 'Platos entregados', cobrosTurno: 'Cobros del turno', items: 'ítems',
      comandasDesp: 'Comandas despachadas', platosPrep: 'Platos preparados', coccionProm: 'Cocción promedio', esperaProm: 'Espera promedio', comandaLenta: 'Comanda más lenta', platosDespHead: 'Platos despachados · tiempo de cocción', espera: 'espera',
      rondasServ: 'Rondas servidas', bebidasPrep: 'Bebidas preparadas', prepProm: 'Preparación promedio', rondaLenta: 'Ronda más lenta', rondasHead: 'Rondas servidas · tiempo de preparación', bebidas: 'bebidas',
    },
    fin: {
      ingresos: 'Ingresos del día', ticketsCobrados: 'tickets cobrados', gastos: 'Gastos del día', registros: 'registros', ganancia: 'Ganancia neta', margen: 'margen',
      registrarGasto: 'Registrar gasto', registrarSub: 'Insumos, sueldos, servicios, proveedores — todo lo que sale de caja.', conceptoPh: 'Concepto — ej: Carne res 10kg, Sueldo mesero…', agregarGasto: 'Agregar gasto', gastosHoy: 'Gastos de hoy', sinGastos: 'Sin gastos registrados. Agrega el primero arriba.', eliminar: 'Eliminar',
      gastosCategoria: 'Gastos por categoría', sinDesglosar: 'Aún sin gastos para desglosar.', inversion: 'Inversión y recuperación', inversionSub: 'Registra tu inversión inicial para seguir cuánto has recuperado con la ganancia de hoy.', inversionInicial: 'Inversión inicial (USD)', recuperado: 'Recuperado con la ganancia de hoy',
    },
    rend: {
      empty1: 'Aún sin actividad registrada', empty2: 'A medida que cocina, barra y meseros trabajan, verás su rendimiento aquí.', despachados: 'despachados', comandas: 'comandas', prepProm: 'prep. prom.',
      meseros: 'Meseros y mesas atendidas', meserosSub: 'Qué mesas cerró cada mesero hoy y cuánto facturó.', sinMesas: 'Aún sin mesas cobradas hoy.', actividad: 'Actividad por empleado', acciones: 'acciones',
      mesa: 'mesa', mesas: 'mesas', comensales: 'comensales',
    },
    minWord: 'min',
  },
  en: {
    numLocale: 'en-US', guest: 'Guest', orderWord: 'Order', tableWord: 'Table', personWord: 'guests',
    roleMeta: { admin: 'Administrator', chef: 'Head chef', bartender: 'Bartender', mesero: 'Server' },
    roleCard: { admin: 'Admin', chef: 'Chef', bartender: 'Bartender', mesero: 'Server' },
    statusLabels: { nuevo: 'New', preparando: 'In progress', listo: 'Ready', entregado: 'Delivered' },
    modeLabels: { 'En mesa': 'Dine-in', 'Para llevar': 'Takeaway', 'Delivery': 'Delivery' },
    pay: { Efectivo: 'Cash', Tarjeta: 'Card', QR: 'QR' },
    expCatLabels: { Insumos: 'Supplies', Sueldos: 'Payroll', Servicios: 'Utilities', Proveedores: 'Vendors', Otros: 'Other' },
    menuCatLabels: { 'Platos bolivianos': 'Bolivian dishes', 'Parrilla': 'Grill', 'Entrantes': 'Starters', 'Postres': 'Desserts', 'Cócteles': 'Cocktails', 'Cervezas': 'Beers', 'Vinos': 'Wines', 'Sin alcohol': 'Non-alcoholic', 'Bar': 'Bar' },
    zoneLabels: { 'Salón principal': 'Main hall', 'Terraza': 'Terrace', 'Barra': 'Bar', 'Reservado': 'Private room' },
    resDate: { 'Hoy': 'Today', 'Mañana': 'Tomorrow' },
    loginErr: 'Incorrect email or password',
    recallDefault: 'Sent back to fix',
    login: {
      kicker: 'Operations panel', headline: 'The pulse of the restaurant, in one place.',
      sub: 'Kitchen, bar, floor and management — orders and reservations in real time from the moment the guest sends them.',
      statRoles: 'operational roles', statSync: 'sync', brandTag: 'Panel',
      title: 'Sign in', intro: 'Sign in with your staff account.',
      emailLabel: 'Email', passLabel: 'Password', emailPh: 'youremail@brasa.bo',
      enterBtn: 'Enter the panel', quickAccess: 'Quick demo access', passDemo: 'Demo password:',
    },
    live: 'Live', refresh: '↻ Refresh', logoutTitle: 'Sign out', panelWord: 'Panel',
    nav: { resumen: 'Overview', operaciones: 'Operations', caja: 'Cash', finanzas: 'Finances', rendimiento: 'Performance', reservas: 'Reservations', menu: 'Menu', equipo: 'Team', cocina: 'Kitchen', historial: 'History', barra: 'Bar', pedidos: 'Orders', mesas: 'Tables', disponibilidad: 'Availability' },
    titles: {
      resumen: ['Overview', "Today's service at a glance"],
      cocina: ['Kitchen line', 'Received → In progress → Ready · advance each ticket with one tap'],
      barra: ['Bar', 'Received → In progress → Ready · advance each round with one tap'],
      histc: ['Kitchen history', 'Tickets fired today · tap Recover to send one back to the line'],
      histb: ['Bar history', 'Rounds served today · tap Recover to send one back to the bar'],
      histm: ['My history', 'Checks charged this shift'],
      caja: ['Cash count', 'Cash reconciliation and end-of-day close'],
      rendimiento: ['Performance', 'Kitchen, bar and floor control'],
      reservas: ['Reservations', 'Guest reservations'],
      mesas: ['Tables', 'Floor status'],
      menu: ['Menu', 'Dish availability'],
      equipo: ['Team', 'Restaurant staff'],
    },
    titleKanban: ['Operations monitor', 'The whole service live — you supervise, you don’t operate'],
    titleMesero: ['My tables', 'Serving and charging by check'],
    menuTitles: {
      bartender: ['Bar list', 'Availability of drinks and cocktails'],
      chef: ['Kitchen list', 'Dish availability'],
      mesero: ['Availability', 'What not to offer: sold out and running low'],
      admin: ['Menu', 'Menu availability'],
    },
    kpi: {
      ventas: "Today's sales", pedidos: 'orders', activos: 'Active orders', enPrep: 'in progress',
      ticket: 'Average ticket', porPedido: 'per order', reservas: 'Reservations', proximas: 'upcoming',
      ocupacion: 'Occupancy', mesasPct: '% tables', clientes: 'Customers', registrados: 'registered',
      canceladas: 'Canceled', hoy: 'today',
    },
    resumen: { recientes: 'Recent orders', ultimos: 'Last', noOrders: 'No orders yet. When a guest orders, it will appear here live.', topDishes: 'Top dishes', noTop: 'No data yet.', ventasCanal: 'Sales by channel', cocinaBarra: 'Kitchen vs Bar', platos: 'dishes' },
    station: { cocina: 'Kitchen', barra: 'Bar', salon: 'Floor' },
    mon: {
      enCola: 'queued', preparando: 'in progress', listo: 'ready', masAntigua: 'oldest', flujo: 'Live flow', soloLectura: 'read only',
      sinComandas: 'No active tickets right now.', atencion: 'Needs your attention', bajoControl: 'All under control', sinExceso: 'No ticket is over its target time.',
      tranquila: 'Quiet', retrasada: 'Behind', cargada: 'Loaded', alDia: 'On track', unassigned: 'Unassigned',
      stageEnCola: 'Queued', stagePrep: 'In progress', stageListo: 'Ready · unserved',
      kActivas: 'Active tickets', kCocina: 'In kitchen', kBarra: 'At the bar', kListo: 'Ready unserved', kAlertas: 'Alerts',
      stBarra: 'Bar', stMix: 'Kitchen + Bar', stCocina: 'Kitchen',
      lleva: 'has been', minEn: 'min in', listoSinServir: 'ready and unserved for', feedCocinaBarra: 'kitchen and bar',
    },
    kds: {
      recibido: 'Received', enPrep: 'In progress', listoServir: 'Ready · to serve', cancelado: 'Canceled',
      capCola: 'queued', capPrep: 'in progress', capListo: 'ready',
      readyIn: 'ready in', aceptar: 'Accept →', marcarListo: 'Mark ready ✓',
      regresarRecibido: '↩ Back to Received', regresarPrep: '↩ Back to in progress',
      cancelHint: 'Cancel ticket', motivoIntro: '— note the reason for the team:', motivoPh: 'E.g. wrong doneness, fix the side…', regresar: 'Send ticket back', cancel: 'Cancel',
      cancelConfirm: 'Cancel this ticket? It won’t be prepared.', siCancelar: 'Yes, cancel', no: 'No', cancelLink: 'Cancel ticket',
      canceladoBadge: 'CANCELED', canceladoPor: 'Canceled by', empty1: 'Kitchen all caught up', empty2: 'No pending tickets. New ones land in the Received column.',
    },
    mesero: {
      noOfrecer: '⚠ Don’t offer', sinServicios: 'No active checks', sinServicios2: 'Here you’ll see each table: when to pick it up and when to charge it.',
      decisionIntro: 'Some dishes are ready and others are still in the kitchen.', preguntaComensal: 'Ask the guest:', servirListo: 'Serve what’s ready now', esperarTodo: 'Wait for everything',
      holdMsg: 'Waiting for the kitchen to finish — it all goes out together', servirYa: 'serve now →',
      servirListos: 'Serve ready ✓', entregarRepartidor: 'Hand to courier ✓', entregarCliente: 'Hand to guest ✓',
      cobrarMesa: 'Charge table →', cobrarPedido: 'Charge order →', cuentaMesa: 'Table check', totalPedido: 'Order total',
      dividido: 'split:', ea: 'ea.', recoger: 'Pick up and serve', porCobrar: 'Served · to charge', enPrep: 'In progress…',
      servida: 'served', entregada: 'delivered', cobrar: 'Charge', comoPaga: 'how do they pay?', cancel: 'Cancel',
      kindDelivery: 'Goes out with the courier for delivery', kindTakeaway: 'The guest picks it up at the counter',
      servido: 'served', entregadoBadge: 'served ✓', servirBadge: 'serve ✓', preparandoEn: 'in progress ·', enEstacion: 'in',
      chipReady: (n) => n + ' ready', chipKitchen: (n) => n + ' in kitchen', chipServed: (n) => n + ' served',
      countBar: (n) => n + (n === 1 ? ' drink' : ' drinks'),
    },
    reservas: { cliente: 'Guest', fechaHora: 'Date · time', personas: 'Guests', mesa: 'Table', codigo: 'Code', empty: 'No reservations on file yet.' },
    mesas: { platos: 'Dishes', bebidas: 'Drinks', sinBebidas: 'No drinks', cuentaMesa: 'Table check', libres: 'free', ocupadas: 'taken', porEntregar: 'to serve', todoEntregado: 'All served', pend: 'pend.', servida: 'Served', reservada: 'Reserved', libre: 'Free', entregado: 'Served ✓', listoServir: 'Ready · serve', enBarra: 'At the bar', enCocina: 'In kitchen' },
    menu: { categoria: 'Category', precio: 'Price', disponibilidad: 'Availability', limitar: 'Limit #', marcarAgotado: 'Mark sold out', agotar: 'Sold out', disponible: 'Available', reponer: 'Restock', agotado: 'Sold out', quedan: 'Left:', plato: 'Dish', trago: 'Drink / beverage', barraTag: '🍸 Bar', cocinaTag: '👨‍🍳 Kitchen' },
    equipo: { tocaIntro1: 'Tap a team member', tocaIntro2: 'to see their shift performance — how much each server charged, the chef’s kitchen times and the bar rounds.', desempenoHoy: 'today’s performance', sinActividad: 'No activity logged today.' },
    histc: { intro1: 'Tickets you already fired today.', recuperarWord: 'Recover', intro2: 'if you marked one ready by mistake — it goes back to the kitchen line as “In progress”.', comandasDesp: 'Tickets fired', platosDesp: 'Dishes fired', esperaMedia: 'Avg wait', coccionMedia: 'Avg cook time', empty1: 'You haven’t fired any dishes today', empty2: 'Every ticket you mark ready will show up here.', espero: 'waited', coccion: 'cook', platos: 'dishes', recuperar: '↩️ Recover' },
    histb: { intro1: 'Rounds you already served today.', recuperarWord: 'Recover', intro2: 'if you marked one ready by mistake — it goes back to the bar as “In progress”.', rondasServ: 'Rounds served', bebidasServ: 'Drinks served', prepMedia: 'Avg prep', empty1: 'You haven’t served any drinks today', bebidas: 'drinks', recuperar: '↩️ Recover' },
    histm: { mesasCobradas: 'Tables charged', cobrado: 'Charged', empty: 'No activity this shift', platos: 'Dishes', bebidas: 'Drinks', comensales: 'guests' },
    caja: {
      ventasCobradas: 'Sales charged', tickets: 'Tickets', ticketProm: 'Average ticket', propina: 'Est. 10% tip',
      ventasMetodo: 'Sales by payment method', arqueoEfectivo: 'Cash reconciliation', fondoInicial: 'Starting float (USD)', efectivoContado: 'Cash counted (USD)',
      fondoRow: 'Starting float', ventasEfvt: '+ Cash sales', efvtEsperado: 'Cash expected in drawer',
      cuadrada: 'Drawer balances', sobrante: 'Over', faltante: 'Short',
      corteConfirm: 'The day will be archived, the event history will reset and the drawer will be ready for the next shift. Confirm the close?', siCerrar: 'Yes, close the drawer', cancel: 'Cancel', cerrarCaja: '🔒 Close drawer · Z-report',
      cortesHist: 'Close history', sinCortes: 'You haven’t done any cash close yet.', cerradoPor: 'Closed by', ticketsWord: 'tickets',
    },
    member: {
      cobradoHoy: 'Charged today', mesasCobradas: 'Tables charged', ticketProm: 'Average ticket', comensales: 'Guests', platosEntregados: 'Dishes served', cobrosTurno: 'Shift charges', items: 'items',
      comandasDesp: 'Tickets fired', platosPrep: 'Dishes prepared', coccionProm: 'Avg cook time', esperaProm: 'Avg wait', comandaLenta: 'Slowest ticket', platosDespHead: 'Dishes fired · cook time', espera: 'waited',
      rondasServ: 'Rounds served', bebidasPrep: 'Drinks prepared', prepProm: 'Avg prep', rondaLenta: 'Slowest round', rondasHead: 'Rounds served · prep time', bebidas: 'drinks',
    },
    fin: {
      ingresos: "Today's revenue", ticketsCobrados: 'tickets charged', gastos: "Today's expenses", registros: 'entries', ganancia: 'Net profit', margen: 'margin',
      registrarGasto: 'Log expense', registrarSub: 'Supplies, payroll, utilities, vendors — everything that leaves the drawer.', conceptoPh: 'Item — e.g. Beef 10kg, Server payroll…', agregarGasto: 'Add expense', gastosHoy: "Today's expenses", sinGastos: 'No expenses logged. Add the first one above.', eliminar: 'Delete',
      gastosCategoria: 'Expenses by category', sinDesglosar: 'No expenses to break down yet.', inversion: 'Investment and payback', inversionSub: 'Log your initial investment to track how much you’ve recovered with today’s profit.', inversionInicial: 'Initial investment (USD)', recuperado: 'Recovered with today’s profit',
    },
    rend: {
      empty1: 'No activity logged yet', empty2: 'As kitchen, bar and servers work, you’ll see their performance here.', despachados: 'fired', comandas: 'tickets', prepProm: 'avg prep',
      meseros: 'Servers and tables handled', meserosSub: 'Which tables each server closed today and how much they billed.', sinMesas: 'No tables charged today yet.', actividad: 'Activity by employee', acciones: 'actions',
      mesa: 'table', mesas: 'tables', comensales: 'guests',
    },
    minWord: 'min',
  },
}

/* ---------- tipos ---------- */
interface Item { name: string; qty: number; cat?: string; price?: number; note?: string }
interface OrderNote { text: string; by: string; time: string; from: string }
interface Order {
  code: string; customer?: string; guest?: string; mode?: string; table?: string
  party?: number; total?: number; status?: string; items?: Item[]; time?: string; ts?: number
  note?: OrderNote | null; readyAt?: number | null; deliveredAt?: number
  acceptedAt?: number | null; acceptedBy?: string; cookId?: string
  canceledAt?: number; canceledBy?: string; closed?: boolean; repeat?: boolean
  off?: number // demo: minutos "de antigüedad" con que se sembró; se re-ancla en cada carga
}
interface Reservation { code: string; customer?: string; date?: string; time?: string; party?: number; table?: string; zone?: string; status?: string }
interface EventItem { qty: number; name: string; cat?: string; price?: number; guest?: string }
interface EventRec {
  type: string; code?: string; staff?: string; role?: string; ts?: number; time?: string
  items?: EventItem[]; count?: number; wait?: number; prep?: number; total?: number
  customer?: string; mode?: string; method?: string; guests?: number; party?: number; table?: string
  from?: string; to?: string; note?: string; cookId?: string; placedAt?: number; acceptedAt?: number; readyAt?: number
}
interface Corte { id: string; fecha: string; hora: string; cerradoPor: string; cobrado: number; tickets: number; byM: Record<string, number>; fondo: number; contado: number | null; diff: number | null }
interface Expense { id: string; concepto: string; monto: number; cat: string; ts: number; by: string }
interface StaffMember { name: string; role: string; pass: string }
type StaffMap = Record<string, StaffMember>
interface Staff { email?: string; name: string; role: string; pass?: string }
interface Zone { name: string; tables: string[] }
interface MenuSeedItem { name: string; cat: string; price: number }

interface State {
  staff: Staff | null; view: string; liEmail: string; liPass: string; loginErr: string
  orders: Order[]; reservations: Reservation[]; usersCount: number
  unavail: Record<string, boolean>; stock: Record<string, number>; tick: number; channel: string
  itemStage: Record<string, number>; events: EventRec[]; caja: { fondo: number; contado: string }
  tenderFor: string | null; cortes: Corte[]; corteConfirm: boolean; cancelFor: string | null
  now: number; recallFor: string | null; recallNote: string; histOpen: string | null
  tableSel: string | null; memberSel: string | null; serveModes: Record<string, string>
  delivered: Record<string, number>; expenses: Expense[]; inversion: number
  expConcepto: string; expMonto: string; expCat: string
}

/* ---------- semillas / metadatos ---------- */
const staffSeed: StaffMap = {
  'admin@brasa.bo': { name: 'Valeria Rojas', role: 'admin', pass: '1234' },
  'chef@brasa.bo': { name: 'Marco Delgado', role: 'chef', pass: '1234' },
  'bar@brasa.bo': { name: 'Lucía Ferrufino', role: 'bartender', pass: '1234' },
  'mesero@brasa.bo': { name: 'Diego Salas', role: 'mesero', pass: '1234' },
}
const statusMeta: Record<string, { color: string; bg: string }> = {
  nuevo: { color: '#e8934f', bg: 'rgba(232,147,79,.16)' },
  preparando: { color: '#e0b34f', bg: 'rgba(224,179,79,.16)' },
  listo: { color: '#6bbf7a', bg: 'rgba(107,191,122,.18)' },
  entregado: { color: '#8aa0b0', bg: 'rgba(138,160,176,.16)' },
}
const ORDER: string[] = ['nuevo', 'preparando', 'listo', 'entregado']
const menuSeed: MenuSeedItem[] = [
  { name: 'Silpancho cochabambino', cat: 'Platos bolivianos', price: 55 }, { name: 'Pique macho', cat: 'Platos bolivianos', price: 90 },
  { name: 'Chicharrón de cerdo', cat: 'Platos bolivianos', price: 85 }, { name: 'Fricasé cochabambino', cat: 'Platos bolivianos', price: 60 },
  { name: 'Costillar de cordero', cat: 'Parrilla', price: 75 }, { name: 'Churrasco de lomo', cat: 'Parrilla', price: 95 },
  { name: 'Parrillada mixta', cat: 'Parrilla', price: 180 }, { name: 'Trucha a la plancha', cat: 'Parrilla', price: 70 },
  { name: 'Salteñas cochabambinas', cat: 'Entrantes', price: 18 }, { name: 'Anticucho de corazón', cat: 'Entrantes', price: 38 },
  { name: 'Leche asada', cat: 'Postres', price: 22 }, { name: 'Flan de la casa', cat: 'Postres', price: 20 },
  { name: 'Chuflay', cat: 'Cócteles', price: 38 }, { name: 'Mojito', cat: 'Cócteles', price: 40 }, { name: 'Yungueño', cat: 'Cócteles', price: 42 }, { name: 'Singani sour', cat: 'Cócteles', price: 45 },
  { name: 'Caipirinha', cat: 'Cócteles', price: 42 }, { name: 'Cuba libre', cat: 'Cócteles', price: 35 }, { name: 'Piña colada', cat: 'Cócteles', price: 44 }, { name: 'Daiquiri de maracuyá', cat: 'Cócteles', price: 44 },
  { name: 'Margarita', cat: 'Cócteles', price: 45 }, { name: 'Tequila sunrise', cat: 'Cócteles', price: 45 }, { name: 'Poncho paceño', cat: 'Cócteles', price: 40 }, { name: 'Sangría (copa)', cat: 'Cócteles', price: 38 },
  { name: 'Cerveza Paceña', cat: 'Cervezas', price: 22 }, { name: 'Cerveza Huari', cat: 'Cervezas', price: 25 }, { name: 'Cerveza Cusqueña', cat: 'Cervezas', price: 28 }, { name: 'Corona', cat: 'Cervezas', price: 32 }, { name: 'Stella Artois', cat: 'Cervezas', price: 32 },
  { name: 'Copa vino tinto', cat: 'Vinos', price: 35 }, { name: 'Copa vino blanco', cat: 'Vinos', price: 35 }, { name: 'Singani Casa Real (copa)', cat: 'Vinos', price: 40 },
  { name: 'Chicha morada', cat: 'Sin alcohol', price: 15 }, { name: 'Mocochinchi', cat: 'Sin alcohol', price: 12 }, { name: 'Limonada', cat: 'Sin alcohol', price: 14 }, { name: 'Jugo de naranja', cat: 'Sin alcohol', price: 16 },
  { name: 'Coca-Cola', cat: 'Sin alcohol', price: 12 }, { name: 'Sprite', cat: 'Sin alcohol', price: 12 }, { name: 'Agua sin gas', cat: 'Sin alcohol', price: 10 }, { name: 'Agua con gas', cat: 'Sin alcohol', price: 12 },
  { name: 'Café americano', cat: 'Sin alcohol', price: 14 }, { name: 'Té', cat: 'Sin alcohol', price: 10 },
]
const barCats: string[] = ['Bar', 'Cócteles', 'Cervezas', 'Vinos', 'Sin alcohol']
const zonesSeed: Zone[] = [
  { name: 'Salón principal', tables: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8'] },
  { name: 'Terraza', tables: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'] },
  { name: 'Barra', tables: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'] },
  { name: 'Reservado', tables: ['P1', 'P2'] },
]

/* ---------- helpers puros (SSR-safe: localStorage envuelto en try/catch) ---------- */
function readArr<T = unknown>(k: string): T[] { try { return JSON.parse(localStorage.getItem(k) || '[]') } catch { return [] } }
function readObj<T = unknown>(k: string): Record<string, T> { try { return JSON.parse(localStorage.getItem(k) || '{}') } catch { return {} } }
function staffOf(): StaffMap { const s = readObj<StaffMember>('brasa_staff'); return Object.keys(s).length ? s : staffSeed }
function clock(): string { const d = new Date(); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) }
function hhmm(ts?: number): string { if (!ts) return ''; const d = new Date(ts); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) }
function fmtDur(m: number): string { m = Math.max(0, Math.round(m || 0)); if (m < 60) return m + ' min'; const h = Math.floor(m / 60), r = m % 60; return h + 'h ' + ('0' + r).slice(-2) + 'm' }
function deriveStage(status: string): number { return (status === 'listo' || status === 'entregado') ? 2 : (status === 'preparando' ? 1 : 0) }
function seatOf(code: string, idx: number, party: number): number { let h = 0; const s = (code || '') + '#' + idx; for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) >>> 0 } return (h % Math.max(1, party || 1)) + 1 }
function stages(): Record<string, number> { try { return JSON.parse(localStorage.getItem('brasa_item_stage') || '{}') || {} } catch { return {} } }
function saveStages(m: Record<string, number>): void { try { localStorage.setItem('brasa_item_stage', JSON.stringify(m)) } catch { /* noop */ } }
function ensureStages(m: Record<string, number>, o: Order): void { (o.items || []).forEach((it, i) => { const k = o.code + '#' + i; if (m[k] == null) m[k] = deriveStage(o.status || 'nuevo') }) }
function syncStatus(o: Order, m: Record<string, number>): string {
  const st = (o.items || []).map((it, i) => m[o.code + '#' + i] == null ? deriveStage(o.status || 'nuevo') : m[o.code + '#' + i])
  const allDone = st.length > 0 && st.every(s => s === 2); const anyStarted = st.some(s => s >= 1)
  return allDone ? 'listo' : (anyStarted ? 'preparando' : 'nuevo')
}
interface TimerMeta { label: string; color: string; bg: string; urgent: boolean }
function elapsedMeta(ts?: number): TimerMeta {
  const min = Math.max(0, Math.floor((Date.now() - (ts || Date.now())) / 60000))
  let color = '#6bbf7a', bg = 'rgba(107,191,122,.16)', urgent = false
  if (min >= 12) { color = '#e5544a'; bg = 'rgba(229,84,74,.16)'; urgent = true } else if (min >= 6) { color = '#e0b34f'; bg = 'rgba(224,179,79,.16)' }
  return { label: min + '′', color, bg, urgent }
}
function liveMeta(ts: number | undefined, endTs: number | null | undefined, nowState: number): TimerMeta {
  const now = endTs || nowState || Date.now()
  const sec = Math.max(0, Math.floor((now - (ts || now)) / 1000)); const mm = Math.floor(sec / 60), ss = sec % 60
  const label = mm + ':' + ('0' + ss).slice(-2); const min = Math.floor(sec / 60)
  let color = '#6bbf7a', bg = 'rgba(107,191,122,.16)', urgent = false
  if (min >= 12) { color = '#e5544a'; bg = 'rgba(229,84,74,.16)'; urgent = true } else if (min >= 6) { color = '#e0b34f'; bg = 'rgba(224,179,79,.16)' }
  return { label, color, bg, urgent }
}
function defaultView(role: string): string { return role === 'chef' ? 'cocina' : role === 'bartender' ? 'barra' : role === 'mesero' ? 'board' : 'resumen' }

/* ---------- seeding (localStorage) ---------- */
function seedStaff(): void { try { if (!localStorage.getItem('brasa_staff')) localStorage.setItem('brasa_staff', JSON.stringify(staffSeed)) } catch { /* noop */ } }
function seedDemo(): void {
  try {
    const SEEDV = 'v5'
    // Demo: re-siembra con timestamps frescos si los datos tienen > 8 h, para que
    // los timers de mesa no queden "colgados" mostrando cientos de horas.
    const seedTs = Number(localStorage.getItem('brasa_seed_ts') || 0)
    const stale = Date.now() - seedTs > 8 * 60 * 60 * 1000
    if (localStorage.getItem('brasa_seed_v') !== SEEDV || stale) {
      const mn = (m: number) => Date.now() - m * 60000
      const hm = (m: number) => { const d = new Date(Date.now() - m * 60000); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) }
      const O = (m: number, rest: Partial<Order>): Order => ({ time: hm(m), ts: mn(m), off: m, ...rest } as Order)
      const seedOrders: Order[] = [
        O(7, { code: 'PD-3001', customer: 'Familia Vargas', guest: 'Camila', mode: 'En mesa', table: 'M3', party: 4, total: 95, status: 'listo', items: [{ name: 'Silpancho cochabambino', qty: 1, cat: 'cocina', price: 60 }, { name: 'Mojito', qty: 1, cat: 'bar', price: 35 }] }),
        O(7, { code: 'PD-3002', customer: 'Familia Vargas', guest: 'Rodrigo', mode: 'En mesa', table: 'M3', party: 4, total: 150, status: 'preparando', items: [{ name: 'Parrillada mixta', qty: 1, cat: 'cocina', price: 120 }, { name: 'Paceña', qty: 1, cat: 'bar', price: 30 }] }),
        O(6, { code: 'PD-3003', customer: 'Familia Vargas', guest: 'Lucía', mode: 'En mesa', table: 'M3', party: 4, total: 95, status: 'preparando', items: [{ name: 'Trucha a la plancha', qty: 1, cat: 'cocina', price: 75, note: 'sin mantequilla' }, { name: 'Limonada de la casa', qty: 1, cat: 'bar', price: 20 }] }),
        O(6, { code: 'PD-3004', customer: 'Familia Vargas', guest: 'Tomás (niño)', mode: 'En mesa', table: 'M3', party: 4, total: 55, status: 'nuevo', items: [{ name: 'Pollo a la parrilla', qty: 1, cat: 'cocina', price: 45, note: 'porción pequeña' }, { name: 'Refresco de mocochinchi', qty: 1, cat: 'bar', price: 10 }] }),
        O(3, { code: 'PD-3010', customer: 'Pedro Gutiérrez', guest: 'Pedro', mode: 'En mesa', table: 'T5', party: 2, total: 210, status: 'nuevo', items: [{ name: 'Parrillada mixta', qty: 1, cat: 'cocina', price: 120 }, { name: 'Chicharrón de cerdo', qty: 1, cat: 'cocina', price: 90 }, { name: 'Paceña', qty: 2, cat: 'bar', price: 30 }] }),
        O(9, { code: 'PD-3012', customer: 'Ana Suárez', guest: 'Ana', mode: 'En mesa', table: 'B2', party: 2, total: 158, status: 'preparando', items: [{ name: 'Anticucho de corazón', qty: 1, cat: 'cocina', price: 38 }, { name: 'Chuflay', qty: 2, cat: 'bar', price: 38 }, { name: 'Mojito', qty: 1, cat: 'bar', price: 44 }] }),
        O(2, { code: 'PD-3014', customer: 'Daniela Roca', guest: 'Daniela', mode: 'En mesa', table: 'M6', party: 2, total: 170, status: 'nuevo', items: [{ name: 'Pique macho', qty: 1, cat: 'cocina', price: 90 }, { name: 'Salteñas cochabambinas', qty: 2, cat: 'cocina', price: 18 }, { name: 'Chicha morada', qty: 2, cat: 'bar', price: 22 }] }),
        O(4, { code: 'PD-3020', customer: 'Sofía Careaga', guest: 'Sofía', mode: 'Delivery', total: 135, status: 'preparando', items: [{ name: 'Chuleta de cerdo a la BBQ', qty: 2, cat: 'cocina', price: 55 }, { name: 'Coca-Cola 2L', qty: 1, cat: 'bar', price: 25 }] }),
        O(5, { code: 'PD-3021', customer: 'Jorge Ríos', guest: 'Jorge', mode: 'Para llevar', total: 78, status: 'nuevo', items: [{ name: 'Pique macho', qty: 1, cat: 'cocina', price: 90 }, { name: 'Chuflay', qty: 1, cat: 'bar', price: 38 }] }),
        O(16, { code: 'PD-3022', customer: 'Marcelo Vaca', guest: 'Marcelo', mode: 'Para llevar', total: 90, status: 'entregado', items: [{ name: 'Pique macho', qty: 1, cat: 'cocina', price: 90 }] }),
      ]
      // Preserva pedidos "vivos" (los que un cliente agregó vía el sitio: sin `off` y con
      // código no-semilla) para no borrarlos al re-sembrar por cambio de versión.
      let liveKeep: Order[] = []
      try {
        const prev = JSON.parse(localStorage.getItem('brasa_orders') || '[]') as Order[]
        if (Array.isArray(prev)) { const seedCodes = new Set(seedOrders.map(o => o.code)); liveKeep = prev.filter(o => o && typeof o.off !== 'number' && !seedCodes.has(o.code)) }
      } catch { /* noop */ }
      localStorage.setItem('brasa_orders', JSON.stringify(liveKeep.concat(seedOrders)))
      try { localStorage.removeItem('brasa_item_stage'); localStorage.removeItem('brasa_serve_modes') } catch { /* noop */ }
      localStorage.setItem('brasa_seed_v', SEEDV)
      localStorage.setItem('brasa_seed_ts', String(Date.now()))
    }
    if (!localStorage.getItem('brasa_reservations')) {
      localStorage.setItem('brasa_reservations', JSON.stringify([
        { code: 'BR-4835', customer: 'Familia Rojas', date: 'Mañana', time: '13:30', party: 8, table: 'P1', zone: 'Reservado', status: 'confirmada' },
        { code: 'BR-4830', customer: 'Jorge Mendoza', date: 'Hoy', time: '21:30', party: 2, table: 'T2', zone: 'Terraza', status: 'confirmada' },
        { code: 'BR-4821', customer: 'Camila Vargas', date: 'Hoy', time: '21:00', party: 4, table: 'M3', zone: 'Salón principal', status: 'confirmada' },
      ]))
    }
  } catch { /* noop */ }
}

/* Demo: re-ancla los timestamps de las comandas sembradas (las que llevan `off`) a
   `ahora − off` en cada carga, para que el tablero SIEMPRE se vea "en vivo" (timers de
   pocos minutos) por más tiempo que la demo haya estado sin abrirse. Las comandas reales
   añadidas por el cliente no llevan `off`, así que conservan su hora real. */
function reanchorSeed(): void {
  try {
    const raw = localStorage.getItem('brasa_orders'); if (!raw) return
    const arr = JSON.parse(raw) as Order[]; if (!Array.isArray(arr)) return
    const now = Date.now(); let changed = false
    for (const o of arr) {
      if (typeof o.off !== 'number') continue
      const ts = now - o.off * 60000
      if (o.ts === ts) continue
      const delta = ts - (o.ts || ts)
      if (typeof o.readyAt === 'number') o.readyAt += delta
      if (typeof o.acceptedAt === 'number') o.acceptedAt += delta
      o.ts = ts
      const d = new Date(ts); o.time = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2)
      changed = true
    }
    if (changed) localStorage.setItem('brasa_orders', JSON.stringify(arr))
  } catch { /* noop */ }
}

function makeInitialState(): State {
  return {
    staff: null, view: '', liEmail: '', liPass: '', loginErr: '', orders: [], reservations: [], usersCount: 0,
    unavail: {}, stock: { Chuflay: 3, 'Trucha a la plancha': 0 }, tick: 0, channel: 'all', itemStage: {}, events: [],
    caja: { fondo: 500, contado: '' }, tenderFor: null, cortes: [], corteConfirm: false, cancelFor: null, now: Date.now(),
    recallFor: null, recallNote: '', histOpen: null, tableSel: null, memberSel: null, serveModes: {}, delivered: {},
    expenses: [], inversion: 0, expConcepto: '', expMonto: '', expCat: 'Insumos',
  }
}

type ChangeEv<T = HTMLInputElement> = { target: { value: string } } & React.ChangeEvent<T>

export default function BrasaPanelClient({ lang }: { lang: DemoLang }) {
  const c = CONTENT[lang]
  const es = lang === 'es'
  // Precios siempre en USD (los números base del menú se convierten al formatear, factor fijo).
  const money = (n: number): string => '$' + Math.round(n / 6.9).toLocaleString('en-US')
  const md = (m?: string): string => (m && c.modeLabels[m]) || m || ''
  const payLabel = (m?: string): string => (m && c.pay[m]) || m || ''
  const [, bump] = useReducer((x: number) => x + 1, 0)
  const [navOpen, setNavOpen] = useState(false)
  const stateRef = useRef<State>(makeInitialState())

  const setState = (patch: Partial<State> | ((s: State) => Partial<State>)) => {
    const p = typeof patch === 'function' ? patch(stateRef.current) : patch
    stateRef.current = { ...stateRef.current, ...p }
    bump()
  }

  /* ---------- carga / eventos ---------- */
  const load = () => {
    setState({
      orders: readArr<Order>('brasa_orders'), reservations: readArr<Reservation>('brasa_reservations'),
      usersCount: Object.keys(readObj('brasa_users')).length, events: readArr<EventRec>('brasa_events'),
      cortes: readArr<Corte>('brasa_cortes'), tick: stateRef.current.tick + 1,
    })
  }
  const logEvent = (ev: Partial<EventRec>) => { try { const arr = readArr<EventRec>('brasa_events'); arr.unshift({ ...ev, ts: Date.now(), time: clock() } as EventRec); localStorage.setItem('brasa_events', JSON.stringify(arr)) } catch { /* noop */ } load() }
  const refresh = () => { load() }
  const loadFin = () => { try { const ex = JSON.parse(localStorage.getItem('brasa_expenses') || '[]'); const inv = parseInt(localStorage.getItem('brasa_inversion') || '0', 10) || 0; setState({ expenses: Array.isArray(ex) ? ex : [], inversion: inv }) } catch { /* noop */ } }

  /* ---------- sesión ---------- */
  const onLiEmail = (e: ChangeEv) => setState({ liEmail: e.target.value })
  const onLiPass = (e: ChangeEv) => setState({ liPass: e.target.value })
  const doLogin = () => { const em = (stateRef.current.liEmail || '').trim().toLowerCase(); const st = staffOf()[em]; if (!st || st.pass !== stateRef.current.liPass) { setState({ loginErr: c.loginErr }); return } try { localStorage.setItem('brasa_staff_session', em) } catch { /* noop */ } setState({ staff: { email: em, ...st }, view: defaultView(st.role), loginErr: '', liPass: '' }); load() }
  const quick = (em: string) => { const st = staffOf()[em]; if (!st) return; try { localStorage.setItem('brasa_staff_session', em) } catch { /* noop */ } setState({ staff: { email: em, ...st }, view: defaultView(st.role), loginErr: '' }); load() }
  const logout = () => { try { localStorage.removeItem('brasa_staff_session') } catch { /* noop */ } setState({ staff: null, view: '', liEmail: '', liPass: '' }) }
  const go = (v: string) => setState({ view: v })

  /* ---------- órdenes / cocina / barra ---------- */
  const advance = (code: string) => { const orders = readArr<Order>('brasa_orders'); const ix = orders.findIndex(o => o.code === code); if (ix < 0) return; const cur = orders[ix].status || 'nuevo'; const ni = Math.min(ORDER.indexOf(cur) + 1, ORDER.length - 1); orders[ix] = { ...orders[ix], status: ORDER[ni] }; try { localStorage.setItem('brasa_orders', JSON.stringify(orders)) } catch { /* noop */ } load() }
  const setStock = (name: string, val: number | null) => { const s = { ...stateRef.current.stock }; if (val == null) delete s[name]; else s[name] = Math.max(0, val | 0); setState({ stock: s }) }
  const markOut = (name: string) => { setStock(name, 0) }
  const limitStock = (name: string) => { setStock(name, 6) }
  const restock = (name: string) => { setStock(name, null) }
  const stepStock = (name: string, d: number) => { const cur = stateRef.current.stock[name]; const base = (typeof cur === 'number' ? cur : 0); setStock(name, base + d) }
  const setChannel = (c: string) => setState({ channel: c })
  const bumpTo = (code: string, to: string) => { const orders = readArr<Order>('brasa_orders'); const ix = orders.findIndex(o => o.code === code); if (ix < 0) return; const patch: Order = { ...orders[ix], status: to }; if (to === 'listo' && !patch.readyAt) patch.readyAt = Date.now(); if (to === 'entregado' && !patch.deliveredAt) patch.deliveredAt = Date.now(); orders[ix] = patch; try { localStorage.setItem('brasa_orders', JSON.stringify(orders)) } catch { /* noop */ } load() }
  const finishStation = (code: string, station: string) => { const orders = readArr<Order>('brasa_orders'); const ix = orders.findIndex(x => x.code === code); if (ix < 0) return; const o = orders[ix]; const m = stages(); ensureStages(m, o); (o.items || []).forEach((it, i) => { const isBar = (it.cat || 'cocina') === 'bar'; if ((station === 'bar') === isBar) m[code + '#' + i] = 2 }); saveStages(m); const ns = syncStatus(o, m); const patch: Order = { ...o, status: ns }; if (ns === 'listo' && !patch.readyAt) patch.readyAt = Date.now(); if (ns !== 'listo') patch.readyAt = null; orders[ix] = patch; try { localStorage.setItem('brasa_orders', JSON.stringify(orders)) } catch { /* noop */ } load() }
  const logStationDone = (o: Order, station: string) => {
    const nowT = Date.now(); const staff = stateRef.current.staff
    if (station === 'bar') { const items = (o.items || []).filter(i => (i.cat || 'cocina') === 'bar'); if (!items.length) return; const prep = Math.max(0, Math.round((nowT - (o.ts || nowT)) / 60000)); logEvent({ type: 'barra', code: o.code, staff: staff ? staff.name : '', role: 'bartender', items: items.map(i => ({ qty: i.qty, name: i.name })), count: items.reduce((s, i) => s + (i.qty || 1), 0), prep, customer: o.customer || c.guest, mode: o.mode || '' }) }
    else { const items = (o.items || []).filter(i => (i.cat || 'cocina') !== 'bar'); if (!items.length) return; const placed = o.ts || nowT; const accepted = o.acceptedAt || placed; const wait = Math.max(0, Math.round((accepted - placed) / 60000)); const prep = Math.max(0, Math.round((nowT - accepted) / 60000)); logEvent({ type: 'cocina', code: o.code, staff: staff ? staff.name : '', cookId: o.cookId || (staff && staff.email) || '', role: 'chef', items: items.map(i => ({ qty: i.qty, name: i.name })), count: items.reduce((s, i) => s + (i.qty || 1), 0), wait, prep, placedAt: placed, acceptedAt: accepted, readyAt: nowT, customer: o.customer || c.guest, mode: o.mode || '' }) }
  }
  const recallOrder = (code: string) => { const ev = readArr<EventRec>('brasa_events'); for (let i = ev.length - 1; i >= 0; i--) { if ((ev[i].type === 'cocina' || ev[i].type === 'barra') && ev[i].code === code) { ev.splice(i, 1); break } } try { localStorage.setItem('brasa_events', JSON.stringify(ev)) } catch { /* noop */ } const orders = readArr<Order>('brasa_orders'); const ix = orders.findIndex(o => o.code === code); if (ix >= 0) { const o = orders[ix]; const m = stages(); ensureStages(m, o); (o.items || []).forEach((it, i) => { m[code + '#' + i] = 1 }); saveStages(m); orders[ix] = { ...o, status: 'preparando', closed: false, readyAt: null }; try { localStorage.setItem('brasa_orders', JSON.stringify(orders)) } catch { /* noop */ } } load() }
  const closeService = (code: string) => { const orders = readArr<Order>('brasa_orders'); const ix = orders.findIndex(o => o.code === code); if (ix < 0) return; orders[ix] = { ...orders[ix], status: 'entregado', closed: true }; try { localStorage.setItem('brasa_orders', JSON.stringify(orders)) } catch { /* noop */ } load() }
  const stationAccept = (o: Order) => { const staff = stateRef.current.staff; const station = (staff && staff.role === 'bartender') ? 'bar' : 'cocina'; const orders = readArr<Order>('brasa_orders'); const ix = orders.findIndex(x => x.code === o.code); if (ix < 0) return; const m = stages(); ensureStages(m, orders[ix]); (orders[ix].items || []).forEach((it, i) => { const isBar = (it.cat || 'cocina') === 'bar'; if ((station === 'bar') === isBar) { const k = o.code + '#' + i; if ((m[k] || 0) < 1) m[k] = 1 } }); saveStages(m); const extra: Partial<Order> = station === 'cocina' ? { acceptedAt: Date.now(), acceptedBy: staff ? staff.name : '', cookId: (staff && staff.email) || '' } : {}; orders[ix] = { ...orders[ix], status: syncStatus(orders[ix], m), ...extra }; try { localStorage.setItem('brasa_orders', JSON.stringify(orders)) } catch { /* noop */ } load() }
  const askCancel = (code: string) => { setState({ cancelFor: code }) }
  const noCancel = () => setState({ cancelFor: null })
  const askRecall = (code: string) => { setState({ recallFor: code, recallNote: '' }) }
  const noRecall = () => setState({ recallFor: null, recallNote: '' })
  const setRecallNote = (e: ChangeEv<HTMLTextAreaElement>) => setState({ recallNote: e.target.value })
  const doRecall = (o: Order, to: string) => { const orders = readArr<Order>('brasa_orders'); const ix = orders.findIndex(x => x.code === o.code); if (ix < 0) return; const note = (stateRef.current.recallNote || '').trim(); const staff = stateRef.current.staff; const patch: Order = { ...orders[ix], status: to }; if (to === 'nuevo') { patch.acceptedAt = null } patch.note = { text: note || c.recallDefault, by: staff ? staff.name : '', time: clock(), from: orders[ix].status || '' }; orders[ix] = patch; try { localStorage.setItem('brasa_orders', JSON.stringify(orders)) } catch { /* noop */ } logEvent({ type: 'recall', code: o.code, staff: staff ? staff.name : '', role: 'chef', from: o.status, to, note, customer: o.customer || '', mode: o.mode || '' }); setState({ recallFor: null, recallNote: '' }) }
  const cancelOrder = (o: Order) => { const orders = readArr<Order>('brasa_orders'); const ix = orders.findIndex(x => x.code === o.code); if (ix < 0) return; const staff = stateRef.current.staff; orders[ix] = { ...orders[ix], status: 'cancelado', canceledAt: Date.now(), canceledBy: staff ? staff.name : '' }; try { localStorage.setItem('brasa_orders', JSON.stringify(orders)) } catch { /* noop */ } logEvent({ type: 'cancelado', code: o.code, staff: staff ? staff.name : '', role: staff ? staff.role : '', items: (o.items || []).map(i => ({ qty: i.qty, name: i.name })), total: o.total || 0, customer: o.customer || '', mode: o.mode || '' }); setState({ cancelFor: null }) }
  const chefReady = (o: Order) => { logStationDone(o, 'cocina'); finishStation(o.code, 'cocina') }
  const barServe = (o: Order) => { logStationDone(o, 'bar'); finishStation(o.code, 'bar') }
  const stationReady = (o: Order) => { const staff = stateRef.current.staff; if (staff && staff.role === 'bartender') barServe(o); else chefReady(o) }
  const meseroDeliver = (o: Order) => { const staff = stateRef.current.staff; logEvent({ type: 'entrega', code: o.code, staff: staff ? staff.name : '', role: 'mesero', items: (o.items || []).map(i => ({ qty: i.qty, name: i.name })), count: (o.items || []).reduce((s, i) => s + (i.qty || 1), 0), customer: o.customer || c.guest, mode: o.mode || '' }); bumpTo(o.code, 'entregado') }
  const openTender = (code: string) => { setState({ tenderFor: code }) }
  const cancelTender = () => setState({ tenderFor: null })
  const toggleHist = (code: string) => setState(s => ({ histOpen: s.histOpen === code ? null : code }))
  const selectTable = (id: string) => setState(s => ({ tableSel: s.tableSel === id ? null : id }))
  const closeTableDetail = () => setState({ tableSel: null })
  const selectMember = (em: string) => setState(s => ({ memberSel: s.memberSel === em ? null : em }))
  const closeMember = () => setState({ memberSel: null })
  const deliverTable = (os: Order[]) => { (os || []).filter(o => o.status === 'listo').forEach(o => meseroDeliver(o)) }
  const deliverItem = (o: Order, idx: number) => { const key = o.code + '#' + idx; const m = { ...(stateRef.current.delivered || {}) }; m[key] = 1; const allDone = (o.items || []).every((_, i) => m[o.code + '#' + i]); if (allDone) { delete m[o.code + '#' + idx]; (o.items || []).forEach((_, i) => delete m[o.code + '#' + i]); setState({ delivered: m }); try { localStorage.setItem('brasa_delivered', JSON.stringify(m)) } catch { /* noop */ } meseroDeliver(o) } else { setState({ delivered: m }); try { localStorage.setItem('brasa_delivered', JSON.stringify(m)) } catch { /* noop */ } } }
  const setServeMode = (tid: string, mode: string) => { const m = { ...(stateRef.current.serveModes || {}) }; m[tid] = mode; setState({ serveModes: m }); try { localStorage.setItem('brasa_serve_modes', JSON.stringify(m)) } catch { /* noop */ } }
  const chargeTable = (os: Order[], method: string) => { const list = os || []; const total = list.reduce((s, o) => s + (o.total || 0), 0); const guests = [...new Set(list.map(o => o.guest || o.customer || c.guest))]; const first = list[0] || ({} as Order); const label = (first.mode === 'En mesa' && first.table) ? (c.tableWord + ' ' + first.table) : (first.customer || c.guest); const items = list.reduce<EventItem[]>((acc, o) => { (o.items || []).forEach(i => acc.push({ qty: i.qty, name: i.name, cat: i.cat || 'cocina', price: (i.price || 0) * (i.qty || 1), guest: o.guest || o.customer || c.guest })); return acc }, []); const staff = stateRef.current.staff; logEvent({ type: 'cobro', code: (first.table ? ('MESA-' + first.table) : first.code), staff: staff ? staff.name : '', role: 'mesero', method, total, customer: label, mode: first.mode || '', table: first.table || '', party: first.party || guests.length, guests: guests.length, items }); list.forEach(o => closeService(o.code)); setState({ tenderFor: null }) }
  const setFondo = (e: ChangeEv) => { const v = parseInt(e.target.value || '0', 10) || 0; setState({ caja: { ...stateRef.current.caja, fondo: v } }) }
  const setContado = (e: ChangeEv) => { setState({ caja: { ...stateRef.current.caja, contado: e.target.value } }) }
  const setExpConcepto = (e: ChangeEv) => setState({ expConcepto: e.target.value })
  const setExpMonto = (e: ChangeEv) => setState({ expMonto: e.target.value })
  const setExpCat = (c: string) => setState({ expCat: c })
  const setInversion = (e: ChangeEv) => { const v = parseInt(e.target.value || '0', 10) || 0; setState({ inversion: v }); try { localStorage.setItem('brasa_inversion', String(v)) } catch { /* noop */ } }
  const addExpense = () => { const c = (stateRef.current.expConcepto || '').trim(); const m = parseFloat(stateRef.current.expMonto || '0') || 0; if (!c || m <= 0) return; const staff = stateRef.current.staff; const ex: Expense[] = [{ id: 'G' + Date.now(), concepto: c, monto: m, cat: stateRef.current.expCat || 'Insumos', ts: Date.now(), by: staff ? staff.name : '' }, ...(stateRef.current.expenses || [])]; setState({ expenses: ex, expConcepto: '', expMonto: '' }); try { localStorage.setItem('brasa_expenses', JSON.stringify(ex)) } catch { /* noop */ } }
  const removeExpense = (id: string) => { const ex = (stateRef.current.expenses || []).filter(x => x.id !== id); setState({ expenses: ex }); try { localStorage.setItem('brasa_expenses', JSON.stringify(ex)) } catch { /* noop */ } }
  const askCorte = () => setState({ corteConfirm: true })
  const cancelCorte = () => setState({ corteConfirm: false })
  const corteZ = () => { const ev = readArr<EventRec>('brasa_events'); const cobros = ev.filter(e => e.type === 'cobro'); const methods = ['Efectivo', 'Tarjeta', 'QR']; const byM: Record<string, number> = {}; methods.forEach(m => byM[m] = 0); cobros.forEach(e => { byM[e.method || 'Efectivo'] += (e.total || 0) }); const cobrado = methods.reduce((s, m) => s + byM[m], 0); const fondo = stateRef.current.caja.fondo || 0; const cont = parseFloat(stateRef.current.caja.contado); const hasC = !isNaN(cont); const esperado = fondo + byM['Efectivo']; const now = new Date(); const pad = (n: number) => ('0' + n).slice(-2); const corte: Corte = { id: 'Z-' + now.getTime().toString().slice(-6), fecha: pad(now.getDate()) + '/' + pad(now.getMonth() + 1) + '/' + now.getFullYear(), hora: pad(now.getHours()) + ':' + pad(now.getMinutes()), cerradoPor: stateRef.current.staff ? stateRef.current.staff!.name : '—', cobrado, tickets: cobros.length, byM, fondo, contado: hasC ? cont : null, diff: hasC ? (cont - esperado) : null }; const arr = readArr<Corte>('brasa_cortes'); arr.unshift(corte); try { localStorage.setItem('brasa_cortes', JSON.stringify(arr)); localStorage.setItem('brasa_events', '[]') } catch { /* noop */ } setState({ corteConfirm: false, caja: { fondo: stateRef.current.caja.fondo, contado: '' } }); load() }
  const repeatRound = (code: string) => { const orders = readArr<Order>('brasa_orders'); const o = orders.find(x => x.code === code); if (!o) return; const bar = (o.items || []).filter(i => (i.cat || 'cocina') === 'bar'); if (!bar.length) return; const total = bar.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0); const d = new Date(); const nc = 'PD-' + Math.floor(1000 + Math.random() * 9000); orders.unshift({ code: nc, customer: o.customer, mode: o.mode, total: total || o.total, time: ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2), ts: Date.now(), status: 'nuevo', items: bar.map(i => ({ ...i })), repeat: true }); try { localStorage.setItem('brasa_orders', JSON.stringify(orders)) } catch { /* noop */ } load() }

  interface MemberKpi { label: string; value: string; accent: string }
  interface MemberMethod { label: string; icon: string; color: string; value: string }
  interface MemberRow { id: number | undefined; label: string; method: string; total: string; time: string; count: string }
  interface MemberDetail { email: string; name: string; initial: string; role: string; roleLabel: string; close: () => void; kind: string; kpis: MemberKpi[]; methods: MemberMethod[] | null; rows: MemberRow[]; rowsEmpty: boolean; rowsHas: boolean; rowHead: string }
  const buildMember = (email: string): MemberDetail | null => {
    const st = staffOf(); const p = st[email]; if (!p) return null
    const name = p.name, role = p.role; const initial = (name || '?').charAt(0)
    const roleLabel = c.roleMeta[role] || role || ''
    const mine = (stateRef.current.events || []).filter(e => e.staff === name)
    const base = { email, name, initial, role, roleLabel, close: closeMember }
    if (role === 'mesero') {
      const cobros = mine.filter(e => e.type === 'cobro'); const entregas = mine.filter(e => e.type === 'entrega')
      const ventas = cobros.reduce((s, e) => s + (e.total || 0), 0); const tickets = cobros.length; const prom = tickets ? ventas / tickets : 0
      const byM: Record<string, number> = { Efectivo: 0, Tarjeta: 0, QR: 0 }; cobros.forEach(e => { if (byM[e.method || ''] != null) byM[e.method || ''] += (e.total || 0) })
      const comensales = cobros.reduce((s, e) => s + (e.guests || e.party || 1), 0); const platos = entregas.reduce((s, e) => s + (e.count || 0), 0)
      const kpis: MemberKpi[] = [{ label: c.member.cobradoHoy, value: money(ventas), accent: '#6bbf7a' }, { label: c.member.mesasCobradas, value: String(tickets), accent: '#f2e8da' }, { label: c.member.ticketProm, value: money(Math.round(prom)), accent: '#f2e8da' }, { label: c.member.comensales, value: String(comensales), accent: '#f2e8da' }, { label: c.member.platosEntregados, value: String(platos), accent: '#e0b34f' }]
      const methods: MemberMethod[] = ([['Efectivo', '💵', '#6bbf7a'], ['Tarjeta', '💳', '#7ab8e8'], ['QR', '📲', '#c9a0e8']] as const).map(([k, ic, col]) => ({ label: payLabel(k), icon: ic, color: col, value: money(byM[k] || 0) }))
      const rows: MemberRow[] = cobros.map(e => ({ id: e.ts, label: e.customer || c.guest, method: payLabel(e.method) || '—', total: money(e.total || 0), time: e.time || hhmm(e.ts), count: String((e.items || []).reduce((s, i) => s + (i.qty || 1), 0)) + ' ' + c.member.items }))
      return { ...base, kind: 'mesero', kpis, methods, rows, rowsEmpty: rows.length === 0, rowsHas: rows.length > 0, rowHead: c.member.cobrosTurno }
    }
    if (role === 'chef') {
      const cs = mine.filter(e => e.type === 'cocina'); const desp = cs.length; const platos = cs.reduce((s, e) => s + (e.count || 0), 0)
      const prepProm = desp ? cs.reduce((s, e) => s + (e.prep || 0), 0) / desp : 0; const waitProm = desp ? cs.reduce((s, e) => s + (e.wait || 0), 0) / desp : 0
      let slow: EventRec | null = null; cs.forEach(e => { if (!slow || (e.prep || 0) > (slow.prep || 0)) slow = e })
      const slowPrep = slow ? (slow as EventRec).prep || 0 : 0
      const kpis: MemberKpi[] = [{ label: c.member.comandasDesp, value: String(desp), accent: '#f2e8da' }, { label: c.member.platosPrep, value: String(platos), accent: '#e0b34f' }, { label: c.member.coccionProm, value: fmtDur(prepProm), accent: '#6bbf7a' }, { label: c.member.esperaProm, value: fmtDur(waitProm), accent: '#f2e8da' }, { label: c.member.comandaLenta, value: slow ? fmtDur(slowPrep) : '—', accent: '#e5544a' }]
      const rows: MemberRow[] = cs.map(e => ({ id: e.ts, label: (e.items || []).map(i => (i.qty > 1 ? i.qty + '× ' : '') + i.name).join(', '), method: e.customer || c.guest, total: fmtDur(e.prep || 0), time: e.time || hhmm(e.ts), count: c.member.espera + ' ' + fmtDur(e.wait || 0) }))
      return { ...base, kind: 'chef', kpis, methods: null, rows, rowsEmpty: rows.length === 0, rowsHas: rows.length > 0, rowHead: c.member.platosDespHead }
    }
    const bs = mine.filter(e => e.type === 'barra'); const rondas = bs.length; const bebidas = bs.reduce((s, e) => s + (e.count || 0), 0)
    const prepProm = rondas ? bs.reduce((s, e) => s + (e.prep || 0), 0) / rondas : 0
    let slow: EventRec | null = null; bs.forEach(e => { if (!slow || (e.prep || 0) > (slow.prep || 0)) slow = e })
    const slowPrep = slow ? (slow as EventRec).prep || 0 : 0
    const kpis: MemberKpi[] = [{ label: c.member.rondasServ, value: String(rondas), accent: '#f2e8da' }, { label: c.member.bebidasPrep, value: String(bebidas), accent: '#7ab8e8' }, { label: c.member.prepProm, value: fmtDur(prepProm), accent: '#6bbf7a' }, { label: c.member.rondaLenta, value: slow ? fmtDur(slowPrep) : '—', accent: '#e5544a' }]
    const rows: MemberRow[] = bs.map(e => ({ id: e.ts, label: (e.items || []).map(i => (i.qty > 1 ? i.qty + '× ' : '') + i.name).join(', '), method: e.customer || c.guest, total: fmtDur(e.prep || 0), time: e.time || hhmm(e.ts), count: String(e.count || 0) + ' ' + c.member.bebidas }))
    return { ...base, kind: 'bartender', kpis, methods: null, rows, rowsEmpty: rows.length === 0, rowsHas: rows.length > 0, rowHead: c.member.rondasHead }
  }

  /* ---------- mount / unmount ---------- */
  useEffect(() => {
    seedStaff(); seedDemo(); reanchorSeed()
    try { const sm = localStorage.getItem('brasa_serve_modes'); if (sm) setState({ serveModes: JSON.parse(sm) || {} }) } catch { /* noop */ }
    try { const dv = localStorage.getItem('brasa_delivered'); if (dv) setState({ delivered: JSON.parse(dv) || {} }) } catch { /* noop */ }
    loadFin()
    try { const em = localStorage.getItem('brasa_staff_session'); if (em) { const st = staffOf()[em]; if (st) { setState({ staff: { email: em, ...st }, view: defaultView(st.role) }) } } } catch { /* noop */ }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Antes estos dos vivían como `setInterval` crudos dentro del useEffect de montaje y no
     paraban nunca: seguían corriendo con la pestaña en segundo plano. `runOnResume` en ambos
     porque al volver el panel debe refrescarse YA — un poll pausado deja datos de hasta 4s de
     antigüedad y el cronómetro de las comandas mostraría la hora vieja hasta 1s. */
  useVisibleInterval(load, 4000, { runOnResume: true })
  useVisibleInterval(() => { if (stateRef.current.staff) setState({ now: Date.now() }) }, 1000, { runOnResume: true })

  const v = renderVals()

  /* ============================================================
     renderVals — deriva TODO lo que la vista necesita del estado.
     Se recomputa en cada render, igual que el original.
     ============================================================ */
  function renderVals() {
    const S = stateRef.current; const staff = S.staff; const role = staff ? staff.role : ''
    const scope = role === 'chef' ? 'cocina' : role === 'bartender' ? 'bar' : 'all'
    const roleCards = ([['admin@brasa.bo', c.roleCard.admin, '👑'], ['chef@brasa.bo', c.roleCard.chef, '👨‍🍳'], ['bar@brasa.bo', c.roleCard.bartender, '🍸'], ['mesero@brasa.bo', c.roleCard.mesero, '🍽️']] as const).map(([em, label, emoji]) => ({ email: em, label, emoji, onClick: () => quick(em) }))

    const rawOrders: Order[] = (S.orders || []).map(o => ({ ...o, status: o.status || 'nuevo' }))
    const orders = rawOrders.filter(o => o.status !== 'cancelado')
    const filtItems = (items?: Item[]) => (items || []).filter(it => scope === 'all' ? true : (it.cat || 'cocina') === scope)
    const visibleOrders = orders.filter(o => scope === 'all' ? true : filtItems(o.items).length > 0)

    const navDefs: Record<string, [string, string, string][]> = {
      admin: [['resumen', c.nav.resumen, '📊'], ['board', c.nav.operaciones, '🛰️'], ['caja', c.nav.caja, '💵'], ['finanzas', c.nav.finanzas, '💹'], ['rendimiento', c.nav.rendimiento, '📈'], ['reservas', c.nav.reservas, '📅'], ['menu', c.nav.menu, '📖'], ['equipo', c.nav.equipo, '👥']],
      chef: [['cocina', c.nav.cocina, '👨‍🍳'], ['histc', c.nav.historial, '📜'], ['menu', c.nav.menu, '📖']],
      bartender: [['barra', c.nav.barra, '🍸'], ['histb', c.nav.historial, '📜'], ['menu', c.nav.menu, '📖']],
      mesero: [['board', c.nav.pedidos, '🧾'], ['histm', c.nav.historial, '📜'], ['reservas', c.nav.reservas, '📅'], ['mesas', c.nav.mesas, '🍽️'], ['menu', c.nav.disponibilidad, '📖']],
    }
    const activeCount = visibleOrders.filter(o => o.status !== 'entregado').length
    const nav = (navDefs[role] || []).map(([vw, label, emoji]) => { const on = S.view === vw; return { label, emoji, onClick: () => go(vw), bg: on ? '#2a1c11' : 'transparent', color: on ? '#fff' : '#b9a58c', weight: on ? 700 : 500, badge: ((vw === 'board' || vw === 'cocina' || vw === 'barra') && activeCount) ? String(activeCount) : '' } })

    const isKanban = S.view === 'board' && role === 'admin'
    const isCocina = S.view === 'cocina'
    const isBarra = S.view === 'barra'
    const isMesero = S.view === 'board' && role === 'mesero'
    const isBoardLike = isKanban || isCocina || isBarra || isMesero
    const isHistC = S.view === 'histc', isHistB = S.view === 'histb', isHistM = S.view === 'histm', isCaja = S.view === 'caja', isRend = S.view === 'rendimiento'
    const titles: Record<string, [string, string]> = c.titles
    const vt: [string, string] = titles[S.view] ? [titles[S.view][0], titles[S.view][1]] : (isKanban ? [c.titleKanban[0], c.titleKanban[1]] : isMesero ? [c.titleMesero[0], c.titleMesero[1]] : ['', ''])
    if (S.view === 'menu') {
      const mt = c.menuTitles[role] || c.menuTitles.admin
      vt[0] = mt[0]
      vt[1] = mt[1]
    }

    const ventas = orders.reduce((s, o) => s + (o.total || 0), 0)
    const ticket = orders.length ? Math.round(ventas / orders.length) : 0
    const totalT = zonesSeed.reduce((s, z) => s + z.tables.length, 0)
    const occT: Record<string, boolean> = {}; (S.reservations || []).forEach(r => { if (r.table) occT[r.table] = true }); const occN = Object.keys(occT).length
    const kpis = [
      { label: c.kpi.ventas, value: money(ventas), sub: orders.length + ' ' + c.kpi.pedidos, emoji: '💰' },
      { label: c.kpi.activos, value: String(activeCount), sub: c.kpi.enPrep, emoji: '🔥' },
      { label: c.kpi.ticket, value: money(ticket), sub: c.kpi.porPedido, emoji: '📈' },
      { label: c.kpi.reservas, value: String((S.reservations || []).length), sub: c.kpi.proximas, emoji: '📅' },
      { label: c.kpi.ocupacion, value: occN + '/' + totalT, sub: Math.round(occN / Math.max(1, totalT) * 100) + c.kpi.mesasPct, emoji: '🪑' },
      { label: c.kpi.clientes, value: String(S.usersCount), sub: c.kpi.registrados, emoji: '👥' },
    ]
    const recentOrders = orders.slice(0, 6).map(o => { const st = statusMeta[o.status || 'nuevo']; return { code: o.code, customer: o.customer || c.guest, summary: (o.items || []).map(i => i.qty + '× ' + i.name).join(', '), totalFmt: money(o.total || 0), stLabel: c.statusLabels[o.status || 'nuevo'], stColor: st.color, stBg: st.bg } })

    const agg: Record<string, number> = {}; orders.forEach(o => (o.items || []).forEach(i => { agg[i.name] = (agg[i.name] || 0) + (i.qty || 1) }))
    const topArr = Object.keys(agg).map(n => ({ name: n, qty: agg[n] })).sort((a, b) => b.qty - a.qty).slice(0, 6)
    const maxQty = topArr.length ? topArr[0].qty : 1
    const topDishes = topArr.map(t => ({ name: t.name, qty: t.qty + ' u.', pct: Math.round(t.qty / maxQty * 100) + '%' }))

    const chanDefs: [string, string][] = [['all', es ? 'Todos' : 'All'], ['En mesa', md('En mesa')], ['Para llevar', md('Para llevar')], ['Delivery', md('Delivery')]]
    const channelChips = chanDefs.map(([k, l]) => { const on = S.channel === k; const c = k === 'all' ? visibleOrders.length : visibleOrders.filter(o => o.mode === k).length; return { label: l, count: String(c), onClick: () => setChannel(k), bg: on ? '#2a1c11' : 'transparent', color: on ? '#fff' : '#b9a58c', border: on ? '#d1642f' : '#33261a' } })
    const boardOrders = visibleOrders.filter(o => S.channel === 'all' || o.mode === S.channel)

    const columns = ORDER.map(stk => { const st = statusMeta[stk]; const list = boardOrders.filter(o => o.status === stk).map(o => { const tm = elapsedMeta(o.ts); const showTimer = stk !== 'entregado'; return { code: o.code, time: o.time || '', mode: md(o.mode), customer: o.customer || c.guest, items: filtItems(o.items).map(it => ({ qty: String(it.qty), name: it.name, dot: (it.cat === 'bar') ? '#7ab8e8' : '#e8934f' })), showTimer, timerLabel: tm.label, timerColor: tm.color, timerBg: tm.bg, cardBorder: (showTimer && tm.urgent) ? '#5c2620' : '#2f2418', advance: () => advance(o.code) } }); return { label: c.statusLabels[stk], color: st.color, count: list.length, orders: list } })
    const boardCount = boardOrders.length

    // ===== MONITOR DE OPERACIONES (admin, solo lectura) =====
    const monActive = boardOrders.filter(o => o.status === 'nuevo' || o.status === 'preparando' || o.status === 'listo')
    const minsSince = (ts?: number) => Math.max(0, Math.floor((Date.now() - (ts || Date.now())) / 60000))
    const stationOfItems = (o: Order) => { const its = filtItems(o.items); const hasBar = its.some(i => i.cat === 'bar'); const hasCoc = its.some(i => i.cat !== 'bar'); return hasBar && hasCoc ? 'mix' : (hasBar ? 'bar' : 'cocina') }
    const buildStation = (key: string, label: string, emoji: string, accent: string) => {
      const mine = monActive.filter(o => { const s = stationOfItems(o); return s === key || s === 'mix' })
      const cola = mine.filter(o => o.status === 'nuevo').length; const prep = mine.filter(o => o.status === 'preparando').length; const ready = mine.filter(o => o.status === 'listo').length
      const working = mine.filter(o => o.status === 'nuevo' || o.status === 'preparando'); const oldest = working.reduce((m, o) => Math.max(m, minsSince(o.ts)), 0)
      let stLabel: string, stColor: string, stBg: string
      if (working.length === 0) { stLabel = c.mon.tranquila; stColor = '#8c7a63'; stBg = '#241a10' } else if (oldest > 12) { stLabel = c.mon.retrasada; stColor = '#e5544a'; stBg = 'rgba(229,84,74,.14)' } else if (oldest > 7 || working.length >= 4) { stLabel = c.mon.cargada; stColor = '#e0b34f'; stBg = 'rgba(224,179,79,.14)' } else { stLabel = c.mon.alDia; stColor = '#6bbf7a'; stBg = 'rgba(107,191,122,.14)' }
      const crew = Object.keys(staffOf()).map(em => staffOf()[em]).filter(p => (key === 'cocina' ? p.role === 'chef' : p.role === 'bartender'))
      return { key, label, emoji, accent, cola: String(cola), prep: String(prep), ready: String(ready), oldestLabel: working.length ? (oldest + ' ' + c.minWord) : '—', stLabel, stColor, stBg, crewNames: crew.map(p => p.name).join(' · ') || c.mon.unassigned, hasCrew: crew.length > 0 }
    }
    const monStations = [buildStation('cocina', c.station.cocina, '👨‍🍳', '#e8934f'), buildStation('bar', c.station.barra, '🍸', '#7ab8e8')]
    interface MonAlert { sev: number; icon: string; code: string; text: string; who: string }
    const monAlerts: MonAlert[] = []
    monActive.forEach(o => {
      const st = stationOfItems(o); const stName = st === 'bar' ? c.station.barra.toLowerCase() : st === 'mix' ? c.mon.feedCocinaBarra : c.station.cocina.toLowerCase()
      if (o.status === 'nuevo' || o.status === 'preparando') { const m = minsSince(o.ts); if (m > 12) { monAlerts.push({ sev: 2, icon: '⏱', code: o.code, text: c.mon.lleva + ' ' + m + ' ' + c.mon.minEn + ' ' + stName, who: (o.mode === 'En mesa' && o.table) ? (c.tableWord + ' ' + o.table) : (o.customer || c.guest) }) } }
      if (o.status === 'listo') { const m = minsSince(o.readyAt || o.ts); if (m > 3) { monAlerts.push({ sev: m > 8 ? 2 : 1, icon: '🔔', code: o.code, text: c.mon.listoSinServir + ' ' + m + ' ' + c.minWord, who: (o.mode === 'En mesa' && o.table) ? (c.tableWord + ' ' + o.table) : (o.customer || c.guest) }) } }
    })
    monAlerts.sort((a, b) => b.sev - a.sev)
    const monAlertRows = monAlerts.slice(0, 6).map(a => ({ icon: a.icon, code: a.code, text: a.text, who: a.who, color: a.sev === 2 ? '#e5544a' : '#e0b34f', bg: a.sev === 2 ? 'rgba(229,84,74,.1)' : 'rgba(224,179,79,.1)', border: a.sev === 2 ? 'rgba(229,84,74,.3)' : 'rgba(224,179,79,.28)' }))
    const monNoAlerts = monAlertRows.length === 0
    const monStageMeta: Record<string, { label: string; color: string; bg: string }> = { nuevo: { label: c.mon.stageEnCola, color: '#e8934f', bg: 'rgba(232,147,79,.16)' }, preparando: { label: c.mon.stagePrep, color: '#e0b34f', bg: 'rgba(224,179,79,.16)' }, listo: { label: c.mon.stageListo, color: '#6bbf7a', bg: 'rgba(107,191,122,.16)' } }
    const monFeed = monActive.slice().sort((a, b) => (a.ts || 0) - (b.ts || 0)).map(o => { const sm = monStageMeta[o.status || 'nuevo'] || monStageMeta.nuevo; const st = stationOfItems(o); const stLabel = st === 'bar' ? c.mon.stBarra : st === 'mix' ? c.mon.stMix : c.mon.stCocina; const stColor = st === 'bar' ? '#7ab8e8' : st === 'mix' ? '#c9a06a' : '#e8934f'; const m = o.status === 'listo' ? minsSince(o.readyAt || o.ts) : minsSince(o.ts); const urgent = (o.status !== 'listo' && m > 12) || (o.status === 'listo' && m > 3); return { code: o.code, customer: o.customer || c.guest, dest: (o.mode === 'En mesa' && o.table) ? (c.tableWord + ' ' + o.table) : md(o.mode), stLabel, stColor, stageLabel: sm.label, stageColor: sm.color, stageBg: sm.bg, timeLabel: m + ' ' + c.minWord, timeColor: urgent ? '#e5544a' : '#8c7a63', summary: filtItems(o.items).map(i => i.qty + '× ' + i.name).join(', ') } })
    const monFeedEmpty = monFeed.length === 0
    const monKpis = [
      { label: c.mon.kActivas, value: String(monActive.length), color: '#e8934f' },
      { label: c.mon.kCocina, value: String(monActive.filter(o => { const s = stationOfItems(o); return (s === 'cocina' || s === 'mix') && o.status !== 'listo' }).length), color: '#e8934f' },
      { label: c.mon.kBarra, value: String(monActive.filter(o => { const s = stationOfItems(o); return (s === 'bar' || s === 'mix') && o.status !== 'listo' }).length), color: '#7ab8e8' },
      { label: c.mon.kListo, value: String(monActive.filter(o => o.status === 'listo').length), color: '#6bbf7a' },
      { label: c.mon.kAlertas, value: String(monAlerts.length), color: monAlerts.length ? '#e5544a' : '#6bbf7a' },
    ]

    // ===== COCINA/BARRA: Kanban por estado — Recibido → En preparación → Listo =====
    const kStates: [string, string, string, string][] = [['nuevo', c.kds.recibido, '#e8934f', c.kds.capCola], ['preparando', c.kds.enPrep, '#e0b34f', c.kds.capPrep], ['listo', c.kds.listoServir, '#6bbf7a', c.kds.capListo]]
    const kSrc = visibleOrders.filter(o => o.status === 'nuevo' || o.status === 'preparando' || o.status === 'listo')
    const kSm = stages()
    const colKeyOf = (o: Order): string | null => { if (scope === 'all') return o.status || 'nuevo'; const its = (o.items || []).map((it, i) => ({ bar: (it.cat || 'cocina') === 'bar', s: (kSm[o.code + '#' + i] != null ? kSm[o.code + '#' + i] : deriveStage(o.status || 'nuevo')) })).filter(x => (scope === 'bar') === x.bar); if (!its.length) return null; if (its.every(x => x.s === 2)) return 'listo'; if (its.some(x => x.s >= 1)) return 'preparando'; return 'nuevo' }
    const cocinaColumns = kStates.map(([stk, label, color, cap]) => {
      const list = kSrc.filter(o => colKeyOf(o) === stk).sort((a, b) => (a.ts || 0) - (b.ts || 0)).map(o => {
        const placed = o.ts || Date.now(); const clockTs = stk === 'preparando' ? (o.acceptedAt || placed) : placed; let tm = liveMeta(clockTs, null, S.now); const totalEl = liveMeta(placed, null, S.now)
        if (stk === 'listo') { const cookMs = Math.max(0, (o.readyAt || placed) - placed); const mm = Math.floor(cookMs / 60000), ss = Math.floor((cookMs % 60000) / 1000); tm = { label: '✓ ' + c.kds.readyIn + ' ' + mm + ':' + String(ss).padStart(2, '0'), color: '#6bbf7a', bg: 'rgba(107,191,122,.16)', urgent: false } }
        const items = filtItems(o.items).map(it => ({ qty: String(it.qty), name: it.name, note: (it.note || '').trim(), hasNote: !!(it.note && it.note.trim()) }))
        let aLabel = '', aFn: (() => void) | null = null, aBg = '', aColor = '', aBorder = ''
        if (stk === 'nuevo') { aLabel = c.kds.aceptar; aFn = () => stationAccept(o); aBg = 'rgba(232,147,79,.16)'; aColor = '#e8934f'; aBorder = 'rgba(232,147,79,.4)' } else if (stk === 'preparando') { aLabel = c.kds.marcarListo; aFn = () => stationReady(o); aBg = '#2f7a45'; aColor = '#dff5e6'; aBorder = '#3c9557' }
        const recallTo = stk === 'preparando' ? 'nuevo' : (stk === 'listo' ? 'preparando' : null)
        const recallLabel = stk === 'preparando' ? c.kds.regresarRecibido : (stk === 'listo' ? c.kds.regresarPrep : '')
        const isTableOrder = o.mode === 'En mesa' && !!o.table; const destLabel = isTableOrder ? (c.tableWord + ' ' + o.table) : md(o.mode)
        const pickup = liveMeta(o.readyAt || placed, null, S.now); const pickupUrgent = (stk === 'listo') && ((Date.now() - (o.readyAt || Date.now())) > 180000)
        return { code: o.code, time: o.time || '', mode: md(o.mode), customer: o.customer || c.guest, destLabel, isTableOrder, showPickup: (stk === 'listo'), pickupLabel: pickup.label, pickupUrgent, items, isCancel: false, normal: true, note: o.note || null, hasNote: !!o.note, noteText: o.note ? o.note.text : '', noteBy: o.note ? o.note.by : '', timerLabel: tm.label, timerColor: tm.color, timerBg: tm.bg, caption: cap, totalLabel: totalEl.label, totalColor: totalEl.color, showTotal: (stk === 'preparando'), cardBorder: (pickupUrgent) ? '#5c2620' : ((tm.urgent && stk !== 'listo') ? '#5c2620' : '#2f2418'), hasAction: !!aFn, aLabel, aFn, aBg, aColor, aBorder, canCancel: (stk !== 'listo'), isCanceling: S.cancelFor === o.code, showCancelLink: (stk !== 'listo' && S.cancelFor !== o.code && S.recallFor !== o.code), askCancel: () => askCancel(o.code), doCancel: () => cancelOrder(o), noCancel, canRecall: !!recallTo, showRecallLink: (!!recallTo && S.recallFor !== o.code && S.cancelFor !== o.code), recallLabel, isRecalling: S.recallFor === o.code, askRecall: () => askRecall(o.code), doRecall: () => doRecall(o, recallTo || ''), noRecall, recallNote: S.recallNote, setRecallNote, canceledBy: '', canceledTime: '' }
      })
      return { key: stk, label, color, count: String(list.length), cards: list, empty: list.length === 0 }
    })
    const cancScope = rawOrders.filter(o => o.status === 'cancelado').filter(o => scope === 'all' || filtItems(o.items).length > 0).sort((a, b) => (b.canceledAt || 0) - (a.canceledAt || 0))
    const cancCards = cancScope.map(o => ({ code: o.code, mode: md(o.mode), customer: o.customer || c.guest, isCancel: true, normal: false, items: filtItems(o.items).map(it => ({ qty: String(it.qty), name: it.name, note: '', hasNote: false })), canceledBy: o.canceledBy || '—', canceledTime: hhmm(o.canceledAt), destLabel: '', isTableOrder: false, showPickup: false, pickupLabel: '', pickupUrgent: false, note: null, hasNote: false, noteText: '', noteBy: '', timerLabel: '', timerColor: '', timerBg: '', caption: '', totalLabel: '', totalColor: '', showTotal: false, cardBorder: '', hasAction: false, aLabel: '', aFn: null as (() => void) | null, aBg: '', aColor: '', aBorder: '', time: '', canCancel: false, isCanceling: false, showCancelLink: false, askCancel: () => undefined, doCancel: () => undefined, noCancel, canRecall: false, showRecallLink: false, recallLabel: '', isRecalling: false, askRecall: () => undefined, doRecall: () => undefined, noRecall, recallNote: '', setRecallNote }))
    cocinaColumns.push({ key: 'cancelado', label: c.kds.cancelado, color: '#e5544a', count: String(cancCards.length), cards: cancCards, empty: cancCards.length === 0 })
    const cocinaAllEmpty = cocinaColumns.every(c => c.empty)

    // ===== BARRA (bartender, legacy rounds — computado; la vista usa el Kanban) =====
    const barSrc = boardOrders.filter(o => o.status === 'nuevo' || o.status === 'preparando').sort((a, b) => (a.ts || 0) - (b.ts || 0))
    const barraRounds = barSrc.map(o => { const tm = liveMeta(o.ts, null, S.now); const drinks = filtItems(o.items); const count = drinks.reduce((s, d) => s + (d.qty || 1), 0); return { code: o.code, time: o.time || '', mode: md(o.mode), customer: o.customer || c.guest, timerLabel: tm.label, timerColor: tm.color, timerBg: tm.bg, accent: tm.urgent ? '#e5544a' : '#7ab8e8', repeatFlag: !!o.repeat, drinks: drinks.map(d => ({ qty: String(d.qty), name: d.name })), countLabel: c.mesero.countBar(count), serve: () => barServe(o), repeat: () => repeatRound(o.code) } })
    const barServed = boardOrders.filter(o => o.status === 'listo').sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, 4).map(o => ({ code: o.code, customer: o.customer || c.guest, summary: filtItems(o.items).map(d => d.qty + '× ' + d.name).join(', '), repeat: () => repeatRound(o.code), showRecallLink: (S.recallFor !== o.code), isRecalling: (S.recallFor === o.code), askRecall: () => askRecall(o.code), doRecall: () => doRecall(o, 'preparando'), noRecall, recallNote: S.recallNote, setRecallNote }))

    // ===== MESERO: cuenta por MESA (una mesa = una cuenta) =====
    const svcSrc = boardOrders.filter(o => !o.closed).sort((a, b) => (a.ts || 0) - (b.ts || 0))
    const tKey = (o: Order) => (o.mode === 'En mesa' && o.table) ? ('mesa-' + o.table) : ('ord-' + o.code)
    const dotFor = (cat: string) => cat === 'bar' ? '#7ab8e8' : '#e8934f'
    const grp: Record<string, Order[]> = {}; svcSrc.forEach(o => { const k = tKey(o); (grp[k] = grp[k] || []).push(o) })
    const meseroTables = Object.keys(grp).map(k => {
      const os = grp[k]; const first = os[0]; const isTable = first.mode === 'En mesa' && !!first.table
      const oldest = Math.min(...os.map(o => o.ts || Date.now())); const fullyServed = os.length > 0 && os.every(o => o.status === 'entregado'); const endTs = fullyServed ? Math.max(...os.map(o => o.deliveredAt || o.ts || Date.now())) : null; const tm = liveMeta(oldest, endTs, S.now); if (fullyServed) { tm.color = '#c9a27a'; tm.bg = 'rgba(201,162,122,.14)'; tm.urgent = false }
      const total = os.reduce((s, o) => s + (o.total || 0), 0)
      const guestsArr: string[] = []; os.forEach(o => { const g = o.guest || o.customer || c.guest; if (guestsArr.indexOf(g) < 0) guestsArr.push(g) })
      const party = first.party || guestsArr.length
      const readyN = os.filter(o => o.status === 'listo').length; const kitchenN = os.filter(o => o.status === 'nuevo' || o.status === 'preparando').length; const delivN = os.filter(o => o.status === 'entregado').length
      const dmap = S.delivered || {}
      const guestLines = guestsArr.map(g => { const items: { it: Item; st: string; ord: Order; idx: number }[] = []; os.filter(o => (o.guest || o.customer || c.guest) === g).forEach(o => (o.items || []).forEach((it, i) => items.push({ it, st: o.status || 'nuevo', ord: o, idx: i }))); return { guest: g, single: guestsArr.length === 1, items: items.map(({ it, st, ord, idx }) => { const isDeliv = !!dmap[ord.code + '#' + idx]; const seat = isTable ? seatOf(ord.code, idx, party) : 0; const served = st === 'entregado' || isDeliv; const ready = st === 'listo' && !isDeliv; const isBar = (it.cat || 'cocina') === 'bar'; const prepping = st === 'preparando'; const place = isBar ? c.station.barra.toLowerCase() : c.station.cocina.toLowerCase(); let label: string, color: string, bg: string; if (served) { label = c.mesero.entregadoBadge; color = '#8fb99a'; bg = 'rgba(143,185,154,.14)' } else if (ready) { label = c.mesero.servirBadge; color = '#6bbf7a'; bg = 'rgba(107,191,122,.16)' } else { label = prepping ? (c.mesero.preparandoEn + ' ' + place) : (c.mesero.enEstacion + ' ' + place); color = '#e0b34f'; bg = 'rgba(224,179,79,.13)' } return { qty: String(it.qty), name: it.name, dot: dotFor(it.cat || 'cocina'), priceFmt: money((it.price || 0) * (it.qty || 1)), showBadge: true, badgeLabel: label, badgeColor: color, badgeBg: bg, badgeCursor: ready ? 'pointer' : 'default', badgeTitle: ready ? (es ? 'Toca al servir este plato' : 'Tap when you serve this dish') : '', tap: ready ? (() => deliverItem(ord, idx)) : null, nameColor: served ? '#8a7d6c' : '#e6d8c6', nameDecoration: served ? 'line-through' : 'none', rowOpacity: served ? '0.6' : '1', seat: String(seat), showSeat: !!seat } }) } })
      const statusChips: { label: string; color: string; bg: string }[] = []; if (readyN) statusChips.push({ label: c.mesero.chipReady(readyN), color: '#6bbf7a', bg: 'rgba(107,191,122,.14)' }); if (kitchenN) statusChips.push({ label: c.mesero.chipKitchen(kitchenN), color: '#e0b34f', bg: 'rgba(224,179,79,.14)' }); if (delivN) statusChips.push({ label: c.mesero.chipServed(delivN), color: '#c9a27a', bg: 'rgba(201,162,122,.14)' })
      const mixed = readyN > 0 && kitchenN > 0; const smode = (S.serveModes || {})[k]; const decided = (smode === 'asready' || smode === 'together')
      const canDeliver = kitchenN === 0 ? readyN > 0 : (mixed && smode === 'asready'); const canCharge = kitchenN === 0 && os.length > 0; const isTender = S.tenderFor === k
      const kind = isTable ? 'table' : (first.mode === 'Delivery' ? 'delivery' : 'takeaway')
      const headerIcon = kind === 'table' ? '🍽️' : (kind === 'delivery' ? '🛵' : '🛍️')
      const kindHint = kind === 'delivery' ? c.mesero.kindDelivery : (kind === 'takeaway' ? c.mesero.kindTakeaway : '')
      return {
        key: k, isTable, kind, headerIcon,
        title: isTable ? (c.tableWord + ' ' + first.table) : (first.customer || c.guest),
        sub: isTable ? (party + ' ' + c.personWord) : (md(first.mode) || c.orderWord),
        guestsSub: isTable ? guestsArr.join(', ') : kindHint,
        billLabel: isTable ? c.mesero.cuentaMesa : c.mesero.totalPedido,
        deliverLabel: kind === 'table' ? c.mesero.servirListos : (kind === 'delivery' ? c.mesero.entregarRepartidor : c.mesero.entregarCliente),
        chargeLabel: isTable ? c.mesero.cobrarMesa : c.mesero.cobrarPedido,
        timerLabel: fullyServed ? (tm.label + ' · ' + (isTable ? c.mesero.servida : c.mesero.entregada)) : tm.label, timerColor: tm.color, timerBg: tm.bg, statusChips, guestLines, totalFmt: money(total),
        splitFmt: (isTable && party > 1) ? ('$' + Math.round(total / party / 6.9).toLocaleString('en-US') + ' ' + c.mesero.ea) : '', showSplit: isTable && party > 1,
        canDeliver, deliver: () => deliverTable(os), canCharge, showChargeBtn: canCharge && !isTender, openCharge: () => openTender(k),
        showDecision: mixed && !decided, showHold: mixed && smode === 'together', setAsReady: () => setServeMode(k, 'asready'), setTogether: () => setServeMode(k, 'together'),
        isTender, payEfectivo: () => chargeTable(os, 'Efectivo'), payTarjeta: () => chargeTable(os, 'Tarjeta'), payQR: () => chargeTable(os, 'QR'), cancelTender,
        waitLabel: canDeliver ? c.mesero.recoger : (canCharge ? c.mesero.porCobrar : c.mesero.enPrep),
        cardBorder: canDeliver ? '#3c9557' : (canCharge ? '#a5561f' : '#2a2016'), cardBg: canDeliver ? 'linear-gradient(160deg,#1c2718,#160f08)' : '#160f08',
      }
    }).sort((a, b) => ((b.canDeliver ? 2 : b.canCharge ? 1 : 0) - (a.canDeliver ? 2 : a.canCharge ? 1 : 0)))
    const meseroEmpty = meseroTables.length === 0

    // ===== HISTORIAL por rol (desde brasa_events) =====
    const events = S.events || []
    const fmtEvItems = (ev: EventRec) => (ev.items || []).map(i => i.qty + '× ' + i.name).join(', ')
    const fmtMin = (val?: number) => val == null ? '—' : (val + ' min')
    const cocinaHist = events.filter(e => e.type === 'cocina').map(e => ({ code: e.code || '', time: e.time || '', itemsLine: fmtEvItems(e), count: String(e.count || 0), wait: fmtMin(e.wait), prep: fmtMin(e.prep), cook: e.staff || '—', customer: e.customer || '', mode: e.mode || '', recall: () => recallOrder(e.code || '') }))
    const barraHist = events.filter(e => e.type === 'barra').map(e => ({ code: e.code || '', time: e.time || '', itemsLine: fmtEvItems(e), count: String(e.count || 0), prep: fmtMin(e.prep), customer: e.customer || '', mode: e.mode || '', recall: () => recallOrder(e.code || '') }))
    const meseroHist = events.filter(e => e.type === 'cobro').map(e => { const items = e.items || []; const dishes = items.filter(i => (i.cat || 'cocina') !== 'bar'); const drinks = items.filter(i => (i.cat || 'cocina') === 'bar'); const open = S.histOpen === e.code; const mLabel = (e.method === 'Efectivo' ? '💵 ' : e.method === 'Tarjeta' ? '💳 ' : '📱 ') + payLabel(e.method); return { code: e.code || '', time: e.time || '', title: e.customer || c.guest, total: money(e.total || 0), methodLabel: mLabel, sub: ((e.guests || 0) > 1 ? (e.guests + ' ' + c.histm.comensales + ' · ') : '') + md(e.mode), open, chev: open ? '▾' : '▸', toggle: () => toggleHist(e.code || ''), hasDishes: dishes.length > 0, dishCount: String(dishes.reduce((s, i) => s + (i.qty || 1), 0)), dishes: dishes.map(i => ({ line: (i.qty || 1) + '× ' + i.name, guest: i.guest || '', priceFmt: money(i.price || 0) })), hasDrinks: drinks.length > 0, drinkCount: String(drinks.reduce((s, i) => s + (i.qty || 1), 0)), drinks: drinks.map(i => ({ line: (i.qty || 1) + '× ' + i.name, guest: i.guest || '', priceFmt: money(i.price || 0) })) } })
    const cSum = (arr: EventRec[], k: 'total') => arr.reduce((s, e) => s + (e[k] || 0), 0)
    const cocinaPrepAvg = cocinaHist.length ? Math.round(events.filter(e => e.type === 'cocina').reduce((s, e) => s + (e.prep || 0), 0) / cocinaHist.length) : 0
    const cocinaWaitAvg = cocinaHist.length ? Math.round(events.filter(e => e.type === 'cocina').reduce((s, e) => s + (e.wait || 0), 0) / cocinaHist.length) : 0
    const barraPrepAvg = barraHist.length ? Math.round(events.filter(e => e.type === 'barra').reduce((s, e) => s + (e.prep || 0), 0) / barraHist.length) : 0
    const cocinaHistStats = [{ label: c.histc.comandasDesp, value: String(cocinaHist.length) }, { label: c.histc.platosDesp, value: String(events.filter(e => e.type === 'cocina').reduce((s, e) => s + (e.count || 0), 0)) }, { label: c.histc.esperaMedia, value: cocinaWaitAvg + ' ' + c.minWord }, { label: c.histc.coccionMedia, value: cocinaPrepAvg + ' ' + c.minWord }]
    const barraHistStats = [{ label: c.histb.rondasServ, value: String(barraHist.length) }, { label: c.histb.bebidasServ, value: String(events.filter(e => e.type === 'barra').reduce((s, e) => s + (e.count || 0), 0)) }, { label: c.histb.prepMedia, value: barraPrepAvg + ' ' + c.minWord }]
    const entregasN = events.filter(e => e.type === 'entrega').length; const cobrosArr = events.filter(e => e.type === 'cobro')
    const canceladasN = events.filter(e => e.type === 'cancelado').length
    kpis.push({ label: c.kpi.canceladas, value: String(canceladasN), sub: c.kpi.hoy, emoji: '🚫' })
    const meseroHistStats = [{ label: c.histm.mesasCobradas, value: String(cobrosArr.length) }, { label: c.histm.cobrado, value: money(cSum(cobrosArr, 'total')) }]

    // ===== ARQUEO DE CAJA =====
    const methods = ['Efectivo', 'Tarjeta', 'QR']
    const methodMeta: Record<string, { color: string; emoji: string }> = { Efectivo: { color: '#6bbf7a', emoji: '💵' }, Tarjeta: { color: '#7ab8e8', emoji: '💳' }, QR: { color: '#c9a0e8', emoji: '📱' } }
    const byMethodRaw: Record<string, number> = {}; methods.forEach(m => byMethodRaw[m] = 0)
    cobrosArr.forEach(e => { const m = e.method || 'Efectivo'; byMethodRaw[m] = (byMethodRaw[m] || 0) + (e.total || 0) })
    const cobradoTotal = methods.reduce((s, m) => s + byMethodRaw[m], 0)
    const cajaByMethod = methods.map(m => ({ label: payLabel(m), emoji: methodMeta[m].emoji, color: methodMeta[m].color, amount: money(byMethodRaw[m]), n: String(cobrosArr.filter(e => (e.method || 'Efectivo') === m).length), pct: cobradoTotal ? Math.round(byMethodRaw[m] / cobradoTotal * 100) + '%' : '0%' }))
    const fondo = S.caja.fondo || 0; const efvtVentas = byMethodRaw['Efectivo']; const esperado = fondo + efvtVentas
    const contadoNum = parseFloat(S.caja.contado); const hasContado = !isNaN(contadoNum); const diff = hasContado ? (contadoNum - esperado) : 0
    const cajaRows = [{ label: c.caja.fondoRow, value: money(fondo) }, { label: c.caja.ventasEfvt, value: money(efvtVentas) }, { label: c.caja.efvtEsperado, value: money(esperado) }]
    const overShort = !hasContado ? { show: false, label: '', value: '', color: '', bg: '' } : { show: true, label: diff === 0 ? c.caja.cuadrada : (diff > 0 ? c.caja.sobrante : c.caja.faltante), value: (diff > 0 ? '+' : '') + money(diff), color: diff === 0 ? '#6bbf7a' : (diff > 0 ? '#e0b34f' : '#e5544a'), bg: diff === 0 ? 'rgba(107,191,122,.12)' : (diff > 0 ? 'rgba(224,179,79,.12)' : 'rgba(229,84,74,.12)') }
    const ticketsCobrados = cobrosArr.length; const ticketProm = ticketsCobrados ? Math.round(cobradoTotal / ticketsCobrados) : 0
    const cajaSummary = [{ label: c.caja.ventasCobradas, value: money(cobradoTotal), emoji: '💰' }, { label: c.caja.tickets, value: String(ticketsCobrados), emoji: '🧾' }, { label: c.caja.ticketProm, value: money(ticketProm), emoji: '📈' }, { label: c.caja.propina, value: money(Math.round(cobradoTotal * 0.1)), emoji: '🙌' }]

    // ===== FINANZAS =====
    const gastos = (S.expenses || []); const gastosTotal = gastos.reduce((s, g) => s + (g.monto || 0), 0)
    const ingresosDia = cobradoTotal; const gananciaDia = ingresosDia - gastosTotal
    const finKpis = [
      { label: c.fin.ingresos, value: money(ingresosDia), emoji: '💰', color: '#6bbf7a', sub: ticketsCobrados + ' ' + c.fin.ticketsCobrados },
      { label: c.fin.gastos, value: money(gastosTotal), emoji: '🧾', color: '#e5544a', sub: gastos.length + ' ' + c.fin.registros },
      { label: c.fin.ganancia, value: (gananciaDia < 0 ? '−' : '') + money(Math.abs(gananciaDia)), emoji: '📈', color: gananciaDia >= 0 ? '#e0b34f' : '#e5544a', sub: (ingresosDia ? Math.round(gananciaDia / ingresosDia * 100) : 0) + '% ' + c.fin.margen },
    ]
    const catMeta: Record<string, string> = { Insumos: '#e8934f', Sueldos: '#7ab8e8', Servicios: '#c9a0e8', Proveedores: '#6bbf7a', Otros: '#a8977f' }
    const catAgg: Record<string, number> = {}; gastos.forEach(g => { const key = g.cat || 'Otros'; catAgg[key] = (catAgg[key] || 0) + (g.monto || 0) })
    const gastosByCat = Object.keys(catAgg).map(cat => ({ label: c.expCatLabels[cat] || cat, color: catMeta[cat] || '#a8977f', amount: money(catAgg[cat]), pct: gastosTotal ? Math.round(catAgg[cat] / gastosTotal * 100) + '%' : '0%' })).sort((a, b) => b.pct.localeCompare(a.pct))
    const gastosList = gastos.map(g => ({ id: g.id, concepto: g.concepto, cat: c.expCatLabels[g.cat || 'Otros'] || g.cat || 'Otros', catColor: catMeta[g.cat] || '#a8977f', monto: money(g.monto || 0), hora: hhmm(g.ts), by: g.by || '—', remove: () => removeExpense(g.id) }))
    const inversion = S.inversion || 0; const recupPct = inversion > 0 ? Math.max(0, Math.min(100, Math.round(gananciaDia / inversion * 100))) : 0
    const expCats = ['Insumos', 'Sueldos', 'Servicios', 'Proveedores', 'Otros'].map(cat => ({ label: c.expCatLabels[cat] || cat, bg: S.expCat === cat ? catMeta[cat] : '#211810', color: S.expCat === cat ? '#160f08' : '#a8977f', onClick: () => setExpCat(cat) }))
    const canAddExp = (S.expConcepto || '').trim().length > 0 && parseFloat(S.expMonto || '0') > 0

    // ===== RENDIMIENTO =====
    const rendStations = [
      { label: c.station.cocina, emoji: '👨‍🍳', color: '#e8934f', done: events.filter(e => e.type === 'cocina').reduce((s, e) => s + (e.count || 0), 0), tickets: cocinaHist.length, avg: cocinaPrepAvg + '′' },
      { label: c.station.barra, emoji: '🍸', color: '#7ab8e8', done: events.filter(e => e.type === 'barra').reduce((s, e) => s + (e.count || 0), 0), tickets: barraHist.length, avg: barraPrepAvg + '′' },
      { label: c.station.salon, emoji: '🍽️', color: '#6bbf7a', done: entregasN, tickets: cobrosArr.length, avg: '—' },
    ].map(r => ({ label: r.label, emoji: r.emoji, color: r.color, doneLabel: String(r.done), ticketsLabel: String(r.tickets), avgLabel: r.avg }))
    interface StaffAgg { name: string; role?: string; actions: number; sales: number }
    const staffAgg: Record<string, StaffAgg> = {}
    events.forEach(e => { const n = e.staff || '—'; if (!staffAgg[n]) staffAgg[n] = { name: n, role: e.role, actions: 0, sales: 0 }; staffAgg[n].actions++; if (e.type === 'cobro') staffAgg[n].sales += (e.total || 0) })
    const rendStaff = Object.values(staffAgg).sort((a, b) => b.actions - a.actions).map(s => ({ name: s.name, initial: (s.name || '?').charAt(0), roleLabel: c.roleMeta[s.role || ''] || s.role || '', actions: String(s.actions) + ' ' + c.rend.acciones, sales: s.sales ? money(s.sales) : '—' }))
    interface WaiterAgg { name: string; tables: string[]; sales: number; guests: number }
    const waiterAgg: Record<string, WaiterAgg> = {}
    cobrosArr.forEach(e => { const n = e.staff || '—'; if (!waiterAgg[n]) waiterAgg[n] = { name: n, tables: [], sales: 0, guests: 0 }; const lbl = e.table ? (c.tableWord + ' ' + e.table) : (e.customer || e.code || c.orderWord); if (waiterAgg[n].tables.indexOf(lbl) < 0) waiterAgg[n].tables.push(lbl); waiterAgg[n].sales += (e.total || 0); waiterAgg[n].guests += (e.guests || e.party || 1) })
    const waiterTables = Object.values(waiterAgg).sort((a, b) => b.sales - a.sales).map(w => ({ name: w.name, initial: (w.name || '?').charAt(0), tablesCount: String(w.tables.length) + ' ' + (w.tables.length === 1 ? c.rend.mesa : c.rend.mesas), tablesLabel: w.tables.join(' · '), guestsLabel: String(w.guests) + ' ' + c.rend.comensales, sales: money(w.sales) }))
    const waiterEmpty = waiterTables.length === 0
    const rendEmpty = events.length === 0

    const modeList = ['En mesa', 'Para llevar', 'Delivery']
    const chTotals = modeList.map(m => ({ mode: m, total: orders.filter(o => o.mode === m).reduce((s, o) => s + (o.total || 0), 0), n: orders.filter(o => o.mode === m).length }))
    const chMax = Math.max(1, ...chTotals.map(ct => ct.total))
    const byChannel = chTotals.map(ct => ({ mode: md(ct.mode), amount: money(ct.total), n: ct.n + ' ' + (es ? 'ped.' : 'ord.'), pct: Math.round(ct.total / chMax * 100) + '%' }))
    let qCoc = 0, qBar = 0; orders.forEach(o => (o.items || []).forEach(i => { if ((i.cat || 'cocina') === 'bar') qBar += (i.qty || 1); else qCoc += (i.qty || 1) }))
    const qTot = Math.max(1, qCoc + qBar)
    const byStation = [{ label: c.station.cocina, qty: qCoc, pct: Math.round(qCoc / qTot * 100) + '%', color: '#e8934f' }, { label: c.station.barra, qty: qBar, pct: Math.round(qBar / qTot * 100) + '%', color: '#7ab8e8' }]

    const reservasList = (S.reservations || []).map(r => ({ customer: r.customer || c.guest, datetime: (r.date ? (c.resDate[r.date] || r.date) : '') + ' · ' + (r.time || ''), party: String(r.party || ''), table: r.table || '—', code: r.code }))

    // mesas — cuenta viva por mesa
    const activeT = (S.orders || []).filter(o => o.mode === 'En mesa' && o.table && !o.closed && o.status !== 'cancelado')
    const byTable: Record<string, Order[]> = {}; activeT.forEach(o => { (byTable[o.table!] = byTable[o.table!] || []).push(o) })
    const takenTables: Record<string, boolean> = {}; Object.keys(byTable).forEach(id => takenTables[id] = true); (S.reservations || []).forEach(r => { if (r.table) takenTables[r.table] = true })
    const zonesView = zonesSeed.map(z => { let taken = 0; const tables = z.tables.map(id => { const has = !!byTable[id]; const t = !!takenTables[id]; if (t) taken++; const sel = S.tableSel === id; const pend = has ? byTable[id].reduce((s, o) => s + ((o.status === 'entregado') ? 0 : (o.items || []).length), 0) : 0; return { id, state: has ? (pend ? pend + ' ' + c.mesas.pend : c.mesas.servida) : (t ? c.mesas.reservada : c.mesas.libre), bg: sel ? 'rgba(209,100,47,.28)' : (has ? 'rgba(209,100,47,.16)' : (t ? 'rgba(224,179,79,.10)' : '#1a120b')), border: sel ? '#e8934f' : (has ? 'rgba(209,100,47,.5)' : (t ? 'rgba(224,179,79,.35)' : '#2a2016')), ink: has ? '#e8934f' : (t ? '#e0b34f' : '#c9b79c'), subColor: has ? '#e8934f' : (t ? '#b98f4a' : '#6f5f4a'), clickable: has, onClick: () => selectTable(id) } }); return { name: c.zoneLabels[z.name] || z.name, free: z.tables.length - taken, taken, tables } })
    const itemStatusMeta = (st: string, isBar: boolean) => { if (st === 'entregado') return { label: c.mesas.entregado, color: '#6bbf7a', bg: 'rgba(107,191,122,.14)' }; if (st === 'listo') return { label: c.mesas.listoServir, color: '#e0b34f', bg: 'rgba(224,179,79,.14)' }; return { label: isBar ? c.mesas.enBarra : c.mesas.enCocina, color: '#c98a5a', bg: 'rgba(201,138,90,.14)' } }
    interface TableDetail { id: string; title: string; sub: string; total: string; close: () => void; hasDishes: boolean; dishes: { line: string; guest: string; priceFmt: string; stLabel: string; stColor: string; stBg: string }[]; dishCount: string; hasDrinks: boolean; drinks: { line: string; guest: string; priceFmt: string; stLabel: string; stColor: string; stBg: string }[]; drinkCount: string; allDone: boolean; pendLabel: string }
    let tableDetail: TableDetail | null = null
    if (S.tableSel && byTable[S.tableSel]) {
      const os = byTable[S.tableSel]; const first = os[0]
      const flat: { qty: string; name: string; cat: string; price: number; guest: string; st: string }[] = []; os.forEach(o => (o.items || []).forEach(it => flat.push({ qty: String(it.qty), name: it.name, cat: it.cat || 'cocina', price: (it.price || 0) * (it.qty || 1), guest: o.guest || o.customer || c.guest, st: o.status || 'nuevo' })))
      const mkRows = (isBar: boolean) => flat.filter(i => (i.cat === 'bar') === isBar).map(i => { const m = itemStatusMeta(i.st, isBar); return { line: i.qty + '× ' + i.name, guest: i.guest, priceFmt: money(i.price), stLabel: m.label, stColor: m.color, stBg: m.bg } })
      const dishes = mkRows(false), drinks = mkRows(true)
      const total = os.reduce((s, o) => s + (o.total || 0), 0)
      const guestsArr: string[] = []; os.forEach(o => { const g = o.guest || o.customer || c.guest; if (guestsArr.indexOf(g) < 0) guestsArr.push(g) })
      const pendN = flat.filter(i => i.st !== 'entregado').length
      tableDetail = { id: S.tableSel, title: c.tableWord + ' ' + S.tableSel, sub: (first.party || guestsArr.length) + ' ' + c.personWord + ' · ' + guestsArr.join(', '), total: money(total), close: closeTableDetail, hasDishes: dishes.length > 0, dishes, dishCount: String(dishes.length), hasDrinks: drinks.length > 0, drinks, drinkCount: String(drinks.length), allDone: pendN === 0, pendLabel: pendN ? (pendN + ' ' + c.mesas.porEntregar) : c.mesas.todoEntregado }
    }

    // menu
    const stk = S.stock || {}
    const stationOf = (m: MenuSeedItem) => (barCats.indexOf(m.cat) >= 0) ? 'bar' : 'cocina'
    let menuSrc = menuSeed
    if (role === 'chef') menuSrc = menuSrc.filter(m => stationOf(m) === 'cocina')
    else if (role === 'bartender') menuSrc = menuSrc.filter(m => stationOf(m) === 'bar')
    const menuEditable = (role === 'chef' || role === 'bartender' || role === 'admin')
    const menuItemLabel = role === 'bartender' ? c.menu.trago : c.menu.plato
    const menuList = menuSrc.map(m => {
      const val = stk[m.name]; const out = (val === 0); const low = (typeof val === 'number' && val > 0)
      return { name: m.name, cat: c.menuCatLabels[m.cat] || m.cat, price: money(m.price), isOut: out, isLow: low, isAvail: !out && !low, qty: String(low ? val : 0), stLabel: out ? c.menu.agotado : low ? (c.menu.quedan + ' ' + val) : c.menu.disponible, stColor: out ? '#e5544a' : low ? '#e0b34f' : '#6bbf7a', stBg: out ? 'rgba(229,84,74,.14)' : low ? 'rgba(224,179,79,.14)' : 'rgba(107,191,122,.14)', markOut: () => markOut(m.name), limit: () => limitStock(m.name), restock: () => restock(m.name), inc: () => stepStock(m.name, 1), dec: () => stepStock(m.name, -1) }
    })
    const unavailAlerts = menuSeed.map(m => ({ m, v: stk[m.name] })).filter(x => x.v === 0 || (typeof x.v === 'number' && x.v > 0)).sort((a, b) => (a.v || 0) - (b.v || 0)).map(x => ({ name: x.m.name, station: (x.m.cat === 'Bar' ? c.menu.barraTag : c.menu.cocinaTag), label: x.v === 0 ? c.menu.agotado : (c.menu.quedan + ' ' + x.v), color: x.v === 0 ? '#f0b4ae' : '#e6cf8f', bg: x.v === 0 ? 'rgba(229,84,74,.14)' : 'rgba(224,179,79,.13)', border: x.v === 0 ? 'rgba(229,84,74,.4)' : 'rgba(224,179,79,.35)' }))
    const hasUnavailAlerts = unavailAlerts.length > 0

    const st = staffOf(); const teamList = Object.keys(st).map(em => ({ name: st[em].name, email: em, roleLabel: c.roleMeta[st[em].role] || st[em].role, initial: (st[em].name || '?').charAt(0), select: () => selectMember(em), isSel: S.memberSel === em }))
    const memberDetail = S.memberSel ? buildMember(S.memberSel) : null

    return {
      isLogged: !!staff, notLogged: !staff,
      liEmail: S.liEmail, onLiEmail, liPass: S.liPass, onLiPass, loginErr: S.loginErr, doLogin, roleCards,
      staffName: staff ? staff.name : '', staffInitial: staff ? (staff.name || '?').charAt(0) : '', roleLabel: staff ? (c.roleMeta[role] || role) : '', logout,
      nav, refresh, viewTitle: vt[0], viewSubtitle: vt[1],
      isResumen: S.view === 'resumen', isKanban, isCocina, isBarra, isStation: (isCocina || isBarra), isMesero, isBoardLike, isReservas: S.view === 'reservas', isMesas: S.view === 'mesas', isMenu: S.view === 'menu', isEquipo: S.view === 'equipo',
      isHistC, isHistB, isHistM, isCaja, isRend, isFinanzas: S.view === 'finanzas',
      finKpis, gastosByCat, gastosList, gastosEmpty: gastosList.length === 0, gastosByCatEmpty: gastosByCat.length === 0,
      inversionVal: String(S.inversion || 0), setInversion, recupPct: recupPct + '%', recupNum: recupPct, hasInversion: (S.inversion || 0) > 0,
      expConcepto: S.expConcepto, setExpConcepto, expMonto: S.expMonto, setExpMonto, expCats, addExpense, canAddExp, addDisabled: !canAddExp,
      waiterTables, waiterEmpty,
      cocinaHist, cocinaHistStats, cocinaHistEmpty: cocinaHist.length === 0,
      barraHist, barraHistStats, barraHistEmpty: barraHist.length === 0,
      meseroHist, meseroHistStats, meseroHistEmpty: meseroHist.length === 0,
      cajaByMethod, cajaRows, cajaSummary, overShort, fondoVal: String(S.caja.fondo), contadoVal: S.caja.contado, setFondo, setContado, cobradoFmt: money(cobradoTotal),
      corteConfirm: S.corteConfirm, askCorte, cancelCorte, corteZ, corteHasVentas: cobradoTotal > 0, showCorteBtn: (cobradoTotal > 0 && !S.corteConfirm),
      cortesList: (S.cortes || []).map(c => ({ id: c.id, fecha: c.fecha, hora: c.hora, cerradoPor: c.cerradoPor, cobrado: money(c.cobrado || 0), tickets: String(c.tickets || 0), diffFmt: (c.diff == null ? '—' : ((c.diff > 0 ? '+' : '') + money(c.diff))), diffColor: (c.diff == null ? '#8c7a63' : (c.diff === 0 ? '#6bbf7a' : (c.diff > 0 ? '#e0b34f' : '#e5544a'))) })),
      cortesEmpty: (S.cortes || []).length === 0,
      rendStations, rendStaff, rendEmpty,
      kpis, recentOrders, recentCount: recentOrders.length, noOrders: orders.length === 0,
      topDishes, noTop: topDishes.length === 0,
      columns, boardEmpty: boardCount === 0, boardHas: boardCount > 0, channelChips, byChannel, byStation,
      cocinaColumns, cocinaEmpty: cocinaAllEmpty,
      barraRounds, barraEmpty: barraRounds.length === 0, barServed, barServedHas: barServed.length > 0,
      meseroTables, meseroEmpty,
      reservasList, noRes: (S.reservations || []).length === 0,
      zonesView, tableDetail, hasTableDetail: !!tableDetail, menuList, menuEditable, menuItemLabel, unavailAlerts, hasUnavailAlerts, teamList, memberDetail, hasMemberDetail: !!memberDetail,
      monStations, monAlertRows, monNoAlerts, monFeed, monFeedEmpty, monKpis,
    }
  }

  return (
    <div className="brasa-root" style={{ minHeight: '100vh', fontFamily: "'Inter',system-ui,sans-serif", background: '#140f09', color: '#f2e8da' }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" />
      <style>{`
        .brasa-root *{box-sizing:border-box}
        .brasa-root .serif{font-family:'Cormorant Garamond',serif}
        .brasa-root ::-webkit-scrollbar{width:9px;height:9px}
        .brasa-root ::-webkit-scrollbar-thumb{background:#3a2c1e;border-radius:8px}
        .brasa-root ::-webkit-scrollbar-track{background:transparent}
        .brasa-root input:focus{outline:none;border-color:#d1642f!important}
        @keyframes pIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes cardIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
      `}</style>

      <div style={{ minHeight: '100vh', background: 'radial-gradient(120% 90% at 100% 0%,#1d140c,#120d07 70%)' }}>

        {/* ==================== LOGIN ==================== */}
        {v.notLogged && (
          <div className="dcol-2" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.05fr .95fr' }}>
            <div style={{ position: 'relative', background: 'linear-gradient(160deg,#c8492b,#2a1a10 85%)', padding: '56px 54px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,180,120,.35),transparent 70%)' }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'rgba(0,0,0,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🔥</span>
                <span className="serif" style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '.26em', paddingLeft: '.26em' }}>BRASA</span>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.22em', color: 'rgba(255,255,255,.7)', marginBottom: '16px' }}>{c.login.kicker}</div>
                <h1 className="serif" style={{ fontSize: 'clamp(34px,4vw,52px)', fontWeight: 600, lineHeight: 1.02, margin: 0, maxWidth: '14ch' }}>{c.login.headline}</h1>
                <p style={{ fontSize: '14.5px', color: 'rgba(255,255,255,.8)', lineHeight: 1.6, maxWidth: '44ch', margin: '18px 0 0' }}>{c.login.sub}</p>
              </div>
              <div style={{ position: 'relative', display: 'flex', gap: '26px', fontSize: '13px', color: 'rgba(255,255,255,.75)' }}>
                <div><div className="serif" style={{ fontSize: '30px', fontWeight: 600, color: '#fff' }}>4</div>{c.login.statRoles}</div>
                <div><div className="serif" style={{ fontSize: '30px', fontWeight: 600, color: '#fff' }}>Live</div>{c.login.statSync}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 46px' }}>
              <div style={{ width: '100%', maxWidth: '380px', animation: 'pIn .5s ease both' }}>
                <h2 className="serif" style={{ fontSize: '30px', fontWeight: 600, margin: '0 0 4px' }}>{c.login.title}</h2>
                <p style={{ margin: '0 0 24px', fontSize: '13.5px', color: '#a8977f' }}>{c.login.intro}</p>
                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.08em', color: '#a8977f', marginBottom: '6px' }}>{c.login.emailLabel}</label>
                <input value={v.liEmail} onChange={v.onLiEmail} placeholder={c.login.emailPh} style={{ width: '100%', background: '#211810', border: '1px solid #3a2c1e', borderRadius: '11px', padding: '13px 14px', fontSize: '14px', color: '#f2e8da', marginBottom: '14px' }} />
                <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.08em', color: '#a8977f', marginBottom: '6px' }}>{c.login.passLabel}</label>
                <input value={v.liPass} onChange={v.onLiPass} type="password" placeholder="••••" style={{ width: '100%', background: '#211810', border: '1px solid #3a2c1e', borderRadius: '11px', padding: '13px 14px', fontSize: '14px', color: '#f2e8da' }} />
                {v.loginErr && <div style={{ marginTop: '12px', background: 'rgba(200,80,46,.12)', border: '1px solid rgba(200,80,46,.35)', color: '#e8934f', borderRadius: '10px', padding: '9px 12px', fontSize: '12.5px' }}>{v.loginErr}</div>}
                <button onClick={v.doLogin} style={{ width: '100%', marginTop: '18px', background: '#d1642f', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', cursor: 'pointer', fontSize: '14.5px', fontWeight: 600 }}>{c.login.enterBtn}</button>
                <div style={{ marginTop: '22px', paddingTop: '20px', borderTop: '1px solid #2a2016' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.1em', color: '#8c7a63', marginBottom: '11px' }}>{c.login.quickAccess}</div>
                  <div className="dcards-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' }}>
                    {v.roleCards.map(r => (
                      <button key={r.email} onClick={r.onClick} style={{ textAlign: 'left', background: '#1e160e', border: '1px solid #33261a', borderRadius: '11px', padding: '11px 12px', cursor: 'pointer' }}>
                        <div style={{ fontSize: '16px', marginBottom: '4px' }}>{r.emoji}</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#f2e8da' }}>{r.label}</div>
                        <div style={{ fontSize: '10.5px', color: '#8c7a63', marginTop: '1px' }}>{r.email}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6f5f4a', marginTop: '12px' }}>{c.login.passDemo} <b style={{ color: '#a8977f' }}>1234</b></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== DASHBOARD ==================== */}
        {v.isLogged && (
          <div className="dshell-flex" style={{ display: 'flex', minHeight: '100vh' }}>
            {/* SIDEBAR */}
            {navOpen && <div className="dshell-backdrop" onClick={() => setNavOpen(false)} />}
            <aside className={`dshell-nav${navOpen ? ' is-open' : ''}`} style={{ width: '236px', flexShrink: 0, background: '#180f08', borderRight: '1px solid #2a2016', display: 'flex', flexDirection: 'column', padding: '22px 16px', position: 'sticky', top: 0, height: '100vh' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '0 8px 22px' }}>
                <span style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'linear-gradient(150deg,#d1642f,#7d2a15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px' }}>🔥</span>
                <div><div className="serif" style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '.2em', lineHeight: 1 }}>BRASA</div><div style={{ fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '.16em', color: '#8c7a63' }}>{c.panelWord}</div></div>
              </div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                {v.nav.map((n, i) => (
                  <button key={i} onClick={() => { n.onClick(); setNavOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: '11px', textAlign: 'left', background: n.bg, border: 'none', color: n.color, padding: '11px 13px', borderRadius: '10px', cursor: 'pointer', fontSize: '13.5px', fontWeight: n.weight }}>
                    <span style={{ width: '20px', textAlign: 'center' }}>{n.emoji}</span>{n.label}<span style={{ flex: 1 }} />
                    {n.badge && <span style={{ background: '#d1642f', color: '#fff', fontSize: '10.5px', fontWeight: 700, minWidth: '19px', height: '19px', padding: '0 5px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n.badge}</span>}
                  </button>
                ))}
              </nav>
              <div style={{ borderTop: '1px solid #2a2016', paddingTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(150deg,#d1642f,#7d2a15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>{v.staffInitial}</span>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.staffName}</div><div style={{ fontSize: '11px', color: '#8c7a63' }}>{v.roleLabel}</div></div>
                <button onClick={v.logout} title={c.logoutTitle} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #33261a', background: '#1e160e', color: '#a8977f', cursor: 'pointer' }}>⎋</button>
              </div>
            </aside>

            {/* MAIN */}
            <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <header className="dpanel-head" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 30px', borderBottom: '1px solid #2a2016', position: 'sticky', top: 0, background: 'rgba(20,15,9,.85)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
                <button className="dshell-hamb" onClick={() => setNavOpen(true)} aria-label="Menu" aria-expanded={navOpen} style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid #33261a', background: '#211810', color: '#f2e8da', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg></button>
                <div className="dpanel-titlewrap"><h1 className="serif dpanel-title" style={{ fontSize: '27px', fontWeight: 600, margin: 0, lineHeight: 1 }}>{v.viewTitle}</h1><div className="dpanel-sub" style={{ fontSize: '12px', color: '#8c7a63', marginTop: '3px' }}>{v.viewSubtitle}</div></div>
                <div className="dpanel-spacer" style={{ flex: 1 }} />
                <div className="dpanel-live" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#8c7a63', flexShrink: 0 }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6bbf7a', animation: 'pulse 1.8s infinite', flexShrink: 0 }} /><span className="dpanel-live-txt">{c.live}</span></div>
                <button className="dpanel-refresh" onClick={v.refresh} aria-label={c.refresh} style={{ background: '#1e160e', border: '1px solid #33261a', color: '#f2e8da', padding: '9px 15px', borderRadius: '9px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600, flexShrink: 0 }}>{c.refresh}</button>
              </header>

              <div className="dpanel-body" style={{ flex: 1, overflow: 'auto', padding: '28px 30px 60px' }}>

                {/* RESUMEN */}
                {v.isResumen && (
                  <>
                    <div className="dstat" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '16px', marginBottom: '26px' }}>
                      {v.kpis.map((k, i) => (
                        <div key={i} style={{ background: 'linear-gradient(160deg,#211810,#1a120b)', border: '1px solid #2f2418', borderRadius: '16px', padding: '20px', animation: 'cardIn .4s ease both' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '.09em', color: '#8c7a63' }}>{k.label}</div><span style={{ fontSize: '18px' }}>{k.emoji}</span></div>
                          <div className="serif dkpi-num" style={{ fontSize: '38px', fontWeight: 600, color: '#fff', marginTop: '8px', lineHeight: 1 }}>{k.value}</div>
                          <div style={{ fontSize: '11.5px', color: '#8c7a63', marginTop: '4px' }}>{k.sub}</div>
                        </div>
                      ))}
                    </div>
                    <div className="dcol-2" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '18px' }}>
                      <div style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', padding: '22px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}><h3 className="serif" style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>{c.resumen.recientes}</h3><span style={{ fontSize: '12px', color: '#8c7a63' }}>{c.resumen.ultimos} {v.recentCount}</span></div>
                        {v.noOrders && <div style={{ padding: '30px', textAlign: 'center', color: '#8c7a63', fontSize: '13px' }}>{c.resumen.noOrders}</div>}
                        {v.recentOrders.map((o, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderTop: '1px solid #241a10' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#231910', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#e8934f', flexShrink: 0 }}>{o.code}</div>
                            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: '13.5px', fontWeight: 600 }}>{o.customer}</div><div style={{ fontSize: '11.5px', color: '#8c7a63', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.summary}</div></div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}><div className="serif" style={{ fontSize: '18px', fontWeight: 600 }}>{o.totalFmt}</div><span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: o.stColor, background: o.stBg, padding: '3px 8px', borderRadius: '20px' }}>{o.stLabel}</span></div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', padding: '22px' }}>
                        <h3 className="serif" style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 16px' }}>{c.resumen.topDishes}</h3>
                        {v.noTop && <div style={{ padding: '20px 0', color: '#8c7a63', fontSize: '13px' }}>{c.resumen.noTop}</div>}
                        {v.topDishes.map((t, i) => (
                          <div key={i} style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}><span style={{ fontWeight: 600 }}>{t.name}</span><span style={{ color: '#8c7a63' }}>{t.qty}</span></div>
                            <div style={{ height: '7px', background: '#241a10', borderRadius: '6px', overflow: 'hidden' }}><div style={{ height: '100%', width: t.pct, background: 'linear-gradient(90deg,#d1642f,#e8934f)', borderRadius: '6px' }} /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="dcards-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginTop: '18px' }}>
                      <div style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', padding: '22px' }}>
                        <h3 className="serif" style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 16px' }}>{c.resumen.ventasCanal}</h3>
                        {v.byChannel.map((ch, i) => (
                          <div key={i} style={{ marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}><span style={{ fontWeight: 600 }}>{ch.mode}</span><span style={{ color: '#c9b79c' }}>{ch.amount} <span style={{ color: '#8c7a63' }}>· {ch.n}</span></span></div>
                            <div style={{ height: '8px', background: '#241a10', borderRadius: '6px', overflow: 'hidden' }}><div style={{ height: '100%', width: ch.pct, background: 'linear-gradient(90deg,#d1642f,#e8934f)', borderRadius: '6px' }} /></div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', padding: '22px' }}>
                        <h3 className="serif" style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 16px' }}>{c.resumen.cocinaBarra}</h3>
                        {v.byStation.map((s, i) => (
                          <div key={i} style={{ marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}><span style={{ fontWeight: 600 }}>{s.label}</span><span style={{ color: '#8c7a63' }}>{s.qty} {c.resumen.platos} · {s.pct}</span></div>
                            <div style={{ height: '8px', background: '#241a10', borderRadius: '6px', overflow: 'hidden' }}><div style={{ height: '100%', width: s.pct, background: s.color, borderRadius: '6px' }} /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* SHARED channel filter */}
                {v.isBoardLike && (
                  <div style={{ display: 'flex', gap: '9px', flexWrap: 'wrap', marginBottom: '18px' }}>
                    {v.channelChips.map((c, i) => (
                      <button key={i} onClick={c.onClick} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: c.bg, border: '1px solid ' + c.border, color: c.color, padding: '8px 14px', borderRadius: '9px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600 }}>{c.label}<span style={{ fontSize: '11px', opacity: .7 }}>{c.count}</span></button>
                    ))}
                  </div>
                )}

                {/* MONITOR DE OPERACIONES (admin, solo lectura) */}
                {v.isKanban && (
                  <>
                    <div className="dcards-5 dstat" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px', marginBottom: '18px' }}>
                      {v.monKpis.map((k, i) => (
                        <div key={i} style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '14px', padding: '16px 18px' }}>
                          <div style={{ fontSize: '30px', fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
                          <div style={{ fontSize: '11.5px', color: '#8c7a63', marginTop: '6px', fontWeight: 600 }}>{k.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="dcol-2" style={{ display: 'grid', gridTemplateColumns: '1.15fr .85fr', gap: '16px', alignItems: 'start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="dcards-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          {v.monStations.map((s, i) => (
                            <div key={i} style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', padding: '18px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                <span style={{ fontSize: '20px' }}>{s.emoji}</span>
                                <span style={{ fontSize: '16px', fontWeight: 700, color: '#f2e8da' }}>{s.label}</span>
                                <span style={{ flex: 1 }} />
                                <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase', color: s.stColor, background: s.stBg, padding: '4px 10px', borderRadius: '20px' }}>{s.stLabel}</span>
                              </div>
                              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                                <div style={{ flex: 1, background: '#160f08', border: '1px solid #2a2016', borderRadius: '10px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: 800, color: '#e8934f' }}>{s.cola}</div><div style={{ fontSize: '10px', color: '#8c7a63', marginTop: '3px' }}>{c.mon.enCola}</div></div>
                                <div style={{ flex: 1, background: '#160f08', border: '1px solid #2a2016', borderRadius: '10px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: 800, color: '#e0b34f' }}>{s.prep}</div><div style={{ fontSize: '10px', color: '#8c7a63', marginTop: '3px' }}>{c.mon.preparando}</div></div>
                                <div style={{ flex: 1, background: '#160f08', border: '1px solid #2a2016', borderRadius: '10px', padding: '10px', textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: 800, color: '#6bbf7a' }}>{s.ready}</div><div style={{ fontSize: '10px', color: '#8c7a63', marginTop: '3px' }}>{c.mon.listo}</div></div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px solid #241a10', paddingTop: '12px' }}>
                                <span style={{ color: '#a8977f' }}>👤 {s.crewNames}</span>
                                <span style={{ color: '#8c7a63' }}>{c.mon.masAntigua} · <span style={{ color: '#c9b79c', fontWeight: 700 }}>{s.oldestLabel}</span></span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', padding: '18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}><span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#6bbf7a', animation: 'pulse 1.6s ease-in-out infinite' }} /><h3 className="serif" style={{ fontSize: '17px', fontWeight: 600, margin: 0 }}>{c.mon.flujo}</h3><span style={{ flex: 1 }} /><span style={{ fontSize: '11px', color: '#8c7a63' }}>{c.mon.soloLectura}</span></div>
                          {v.monFeedEmpty && <div style={{ textAlign: 'center', color: '#8c7a63', padding: '40px 0', fontSize: '13px' }}>{c.mon.sinComandas}</div>}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {v.monFeed.map((o, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#160f08', border: '1px solid #241a10', borderRadius: '11px', padding: '11px 13px' }}>
                                <div style={{ minWidth: '56px' }}><div style={{ fontSize: '12.5px', fontWeight: 700, color: '#e8934f' }}>{o.code}</div><div style={{ fontSize: '10px', color: '#8c7a63', marginTop: '2px' }}>{o.dest}</div></div>
                                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: '12.5px', color: '#e6d8c6', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.summary}</div><div style={{ fontSize: '10.5px', color: o.stColor, marginTop: '3px', fontWeight: 600 }}>{o.stLabel}</div></div>
                                <span style={{ fontSize: '10.5px', fontWeight: 700, color: o.stageColor, background: o.stageBg, padding: '4px 9px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{o.stageLabel}</span>
                                <span style={{ fontSize: '11.5px', fontWeight: 700, color: o.timeColor, minWidth: '44px', textAlign: 'right' }}>{o.timeLabel}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', padding: '18px', position: 'sticky', top: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}><span style={{ fontSize: '16px' }}>⚠️</span><h3 className="serif" style={{ fontSize: '17px', fontWeight: 600, margin: 0 }}>{c.mon.atencion}</h3></div>
                        {v.monNoAlerts && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '34px 0', textAlign: 'center' }}><span style={{ fontSize: '30px' }}>✅</span><div style={{ fontSize: '13.5px', color: '#6bbf7a', fontWeight: 600 }}>{c.mon.bajoControl}</div><div style={{ fontSize: '12px', color: '#8c7a63' }}>{c.mon.sinExceso}</div></div>}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                          {v.monAlertRows.map((a, i) => (
                            <div key={i} style={{ display: 'flex', gap: '11px', alignItems: 'flex-start', background: a.bg, border: '1px solid ' + a.border, borderRadius: '11px', padding: '11px 12px' }}>
                              <span style={{ fontSize: '15px' }}>{a.icon}</span>
                              <div style={{ minWidth: 0 }}><div style={{ fontSize: '12.5px', color: '#f2e8da' }}><span style={{ fontWeight: 700, color: a.color }}>{a.code}</span> {a.text}</div><div style={{ fontSize: '10.5px', color: '#9c8a70', marginTop: '2px' }}>{a.who}</div></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* COCINA + BARRA: Kanban por estado */}
                {v.isStation && (
                  <>
                    {v.cocinaEmpty && <div style={{ background: '#1a120b', border: '1px dashed #33261a', borderRadius: '16px', padding: '60px', textAlign: 'center', color: '#8c7a63' }}><div style={{ fontSize: '34px', marginBottom: '10px' }}>👨‍🍳</div><div style={{ fontSize: '15px', fontWeight: 600, color: '#c9b79c' }}>{c.kds.empty1}</div><div style={{ fontSize: '13px', marginTop: '5px' }}>{c.kds.empty2}</div></div>}
                    <div className="dcards-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: '12px', alignItems: 'start' }}>
                      {v.cocinaColumns.map((col) => (
                        <div key={col.key} style={{ background: '#160f08', border: '1px solid #2a2016', borderRadius: '14px', padding: '12px', minWidth: 0, minHeight: '140px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 6px 13px' }}>
                            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: col.color }} />
                            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em', color: '#c9b79c' }}>{col.label}</span>
                            <span style={{ flex: 1 }} />
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#8c7a63', background: '#211810', minWidth: '22px', height: '22px', padding: '0 7px', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{col.count}</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {col.cards.map((t) => (
                              <div key={t.code}>
                                {t.normal && (
                                  <div style={{ background: '#211810', border: '1px solid ' + t.cardBorder, borderRadius: '12px', padding: '13px', animation: 'cardIn .3s ease both' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '9px' }}>
                                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#e8934f' }}>{t.code}</span>
                                      <span style={{ fontSize: '11px', fontWeight: 700, color: t.timerColor, background: t.timerBg, padding: '2px 8px', borderRadius: '20px' }}>⏱ {t.timerLabel}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
                                      <span style={{ fontSize: '10px', fontWeight: 600, background: '#2a1f14', color: '#c9b79c', padding: '3px 8px', borderRadius: '20px' }}>{t.mode}</span>
                                      {t.isTableOrder && <span style={{ fontSize: '10px', fontWeight: 800, background: 'rgba(122,184,232,.14)', color: '#7ab8e8', padding: '3px 8px', borderRadius: '20px' }}>→ {t.destLabel}</span>}
                                      <span style={{ fontSize: '10.5px', color: '#8c7a63', padding: '3px 0' }}>{t.customer} · {t.caption}</span>
                                      {t.showTotal && <span title={es ? 'Tiempo total en cocina desde que llegó' : 'Total time in kitchen since it arrived'} style={{ fontSize: '10px', fontWeight: 700, color: t.totalColor, background: '#211810', border: '1px solid #33261a', padding: '2px 8px', borderRadius: '20px' }}>Σ {t.totalLabel}</span>}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
                                      {t.items.map((it, ii) => (
                                        <div key={ii} style={{ display: 'flex', gap: '9px', fontSize: '14px', alignItems: 'baseline' }}><span style={{ color: '#e8934f', fontWeight: 800, minWidth: '24px' }}>{it.qty}×</span><div style={{ minWidth: 0 }}><span style={{ color: '#e6d8c6', fontWeight: 600 }}>{it.name}</span>{it.hasNote && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '3px', background: 'rgba(224,179,79,.13)', border: '1px solid rgba(224,179,79,.32)', borderRadius: '7px', padding: '2px 8px', fontSize: '11.5px', fontWeight: 600, color: '#f0d9a8' }}>✎ {it.note}</div>}</div></div>
                                      ))}
                                    </div>
                                    {t.hasNote && <div style={{ display: 'flex', gap: '8px', background: 'rgba(224,179,79,.1)', border: '1px solid rgba(224,179,79,.28)', borderRadius: '9px', padding: '8px 10px', marginBottom: '11px' }}><span style={{ fontSize: '12px' }}>✎</span><div style={{ minWidth: 0 }}><div style={{ fontSize: '11.5px', color: '#f0d9a8', lineHeight: 1.35 }}>{t.noteText}</div><div style={{ fontSize: '10px', color: '#9c8a63', marginTop: '2px' }}>— {t.noteBy}</div></div></div>}
                                    {t.hasAction && t.aFn && <button onClick={t.aFn} style={{ width: '100%', background: t.aBg, color: t.aColor, border: '1px solid ' + t.aBorder, padding: '10px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>{t.aLabel}</button>}
                                    {t.showCancelLink && <button onClick={t.askCancel} style={{ width: '100%', marginTop: '7px', background: 'transparent', border: 'none', color: '#8c7a63', padding: '5px', cursor: 'pointer', fontSize: '11.5px', fontWeight: 600 }}>{c.kds.cancelLink}</button>}
                                    {t.showRecallLink && <button onClick={t.askRecall} style={{ width: '100%', marginTop: '5px', background: 'transparent', border: 'none', color: '#8c7a63', padding: '5px', cursor: 'pointer', fontSize: '11.5px', fontWeight: 600 }}>{t.recallLabel}</button>}
                                    {t.isRecalling && (
                                      <div style={{ marginTop: '9px', background: 'rgba(224,179,79,.08)', border: '1px solid rgba(224,179,79,.3)', borderRadius: '10px', padding: '10px' }}>
                                        <div style={{ fontSize: '11.5px', color: '#e6d8c6', marginBottom: '8px' }}>{t.recallLabel} {c.kds.motivoIntro}</div>
                                        <textarea value={t.recallNote} onChange={t.setRecallNote} placeholder={c.kds.motivoPh} style={{ width: '100%', boxSizing: 'border-box', background: '#211810', border: '1px solid #33261a', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', color: '#f2e8da', fontFamily: 'inherit', resize: 'vertical', minHeight: '48px', marginBottom: '8px' }} />
                                        <div style={{ display: 'flex', gap: '7px' }}>
                                          <button onClick={t.doRecall} style={{ flex: 1, background: '#e0b34f', color: '#241a10', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>{c.kds.regresar}</button>
                                          <button onClick={t.noRecall} style={{ background: 'transparent', border: '1px solid #33261a', color: '#a8977f', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>{c.kds.cancel}</button>
                                        </div>
                                      </div>
                                    )}
                                    {t.isCanceling && (
                                      <div style={{ marginTop: '9px', background: 'rgba(229,84,74,.08)', border: '1px solid rgba(229,84,74,.3)', borderRadius: '10px', padding: '10px' }}>
                                        <div style={{ fontSize: '11.5px', color: '#e6d8c6', marginBottom: '9px' }}>{c.kds.cancelConfirm}</div>
                                        <div style={{ display: 'flex', gap: '7px' }}>
                                          <button onClick={t.doCancel} style={{ flex: 1, background: '#e5544a', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>{c.kds.siCancelar}</button>
                                          <button onClick={t.noCancel} style={{ background: 'transparent', border: '1px solid #33261a', color: '#a8977f', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>{c.kds.no}</button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                {t.isCancel && (
                                  <div style={{ background: '#170f0a', border: '1px dashed #4a2a26', borderRadius: '12px', padding: '13px', opacity: .75 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#c98a80', textDecoration: 'line-through' }}>{t.code}</span>
                                      <span style={{ fontSize: '9.5px', fontWeight: 800, letterSpacing: '.05em', color: '#e5544a', background: 'rgba(229,84,74,.14)', padding: '3px 8px', borderRadius: '20px' }}>{c.kds.canceladoBadge}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '9px' }}><span style={{ fontSize: '10px', fontWeight: 600, background: '#2a1714', color: '#c9a59f', padding: '3px 8px', borderRadius: '20px' }}>{t.mode}</span><span style={{ fontSize: '10.5px', color: '#8c7a63' }}>{t.customer}</span></div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                                      {t.items.map((it, ii) => (<div key={ii} style={{ display: 'flex', gap: '9px', fontSize: '13.5px', alignItems: 'baseline' }}><span style={{ color: '#a56a62', fontWeight: 800, minWidth: '24px', textDecoration: 'line-through' }}>{it.qty}×</span><span style={{ color: '#9a8b82', fontWeight: 600, textDecoration: 'line-through' }}>{it.name}</span></div>))}
                                    </div>
                                    <div style={{ fontSize: '10.5px', color: '#8c7a63', borderTop: '1px solid #2a1714', paddingTop: '8px' }}>{c.kds.canceladoPor} {t.canceledBy} · {t.canceledTime}</div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* MESERO: tablero por acción */}
                {v.isMesero && (
                  <>
                    {v.hasUnavailAlerts && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', background: '#1a120b', border: '1px solid #33261a', borderRadius: '14px', padding: '12px 16px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: '#c9a76a' }}>{c.mesero.noOfrecer}</span>
                        {v.unavailAlerts.map((u, i) => (<span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: u.color, background: u.bg, border: '1px solid ' + u.border, padding: '4px 11px', borderRadius: '20px' }}><span style={{ opacity: .7 }}>{u.station}</span> {u.name} · {u.label}</span>))}
                      </div>
                    )}
                    {v.meseroEmpty && <div style={{ background: '#1a120b', border: '1px dashed #33261a', borderRadius: '16px', padding: '60px', textAlign: 'center', color: '#8c7a63' }}><div style={{ fontSize: '34px', marginBottom: '10px' }}>🍽️</div><div style={{ fontSize: '15px', fontWeight: 600, color: '#c9b79c' }}>{c.mesero.sinServicios}</div><div style={{ fontSize: '13px', marginTop: '5px' }}>{c.mesero.sinServicios2}</div></div>}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '16px', alignItems: 'start' }}>
                      {v.meseroTables.map((t) => (
                        <div key={t.key} style={{ background: t.cardBg, border: '1px solid ' + t.cardBorder, borderRadius: '16px', padding: '18px', minWidth: 0, animation: 'cardIn .3s ease both' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '16px' }}>{t.headerIcon}</span><span className="serif" style={{ fontSize: '21px', fontWeight: 600, color: '#f2e8da' }}>{t.title}</span></div>
                              <div style={{ fontSize: '11.5px', color: '#a8977f', marginTop: '2px' }}>{t.sub}</div>
                            </div>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: t.timerColor, background: t.timerBg, padding: '5px 11px', borderRadius: '20px', whiteSpace: 'nowrap' }}>⏱ {t.timerLabel}</span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#8c7a63', marginBottom: '12px' }}>{t.guestsSub}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                            {t.statusChips.map((c, i) => (<span key={i} style={{ fontSize: '10.5px', fontWeight: 700, color: c.color, background: c.bg, padding: '3px 10px', borderRadius: '20px' }}>{c.label}</span>))}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '15px' }}>
                            {t.guestLines.map((g, gi) => (
                              <div key={gi} style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: '#c98a52', marginBottom: '5px' }}>{g.guest}</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                  {g.items.map((it, ii) => (
                                    <div key={ii} style={{ display: 'flex', gap: '9px', fontSize: '13.5px', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                      <span style={{ display: 'flex', gap: '9px', alignItems: 'baseline', minWidth: 0, flexWrap: 'wrap' }}>
                                        <span style={{ color: it.dot, fontWeight: 800, minWidth: '20px', opacity: Number(it.rowOpacity) }}>{it.qty}×</span>
                                        <span style={{ color: it.nameColor, fontWeight: 600, textDecoration: it.nameDecoration, opacity: Number(it.rowOpacity) }}>{it.name}</span>
                                        {it.showSeat && <span title={(es ? 'Asiento ' : 'Seat ') + it.seat} style={{ fontSize: '9.5px', fontWeight: 700, color: '#b79a74', background: 'rgba(183,154,116,.14)', padding: '2px 7px', borderRadius: '20px', whiteSpace: 'nowrap', opacity: Number(it.rowOpacity) }}>🪑 {it.seat}</span>}
                                        {it.showBadge && <span onClick={it.tap || undefined} title={it.badgeTitle} style={{ fontSize: '9.5px', fontWeight: 700, color: it.badgeColor, background: it.badgeBg, padding: '2px 8px', borderRadius: '20px', whiteSpace: 'nowrap', letterSpacing: '.02em', cursor: it.badgeCursor, userSelect: 'none' }}>{it.badgeLabel}</span>}
                                      </span>
                                      <span style={{ color: '#a8977f', fontWeight: 600, whiteSpace: 'nowrap' }}>{it.priceFmt}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          {t.showDecision && (
                            <div style={{ background: 'rgba(224,179,79,.07)', border: '1px solid rgba(224,179,79,.28)', borderRadius: '11px', padding: '11px 12px', marginBottom: '4px' }}>
                              <div style={{ fontSize: '11.5px', color: '#f0d9a8', lineHeight: 1.4, marginBottom: '9px' }}>{c.mesero.decisionIntro} <strong style={{ color: '#f2e8da' }}>{c.mesero.preguntaComensal}</strong></div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={t.setAsReady} style={{ flex: 1, background: 'rgba(60,149,87,.18)', border: '1px solid #3c9557', color: '#dff5e6', padding: '9px 8px', borderRadius: '9px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, lineHeight: 1.25 }}>{c.mesero.servirListo}</button>
                                <button onClick={t.setTogether} style={{ flex: 1, background: 'rgba(224,179,79,.14)', border: '1px solid #5c4a2a', color: '#f0d9a8', padding: '9px 8px', borderRadius: '9px', cursor: 'pointer', fontSize: '12px', fontWeight: 700, lineHeight: 1.25 }}>{c.mesero.esperarTodo}</button>
                              </div>
                            </div>
                          )}
                          {t.showHold && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1a120b', border: '1px solid #2a2016', borderRadius: '10px', padding: '9px 12px', marginBottom: '4px' }}><span style={{ fontSize: '13px' }}>⏳</span><span style={{ fontSize: '11.5px', color: '#c9b79c', fontWeight: 600, lineHeight: 1.3 }}>{c.mesero.holdMsg}</span><button onClick={t.setAsReady} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#c98a52', fontSize: '11px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{c.mesero.servirYa}</button></div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,.07)' }}>
                            <div><div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '.07em', color: '#8c7a63' }}>{t.billLabel}</div><div className="serif" style={{ fontSize: '24px', fontWeight: 600, color: '#f2e8da' }}>{t.totalFmt}</div>{t.showSplit && <div style={{ fontSize: '10.5px', color: '#8c7a63', marginTop: '1px' }}>{c.mesero.dividido} {t.splitFmt}</div>}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', alignItems: 'flex-end' }}>
                              {t.canDeliver && <button onClick={t.deliver} style={{ background: '#2f7a45', color: '#dff5e6', border: 'none', padding: '11px 17px', borderRadius: '11px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap' }}>{t.deliverLabel}</button>}
                              {t.showChargeBtn && <button onClick={t.openCharge} style={{ background: '#d1642f', color: '#fff', border: 'none', padding: '11px 17px', borderRadius: '11px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap' }}>{t.chargeLabel}</button>}
                            </div>
                          </div>
                          {t.isTender && (
                            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #2a2016' }}>
                              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.08em', color: '#8c7a63', marginBottom: '9px' }}>{c.mesero.cobrar} {t.totalFmt} · {c.mesero.comoPaga}</div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                <button onClick={t.payEfectivo} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: '#211810', border: '1px solid #33261a', color: '#f2e8da', padding: '11px 4px', borderRadius: '11px', cursor: 'pointer', fontSize: '11.5px', fontWeight: 700 }}>💵<span>{c.pay.Efectivo}</span></button>
                                <button onClick={t.payTarjeta} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: '#211810', border: '1px solid #33261a', color: '#f2e8da', padding: '11px 4px', borderRadius: '11px', cursor: 'pointer', fontSize: '11.5px', fontWeight: 700 }}>💳<span>{c.pay.Tarjeta}</span></button>
                                <button onClick={t.payQR} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: '#211810', border: '1px solid #33261a', color: '#f2e8da', padding: '11px 4px', borderRadius: '11px', cursor: 'pointer', fontSize: '11.5px', fontWeight: 700 }}>📱<span>{c.pay.QR}</span></button>
                              </div>
                              <button onClick={t.cancelTender} style={{ marginTop: '8px', width: '100%', background: 'transparent', border: 'none', color: '#8c7a63', padding: '5px', cursor: 'pointer', fontSize: '11.5px' }}>{c.mesero.cancel}</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* RESERVAS */}
                {v.isReservas && (
                  <div className="dtable-wrap brasa-tbl" style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr .7fr .7fr .9fr', gap: '12px', padding: '14px 20px', borderBottom: '1px solid #2a2016', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.08em', color: '#8c7a63' }}>
                      <span>{c.reservas.cliente}</span><span>{c.reservas.fechaHora}</span><span>{c.reservas.personas}</span><span>{c.reservas.mesa}</span><span>{c.reservas.codigo}</span>
                    </div>
                    {v.noRes && <div style={{ padding: '40px', textAlign: 'center', color: '#8c7a63', fontSize: '13px' }}>{c.reservas.empty}</div>}
                    {v.reservasList.map((r, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr .7fr .7fr .9fr', gap: '12px', padding: '15px 20px', borderTop: '1px solid #241a10', alignItems: 'center', fontSize: '13.5px' }}>
                        <span style={{ fontWeight: 600 }}>{r.customer}</span><span style={{ color: '#c9b79c' }}>{r.datetime}</span><span>{r.party}</span><span style={{ color: '#e8934f', fontWeight: 600 }}>{r.table}</span><span style={{ fontSize: '12px', color: '#8c7a63' }}>{r.code}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* MESAS */}
                {v.isMesas && (
                  <>
                    {v.hasTableDetail && v.tableDetail && (
                      <div style={{ background: 'linear-gradient(160deg,#20160d,#160f08)', border: '1px solid #3a2c1e', borderRadius: '18px', padding: '22px', marginBottom: '22px', animation: 'cardIn .3s ease both' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'rgba(209,100,47,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🍽️</span><h3 className="serif" style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>{v.tableDetail.title}</h3></div>
                            <div style={{ fontSize: '12.5px', color: '#a8977f', marginTop: '6px' }}>{v.tableDetail.sub}</div>
                          </div>
                          <button onClick={v.tableDetail.close} style={{ background: 'transparent', border: '1px solid #3a2c1e', color: '#a8977f', width: '32px', height: '32px', borderRadius: '9px', cursor: 'pointer', fontSize: '15px' }}>✕</button>
                        </div>
                        <div className="dcards-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                          <div>
                            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.08em', color: '#e8934f', fontWeight: 700, marginBottom: '10px' }}>🍳 {c.mesas.platos} <span style={{ color: '#6f5f4a' }}>· {v.tableDetail.dishCount}</span></div>
                            {v.tableDetail.hasDishes && v.tableDetail.dishes.map((d, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '9px 0', borderTop: '1px solid #241a10' }}>
                                <div style={{ minWidth: 0 }}><div style={{ fontSize: '13.5px', fontWeight: 600, color: '#f2e8da' }}>{d.line}</div><div style={{ fontSize: '11px', color: '#8c7a63', marginTop: '1px' }}>{d.guest}</div></div>
                                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '13px', fontWeight: 700, color: '#e6d8c6', whiteSpace: 'nowrap' }}>{d.priceFmt}</span><span style={{ fontSize: '10px', fontWeight: 700, color: d.stColor, background: d.stBg, padding: '4px 9px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{d.stLabel}</span></div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.08em', color: '#7ab8e8', fontWeight: 700, marginBottom: '10px' }}>🍸 {c.mesas.bebidas} <span style={{ color: '#6f5f4a' }}>· {v.tableDetail.drinkCount}</span></div>
                            {v.tableDetail.hasDrinks ? v.tableDetail.drinks.map((b, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '9px 0', borderTop: '1px solid #241a10' }}>
                                <div style={{ minWidth: 0 }}><div style={{ fontSize: '13.5px', fontWeight: 600, color: '#f2e8da' }}>{b.line}</div><div style={{ fontSize: '11px', color: '#8c7a63', marginTop: '1px' }}>{b.guest}</div></div>
                                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '13px', fontWeight: 700, color: '#e6d8c6', whiteSpace: 'nowrap' }}>{b.priceFmt}</span><span style={{ fontSize: '10px', fontWeight: 700, color: b.stColor, background: b.stBg, padding: '4px 9px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{b.stLabel}</span></div>
                              </div>
                            )) : <div style={{ fontSize: '12.5px', color: '#6f5f4a', padding: '9px 0', borderTop: '1px solid #241a10' }}>{c.mesas.sinBebidas}</div>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #2f2418' }}>
                          <span style={{ fontSize: '12px', color: '#a8977f' }}>{v.tableDetail.pendLabel}</span>
                          <div style={{ textAlign: 'right' }}><div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '.08em', color: '#8c7a63' }}>{c.mesas.cuentaMesa}</div><div className="serif" style={{ fontSize: '24px', fontWeight: 600, color: '#e8934f' }}>{v.tableDetail.total}</div></div>
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                      {v.zonesView.map((z, zi) => (
                        <div key={zi}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><h3 className="serif" style={{ fontSize: '19px', fontWeight: 600, margin: 0 }}>{z.name}</h3><span style={{ fontSize: '12px', color: '#8c7a63' }}>{z.free} {c.mesas.libres} · {z.taken} {c.mesas.ocupadas}</span></div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(96px,1fr))', gap: '11px' }}>
                            {z.tables.map((t) => (
                              <button key={t.id} onClick={t.onClick} style={{ aspectRatio: '1', borderRadius: '13px', border: '1px solid ' + t.border, background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
                                <div className="serif" style={{ fontSize: '22px', fontWeight: 600, color: t.ink }}>{t.id}</div>
                                <div style={{ fontSize: '10px', color: t.subColor }}>{t.state}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* MENU */}
                {v.isMenu && (
                  <div className="brasa-menu" style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr .8fr .5fr 1.5fr', gap: '12px', padding: '14px 20px', borderBottom: '1px solid #2a2016', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.08em', color: '#8c7a63' }}><span>{v.menuItemLabel}</span><span>{c.menu.categoria}</span><span>{c.menu.precio}</span><span>{c.menu.disponibilidad}</span></div>
                    {v.menuList.map((m, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr .8fr .5fr 1.5fr', gap: '12px', padding: '14px 20px', borderTop: '1px solid #241a10', alignItems: 'center', fontSize: '13.5px' }}>
                        <span style={{ fontWeight: 600 }}>{m.name}</span><span style={{ color: '#8c7a63' }}>{m.cat}</span><span style={{ color: '#e8934f', fontWeight: 600 }}>{m.price}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 700, color: m.stColor, background: m.stBg, padding: '5px 11px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{m.stLabel}</span>
                          {v.menuEditable && (
                            <>
                              {m.isAvail && (
                                <>
                                  <button onClick={m.limit} style={{ background: 'transparent', color: '#e0b34f', border: '1px solid rgba(224,179,79,.4)', padding: '5px 11px', borderRadius: '20px', cursor: 'pointer', fontSize: '11.5px', fontWeight: 600 }}>{c.menu.limitar}</button>
                                  <button onClick={m.markOut} style={{ background: 'transparent', color: '#e5544a', border: '1px solid rgba(229,84,74,.4)', padding: '5px 11px', borderRadius: '20px', cursor: 'pointer', fontSize: '11.5px', fontWeight: 600 }}>{c.menu.marcarAgotado}</button>
                                </>
                              )}
                              {m.isLow && (
                                <>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', background: '#241a10', border: '1px solid #33261a', borderRadius: '20px', padding: '2px' }}>
                                    <button onClick={m.dec} style={{ width: '26px', height: '26px', borderRadius: '50%', border: 'none', background: '#2f2113', color: '#e6d8c6', cursor: 'pointer', fontSize: '15px', fontWeight: 700, lineHeight: 1 }}>−</button>
                                    <span style={{ minWidth: '22px', textAlign: 'center', fontSize: '13px', fontWeight: 700, color: '#e6cf8f' }}>{m.qty}</span>
                                    <button onClick={m.inc} style={{ width: '26px', height: '26px', borderRadius: '50%', border: 'none', background: '#2f2113', color: '#e6d8c6', cursor: 'pointer', fontSize: '15px', fontWeight: 700, lineHeight: 1 }}>+</button>
                                  </span>
                                  <button onClick={m.markOut} style={{ background: 'transparent', color: '#e5544a', border: '1px solid rgba(229,84,74,.4)', padding: '5px 11px', borderRadius: '20px', cursor: 'pointer', fontSize: '11.5px', fontWeight: 600 }}>{c.menu.agotar}</button>
                                  <button onClick={m.restock} style={{ background: 'transparent', color: '#6bbf7a', border: '1px solid rgba(107,191,122,.35)', padding: '5px 11px', borderRadius: '20px', cursor: 'pointer', fontSize: '11.5px', fontWeight: 600 }}>{c.menu.disponible}</button>
                                </>
                              )}
                              {m.isOut && <button onClick={m.restock} style={{ background: 'transparent', color: '#6bbf7a', border: '1px solid rgba(107,191,122,.35)', padding: '5px 11px', borderRadius: '20px', cursor: 'pointer', fontSize: '11.5px', fontWeight: 600 }}>{c.menu.reponer}</button>}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* EQUIPO */}
                {v.isEquipo && (
                  <>
                    <div style={{ display: 'flex', gap: '11px', alignItems: 'flex-start', background: 'rgba(232,147,79,.07)', border: '1px solid rgba(232,147,79,.22)', borderRadius: '13px', padding: '13px 16px', marginBottom: '16px' }}><span style={{ fontSize: '17px', lineHeight: 1.2 }}>👥</span><div style={{ fontSize: '12.5px', color: '#c9b79c', lineHeight: 1.55 }}><b style={{ color: '#f2e8da' }}>{c.equipo.tocaIntro1}</b> {c.equipo.tocaIntro2}</div></div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px' }}>
                      {v.teamList.map((p) => (
                        <div key={p.email} onClick={p.select} style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'border-color .15s,background .15s' }}>
                          <span style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(150deg,#d1642f,#7d2a15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '17px', flexShrink: 0 }}>{p.initial}</span>
                          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: '15px', fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: '12px', color: '#8c7a63' }}>{p.roleLabel}</div><div style={{ fontSize: '11.5px', color: '#6f5f4a', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.email}</div></div>
                          <span style={{ fontSize: '15px', color: '#6f5f4a', flexShrink: 0 }}>›</span>
                        </div>
                      ))}
                    </div>
                    {v.hasMemberDetail && v.memberDetail && (
                      <div style={{ background: 'linear-gradient(160deg,#20160d,#160f08)', border: '1px solid #3a2c1e', borderRadius: '18px', padding: '24px', marginTop: '22px', animation: 'cardIn .3s ease both' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <span style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(150deg,#d1642f,#7d2a15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '20px' }}>{v.memberDetail.initial}</span>
                            <div><div className="serif" style={{ fontSize: '22px', fontWeight: 600 }}>{v.memberDetail.name}</div><div style={{ fontSize: '12.5px', color: '#a8977f', marginTop: '2px' }}>{v.memberDetail.roleLabel} · {c.equipo.desempenoHoy}</div></div>
                          </div>
                          <button onClick={v.memberDetail.close} style={{ background: 'transparent', border: '1px solid #3a2c1e', color: '#a8977f', width: '34px', height: '34px', borderRadius: '9px', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                        </div>
                        <div className="dstat" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '12px', marginBottom: '20px' }}>
                          {v.memberDetail.kpis.map((k, i) => (
                            <div key={i} style={{ background: '#160f08', border: '1px solid #2a2016', borderRadius: '13px', padding: '15px 16px' }}>
                              <div style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '.05em', color: '#8c7a63' }}>{k.label}</div>
                              <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontVariantNumeric: 'tabular-nums', fontSize: '25px', fontWeight: 700, marginTop: '5px', letterSpacing: '-.01em', color: k.accent }}>{k.value}</div>
                            </div>
                          ))}
                        </div>
                        {v.memberDetail.methods && (
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                            {v.memberDetail.methods.map((m, i) => (
                              <div key={i} style={{ flex: 1, minWidth: '150px', background: '#160f08', border: '1px solid #2a2016', borderRadius: '13px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '20px' }}>{m.icon}</span>
                                <div><div style={{ fontSize: '11px', color: '#8c7a63' }}>{m.label}</div><div style={{ fontSize: '17px', fontWeight: 700, color: m.color, marginTop: '1px' }}>{m.value}</div></div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.08em', color: '#e8934f', fontWeight: 700, marginBottom: '6px' }}>{v.memberDetail.rowHead}</div>
                        {v.memberDetail.rowsEmpty && <div style={{ fontSize: '12.5px', color: '#6f5f4a', padding: '16px 0' }}>{c.equipo.sinActividad}</div>}
                        {v.memberDetail.rowsHas && (
                          <div style={{ background: '#160f08', border: '1px solid #2a2016', borderRadius: '13px', overflow: 'hidden' }}>
                            {v.memberDetail.rows.map((r, i) => (
                              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: '12px', padding: '12px 16px', borderTop: '1px solid #241a10', alignItems: 'center' }}>
                                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#8c7a63', fontVariantNumeric: 'tabular-nums' }}>{r.time}</span>
                                <div style={{ minWidth: 0 }}><div style={{ fontSize: '13px', color: '#e6d8c6', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</div><div style={{ fontSize: '11px', color: '#8c7a63', marginTop: '1px' }}>{r.method} · {r.count}</div></div>
                                <span style={{ fontSize: '14px', fontWeight: 700, color: '#6bbf7a', whiteSpace: 'nowrap' }}>{r.total}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* HISTORIAL COCINA */}
                {v.isHistC && (
                  <>
                    <div style={{ display: 'flex', gap: '11px', alignItems: 'flex-start', background: 'rgba(232,147,79,.07)', border: '1px solid rgba(232,147,79,.22)', borderRadius: '13px', padding: '13px 16px', marginBottom: '16px' }}><span style={{ fontSize: '17px', lineHeight: 1.2 }}>↩️</span><div style={{ fontSize: '12.5px', color: '#c9b79c', lineHeight: 1.55 }}><b style={{ color: '#f2e8da' }}>{c.histc.intro1}</b> {es ? 'Revísalas para ver cuánto tardaron, o toca' : 'Review them to see how long they took, or tap'} <b style={{ color: '#e8934f' }}>{c.histc.recuperarWord}</b> {c.histc.intro2}</div></div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
                      {v.cocinaHistStats.map((k, i) => (<div key={i} style={{ flex: 1, minWidth: '130px', background: '#1a120b', border: '1px solid #2a2016', borderRadius: '14px', padding: '14px 18px' }}><div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.05em', color: '#8c7a63' }}>{k.label}</div><div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontVariantNumeric: 'tabular-nums', fontSize: '26px', fontWeight: 700, color: '#f2e8da', marginTop: '4px', letterSpacing: '-.01em' }}>{k.value}</div></div>))}
                    </div>
                    {v.cocinaHistEmpty && <div style={{ background: '#1a120b', border: '1px dashed #33261a', borderRadius: '16px', padding: '50px', textAlign: 'center', color: '#8c7a63' }}><div style={{ fontSize: '30px', marginBottom: '8px' }}>📜</div><div style={{ fontSize: '14px', color: '#c9b79c' }}>{c.histc.empty1}</div><div style={{ fontSize: '12.5px', marginTop: '4px' }}>{c.histc.empty2}</div></div>}
                    <div className="dtable-wrap" style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', overflow: 'hidden' }}>
                      {v.cocinaHist.map((h, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto auto', gap: '14px', padding: '14px 20px', borderTop: '1px solid #241a10', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#6bbf7a' }}>✓ {h.time}</span>
                          <div style={{ minWidth: 0 }}><div style={{ fontSize: '13.5px', color: '#e6d8c6', fontWeight: 600 }}>{h.itemsLine}</div><div style={{ fontSize: '11.5px', color: '#8c7a63', marginTop: '2px' }}>{h.code} · {h.mode} · {h.customer} · 👨‍🍳 {h.cook}</div></div>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: '#8c7a63', background: '#241a10', padding: '4px 10px', borderRadius: '20px' }} title={es ? 'Cuánto esperó antes de que cocina la aceptara' : 'How long it waited before the kitchen accepted it'}><span style={{ opacity: .7 }}>{c.histc.espero}</span> {h.wait}</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: '#e0b34f', background: 'rgba(224,179,79,.14)', padding: '4px 10px', borderRadius: '20px' }} title={es ? 'Tiempo de cocción, de aceptada a lista' : 'Cook time, from accepted to ready'}><span style={{ opacity: .8, fontWeight: 600 }}>{c.histc.coccion}</span> {h.prep}</span>
                          <span style={{ fontSize: '12px', color: '#c9b79c', whiteSpace: 'nowrap' }}>{h.count} {c.histc.platos}</span>
                          <button onClick={h.recall} title={es ? 'Devolver esta comanda a la línea de cocina' : 'Send this ticket back to the kitchen line'} style={{ background: 'transparent', border: '1px solid #3a2c1c', color: '#c9b79c', fontSize: '11.5px', fontWeight: 600, padding: '6px 12px', borderRadius: '9px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{c.histc.recuperar}</button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* HISTORIAL BARRA */}
                {v.isHistB && (
                  <>
                    <div style={{ display: 'flex', gap: '11px', alignItems: 'flex-start', background: 'rgba(122,184,232,.07)', border: '1px solid rgba(122,184,232,.22)', borderRadius: '13px', padding: '13px 16px', marginBottom: '16px' }}><span style={{ fontSize: '17px', lineHeight: 1.2 }}>↩️</span><div style={{ fontSize: '12.5px', color: '#9cb4c4', lineHeight: 1.55 }}><b style={{ color: '#e2ecf3' }}>{c.histb.intro1}</b> {es ? 'Toca' : 'Tap'} <b style={{ color: '#7ab8e8' }}>{c.histb.recuperarWord}</b> {c.histb.intro2}</div></div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
                      {v.barraHistStats.map((k, i) => (<div key={i} style={{ flex: 1, minWidth: '130px', background: '#131a20', border: '1px solid #23303a', borderRadius: '14px', padding: '14px 18px' }}><div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.05em', color: '#7f96a6' }}>{k.label}</div><div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", fontVariantNumeric: 'tabular-nums', fontSize: '26px', fontWeight: 700, color: '#e2ecf3', marginTop: '4px', letterSpacing: '-.01em' }}>{k.value}</div></div>))}
                    </div>
                    {v.barraHistEmpty && <div style={{ background: '#131a20', border: '1px dashed #23303a', borderRadius: '16px', padding: '50px', textAlign: 'center', color: '#7f96a6' }}><div style={{ fontSize: '30px', marginBottom: '8px' }}>📜</div><div style={{ fontSize: '14px', color: '#9cc9e8' }}>{c.histb.empty1}</div></div>}
                    <div style={{ background: '#131a20', border: '1px solid #23303a', borderRadius: '16px', overflow: 'hidden' }}>
                      {v.barraHist.map((h, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: '14px', padding: '14px 20px', borderTop: '1px solid #1e2830', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#6bbf7a' }}>✓ {h.time}</span>
                          <div style={{ minWidth: 0 }}><div style={{ fontSize: '13.5px', color: '#e2ecf3', fontWeight: 600 }}>{h.itemsLine}</div><div style={{ fontSize: '11.5px', color: '#7f96a6', marginTop: '2px' }}>{h.code} · {h.customer}</div></div>
                          <span style={{ fontSize: '12px', color: '#9cc9e8', whiteSpace: 'nowrap' }}>{h.count} {c.histb.bebidas}</span>
                          <button onClick={h.recall} title={es ? 'Devolver esta ronda a la barra' : 'Send this round back to the bar'} style={{ background: 'transparent', border: '1px solid #2c3a46', color: '#9cb4c4', fontSize: '11.5px', fontWeight: 600, padding: '6px 12px', borderRadius: '9px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{c.histb.recuperar}</button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* HISTORIAL MESERO */}
                {v.isHistM && (
                  <>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
                      {v.meseroHistStats.map((k, i) => (<div key={i} style={{ flex: 1, minWidth: '130px', background: '#1a120b', border: '1px solid #2a2016', borderRadius: '14px', padding: '14px 18px' }}><div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.07em', color: '#8c7a63' }}>{k.label}</div><div className="serif" style={{ fontSize: '28px', fontWeight: 600, color: '#f2e8da', marginTop: '3px' }}>{k.value}</div></div>))}
                    </div>
                    {v.meseroHistEmpty && <div style={{ background: '#1a120b', border: '1px dashed #33261a', borderRadius: '16px', padding: '50px', textAlign: 'center', color: '#8c7a63' }}><div style={{ fontSize: '30px', marginBottom: '8px' }}>📜</div><div style={{ fontSize: '14px', color: '#c9b79c' }}>{c.histm.empty}</div></div>}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {v.meseroHist.map((h) => (
                        <div key={h.code} style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '14px', overflow: 'hidden' }}>
                          <button onClick={h.toggle} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '15px 18px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                            <span style={{ fontSize: '14px', color: '#6f5f4a', width: '12px' }}>{h.chev}</span>
                            <span style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(107,191,122,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>✓</span>
                            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: '14.5px', fontWeight: 700, color: '#f2e8da' }}>{h.title}</div><div style={{ fontSize: '11.5px', color: '#8c7a63', marginTop: '1px' }}>{h.sub} · {h.time}</div></div>
                            <span style={{ fontSize: '11px', color: '#c9b79c', background: '#241a10', padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{h.methodLabel}</span>
                            <span className="serif" style={{ fontSize: '19px', fontWeight: 600, color: '#6bbf7a', whiteSpace: 'nowrap' }}>{h.total}</span>
                          </button>
                          {h.open && (
                            <div style={{ padding: '4px 18px 18px 44px', borderTop: '1px solid #241a10' }}>
                              {h.hasDishes && (
                                <>
                                  <div style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '.08em', color: '#e8934f', fontWeight: 700, margin: '14px 0 6px' }}>🍳 {c.histm.platos} · {h.dishCount}</div>
                                  {h.dishes.map((d, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '13px', padding: '4px 0', color: '#e6d8c6' }}><span>{d.line}</span><span style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}><span style={{ color: '#8c7a63', fontSize: '11.5px' }}>{d.guest}</span><span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{d.priceFmt}</span></span></div>))}
                                </>
                              )}
                              {h.hasDrinks && (
                                <>
                                  <div style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '.08em', color: '#7ab8e8', fontWeight: 700, margin: '14px 0 6px' }}>🍸 {c.histm.bebidas} · {h.drinkCount}</div>
                                  {h.drinks.map((b, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '13px', padding: '4px 0', color: '#e6d8c6' }}><span>{b.line}</span><span style={{ display: 'flex', gap: '12px', alignItems: 'baseline' }}><span style={{ color: '#8c7a63', fontSize: '11.5px' }}>{b.guest}</span><span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{b.priceFmt}</span></span></div>))}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* CAJA · ARQUEO */}
                {v.isCaja && (
                  <>
                    <div className="dstat" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '14px', marginBottom: '20px' }}>
                      {v.cajaSummary.map((k, i) => (<div key={i} style={{ background: 'linear-gradient(160deg,#211810,#1a120b)', border: '1px solid #2f2418', borderRadius: '16px', padding: '18px' }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.07em', color: '#8c7a63' }}>{k.label}</span><span style={{ fontSize: '16px' }}>{k.emoji}</span></div><div className="serif" style={{ fontSize: '30px', fontWeight: 600, color: '#fff', marginTop: '6px' }}>{k.value}</div></div>))}
                    </div>
                    <div className="dcards-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', alignItems: 'start' }}>
                      <div style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', padding: '22px' }}>
                        <h3 className="serif" style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 16px' }}>{c.caja.ventasMetodo}</h3>
                        {v.cajaByMethod.map((m, i) => (
                          <div key={i} style={{ marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}><span style={{ fontWeight: 600 }}>{m.emoji} {m.label}</span><span style={{ color: '#c9b79c' }}>{m.amount} <span style={{ color: '#8c7a63' }}>· {m.n}</span></span></div>
                            <div style={{ height: '8px', background: '#241a10', borderRadius: '6px', overflow: 'hidden' }}><div style={{ height: '100%', width: m.pct, background: m.color, borderRadius: '6px' }} /></div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', padding: '22px' }}>
                        <h3 className="serif" style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 16px' }}>{c.caja.arqueoEfectivo}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{ fontSize: '13px', color: '#c9b79c' }}>{c.caja.fondoInicial}</span>
                          <input value={v.fondoVal} onChange={v.setFondo} type="number" style={{ width: '110px', textAlign: 'right', background: '#211810', border: '1px solid #33261a', borderRadius: '9px', padding: '8px 11px', fontSize: '13.5px', color: '#f2e8da' }} />
                        </div>
                        {v.cajaRows.map((r, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderTop: '1px solid #241a10' }}><span style={{ fontSize: '13px', color: '#a8977f' }}>{r.label}</span><span style={{ fontSize: '14px', fontWeight: 700, color: '#f2e8da' }}>{r.value}</span></div>
                        ))}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 0 4px' }}><span style={{ fontSize: '13px', color: '#c9b79c' }}>{c.caja.efectivoContado}</span><input value={v.contadoVal} onChange={v.setContado} type="number" placeholder="0" style={{ width: '110px', textAlign: 'right', background: '#211810', border: '1px solid #33261a', borderRadius: '9px', padding: '8px 11px', fontSize: '13.5px', color: '#f2e8da' }} /></div>
                        {v.overShort.show && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', padding: '13px 15px', borderRadius: '12px', background: v.overShort.bg }}><span style={{ fontSize: '13px', fontWeight: 700, color: v.overShort.color }}>{v.overShort.label}</span><span className="serif" style={{ fontSize: '22px', fontWeight: 600, color: v.overShort.color }}>{v.overShort.value}</span></div>
                        )}
                        <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #2a2016' }}>
                          {v.corteConfirm && (
                            <div style={{ background: 'rgba(229,84,74,.08)', border: '1px solid rgba(229,84,74,.3)', borderRadius: '12px', padding: '14px' }}>
                              <div style={{ fontSize: '13px', color: '#e6d8c6', lineHeight: 1.5, marginBottom: '12px' }}>{c.caja.corteConfirm}</div>
                              <div style={{ display: 'flex', gap: '9px' }}>
                                <button onClick={v.corteZ} style={{ flex: 1, background: '#e5544a', color: '#fff', border: 'none', padding: '12px', borderRadius: '11px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>{c.caja.siCerrar}</button>
                                <button onClick={v.cancelCorte} style={{ background: 'transparent', border: '1px solid #33261a', color: '#a8977f', padding: '12px 16px', borderRadius: '11px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>{c.caja.cancel}</button>
                              </div>
                            </div>
                          )}
                          {v.showCorteBtn && <button onClick={v.askCorte} style={{ width: '100%', background: '#241a10', border: '1px solid #4a2a1e', color: '#e8934f', padding: '13px', borderRadius: '12px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 700 }}>{c.caja.cerrarCaja}</button>}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.1em', color: '#8c7a63', marginBottom: '12px' }}>{c.caja.cortesHist}</div>
                      {v.cortesEmpty && <div style={{ background: '#1a120b', border: '1px dashed #33261a', borderRadius: '14px', padding: '26px', textAlign: 'center', color: '#8c7a63', fontSize: '13px' }}>{c.caja.sinCortes}</div>}
                      <div className="dtable-wrap" style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', overflow: 'hidden' }}>
                        {v.cortesList.map((z, i) => (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: '14px', padding: '14px 20px', borderTop: '1px solid #241a10', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#c9a0e8' }}>{z.id}</span>
                            <div style={{ minWidth: 0 }}><div style={{ fontSize: '13px', color: '#e6d8c6', fontWeight: 600 }}>{z.fecha} · {z.hora}</div><div style={{ fontSize: '11.5px', color: '#8c7a63', marginTop: '1px' }}>{c.caja.cerradoPor} {z.cerradoPor} · {z.tickets} {c.caja.ticketsWord}</div></div>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#f2e8da' }}>{z.cobrado}</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: z.diffColor, minWidth: '70px', textAlign: 'right' }}>{z.diffFmt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* FINANZAS */}
                {v.isFinanzas && (
                  <>
                    <div className="dstat" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '14px', marginBottom: '20px' }}>
                      {v.finKpis.map((k, i) => (
                        <div key={i} style={{ background: 'linear-gradient(160deg,#211810,#1a120b)', border: '1px solid #2f2418', borderTop: '3px solid ' + k.color, borderRadius: '16px', padding: '18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.07em', color: '#8c7a63' }}>{k.label}</span><span style={{ fontSize: '16px' }}>{k.emoji}</span></div>
                          <div className="serif" style={{ fontSize: '32px', fontWeight: 600, color: k.color, marginTop: '6px' }}>{k.value}</div>
                          <div style={{ fontSize: '11.5px', color: '#8c7a63', marginTop: '3px' }}>{k.sub}</div>
                        </div>
                      ))}
                    </div>
                    <div className="dcol-2" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: '18px', alignItems: 'start' }}>
                      <div style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', padding: '22px' }}>
                        <h3 className="serif" style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 4px' }}>{c.fin.registrarGasto}</h3>
                        <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: '#8c7a63' }}>{c.fin.registrarSub}</p>
                        <input value={v.expConcepto} onChange={v.setExpConcepto} placeholder={c.fin.conceptoPh} style={{ width: '100%', boxSizing: 'border-box', background: '#211810', border: '1px solid #33261a', borderRadius: '10px', padding: '11px 13px', fontSize: '13.5px', color: '#f2e8da', marginBottom: '10px' }} />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '12px' }}>
                          {v.expCats.map((c, i) => (<button key={i} onClick={c.onClick} style={{ background: c.bg, color: c.color, border: 'none', padding: '7px 13px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>{c.label}</button>))}
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: '#211810', border: '1px solid #33261a', borderRadius: '10px', padding: '0 13px' }}><span style={{ fontSize: '13px', color: '#8c7a63' }}>$</span><input value={v.expMonto} onChange={v.setExpMonto} type="number" placeholder="0" style={{ flex: 1, background: 'transparent', border: 'none', padding: '11px 0', fontSize: '14px', color: '#f2e8da', outline: 'none' }} /></div>
                          <button onClick={v.addExpense} disabled={v.addDisabled} style={{ background: '#e8934f', color: '#241a10', border: 'none', padding: '11px 22px', borderRadius: '10px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 700 }}>{c.fin.agregarGasto}</button>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.1em', color: '#8c7a63', marginBottom: '11px' }}>{c.fin.gastosHoy}</div>
                          {v.gastosEmpty && <div style={{ background: '#211810', border: '1px dashed #33261a', borderRadius: '12px', padding: '22px', textAlign: 'center', color: '#8c7a63', fontSize: '12.5px' }}>{c.fin.sinGastos}</div>}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {v.gastosList.map((g) => (
                              <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#211810', border: '1px solid #2a2016', borderRadius: '11px', padding: '11px 13px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: g.catColor, flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: '13.5px', fontWeight: 600, color: '#e6d8c6' }}>{g.concepto}</div><div style={{ fontSize: '11px', color: '#8c7a63', marginTop: '1px' }}>{g.cat} · {g.hora} · {g.by}</div></div>
                                <span style={{ fontSize: '14px', fontWeight: 700, color: '#e5544a' }}>− {g.monto}</span>
                                <button onClick={g.remove} title={c.fin.eliminar} style={{ background: 'transparent', border: 'none', color: '#8c7a63', cursor: 'pointer', fontSize: '15px', padding: '2px 4px' }}>✕</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', padding: '22px' }}>
                          <h3 className="serif" style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 16px' }}>{c.fin.gastosCategoria}</h3>
                          {v.gastosByCatEmpty && <div style={{ color: '#8c7a63', fontSize: '12.5px' }}>{c.fin.sinDesglosar}</div>}
                          {v.gastosByCat.map((m, i) => (
                            <div key={i} style={{ marginBottom: '14px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}><span style={{ fontWeight: 600, color: '#e6d8c6' }}>{m.label}</span><span style={{ color: '#c9b79c' }}>{m.amount} <span style={{ color: '#8c7a63' }}>· {m.pct}</span></span></div>
                              <div style={{ height: '8px', background: '#241a10', borderRadius: '6px', overflow: 'hidden' }}><div style={{ height: '100%', width: m.pct, background: m.color, borderRadius: '6px' }} /></div>
                            </div>
                          ))}
                        </div>
                        <div style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', padding: '22px' }}>
                          <h3 className="serif" style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 6px' }}>{c.fin.inversion}</h3>
                          <p style={{ margin: '0 0 14px', fontSize: '12.5px', color: '#8c7a63' }}>{c.fin.inversionSub}</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}><span style={{ fontSize: '13px', color: '#c9b79c' }}>{c.fin.inversionInicial}</span><input value={v.inversionVal} onChange={v.setInversion} type="number" style={{ width: '130px', textAlign: 'right', background: '#211810', border: '1px solid #33261a', borderRadius: '9px', padding: '9px 12px', fontSize: '14px', color: '#f2e8da' }} /></div>
                          {v.hasInversion && (
                            <>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '7px' }}><span style={{ color: '#8c7a63' }}>{c.fin.recuperado}</span><span style={{ fontWeight: 700, color: '#e0b34f' }}>{v.recupPct}</span></div>
                              <div style={{ height: '10px', background: '#241a10', borderRadius: '6px', overflow: 'hidden' }}><div style={{ height: '100%', width: v.recupPct, background: 'linear-gradient(90deg,#e8934f,#e0b34f)', borderRadius: '6px', transition: 'width .5s ease' }} /></div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* RENDIMIENTO */}
                {v.isRend && (
                  <>
                    {v.rendEmpty && <div style={{ background: '#1a120b', border: '1px dashed #33261a', borderRadius: '16px', padding: '50px', textAlign: 'center', color: '#8c7a63', marginBottom: '18px' }}><div style={{ fontSize: '30px', marginBottom: '8px' }}>📈</div><div style={{ fontSize: '14px', color: '#c9b79c' }}>{c.rend.empty1}</div><div style={{ fontSize: '12.5px', marginTop: '4px' }}>{c.rend.empty2}</div></div>}
                    <div className="dstat" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px', marginBottom: '20px' }}>
                      {v.rendStations.map((s, i) => (
                        <div key={i} style={{ background: '#1a120b', border: '1px solid #2a2016', borderTop: '3px solid ' + s.color, borderRadius: '14px', padding: '18px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#f2e8da', marginBottom: '12px' }}>{s.emoji} {s.label}</div>
                          <div style={{ display: 'flex', gap: '14px' }}>
                            <div><div className="serif" style={{ fontSize: '26px', fontWeight: 600, color: s.color }}>{s.doneLabel}</div><div style={{ fontSize: '10.5px', color: '#8c7a63' }}>{c.rend.despachados}</div></div>
                            <div><div className="serif" style={{ fontSize: '26px', fontWeight: 600, color: '#c9b79c' }}>{s.ticketsLabel}</div><div style={{ fontSize: '10.5px', color: '#8c7a63' }}>{c.rend.comandas}</div></div>
                            <div><div className="serif" style={{ fontSize: '26px', fontWeight: 600, color: '#c9b79c' }}>{s.avgLabel}</div><div style={{ fontSize: '10.5px', color: '#8c7a63' }}>{c.rend.prepProm}</div></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', padding: '22px' }}>
                      <h3 className="serif" style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 4px' }}>{c.rend.meseros}</h3>
                      <p style={{ margin: '0 0 14px', fontSize: '12.5px', color: '#8c7a63' }}>{c.rend.meserosSub}</p>
                      {v.waiterEmpty && <div style={{ color: '#8c7a63', fontSize: '12.5px', padding: '6px 0' }}>{c.rend.sinMesas}</div>}
                      {v.waiterTables.map((w, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 0', borderTop: '1px solid #241a10' }}>
                          <span style={{ width: '38px', height: '38px', flexShrink: 0, borderRadius: '50%', background: 'linear-gradient(150deg,#6bbf7a,#2f7a45)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '15px' }}>{w.initial}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#f2e8da' }}>{w.name} · <span style={{ color: '#6bbf7a' }}>{w.tablesCount}</span></div>
                            <div style={{ fontSize: '11.5px', color: '#8c7a63', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.tablesLabel} · {w.guestsLabel}</div>
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#6bbf7a', minWidth: '80px', textAlign: 'right' }}>{w.sales}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: '#1a120b', border: '1px solid #2a2016', borderRadius: '16px', padding: '22px', marginTop: '18px' }}>
                      <h3 className="serif" style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 14px' }}>{c.rend.actividad}</h3>
                      {v.rendStaff.map((p, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderTop: '1px solid #241a10' }}>
                          <span style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(150deg,#d1642f,#7d2a15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '15px' }}>{p.initial}</span>
                          <div style={{ flex: 1 }}><div style={{ fontSize: '14px', fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: '11.5px', color: '#8c7a63' }}>{p.roleLabel}</div></div>
                          <span style={{ fontSize: '12.5px', color: '#c9b79c' }}>{p.actions}</span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#6bbf7a', minWidth: '80px', textAlign: 'right' }}>{p.sales}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

              </div>
            </main>
          </div>
        )}

      </div>
    </div>
  )
}
