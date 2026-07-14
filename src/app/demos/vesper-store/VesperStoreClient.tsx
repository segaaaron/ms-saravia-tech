'use client'

import { useEffect, useRef, useState, type CSSProperties, type ChangeEvent, type MouseEvent as ReactMouseEvent } from 'react'
import type { DemoLang } from '../lang'

/* ============================================================
   VESPER — Tienda (demo). Port nativo Next.js del diseño
   original .dc.html, misma info y mismo diseño. Bilingüe
   (es/en) según el sitio; el toggle interno EN/ES conmuta.
   ============================================================ */

type Color = { name: string; hex: string }
type Size = { label: string; stock: number }
type Product = { id: string; name: string; cat: string; catLabel: string; price: number; was?: number; tag: string | null; material: string; rating: string; sold: number; img: string; colors: Color[]; sizes: Size[] }
type CartItem = { key: string; id: string; name: string; price: number; img: string; size: string; color: string; colorHex: string; qty: number }
type User = { name: string; email: string; initials: string }
type OrderItem = { n: string; i: string; q: number }
type Order = { id: string; date: string; status: string; items: OrderItem[]; total: number }
type Address = { id: string; label: string; name: string; line: string; city: string; country: string; phone: string; def: boolean }

const INITIAL_CART: CartItem[] = [
  { key: 'p3-42-0', id: 'p3', name: 'Sneaker Aero Knit', price: 420, img: 'photo-1600185365483-26d7a4cc7519', size: '42', color: 'Blanco', colorHex: '#f2f0ec', qty: 1 },
  { key: 'p5-M-0', id: 'p5', name: 'Camisa Merino Zero', price: 240, img: 'photo-1602810318383-e386cc2a3ccf', size: 'M', color: 'Blanco', colorHex: '#f2f0ec', qty: 2 },
  { key: 'p1-M-0', id: 'p1', name: 'Abrigo Sculpted Wool', price: 1290, img: 'photo-1539533018447-63fcce2678e3', size: 'M', color: 'Camel', colorHex: '#b08d57', qty: 1 },
]

// Non-text carousel metadata (image/color/target). Text lives in CONTENT[lang].slides.
const SLIDE_META: { badge: string | null; dot: string; img: string; go: string; timer: boolean }[] = [
  { badge: '-40%', dot: '#ff6b52', img: 'photo-1542291026-7eec264c27ff', go: 'calzado', timer: true },
  { badge: null, dot: '#c9a05f', img: 'photo-1539533018447-63fcce2678e3', go: 'abrigos', timer: false },
  { badge: null, dot: '#3a8a5a', img: 'photo-1490481651871-ab68de25d43d', go: 'all', timer: false },
]

const PIMGS: Record<string, string[]> = {
  p1: ['photo-1539533018447-63fcce2678e3', 'photo-1591047139829-d91aecb6caea', 'photo-1483985988355-763728e1935b'],
  p3: ['photo-1600185365483-26d7a4cc7519', 'photo-1595950653106-6c9ebd614d3a', 'photo-1549298916-b41d501d3772'],
  p4: ['photo-1542291026-7eec264c27ff', 'photo-1460353581641-37baddab0fa2'],
  p5: ['photo-1602810318383-e386cc2a3ccf', 'photo-1620799140408-edc6dcb6d633'],
}

// Canonical catalog (Spanish source of truth; display strings translated via CONTENT[lang].data).
const INITIAL_CATALOG: Product[] = [
  { id: 'p1', name: 'Abrigo Sculpted Wool', cat: 'abrigos', catLabel: 'Abrigos', price: 1290, was: 1490, tag: 'Edición limitada', material: 'Lana virgen italiana de doble faz, forro de cupro y sastrería escultural cosida a mano en Milán.', rating: '4.9', sold: 78, img: 'photo-1539533018447-63fcce2678e3',
    colors: [{ name: 'Camel', hex: '#b08d57' }, { name: 'Grafito', hex: '#3a3a3e' }, { name: 'Marfil', hex: '#e6e0d4' }],
    sizes: [{ label: 'XS', stock: 4 }, { label: 'S', stock: 0 }, { label: 'M', stock: 6 }, { label: 'L', stock: 3 }, { label: 'XL', stock: 2 }] },
  { id: 'p2', name: 'Chaqueta Tech Shell', cat: 'abrigos', catLabel: 'Chaquetas', price: 690, tag: 'Nuevo', material: 'Softshell impermeable de 3 capas con costuras selladas y membrana transpirable de alto rendimiento.', rating: '4.8', sold: 52, img: 'photo-1591047139829-d91aecb6caea',
    colors: [{ name: 'Negro', hex: '#16161a' }, { name: 'Arena', hex: '#c9b79c' }],
    sizes: [{ label: 'S', stock: 9 }, { label: 'M', stock: 14 }, { label: 'L', stock: 7 }, { label: 'XL', stock: 5 }] },
  { id: 'p3', name: 'Sneaker Aero Knit', cat: 'calzado', catLabel: 'Calzado', price: 420, tag: 'Más vendido', material: 'Punto técnico monofilamento sobre suela de espuma de carbono con retorno de energía del 92%.', rating: '4.9', sold: 212, img: 'photo-1600185365483-26d7a4cc7519',
    colors: [{ name: 'Blanco', hex: '#f2f0ec' }, { name: 'Negro', hex: '#16161a' }, { name: 'Salvia', hex: '#6b7351' }],
    sizes: [{ label: '39', stock: 0 }, { label: '40', stock: 5 }, { label: '41', stock: 8 }, { label: '42', stock: 3 }, { label: '43', stock: 6 }, { label: '44', stock: 4 }, { label: '45', stock: 0 }] },
  { id: 'p4', name: 'Sneaker Runner Carbon', cat: 'calzado', catLabel: 'Calzado', price: 490, was: 560, tag: null, material: 'Cuero de becerro italiano y placa de fibra de carbono. Construcción cosida Blake, hecho para durar décadas.', rating: '4.7', sold: 88, img: 'photo-1542291026-7eec264c27ff',
    colors: [{ name: 'Rojo señal', hex: '#a23b2e' }, { name: 'Negro', hex: '#16161a' }],
    sizes: [{ label: '40', stock: 2 }, { label: '41', stock: 4 }, { label: '42', stock: 5 }, { label: '43', stock: 1 }, { label: '44', stock: 3 }] },
  { id: 'p5', name: 'Camisa Merino Zero', cat: 'prendas', catLabel: 'Camisas', price: 240, tag: 'Nuevo', material: 'Merino ultrafino de 17.5µ que regula la temperatura, resiste arrugas y no retiene olores.', rating: '4.8', sold: 140, img: 'photo-1602810318383-e386cc2a3ccf',
    colors: [{ name: 'Blanco', hex: '#f2f0ec' }, { name: 'Azul niebla', hex: '#4a5a6a' }, { name: 'Negro', hex: '#16161a' }],
    sizes: [{ label: 'XS', stock: 6 }, { label: 'S', stock: 11 }, { label: 'M', stock: 9 }, { label: 'L', stock: 8 }, { label: 'XL', stock: 4 }] },
  { id: 'p6', name: 'Punto Cashmere Fold', cat: 'prendas', catLabel: 'Punto', price: 304, was: 380, tag: null, material: 'Cachemira mongola de grado A, hilado de 2 cabos, con acabado cepillado que gana suavidad con el uso.', rating: '4.9', sold: 64, img: 'photo-1576871337622-98d48d1cf531',
    colors: [{ name: 'Camel', hex: '#b08d57' }, { name: 'Gris piedra', hex: '#8a8a8e' }],
    sizes: [{ label: 'S', stock: 3 }, { label: 'M', stock: 2 }, { label: 'L', stock: 1 }, { label: 'XL', stock: 0 }] },
  { id: 'p7', name: 'Pantalón Tailored Flow', cat: 'prendas', catLabel: 'Pantalones', price: 320, tag: null, material: 'Lana fría con stretch mecánico de 4 direcciones, pinza planchada permanente y caída impecable.', rating: '4.7', sold: 96, img: 'photo-1594633312681-425c7b97ccd1',
    colors: [{ name: 'Grafito', hex: '#3a3a3e' }, { name: 'Negro', hex: '#16161a' }, { name: 'Oliva', hex: '#5a5a3a' }],
    sizes: [{ label: '28', stock: 5 }, { label: '30', stock: 7 }, { label: '32', stock: 6 }, { label: '34', stock: 4 }, { label: '36', stock: 2 }] },
  { id: 'p8', name: 'Bolso Structured Tote', cat: 'accesorios', catLabel: 'Accesorios', price: 780, tag: 'Edición limitada', material: 'Piel saffiano con estructura reforzada, herrajes de latón macizo y grabado del número de serie.', rating: '4.9', sold: 41, img: 'photo-1584917865442-de89df76afd3',
    colors: [{ name: 'Negro', hex: '#16161a' }, { name: 'Camel', hex: '#b08d57' }],
    sizes: [{ label: 'Única', stock: 7 }] },
  { id: 'p9', name: 'Reloj Chrono Steel', cat: 'accesorios', catLabel: 'Accesorios', price: 1150, tag: null, material: 'Acero 316L cepillado, cristal de zafiro y movimiento automático suizo con reserva de 72 horas.', rating: '4.8', sold: 28, img: 'photo-1524592094714-0f0654e20314',
    colors: [{ name: 'Acero', hex: '#b8bcc2' }, { name: 'Grafito', hex: '#3a3a3e' }],
    sizes: [{ label: '38mm', stock: 3 }, { label: '42mm', stock: 5 }] },
]

const img = (id: string) => 'https://images.unsplash.com/' + id + '?w=900&q=80'

// Non-text review metadata (avatar/photos/name). Text lives in CONTENT[lang].reviews.
const REVIEW_META = [
  { avBg: '#b08d57', avatar: img('photo-1494790108377-be9c29b29330'), photos: [img('photo-1600185365483-26d7a4cc7519'), img('photo-1542291026-7eec264c27ff')], name: 'Marina O.' },
  { avBg: '#3a8a5a', avatar: img('photo-1500648767791-00dcc994a43e'), photos: [img('photo-1539533018447-63fcce2678e3')], name: 'Théo L.' },
  { avBg: '#6f7f8a', avatar: img('photo-1438761681033-6461ffad8d80'), photos: [img('photo-1602810318383-e386cc2a3ccf'), img('photo-1594633312681-425c7b97ccd1')], name: 'Sofía K.' },
]
const TRUST_ICONS = ['🚚', '↩', '🔒', '★']

const es = {
  searchPh: 'Buscar zapatos, abrigos, camisas…',
  themeLight: 'Claro', themeDark: 'Oscuro',
  account: 'Cuenta', cart: 'Carrito', ordersNav: 'Mis pedidos', favs: 'Favoritos',
  ariaLang: 'Idioma', ariaTheme: 'Tema', ariaSave: 'Guardar', ariaRemoveFav: 'Quitar de favoritos',
  nav: { all: 'Novedades', calzado: 'Calzado', abrigos: 'Abrigos', prendas: 'Prendas', accesorios: 'Accesorios', ofertas: 'Ofertas' } as Record<string, string>,
  chips: { all: 'Todo', calzado: 'Calzado', abrigos: 'Abrigos', prendas: 'Prendas', accesorios: 'Accesorios', ofertas: 'Ofertas' } as Record<string, string>,
  tiles: { calzado: 'Calzado', abrigos: 'Abrigos', prendas: 'Prendas', accesorios: 'Accesorios' } as Record<string, string>,
  productsWord: 'productos', freeShipFrom: 'envío gratis desde $80',
  ann: '✦ ENVÍO GRATIS DESDE $80   ✦ DEVOLUCIONES GRATIS 30 DÍAS   ✦ PAGO SEGURO   ✦ 10% EN TU PRIMERA COMPRA   ',
  flashOffer: 'Oferta flash', endsIn: 'Termina en',
  slides: [
    { eyebrow: 'Ofertas flash · termina pronto', title: 'Hasta -40% en calzado de autor', sub: 'Sneakers y botines seleccionados con descuentos reales por tiempo limitado. Envío en 48h.', cta: 'Comprar calzado', note: 'Stock limitado' },
    { eyebrow: 'Nueva colección AW26', title: 'Abrigos que abrigan de verdad', sub: 'Lana virgen italiana y sastrería escultural cosida a mano. Series numeradas y trazables.', cta: 'Ver abrigos', note: 'Edición limitada' },
    { eyebrow: 'Solo esta semana', title: 'Envío gratis en toda la tienda', sub: 'Sin mínimo de compra durante 7 días, más devoluciones gratis 30 días. Compra sin riesgo.', cta: 'Empezar a comprar', note: 'Todos los productos' },
  ],
  shopTitles: { all: 'Toda la colección', calzado: 'Calzado', abrigos: 'Abrigos y chaquetas', prendas: 'Ropa', accesorios: 'Accesorios', ofertas: 'Ofertas' } as Record<string, string>,
  resultsFor: 'Resultados para', collection: 'Colección',
  filters: 'Filtros', sortBy: 'Ordenar por', sortFeatured: 'Relevancia', sortLow: 'Precio: menor a mayor', sortHigh: 'Precio: mayor a menor',
  sizeWord: 'Talla', colorWord: 'Color', priceUpTo: 'Precio hasta', onlyAvailable: 'Solo productos disponibles',
  clearFilters: 'Limpiar filtros', viewWord: 'Ver', resultsWord: 'resultados', addWord: 'Añadir',
  colorSingular: 'color', colorPlural: 'colores', save: 'Ahorras',
  soldOut: 'Agotado', onlyLeftPre: '¡Solo quedan ', onlyLeftSuf: '!', inStock: 'En stock · envío en 48h',
  notifyMe: 'Avísame', addToCart: 'Añadir al carrito', inCompare: '✓ En comparación', compareWord: 'Comparar',
  noResults: 'Sin resultados', noResultsBody: 'No encontramos productos con esos criterios. Prueba ajustar la búsqueda o los filtros.', clearAll: 'Limpiar todo',
  recentlyViewed: 'Visto recientemente',
  trust: [
    { title: 'Envío gratis', body: 'En pedidos desde $80' },
    { title: 'Devoluciones 30 días', body: 'Cambios y devoluciones gratis' },
    { title: 'Pago seguro', body: 'Cifrado y protección total' },
    { title: '4.9/5 valoración', body: '+12.000 clientes felices' },
  ],
  reviewsTitle: 'Lo que dicen nuestros clientes', reviewsSub: '4.9 de 5 · 12.480 reseñas verificadas', verified: 'Verificada',
  reviews: [
    { text: 'La calidad es de otro nivel. Los sneakers son comodísimos y llegaron en dos días. Repetiré sin duda.', meta: 'Ciudad de México · Compra verificada' },
    { text: 'El abrigo es espectacular, se nota el material premium. La talla fue perfecta gracias a la guía.', meta: 'Madrid · Compra verificada' },
    { text: 'Compré la camisa merino y no me la quito. Devolución fácil de otra talla, todo impecable.', meta: 'Bogotá · Compra verificada' },
  ],
  stats: ['Clientes felices', 'Envío medio', 'Recompra', 'Valoración media'],
  nlTitle: 'Suscríbete y obtén 10% en tu primera compra', nlSub: 'Novedades, drops exclusivos y ofertas antes que nadie.', nlEmailPh: 'tu@correo.com', nlBtn: 'Suscribirme',
  footerTagline: 'Ropa y calzado de autor. Envíos a todo el mundo desde $80. Devoluciones gratis 30 días.',
  footerShop: 'Comprar', footerShopLinks: ['Novedades', 'Calzado', 'Ofertas'],
  footerHelp: 'Ayuda', footerHelpLinks: ['Envíos y entregas', 'Cambios y devoluciones', 'Guía de tallas'],
  footerCompany: 'Empresa', footerCompanyLinks: ['Sobre VESPER', 'Sostenibilidad', 'Panel admin'],
  footerRights: '© 2026 VESPER · Todos los derechos reservados',
  yourCart: 'Tu carrito', remove: 'Quitar', completeLook: 'Completa el look', addBtn: '+ Añadir',
  freeShipDone: '¡Envío gratis conseguido! 🎉', freeShipNeedPre: 'Te faltan ', freeShipNeedSuf: ' para envío gratis',
  estDelivery: 'Entrega estimada', couponAppliedPre: '✓ Cupón ', couponAppliedSuf: ' aplicado',
  couponPh: 'Código de descuento', apply: 'Aplicar', couponTry: 'Prueba', or: 'o',
  subtotal: 'Subtotal', discount: 'Descuento', shipping: 'Envío', free: 'Gratis', taxIncl: 'IVA incluido (16%)', taxInclShort: 'IVA incluido',
  total: 'Total', checkout: 'Finalizar compra', securePay: '🔒 Pago 100% seguro · Apple Pay · Klarna',
  emptyCart: 'Tu carrito está vacío', emptyCartBody: 'Añade productos y aparecerán aquí.', startShopping: 'Empezar a comprar', sizeLabel: 'Talla',
  backToStore: '← Volver a la tienda',
  wishlistTitle: 'Tu lista de deseos', wishlistSub: 'Guardamos tus piezas favoritas. Añádelas al carrito antes de que se agoten.',
  noFavs: 'Aún no tienes favoritos', noFavsBody: 'Explora la colección y toca el corazón en los productos que te gusten para guardarlos aquí.', exploreCollection: 'Explorar la colección',
  settings: 'Configuración', vipMember: 'Miembro VIP', profile: 'Perfil', addresses: 'Direcciones', preferences: 'Preferencias', logout: 'Cerrar sesión',
  profileSub: 'Gestiona tus datos personales y de contacto.', fullName: 'Nombre completo', email: 'Correo electrónico', phone: 'Teléfono', phonePh: '+52 55 0000 0000', saveChanges: 'Guardar cambios',
  addressesSub: 'Tus direcciones de envío guardadas.', addAddress: '+ Añadir dirección', principal: 'Principal', makeDefaultWord: 'Hacer principal', deleteWord: 'Eliminar',
  preferencesSub: 'Personaliza tu experiencia de compra.', darkTheme: 'Tema oscuro', darkThemeSub: 'Cambia entre modo claro y oscuro',
  emailNotif: 'Notificaciones por correo', emailNotifSub: 'Ofertas, novedades y estado de pedidos', restockAlerts: 'Alertas de reposición', restockAlertsSub: 'Avísame cuando vuelva mi talla',
  logoutQ: '¿Cerrar sesión?', logoutBody: 'Se cerrará tu sesión en este dispositivo. Podrás volver a iniciar sesión cuando quieras.', cancel: 'Cancelar',
  ordersTitle: 'Mis pedidos', ordersSub: 'Sigue tus compras en tiempo real y gestiona devoluciones.', itemsWord: 'artículos',
  orderStages: ['Confirmado', 'Preparado', 'Enviado', 'Entregado'],
  orderStatus: { entregado: 'Entregado · hoy', camino: 'En camino', pendiente: 'Pendiente de pago', cancelado: 'Cancelado' } as Record<string, string>,
  actRebuy: 'Volver a comprar', actReturn: 'Devolver', actTrack: 'Rastrear pedido', actDetail: 'Ver detalle', actCompletePay: 'Completar pago', actCancel: 'Cancelar',
  soldThisMonth: 'vendidos este mes', specs: 'Especificaciones', colorDash: 'Color —', sizeGuide: 'Guía de tallas',
  onlyLeftSizePre: '¡Solo quedan ', onlyLeftSizeSuf: ' en esta talla!', selectSize: 'Selecciona tu talla', chooseSize: 'Elige tu talla', alsoLike: 'También te puede gustar',
  orderSummary: 'Resumen del pedido', emailWord: 'Correo', nameWord: 'Nombre', lastName: 'Apellido', addressWord: 'Dirección', cityWord: 'Ciudad', zip: 'C.P.',
  shipMethod: 'Método de envío', shipExpress: 'Envío express', shipExpressEta: 'Llega en 48h', shipStd: 'Envío estándar', shipStdEta: '3-5 días hábiles', continueToPay: 'Continuar al pago →',
  payMethod: 'Método de pago', payCardTab: '💳 Tarjeta', payAppleTab: ' Apple Pay', payKlarnaTab: 'Klarna',
  cardNumber: 'Número de tarjeta', expires: 'Vence', cvc: 'CVC',
  walletApple: 'Se abrirá Apple Pay para confirmar con Face ID.', walletKlarna: 'Paga en 3 plazos sin intereses con Klarna.',
  payApple: ' Pagar con Apple Pay · ', payKlarna: 'Continuar con Klarna · ', payCard: '🔒 Pagar ',
  sslNote: '🔒 Pago cifrado SSL · No se realizará ningún cargo real (demo)', coStepInfo: 'Datos y envío', coStepPay: 'Pago',
  payMsgs: ['Verificando la tarjeta…', 'Procesando el pago de forma segura…', 'Confirmando tu pedido…', '¡Listo!'],
  processingPay: 'Procesando tu pago', dontClose: '🔒 No cierres esta ventana',
  paymentConfirmed: '¡Pago confirmado!', orderOnWayPre: 'Tu pedido ', orderOnWaySuf: ' está en camino. Te enviamos la confirmación a tu correo.',
  estDeliveryShort: 'Entrega estimada', totalPaid: 'Total pagado', keepShopping: 'Seguir comprando',
  authRegSub: 'Crea tu cuenta y obtén 10% en tu primera compra.', authLoginSub: 'Bienvenido de nuevo. Inicia sesión para continuar.',
  login: 'Iniciar sesión', register: 'Crear cuenta', passwordPh: 'Contraseña', continueWith: 'o continúa con', termsNote: 'Al continuar aceptas los Términos y la Política de Privacidad',
  ordersStat: 'Pedidos', levelWord: 'Nivel',
  sizeGuideIntro: 'Mide sobre tu cuerpo (o una prenda que te quede bien) y compara con la tabla. Si estás entre dos tallas, elige la mayor.',
  sgClothes: 'Ropa', sgShoes: 'Calzado', sgHeadClothes: ['Talla', 'Pecho', 'Cintura', 'Cadera'], sgHeadShoes: ['MX/EU', 'US', 'UK', 'CM'],
  sgFootnote: '📏 Medidas en cm. ¿Dudas? Escríbenos y te ayudamos a elegir.',
  compareNow: 'Comparar ahora →', clearWord: 'Limpiar', compareProducts: 'Comparar productos',
  cmpPrice: 'Precio', cmpCategory: 'Categoría', cmpMaterial: 'Material', cmpRating: 'Valoración', cmpColors: 'Colores', cmpSizes: 'Tallas', cmpShipping: 'Envío', cmpSoldOut: 'Agotado', cmpFreeShip: 'Gratis · 48h',
  toastAdded: 'añadido al carrito', toastAddrDefault: 'Dirección principal actualizada', toastAddrDeleted: 'Dirección eliminada', toastAddrAdded: 'Dirección añadida — edítala',
  toastProfile: 'Perfil actualizado', toastLoggedOut: 'Sesión cerrada', toastLoggedIn: 'Sesión iniciada', toastAccountCreated: '¡Cuenta creada! Bienvenido 🎉',
  toastCouponPre: 'Cupón ', toastCouponSuf: ' aplicado ✓', toastCouponInvalid: 'Código no válido', toastMaxCompare: 'Máximo 3 productos para comparar', toastThanks: '¡Gracias por tu compra! 🎉',
  defaultCustomerName: 'Cliente VESPER', defaultEmail: 'cliente@correo.com',
  coEmailDef: 'cliente@correo.com', coNameDef: 'Alex', coLastDef: 'Cliente', coAddrDef: 'Av. Reforma 122, Piso 8', coCityDef: 'CDMX', coZipDef: '06600',
  addrNewLabel: 'Nueva dirección', addrNewLine: 'Añade calle y número', addrNewCity: 'Ciudad, Estado CP', addrCountry: 'México',
  orderNow: 'Hoy · ahora',
  days: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'], months: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  data: {
    prodName: { p1: 'Abrigo Sculpted Wool', p2: 'Chaqueta Tech Shell', p3: 'Sneaker Aero Knit', p4: 'Sneaker Runner Carbon', p5: 'Camisa Merino Zero', p6: 'Punto Cashmere Fold', p7: 'Pantalón Tailored Flow', p8: 'Bolso Structured Tote', p9: 'Reloj Chrono Steel' } as Record<string, string>,
    material: {
      p1: 'Lana virgen italiana de doble faz, forro de cupro y sastrería escultural cosida a mano en Milán.',
      p2: 'Softshell impermeable de 3 capas con costuras selladas y membrana transpirable de alto rendimiento.',
      p3: 'Punto técnico monofilamento sobre suela de espuma de carbono con retorno de energía del 92%.',
      p4: 'Cuero de becerro italiano y placa de fibra de carbono. Construcción cosida Blake, hecho para durar décadas.',
      p5: 'Merino ultrafino de 17.5µ que regula la temperatura, resiste arrugas y no retiene olores.',
      p6: 'Cachemira mongola de grado A, hilado de 2 cabos, con acabado cepillado que gana suavidad con el uso.',
      p7: 'Lana fría con stretch mecánico de 4 direcciones, pinza planchada permanente y caída impecable.',
      p8: 'Piel saffiano con estructura reforzada, herrajes de latón macizo y grabado del número de serie.',
      p9: 'Acero 316L cepillado, cristal de zafiro y movimiento automático suizo con reserva de 72 horas.',
    } as Record<string, string>,
    catLabel: { Abrigos: 'Abrigos', Chaquetas: 'Chaquetas', Calzado: 'Calzado', Camisas: 'Camisas', Punto: 'Punto', Pantalones: 'Pantalones', Accesorios: 'Accesorios' } as Record<string, string>,
    tag: { 'Edición limitada': 'Edición limitada', Nuevo: 'Nuevo', 'Más vendido': 'Más vendido' } as Record<string, string>,
    color: { Camel: 'Camel', Grafito: 'Grafito', Marfil: 'Marfil', Negro: 'Negro', Arena: 'Arena', Blanco: 'Blanco', Salvia: 'Salvia', 'Rojo señal': 'Rojo señal', 'Azul niebla': 'Azul niebla', 'Gris piedra': 'Gris piedra', Oliva: 'Oliva', Acero: 'Acero' } as Record<string, string>,
    size: { 'Única': 'Única' } as Record<string, string>,
    spec: {
      p1: [['Tipo', 'Abrigo'], ['Material', 'Lana virgen italiana'], ['Forro', 'Cupro'], ['Corte', 'Escultural'], ['Temporada', 'Otoño/Invierno']],
      p2: [['Tipo', 'Chaqueta'], ['Material', 'Softshell 3 capas'], ['Impermeable', 'Sí · costuras selladas'], ['Corte', 'Regular'], ['Temporada', 'Todo el año']],
      p3: [['Tipo', 'Tenis'], ['Material', 'Punto técnico'], ['Suela', 'Espuma de carbono'], ['Drop', '8 mm'], ['Género', 'Unisex']],
      p4: [['Tipo', 'Tenis'], ['Material', 'Cuero de becerro'], ['Suela', 'Fibra de carbono'], ['Construcción', 'Cosido Blake'], ['Género', 'Unisex']],
      p5: [['Tipo', 'Camisa'], ['Material', 'Merino 17.5µ'], ['Corte', 'Slim'], ['Cuidado', 'Lavable a máquina'], ['Género', 'Unisex']],
      p6: [['Tipo', 'Punto'], ['Material', 'Cachemira grado A'], ['Hilado', '2 cabos'], ['Corte', 'Regular'], ['Temporada', 'Otoño/Invierno']],
      p7: [['Tipo', 'Pantalón'], ['Material', 'Lana fría con stretch'], ['Corte', 'Tailored'], ['Elasticidad', '4 direcciones'], ['Género', 'Hombre']],
      p8: [['Tipo', 'Bolso'], ['Material', 'Piel saffiano'], ['Herrajes', 'Latón macizo'], ['Cierre', 'Cremallera'], ['Correa', 'Desmontable']],
      p9: [['Tipo', 'Reloj'], ['Movimiento', 'Automático suizo'], ['Caja', 'Acero 316L · zafiro'], ['Diámetro', '38–42 mm'], ['Resistencia', '10 ATM']],
    } as Record<string, [string, string][]>,
    initialOrders: [
      { id: 'VS-49215', date: 'Hoy · 09:12', status: 'entregado', items: [{ n: 'Sneaker Aero Knit', i: 'photo-1600185365483-26d7a4cc7519', q: 1 }], total: 420 },
      { id: 'VS-49088', date: '1 jul 2026', status: 'camino', items: [{ n: 'Camisa Merino Zero', i: 'photo-1602810318383-e386cc2a3ccf', q: 2 }, { n: 'Pantalón Tailored Flow', i: 'photo-1594633312681-425c7b97ccd1', q: 1 }], total: 800 },
      { id: 'VS-48731', date: '28 jun 2026', status: 'pendiente', items: [{ n: 'Abrigo Sculpted Wool', i: 'photo-1539533018447-63fcce2678e3', q: 1 }], total: 1290 },
      { id: 'VS-48119', date: '19 jun 2026', status: 'cancelado', items: [{ n: 'Bolso Structured Tote', i: 'photo-1584917865442-de89df76afd3', q: 1 }], total: 780 },
    ] as Order[],
    initialAddresses: [
      { id: 'a1', label: 'Casa', name: 'Alex Cliente', line: 'Av. Reforma 1234, Piso 8', city: 'Ciudad de México, CDMX 06600', country: 'México', phone: '+52 55 1234 5678', def: true },
      { id: 'a2', label: 'Oficina', name: 'Alex Cliente', line: 'Blvd. Insurgentes Sur 890', city: 'Ciudad de México, CDMX 03100', country: 'México', phone: '+52 55 8765 4321', def: false },
    ] as Address[],
  },
}

const en: typeof es = {
  searchPh: 'Search shoes, coats, shirts…',
  themeLight: 'Light', themeDark: 'Dark',
  account: 'Account', cart: 'Cart', ordersNav: 'My orders', favs: 'Favorites',
  ariaLang: 'Language', ariaTheme: 'Theme', ariaSave: 'Save', ariaRemoveFav: 'Remove from favorites',
  nav: { all: 'New in', calzado: 'Footwear', abrigos: 'Coats', prendas: 'Apparel', accesorios: 'Accessories', ofertas: 'Sale' },
  chips: { all: 'All', calzado: 'Footwear', abrigos: 'Coats', prendas: 'Apparel', accesorios: 'Accessories', ofertas: 'Sale' },
  tiles: { calzado: 'Footwear', abrigos: 'Coats', prendas: 'Apparel', accesorios: 'Accessories' },
  productsWord: 'products', freeShipFrom: 'free shipping from $80',
  ann: '✦ FREE SHIPPING FROM $80   ✦ FREE 30-DAY RETURNS   ✦ SECURE PAYMENT   ✦ 10% OFF YOUR FIRST ORDER   ',
  flashOffer: 'Flash sale', endsIn: 'Ends in',
  slides: [
    { eyebrow: 'Flash sale · ending soon', title: 'Up to -40% on designer footwear', sub: 'Selected sneakers and boots with real discounts for a limited time. Ships in 48h.', cta: 'Shop footwear', note: 'Limited stock' },
    { eyebrow: 'New AW26 collection', title: 'Coats that truly keep you warm', sub: 'Italian virgin wool and sculptural tailoring sewn by hand. Numbered, traceable series.', cta: 'View coats', note: 'Limited edition' },
    { eyebrow: 'This week only', title: 'Free shipping storewide', sub: 'No minimum purchase for 7 days, plus free returns for 30 days. Shop risk-free.', cta: 'Start shopping', note: 'All products' },
  ],
  shopTitles: { all: 'The whole collection', calzado: 'Footwear', abrigos: 'Coats & jackets', prendas: 'Apparel', accesorios: 'Accessories', ofertas: 'Sale' },
  resultsFor: 'Results for', collection: 'Collection',
  filters: 'Filters', sortBy: 'Sort by', sortFeatured: 'Featured', sortLow: 'Price: low to high', sortHigh: 'Price: high to low',
  sizeWord: 'Size', colorWord: 'Color', priceUpTo: 'Price up to', onlyAvailable: 'In-stock products only',
  clearFilters: 'Clear filters', viewWord: 'View', resultsWord: 'results', addWord: 'Add',
  colorSingular: 'color', colorPlural: 'colors', save: 'You save',
  soldOut: 'Sold out', onlyLeftPre: 'Only ', onlyLeftSuf: ' left!', inStock: 'In stock · ships in 48h',
  notifyMe: 'Notify me', addToCart: 'Add to cart', inCompare: '✓ Comparing', compareWord: 'Compare',
  noResults: 'No results', noResultsBody: 'We couldn’t find products matching those criteria. Try adjusting your search or filters.', clearAll: 'Clear all',
  recentlyViewed: 'Recently viewed',
  trust: [
    { title: 'Free shipping', body: 'On orders from $80' },
    { title: '30-day returns', body: 'Free exchanges and returns' },
    { title: 'Secure payment', body: 'Full encryption and protection' },
    { title: '4.9/5 rating', body: '+12,000 happy customers' },
  ],
  reviewsTitle: 'What our customers say', reviewsSub: '4.9 out of 5 · 12,480 verified reviews', verified: 'Verified',
  reviews: [
    { text: 'The quality is on another level. The sneakers are super comfortable and arrived in two days. I’ll definitely order again.', meta: 'Mexico City · Verified purchase' },
    { text: 'The coat is stunning, you can tell it’s premium material. The size was perfect thanks to the guide.', meta: 'Madrid · Verified purchase' },
    { text: 'I bought the merino shirt and never take it off. Easy exchange for another size, all flawless.', meta: 'Bogotá · Verified purchase' },
  ],
  stats: ['Happy customers', 'Avg. shipping', 'Repurchase', 'Avg. rating'],
  nlTitle: 'Subscribe and get 10% off your first order', nlSub: 'New arrivals, exclusive drops and offers before anyone else.', nlEmailPh: 'you@email.com', nlBtn: 'Subscribe',
  footerTagline: 'Designer clothing and footwear. Worldwide shipping from $80. Free 30-day returns.',
  footerShop: 'Shop', footerShopLinks: ['New in', 'Footwear', 'Sale'],
  footerHelp: 'Help', footerHelpLinks: ['Shipping & delivery', 'Exchanges & returns', 'Size guide'],
  footerCompany: 'Company', footerCompanyLinks: ['About VESPER', 'Sustainability', 'Admin panel'],
  footerRights: '© 2026 VESPER · All rights reserved',
  yourCart: 'Your cart', remove: 'Remove', completeLook: 'Complete the look', addBtn: '+ Add',
  freeShipDone: 'Free shipping unlocked! 🎉', freeShipNeedPre: '', freeShipNeedSuf: ' away from free shipping',
  estDelivery: 'Estimated delivery', couponAppliedPre: '✓ Coupon ', couponAppliedSuf: ' applied',
  couponPh: 'Discount code', apply: 'Apply', couponTry: 'Try', or: 'or',
  subtotal: 'Subtotal', discount: 'Discount', shipping: 'Shipping', free: 'Free', taxIncl: 'VAT incl. (16%)', taxInclShort: 'VAT incl.',
  total: 'Total', checkout: 'Checkout', securePay: '🔒 100% secure payment · Apple Pay · Klarna',
  emptyCart: 'Your cart is empty', emptyCartBody: 'Add products and they’ll appear here.', startShopping: 'Start shopping', sizeLabel: 'Size',
  backToStore: '← Back to store',
  wishlistTitle: 'Your wishlist', wishlistSub: 'We save your favorite pieces. Add them to your cart before they sell out.',
  noFavs: 'No favorites yet', noFavsBody: 'Browse the collection and tap the heart on the products you love to save them here.', exploreCollection: 'Explore the collection',
  settings: 'Settings', vipMember: 'VIP member', profile: 'Profile', addresses: 'Addresses', preferences: 'Preferences', logout: 'Log out',
  profileSub: 'Manage your personal and contact details.', fullName: 'Full name', email: 'Email', phone: 'Phone', phonePh: '+52 55 0000 0000', saveChanges: 'Save changes',
  addressesSub: 'Your saved shipping addresses.', addAddress: '+ Add address', principal: 'Default', makeDefaultWord: 'Set as default', deleteWord: 'Delete',
  preferencesSub: 'Customize your shopping experience.', darkTheme: 'Dark theme', darkThemeSub: 'Switch between light and dark mode',
  emailNotif: 'Email notifications', emailNotifSub: 'Offers, new arrivals and order updates', restockAlerts: 'Restock alerts', restockAlertsSub: 'Notify me when my size is back',
  logoutQ: 'Log out?', logoutBody: 'You’ll be signed out on this device. You can sign back in whenever you like.', cancel: 'Cancel',
  ordersTitle: 'My orders', ordersSub: 'Track your purchases in real time and manage returns.', itemsWord: 'items',
  orderStages: ['Confirmed', 'Prepared', 'Shipped', 'Delivered'],
  orderStatus: { entregado: 'Delivered · today', camino: 'On the way', pendiente: 'Payment pending', cancelado: 'Cancelled' },
  actRebuy: 'Buy again', actReturn: 'Return', actTrack: 'Track order', actDetail: 'View details', actCompletePay: 'Complete payment', actCancel: 'Cancel',
  soldThisMonth: 'sold this month', specs: 'Specifications', colorDash: 'Color —', sizeGuide: 'Size guide',
  onlyLeftSizePre: 'Only ', onlyLeftSizeSuf: ' left in this size!', selectSize: 'Select your size', chooseSize: 'Choose your size', alsoLike: 'You may also like',
  orderSummary: 'Order summary', emailWord: 'Email', nameWord: 'First name', lastName: 'Last name', addressWord: 'Address', cityWord: 'City', zip: 'ZIP',
  shipMethod: 'Shipping method', shipExpress: 'Express shipping', shipExpressEta: 'Arrives in 48h', shipStd: 'Standard shipping', shipStdEta: '3-5 business days', continueToPay: 'Continue to payment →',
  payMethod: 'Payment method', payCardTab: '💳 Card', payAppleTab: ' Apple Pay', payKlarnaTab: 'Klarna',
  cardNumber: 'Card number', expires: 'Expires', cvc: 'CVC',
  walletApple: 'Apple Pay will open to confirm with Face ID.', walletKlarna: 'Pay in 3 interest-free installments with Klarna.',
  payApple: ' Pay with Apple Pay · ', payKlarna: 'Continue with Klarna · ', payCard: '🔒 Pay ',
  sslNote: '🔒 SSL-encrypted payment · No real charge will be made (demo)', coStepInfo: 'Details & shipping', coStepPay: 'Payment',
  payMsgs: ['Verifying the card…', 'Processing the payment securely…', 'Confirming your order…', 'Done!'],
  processingPay: 'Processing your payment', dontClose: '🔒 Don’t close this window',
  paymentConfirmed: 'Payment confirmed!', orderOnWayPre: 'Your order ', orderOnWaySuf: ' is on its way. We’ve sent the confirmation to your email.',
  estDeliveryShort: 'Estimated delivery', totalPaid: 'Total paid', keepShopping: 'Keep shopping',
  authRegSub: 'Create your account and get 10% off your first order.', authLoginSub: 'Welcome back. Sign in to continue.',
  login: 'Sign in', register: 'Create account', passwordPh: 'Password', continueWith: 'or continue with', termsNote: 'By continuing you accept the Terms and Privacy Policy',
  ordersStat: 'Orders', levelWord: 'Level',
  sizeGuideIntro: 'Measure against your body (or a garment that fits you well) and compare with the table. If you’re between two sizes, choose the larger.',
  sgClothes: 'Clothing', sgShoes: 'Footwear', sgHeadClothes: ['Size', 'Chest', 'Waist', 'Hip'], sgHeadShoes: ['MX/EU', 'US', 'UK', 'CM'],
  sgFootnote: '📏 Measurements in cm. Questions? Message us and we’ll help you choose.',
  compareNow: 'Compare now →', clearWord: 'Clear', compareProducts: 'Compare products',
  cmpPrice: 'Price', cmpCategory: 'Category', cmpMaterial: 'Material', cmpRating: 'Rating', cmpColors: 'Colors', cmpSizes: 'Sizes', cmpShipping: 'Shipping', cmpSoldOut: 'Sold out', cmpFreeShip: 'Free · 48h',
  toastAdded: 'added to cart', toastAddrDefault: 'Default address updated', toastAddrDeleted: 'Address deleted', toastAddrAdded: 'Address added — edit it',
  toastProfile: 'Profile updated', toastLoggedOut: 'Signed out', toastLoggedIn: 'Signed in', toastAccountCreated: 'Account created! Welcome 🎉',
  toastCouponPre: 'Coupon ', toastCouponSuf: ' applied ✓', toastCouponInvalid: 'Invalid code', toastMaxCompare: 'Up to 3 products to compare', toastThanks: 'Thanks for your purchase! 🎉',
  defaultCustomerName: 'VESPER Customer', defaultEmail: 'customer@email.com',
  coEmailDef: 'customer@email.com', coNameDef: 'Alex', coLastDef: 'Cliente', coAddrDef: 'Av. Reforma 122, Floor 8', coCityDef: 'Mexico City', coZipDef: '06600',
  addrNewLabel: 'New address', addrNewLine: 'Add street and number', addrNewCity: 'City, State ZIP', addrCountry: 'Mexico',
  orderNow: 'Today · now',
  days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  data: {
    prodName: { p1: 'Sculpted Wool Coat', p2: 'Tech Shell Jacket', p3: 'Aero Knit Sneaker', p4: 'Runner Carbon Sneaker', p5: 'Merino Zero Shirt', p6: 'Cashmere Fold Knit', p7: 'Tailored Flow Trousers', p8: 'Structured Tote Bag', p9: 'Chrono Steel Watch' },
    material: {
      p1: 'Italian double-faced virgin wool, cupro lining and sculptural tailoring hand-sewn in Milan.',
      p2: 'Waterproof 3-layer softshell with sealed seams and a high-performance breathable membrane.',
      p3: 'Monofilament technical knit on a carbon-foam sole with 92% energy return.',
      p4: 'Italian calf leather and a carbon-fiber plate. Blake-stitched construction, built to last decades.',
      p5: 'Ultrafine 17.5µ merino that regulates temperature, resists wrinkles and holds no odor.',
      p6: 'Grade-A Mongolian cashmere, 2-ply yarn, with a brushed finish that softens with wear.',
      p7: 'Cool wool with 4-way mechanical stretch, a permanent pressed crease and impeccable drape.',
      p8: 'Saffiano leather with a reinforced structure, solid brass hardware and an engraved serial number.',
      p9: 'Brushed 316L steel, sapphire crystal and a Swiss automatic movement with a 72-hour reserve.',
    },
    catLabel: { Abrigos: 'Coats', Chaquetas: 'Jackets', Calzado: 'Footwear', Camisas: 'Shirts', Punto: 'Knitwear', Pantalones: 'Trousers', Accesorios: 'Accessories' },
    tag: { 'Edición limitada': 'Limited edition', Nuevo: 'New', 'Más vendido': 'Best seller' },
    color: { Camel: 'Camel', Grafito: 'Graphite', Marfil: 'Ivory', Negro: 'Black', Arena: 'Sand', Blanco: 'White', Salvia: 'Sage', 'Rojo señal': 'Signal red', 'Azul niebla': 'Mist blue', 'Gris piedra': 'Stone gray', Oliva: 'Olive', Acero: 'Steel' },
    size: { 'Única': 'One size' },
    spec: {
      p1: [['Type', 'Coat'], ['Material', 'Virgin wool'], ['Lining', 'Cupro'], ['Cut', 'Sculptural'], ['Season', 'Fall/Winter']],
      p2: [['Type', 'Jacket'], ['Material', '3-layer softshell'], ['Waterproof', 'Yes · sealed seams'], ['Cut', 'Regular'], ['Season', 'Year-round']],
      p3: [['Type', 'Sneaker'], ['Material', 'Technical knit'], ['Sole', 'Carbon foam'], ['Drop', '8 mm'], ['Gender', 'Unisex']],
      p4: [['Type', 'Sneaker'], ['Material', 'Calf leather'], ['Sole', 'Carbon fiber'], ['Construction', 'Blake-stitched'], ['Gender', 'Unisex']],
      p5: [['Type', 'Shirt'], ['Material', 'Merino 17.5µ'], ['Cut', 'Slim'], ['Care', 'Machine washable'], ['Gender', 'Unisex']],
      p6: [['Type', 'Knit'], ['Material', 'Grade-A cashmere'], ['Yarn', '2-ply'], ['Cut', 'Regular'], ['Season', 'Fall/Winter']],
      p7: [['Type', 'Trousers'], ['Material', 'Cool wool with stretch'], ['Cut', 'Tailored'], ['Stretch', '4-way'], ['Gender', 'Men']],
      p8: [['Type', 'Bag'], ['Material', 'Saffiano leather'], ['Hardware', 'Solid brass'], ['Closure', 'Zipper'], ['Strap', 'Detachable']],
      p9: [['Type', 'Watch'], ['Movement', 'Swiss automatic'], ['Case', '316L steel · sapphire'], ['Diameter', '38–42 mm'], ['Resistance', '10 ATM']],
    },
    initialOrders: [
      { id: 'VS-49215', date: 'Today · 09:12', status: 'entregado', items: [{ n: 'Aero Knit Sneaker', i: 'photo-1600185365483-26d7a4cc7519', q: 1 }], total: 420 },
      { id: 'VS-49088', date: 'Jul 1, 2026', status: 'camino', items: [{ n: 'Merino Zero Shirt', i: 'photo-1602810318383-e386cc2a3ccf', q: 2 }, { n: 'Tailored Flow Trousers', i: 'photo-1594633312681-425c7b97ccd1', q: 1 }], total: 800 },
      { id: 'VS-48731', date: 'Jun 28, 2026', status: 'pendiente', items: [{ n: 'Sculpted Wool Coat', i: 'photo-1539533018447-63fcce2678e3', q: 1 }], total: 1290 },
      { id: 'VS-48119', date: 'Jun 19, 2026', status: 'cancelado', items: [{ n: 'Structured Tote Bag', i: 'photo-1584917865442-de89df76afd3', q: 1 }], total: 780 },
    ],
    initialAddresses: [
      { id: 'a1', label: 'Home', name: 'Alex Cliente', line: 'Av. Reforma 1234, Floor 8', city: 'Mexico City, CDMX 06600', country: 'Mexico', phone: '+52 55 1234 5678', def: true },
      { id: 'a2', label: 'Office', name: 'Alex Cliente', line: 'Blvd. Insurgentes Sur 890', city: 'Mexico City, CDMX 03100', country: 'Mexico', phone: '+52 55 8765 4321', def: false },
    ],
  },
}

const CONTENT: Record<DemoLang, typeof es> = { es, en }

export default function VesperStoreClient({ lang: initialLang }: { lang: DemoLang }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const saleEndRef = useRef(0)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const coLoadTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const payIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const statsInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const statsStarted = useRef(false)
  const pausedRef = useRef(false)
  const qvRef = useRef<string | null>(null)
  const cartOpenRef = useRef(false)

  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [cat, setCatRaw] = useState('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const [sort, setSort] = useState('featured')
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [fSize, setFSize] = useState<string[]>([])
  const [fColor, setFColor] = useState<string[]>([])
  const [priceMax, setPriceMax] = useState(1300)
  const [availOnly, setAvailOnly] = useState(false)
  const [favsOpen, setFavsOpen] = useState(false)
  const [ordersPage, setOrdersPage] = useState(false)
  const [recent, setRecent] = useState<string[]>([])
  const [coStep, setCoStep] = useState<'info' | 'pay'>('info')
  const [payMethod, setPayMethodRaw] = useState<'card' | 'apple' | 'klarna'>('card')
  const [user, setUser] = useState<User | null>({ name: 'Alex Cliente', email: 'alex@correo.com', initials: 'AC' })
  const [cartOpen, setCartOpen] = useState(false)
  const [qvId, setQvId] = useState<string | null>(null)
  const [qvSize, setQvSize] = useState<string | null>(null)
  const [qvColor, setQvColor] = useState(0)
  const [qvQty, setQvQty] = useState(1)
  const [toast, setToast] = useState<string | null>(null)
  const [slide, setSlide] = useState(0)
  const [prog, setProg] = useState(0)
  const [paused, setPaused] = useState(false)
  const [wish, setWish] = useState<string[]>(['p3'])
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART)
  const [lang, setLang] = useState<DemoLang>(initialLang)
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'MXN'>('USD')
  const [coupon, setCoupon] = useState<string | null>(null)
  const [couponRate, setCouponRate] = useState(0)
  const [couponInput, setCouponInput] = useState('')
  const [compare, setCompare] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [sizeGuide, setSizeGuide] = useState<string | null>(null)
  const [settingsPage, setSettingsPage] = useState(false)
  const [settingsTab, setSettingsTab] = useState('perfil')
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [account, setAccount] = useState<'auth' | 'profile' | 'orders' | null>(null)
  const [checkout, setCheckout] = useState<'form' | 'processing' | 'success' | null>(null)
  const [coLoading, setCoLoading] = useState(false)
  const [payStep, setPayStep] = useState(0)
  const [orderNo, setOrderNo] = useState<string | null>(null)
  const [statP, setStatP] = useState(0)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [catalog, setCatalog] = useState<Product[]>(INITIAL_CATALOG)
  const [orders, setOrders] = useState<Order[]>(CONTENT[initialLang].data.initialOrders)
  const [addresses, setAddresses] = useState<Address[]>(CONTENT[initialLang].data.initialAddresses)
  const [, setTick] = useState(0)
  const [deliveryTs, setDeliveryTs] = useState(0)

  const c = CONTENT[lang]
  const d = c.data
  const tname = (id: string) => d.prodName[id] ?? id
  const tmat = (id: string) => d.material[id] ?? ''
  const tcat = (l: string) => d.catLabel[l] ?? l
  const ttag = (t: string | null) => (t ? (d.tag[t] ?? t) : null)
  const tcol = (n: string) => d.color[n] ?? n
  const tsz = (l: string) => d.size[l] ?? l

  pausedRef.current = paused
  qvRef.current = qvId
  cartOpenRef.current = cartOpen

  const showToast = (msg: string, ms = 2000) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), ms)
  }

  const startStats = () => {
    if (statsStarted.current) return
    statsStarted.current = true
    const t0 = Date.now(), d = 1600
    statsInterval.current = setInterval(() => {
      let p = Math.min(1, (Date.now() - t0) / d)
      p = 1 - Math.pow(1 - p, 3)
      setStatP(p)
      if (p >= 1 && statsInterval.current) clearInterval(statsInterval.current)
    }, 40)
  }

  const fmt = (n: number) => {
    const rates = { USD: 1, EUR: 0.92, MXN: 17.4 } as const
    const sym = { USD: '$', EUR: '€', MXN: 'MX$' } as const
    return sym[currency] + Math.round(n * rates[currency]).toLocaleString('en-US')
  }
  const countdown = () => {
    if (!saleEndRef.current) return '00:00:00'
    let ms = Math.max(0, saleEndRef.current - Date.now())
    const h = Math.floor(ms / 3600000); ms -= h * 3600000
    const m = Math.floor(ms / 60000); ms -= m * 60000
    const s = Math.floor(ms / 1000)
    const p = (n: number) => String(n).padStart(2, '0')
    return p(h) + ':' + p(m) + ':' + p(s)
  }

  // ---------- handlers ----------
  const setCat = (v: string) => { setCatRaw(v); setCartOpen(false) }
  const onSearch = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)
  const clearSearch = () => setQuery('')
  const toggleFilters = () => setFiltersOpen((v) => !v)
  const toggleFSize = (v: string) => setFSize((a) => a.includes(v) ? a.filter((x) => x !== v) : [...a, v])
  const toggleFColor = (v: string) => setFColor((a) => a.includes(v) ? a.filter((x) => x !== v) : [...a, v])
  const onPrice = (e: ChangeEvent<HTMLInputElement>) => setPriceMax(Number(e.target.value))
  const toggleAvail = () => setAvailOnly((v) => !v)
  const clearFilters = () => { setFSize([]); setFColor([]); setPriceMax(1300); setAvailOnly(false); setQuery('') }
  const openFavs = () => { setFavsOpen(true); setCartOpen(false); setAccount(null) }
  const closeFavs = () => setFavsOpen(false)
  const goOffers = () => setCatRaw('ofertas')
  const onSort = (e: ChangeEvent<HTMLSelectElement>) => setSort(e.target.value)
  const toggleCart = () => setCartOpen((v) => !v)
  const closeAll = () => setCartOpen(false)
  const stop = (e: ReactMouseEvent) => e.stopPropagation()
  const onCurrency = (e: ChangeEvent<HTMLSelectElement>) => setCurrency(e.target.value as 'USD' | 'EUR' | 'MXN')
  const toggleTheme = () => { const t = theme === 'dark' ? 'light' : 'dark'; setTheme(t); try { document.body.style.background = t === 'dark' ? '#0e0f13' : '#ffffff' } catch { /* noop */ } }
  const toggleLang = () => { const l = lang === 'en' ? 'es' : 'en'; setLang(l); showToast(l === 'en' ? 'Language: English' : 'Idioma: Español', 1800) }

  const openQV = (id: string) => { setRecent((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 6)); setQvId(id); setQvSize(null); setQvColor(0); setQvQty(1); setCartOpen(false); setFavsOpen(false) }
  const closeQV = () => setQvId(null)
  const qvInc = () => setQvQty((v) => v + 1)
  const qvDec = () => setQvQty((v) => Math.max(1, v - 1))

  const pushCart = (qp: Product, size: string, ci: number, qty: number) => {
    const color = qp.colors[ci]
    const key = qp.id + '-' + size + '-' + ci
    setCart((prev) => {
      const ex = prev.find((x) => x.key === key)
      if (ex) return prev.map((x) => x.key === key ? { ...x, qty: x.qty + qty } : x)
      return [...prev, { key, id: qp.id, name: qp.name, price: qp.price, img: qp.img, size, color: color.name, colorHex: color.hex, qty }]
    })
    setCartOpen(true)
    showToast(tname(qp.id) + ' ' + c.toastAdded)
  }
  const toggleWish = (id: string, e?: ReactMouseEvent) => { if (e) e.stopPropagation(); setWish((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]) }
  const quickAdd = (id: string, size: string, e?: ReactMouseEvent) => { if (e) e.stopPropagation(); const qp = catalog.find((p) => p.id === id); if (qp) pushCart(qp, size, 0, 1) }
  const addFromCard = (id: string) => { const qp = catalog.find((p) => p.id === id); if (!qp) return; const avail = qp.sizes.filter((z) => z.stock > 0); if (qp.sizes.length === 1 && avail.length === 1) pushCart(qp, avail[0].label, 0, 1); else openQV(id) }
  const addQV = () => { const qp = catalog.find((p) => p.id === qvId); if (!qp || qvSize == null) return; pushCart(qp, qvSize, qvColor, qvQty); setQvId(null); setQvSize(null); setQvQty(1) }
  const chQty = (key: string, delta: number) => setCart((prev) => prev.map((x) => x.key === key ? { ...x, qty: Math.max(1, x.qty + delta) } : x))
  const removeItem = (key: string) => setCart((prev) => prev.filter((x) => x.key !== key))

  const openAccount = () => { setAccount(user ? 'profile' : 'auth'); setAuthTab('login') }
  const closeAccount = () => setAccount(null)
  const openOrders = () => { setOrdersPage(true); setAccount(null); setFavsOpen(false) }
  const closeOrders = () => setOrdersPage(false)
  const backProfile = () => setAccount('profile')
  const openSettings = () => { setSettingsPage(true); setSettingsTab('perfil'); setAccount(null); setFavsOpen(false) }
  const closeSettings = () => setSettingsPage(false)
  const settingsTabHandler = (t: string) => () => setSettingsTab(t)
  const tabLogin = () => setAuthTab('login')
  const tabRegister = () => setAuthTab('register')
  const onName = (e: ChangeEvent<HTMLInputElement>) => setRegName(e.target.value)
  const onEmail = (e: ChangeEvent<HTMLInputElement>) => setRegEmail(e.target.value)
  const doAuth = () => {
    const isReg = authTab === 'register'
    const name = isReg ? (regName || c.defaultCustomerName) : 'Alex Cliente'
    const email = regEmail || c.defaultEmail
    const parts = name.trim().split(/\s+/).filter(Boolean)
    const initials = (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] || '').slice(0, 1)).toUpperCase()
    setUser({ name, email, initials }); setAccount('profile'); showToast(isReg ? c.toastAccountCreated : c.toastLoggedIn)
  }
  const logout = () => setConfirmLogout(true)
  const cancelLogout = () => setConfirmLogout(false)
  const doLogout = () => { setUser(null); setAccount(null); setSettingsPage(false); setConfirmLogout(false); showToast(c.toastLoggedOut) }

  const makeDefault = (id: string) => () => { setAddresses((prev) => prev.map((a) => ({ ...a, def: a.id === id }))); showToast(c.toastAddrDefault) }
  const deleteAddr = (id: string) => () => { setAddresses((prev) => prev.filter((a) => a.id !== id)); showToast(c.toastAddrDeleted) }
  const addAddr = () => { setAddresses((prev) => [...prev, { id: 'a' + Date.now(), label: c.addrNewLabel, name: user ? user.name : '', line: c.addrNewLine, city: c.addrNewCity, country: c.addrCountry, phone: '', def: prev.length === 0 }]); showToast(c.toastAddrAdded) }
  const saveProfile = () => showToast(c.toastProfile)

  const openSizeGuide = () => { const qp = catalog.find((p) => p.id === qvId); setSizeGuide(qp && qp.cat === 'calzado' ? 'calzado' : 'ropa') }
  const closeSizeGuide = () => setSizeGuide(null)
  const setSizeGuideTab = (t: string) => setSizeGuide(t)

  const openCheckout = () => { if (!cart.length) return; setCheckout('form'); setCoStep('info'); setCoLoading(true); setCartOpen(false); if (coLoadTimer.current) clearTimeout(coLoadTimer.current); coLoadTimer.current = setTimeout(() => setCoLoading(false), 950) }
  const goPay = () => setCoStep('pay')
  const backInfo = () => setCoStep('info')
  const setPayMethod = (m: 'card' | 'apple' | 'klarna') => setPayMethodRaw(m)
  const closeCheckout = () => { if (checkout === 'processing') return; if (payIntervalRef.current) clearInterval(payIntervalRef.current); if (coLoadTimer.current) clearTimeout(coLoadTimer.current); setCheckout(null); setCoLoading(false) }
  const pay = () => {
    setCheckout('processing'); setPayStep(0)
    if (payIntervalRef.current) clearInterval(payIntervalRef.current)
    let step = 0
    payIntervalRef.current = setInterval(() => {
      step += 1
      if (step >= 3) { if (payIntervalRef.current) clearInterval(payIntervalRef.current); setPayStep(3); setTimeout(() => { setCheckout('success'); setOrderNo(String(48210 + Math.floor(Math.random() * 1400))) }, 750) }
      else setPayStep(step)
    }, 1050)
  }
  const finishOrder = () => {
    if (payIntervalRef.current) clearInterval(payIntervalRef.current)
    const snap = cart
    setCatalog((prev) => prev.map((p) => {
      const items = snap.filter((it) => it.id === p.id)
      if (!items.length) return p
      return { ...p, sizes: p.sizes.map((z) => { const it = items.find((x) => x.size === z.label); return it ? { ...z, stock: Math.max(0, z.stock - it.qty) } : z }) }
    }))
    if (snap.length) {
      const no = orderNo || '49300'
      const newOrder: Order = { id: 'VS-' + no, date: c.orderNow, status: 'pendiente', items: snap.map((it) => ({ n: tname(it.id), i: it.img, q: it.qty })), total: snap.reduce((s, it) => s + it.price * it.qty, 0) }
      setOrders((prev) => [newOrder, ...prev])
    }
    setCheckout(null); setCart([]); setCartOpen(false); setCoStep('info'); setCoLoading(false); showToast(c.toastThanks)
  }

  const toggleCompare = (id: string, e?: ReactMouseEvent) => { if (e) e.stopPropagation(); if (compare.includes(id)) setCompare(compare.filter((x) => x !== id)); else if (compare.length < 3) setCompare([...compare, id]); else showToast(c.toastMaxCompare) }
  const openCompare = () => setCompareOpen(true)
  const closeCompare = () => setCompareOpen(false)
  const clearCompare = () => { setCompare([]); setCompareOpen(false) }
  const onCoupon = (e: ChangeEvent<HTMLInputElement>) => setCouponInput(e.target.value)
  const applyCoupon = () => {
    const code = (couponInput || '').trim().toUpperCase()
    const valid: Record<string, number> = { VESPER10: 0.10, BIENVENIDA: 0.15 }
    if (valid[code] != null) { setCoupon(code); setCouponRate(valid[code]); setCouponInput(''); showToast(c.toastCouponPre + code + c.toastCouponSuf) }
    else showToast(c.toastCouponInvalid)
  }
  const removeCoupon = () => { setCoupon(null); setCouponRate(0) }

  const carPause = () => setPaused(true)
  const carResume = () => setPaused(false)
  const carGo = (i: number) => { setSlide(i); setProg(0) }

  const cardTilt = (e: ReactMouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (0.5 - py) * 11
    const ry = (px - 0.5) * 11
    el.style.transform = 'perspective(820px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-8px) scale(1.02)'
    el.style.setProperty('--gx', (px * 100).toFixed(1) + '%')
    el.style.setProperty('--gy', (py * 100).toFixed(1) + '%')
    el.style.setProperty('--gl', '1')
  }
  const cardUntilt = (e: ReactMouseEvent<HTMLElement>) => { const el = e.currentTarget; el.style.transform = ''; el.style.setProperty('--gl', '0') }
  const swEnter = (url: string, e: ReactMouseEvent<HTMLElement>) => { const cc = (e.currentTarget as HTMLElement).closest('[data-card]') as HTMLElement | null; if (cc) cc.style.setProperty('--cimg', 'url(' + url + ')') }
  const swLeave = (e: ReactMouseEvent<HTMLElement>) => { const cc = (e.currentTarget as HTMLElement).closest('[data-card]') as HTMLElement | null; if (cc) cc.style.removeProperty('--cimg') }

  // ---------- mount ----------
  useEffect(() => {
    const root = rootRef.current
    if (root) {
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
        el.style.animation = 'fadeUp .7s cubic-bezier(.2,.7,.2,1) both'
        el.style.animationDelay = ((i % 4) * 0.07) + 's'
      })
    }
    setDeliveryTs(Date.now() + 2 * 86400000)
    saleEndRef.current = Date.now() + (8 * 3600 + 42 * 60 + 15) * 1000
    const ti = setInterval(() => setTick((t) => t + 1), 1000)

    let cm: ((e: MouseEvent) => void) | undefined
    let cd: ((e: MouseEvent) => void) | undefined
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer:fine)').matches && root) {
      const ring = root.querySelector<HTMLElement>('[data-cursor-ring]')
      if (ring) {
        cm = (e) => { ring.style.opacity = '1'; ring.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)' }
        window.addEventListener('mousemove', cm)
        cd = (e) => { const t = e.target as HTMLElement; const on = t.closest && t.closest('button,a,input,select,[data-card]'); ring.style.width = on ? '50px' : '34px'; ring.style.height = on ? '50px' : '34px'; ring.style.margin = on ? '-25px 0 0 -25px' : '-17px 0 0 -17px' }
        window.addEventListener('mouseover', cd)
      }
    }

    let io: IntersectionObserver | undefined
    const band = root && root.querySelector('[data-stats]')
    if (band && 'IntersectionObserver' in window) {
      io = new IntersectionObserver((es2) => { es2.forEach((x) => { if (x.isIntersecting) { startStats(); io?.disconnect() } }) }, { threshold: 0.25 })
      io.observe(band)
    }
    const stTimeout = setTimeout(() => startStats(), 2600)

    const ci = setInterval(() => {
      if (pausedRef.current || qvRef.current || cartOpenRef.current) return
      setProg((prev) => {
        const p = prev + (70 / 5400) * 100
        if (p >= 100) { setSlide((s) => (s + 1) % SLIDE_META.length); return 0 }
        return p
      })
    }, 70)

    return () => {
      clearInterval(ti); clearInterval(ci); clearTimeout(stTimeout)
      if (statsInterval.current) clearInterval(statsInterval.current)
      if (payIntervalRef.current) clearInterval(payIntervalRef.current)
      if (coLoadTimer.current) clearTimeout(coLoadTimer.current)
      if (toastTimer.current) clearTimeout(toastTimer.current)
      if (cm) window.removeEventListener('mousemove', cm)
      if (cd) window.removeEventListener('mouseover', cd)
      io?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------- derived (renderVals) ----------
  const fmtDelivery = (ts: number) => {
    const dt = new Date(ts)
    const day = c.days[dt.getDay()], mo = c.months[dt.getMonth()], dd = dt.getDate()
    return lang === 'es' ? ('el ' + day + ' ' + dd + ' ' + mo) : (day + ', ' + mo + ' ' + dd)
  }
  const deliveryEst = deliveryTs ? fmtDelivery(deliveryTs) : ''
  const numLocale = lang === 'es' ? 'es-MX' : 'en-US'

  const tagStyle = (tag: string | null) => {
    if (tag === 'Más vendido') return { tagBg: '#fff5e0', tagColor: '#8a6a1a', tagBorder: '#f0e4c4' }
    if (tag === 'Edición limitada') return { tagBg: '#ffffff', tagColor: '#171717', tagBorder: 'var(--line2)' }
    return { tagBg: '#171717', tagColor: '#ffffff', tagBorder: 'transparent' }
  }
  const buildTag = (p: Product) => { const ts = tagStyle(p.tag); const disc = p.was ? Math.round((1 - p.price / p.was) * 100) : 0; return { ...ts, hasDisc: !!p.was, discBadge: '-' + disc + '%' } }

  const q = (query || '').trim().toLowerCase()
  let list = catalog.filter((p) => {
    if (!(cat === 'all' ? true : (cat === 'ofertas' ? !!p.was : p.cat === cat))) return false
    if (q && !((p.name + ' ' + p.catLabel + ' ' + p.material + ' ' + tname(p.id) + ' ' + tcat(p.catLabel) + ' ' + tmat(p.id)).toLowerCase().includes(q))) return false
    if (fSize.length && !p.sizes.some((z) => z.stock > 0 && fSize.includes(z.label))) return false
    if (fColor.length && !p.colors.some((col) => fColor.includes(col.name))) return false
    if (p.price > priceMax) return false
    if (availOnly && !p.sizes.some((z) => z.stock > 0)) return false
    return true
  })
  if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price)
  else if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price)

  const products = list.map((p) => {
    const totalStock = p.sizes.reduce((s, z) => s + z.stock, 0)
    const low = totalStock > 0 && totalStock <= 8
    const out = totalStock === 0
    const t = buildTag(p)
    const wished = wish.includes(p.id)
    const inCmp = compare.includes(p.id)
    return {
      ...p, name: tname(p.id), catLabel: tcat(p.catLabel), tag: ttag(p.tag),
      imgUrl: img(p.img), priceFmt: fmt(p.price), wasFmt: p.was ? fmt(p.was) : '', hasWas: !!p.was,
      priceColor: p.was ? '#c0392b' : '#171717',
      colorCount: p.colors.length === 1 ? ('1 ' + c.colorSingular) : (p.colors.length + ' ' + c.colorPlural),
      reviews: p.sold, hasSave: !!p.was, saveFmt: p.was ? (c.save + ' ' + fmt(p.was - p.price)) : '',
      stockText: out ? c.soldOut : low ? (c.onlyLeftPre + totalStock + c.onlyLeftSuf) : c.inStock,
      stockColor: out ? '#a5a29b' : low ? '#c0392b' : '#3a8a5a',
      swatches: p.colors.slice(0, 4).map((col, ci) => { const arr = PIMGS[p.id] || [p.img]; const url = img(arr[Math.min(ci, arr.length - 1)]); return { hex: col.hex, name: tcol(col.name), enter: (e: ReactMouseEvent<HTMLElement>) => swEnter(url, e), leave: swLeave } }),
      qaSizes: p.sizes.filter((z) => z.stock > 0).slice(0, 5).map((z) => ({ label: tsz(z.label), onClick: (e: ReactMouseEvent) => quickAdd(p.id, z.label, e) })),
      heartFill: wished ? '#e63329' : 'rgba(0,0,0,0)', heartStroke: wished ? '#e63329' : '#3a3a3a',
      heartAnim: wished ? 'heartPop .4s cubic-bezier(.2,.7,.2,1)' : 'none',
      wishBg: wished ? 'rgba(255,255,255,.98)' : 'rgba(255,255,255,.9)', wishBorder: wished ? '#f4c9c5' : 'var(--line)',
      ...t,
      btnLabel: out ? c.notifyMe : c.addToCart,
      btnBg: out ? '#fff' : '#171717', btnColor: out ? '#171717' : '#fff', btnBorder: out ? 'var(--line2)' : '#171717',
      btnCursor: 'pointer',
      open: () => openQV(p.id), add: (e?: ReactMouseEvent) => { if (e) e.stopPropagation(); addFromCard(p.id) }, wish: (e?: ReactMouseEvent) => toggleWish(p.id, e),
      compare: (e?: ReactMouseEvent) => toggleCompare(p.id, e), cmpLabel: inCmp ? c.inCompare : c.compareWord, cmpColor: inCmp ? '#3a8a5a' : 'var(--muted)',
    }
  })

  const counts: Record<string, number> = {}
  catalog.forEach((p) => { counts[p.cat] = (counts[p.cat] || 0) + 1 })
  const chipVals = ['all', 'calzado', 'abrigos', 'prendas', 'accesorios', 'ofertas']
  const chips = chipVals.map((val) => { const active = cat === val; return { label: c.chips[val], onClick: () => setCat(val), bg: active ? '#171717' : '#fff', color: active ? '#fff' : '#171717', border: active ? '#171717' : 'var(--line2)' } })
  const navCats = chipVals.map((val) => { const active = cat === val; return { label: c.nav[val], onClick: () => setCat(val), color: active ? '#171717' : '#6b6b6b', weight: active ? '600' : '500', underline: active ? '#171717' : 'transparent' } })
  const tileDefs = [{ val: 'calzado', img: 'photo-1600185365483-26d7a4cc7519' }, { val: 'abrigos', img: 'photo-1539533018447-63fcce2678e3' }, { val: 'prendas', img: 'photo-1602810318383-e386cc2a3ccf' }, { val: 'accesorios', img: 'photo-1584917865442-de89df76afd3' }]
  const tiles = tileDefs.map((t) => ({ label: c.tiles[t.val], count: counts[t.val] || 0, imgUrl: img(t.img), onClick: () => setCat(t.val) }))

  const cartItems = cart.map((it) => ({ ...it, name: tname(it.id), color: tcol(it.color), size: tsz(it.size), imgUrl: img(it.img), lineFmt: fmt(it.price * it.qty), inc: () => chQty(it.key, 1), dec: () => chQty(it.key, -1), remove: () => removeItem(it.key) }))
  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0)
  const count = cart.reduce((s, it) => s + it.qty, 0)
  const freeAt = 80 * 10
  const discount = coupon ? subtotal * (couponRate || 0) : 0
  const shipping = subtotal > 0 && (subtotal - discount) < freeAt ? 12 : 0
  const tax = (subtotal - discount) * 0.16
  const total = subtotal - discount + shipping
  const inCart = new Set(cart.map((it) => it.id))
  const crossSell = catalog
    .filter((p) => !inCart.has(p.id) && p.sizes.some((z) => z.stock > 0))
    .sort((a, b) => (b.was ? 1 : 0) - (a.was ? 1 : 0) || b.sold - a.sold)
    .slice(0, 2)
    .map((p) => ({ name: tname(p.id), priceFmt: fmt(p.price), imgUrl: img(p.img), add: (e?: ReactMouseEvent) => { if (e) e.stopPropagation(); const z = p.sizes.find((z) => z.stock > 0); if (z) pushCart(p, z.label, 0, 1) } }))

  const qp = catalog.find((p) => p.id === qvId)
  let qv: any = null
  if (qp) {
    const t = buildTag(qp)
    const selSize = qp.sizes.find((z) => z.label === qvSize)
    qv = {
      ...qp, name: tname(qp.id), catLabel: tcat(qp.catLabel), tag: ttag(qp.tag), material: tmat(qp.id),
      imgUrl: img(qp.img), priceFmt: fmt(qp.price), wasFmt: qp.was ? fmt(qp.was) : '', hasWas: !!qp.was,
      priceColor: qp.was ? '#c0392b' : '#171717',
      soldText: qp.sold + ' ' + c.soldThisMonth, qvColorName: tcol(qp.colors[qvColor].name), ...t,
      specs: (d.spec[qp.id] || []).map(([label, value]) => ({ label, value })),
      related: catalog.filter((x) => x.id !== qp.id).sort((a, b) => (a.cat === qp.cat ? -1 : 0) - (b.cat === qp.cat ? -1 : 0) || b.sold - a.sold).slice(0, 3).map((x) => ({ name: tname(x.id), priceFmt: fmt(x.price), imgUrl: img(x.img), open: () => openQV(x.id) })),
      colors: qp.colors.map((col, i) => ({ name: tcol(col.name), hex: col.hex, ring: i === qvColor ? '#171717' : 'transparent', onClick: () => setQvColor(i) })),
      sizes: qp.sizes.map((z) => { const so = z.stock === 0; const sel = qvSize === z.label; return { label: tsz(z.label), bg: sel ? '#171717' : '#fff', color: so ? '#c4c1ba' : (sel ? '#fff' : '#171717'), border: sel ? '#171717' : 'var(--line2)', cursor: so ? 'not-allowed' : 'pointer', deco: so ? 'line-through' : 'none', onClick: so ? (() => {}) : (() => setQvSize(z.label)) } }),
      sizeHint: selSize ? (selSize.stock <= 3 ? (c.onlyLeftSizePre + selSize.stock + c.onlyLeftSizeSuf) : '') : (qvSize == null ? c.selectSize : ''),
      sizeHintColor: selSize && selSize.stock <= 3 ? '#c0392b' : '#9a978f',
    }
  }
  const canAdd = !!qp && qvSize != null

  const slidesV = SLIDE_META.map((s, i) => {
    const st = c.slides[i]
    const active = i === slide
    return {
      eyebrow: st.eyebrow, title: st.title, sub: st.sub, cta: st.cta, note: st.note, badge: s.badge, dot: s.dot,
      hasTimer: !!s.timer, countdown: s.timer ? countdown() : '',
      imgUrl: img(s.img),
      op: active ? 1 : 0, scale: active ? '1' : '1.04', z: active ? 2 : 1, pe: (active ? 'auto' : 'none') as CSSProperties['pointerEvents'],
      contentT: active ? 'translateY(0)' : 'translateY(26px)',
      kbState: (active ? 'running' : 'paused') as CSSProperties['animationPlayState'],
      ctaAction: () => { setCat(s.go); const el = rootRef.current && rootRef.current.querySelector('#shop'); if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 70; window.scrollTo({ top: y, behavior: 'smooth' }) } },
    }
  })
  const dots = SLIDE_META.map((s, i) => { const active = i === slide; return { w: active ? '40px' : '22px', fill: active ? (prog + '%') : '0%', onClick: () => carGo(i) } })

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', '28', '30', '32', '34', '36', '39', '40', '41', '42', '43', '44', '45', 'Única', '38mm', '42mm']
  const usedSizes = allSizes.filter((sz) => catalog.some((p) => p.sizes.some((z) => z.label === sz)))
  const fSizeOpts = usedSizes.map((sz) => { const on = fSize.includes(sz); return { label: tsz(sz), onClick: () => toggleFSize(sz), bg: on ? '#171717' : '#fff', color: on ? '#fff' : '#171717', border: on ? '#171717' : 'var(--line2)' } })
  const colorMap: Record<string, string> = {}
  catalog.forEach((p) => p.colors.forEach((col) => { if (!colorMap[col.name]) colorMap[col.name] = col.hex }))
  const fColorOpts = Object.keys(colorMap).map((nm) => { const on = fColor.includes(nm); return { name: tcol(nm), hex: colorMap[nm], onClick: () => toggleFColor(nm), bg: on ? '#efece6' : '#fff', border: on ? '#171717' : 'var(--line2)', txt: '#171717' } })
  const activeCount = fSize.length + fColor.length + (availOnly ? 1 : 0) + (priceMax < 1300 ? 1 : 0)
  const filtActive = filtersOpen || activeCount > 0

  const favItems = wish.map((id) => catalog.find((p) => p.id === id)).filter(Boolean).map((p) => ({ id: p!.id, name: tname(p!.id), catLabel: tcat(p!.catLabel), priceFmt: fmt(p!.price), imgUrl: img(p!.img), open: () => openQV(p!.id), remove: (e?: ReactMouseEvent) => { if (e) e.stopPropagation(); toggleWish(p!.id) } }))
  const recentItems = recent.map((id) => catalog.find((p) => p.id === id)).filter(Boolean).map((p) => ({ name: tname(p!.id), priceFmt: fmt(p!.price), imgUrl: img(p!.img), open: () => openQV(p!.id) }))

  const sp = statP || 0
  const statDefs = [{ to: 12480, suf: '', dec: 0 }, { to: 48, suf: 'h', dec: 0 }, { to: 98, suf: '%', dec: 0 }, { to: 4.9, suf: '', dec: 1 }]
  const stats = statDefs.map((s, i) => { const v = s.to * sp; const display = s.dec ? v.toFixed(1) + s.suf : Math.round(v).toLocaleString(numLocale) + s.suf; return { display, label: c.stats[i] } })

  // orders view
  const orderMeta: Record<string, { label: string; color: string; bg: string; stage: number }> = {
    entregado: { label: c.orderStatus.entregado, color: '#2f9e5f', bg: '#eaf6ee', stage: 4 },
    camino: { label: c.orderStatus.camino, color: '#3b6fb0', bg: '#eaf1f9', stage: 3 },
    pendiente: { label: c.orderStatus.pendiente, color: '#b7791f', bg: '#fbf1de', stage: 1 },
    cancelado: { label: c.orderStatus.cancelado, color: '#a05252', bg: '#f6ecec', stage: 0 },
  }
  const orderStages = c.orderStages
  const ordersView = orders.map((o) => {
    const m = orderMeta[o.status]
    const showTrack = o.status === 'camino' || o.status === 'entregado'
    const track = orderStages.map((lbl, i) => { const done = (i + 1) <= m.stage; const isLast = i === orderStages.length - 1; return { label: lbl, mark: done ? '✓' : '', dotBg: done ? m.color : 'var(--line2)', dotBorder: done ? m.color : 'var(--line2)', txt: done ? '#171717' : '#b3b0a9', hasBar: !isLast, barColor: ((i + 1) < m.stage) ? m.color : 'var(--line2)', flex: isLast ? '0' : '1' } })
    const qty = o.items.reduce((s, it) => s + it.q, 0)
    const summary = o.items.map((it) => it.n).join(', ') + (qty > o.items.length ? (' · ' + qty + ' ' + c.itemsWord) : '')
    let acts: { label: string; primary?: boolean }[]
    if (o.status === 'entregado') acts = [{ label: c.actRebuy, primary: true }, { label: c.actReturn }]
    else if (o.status === 'camino') acts = [{ label: c.actTrack, primary: true }, { label: c.actDetail }]
    else if (o.status === 'pendiente') acts = [{ label: c.actCompletePay, primary: true }, { label: c.actCancel }]
    else acts = [{ label: c.actRebuy, primary: true }]
    const actions = acts.map((a) => ({ label: a.label, onClick: () => {}, bg: a.primary ? '#171717' : '#fff', color: a.primary ? '#fff' : '#171717', border: a.primary ? '#171717' : 'var(--line2)', hover: a.primary ? 'background:#000' : 'border-color:var(--text)' }))
    return { id: o.id, date: o.date, stLabel: m.label, stColor: m.color, stBg: m.bg, totalFmt: fmt(o.total), summary, thumbs: o.items.slice(0, 3).map((it) => ({ imgUrl: img(it.i), qty: it.q, multi: it.q > 1 })), showTrack, track, actions }
  })

  // compare
  const compareProds = compare.map((id) => catalog.find((p) => p.id === id)).filter(Boolean) as Product[]
  const compareThumbs = compareProds.map((p) => ({ imgUrl: img(p.img), remove: (e?: ReactMouseEvent) => toggleCompare(p.id, e) }))
  const compareCols = compareProds.map((p) => ({ imgUrl: img(p.img), name: tname(p.id) }))
  const compareRowDefs: { label: string; get: (p: Product) => string; strong?: boolean }[] = [
    { label: c.cmpPrice, get: (p) => fmt(p.price), strong: true },
    { label: c.cmpCategory, get: (p) => tcat(p.catLabel) },
    { label: c.cmpMaterial, get: (p) => tmat(p.id) },
    { label: c.cmpRating, get: (p) => '★ ' + p.rating + ' (' + p.sold + ')' },
    { label: c.cmpColors, get: (p) => p.colors.map((col) => tcol(col.name)).join(', ') },
    { label: c.cmpSizes, get: (p) => p.sizes.filter((z) => z.stock > 0).map((z) => tsz(z.label)).join(' · ') || c.cmpSoldOut },
    { label: c.cmpShipping, get: () => c.cmpFreeShip },
  ]
  const compareRows = compareRowDefs.map((r) => ({ label: r.label, cells: compareProds.map((p) => ({ v: r.get(p), color: r.strong ? '#c0392b' : 'var(--text2)', weight: r.strong ? '700' : '400' })) }))
  const compareOpenComputed = compareOpen && compare.length > 0

  // size guide
  const sgActive = sizeGuide
  let sgTabs: { label: string; onClick: () => void; bg: string; color: string; border: string }[] = []
  let sgHead: string[] = []
  let sgRows: { bg: string; cells: { v: string; color: string; weight: string }[] }[] = []
  let sgCols = '1fr'
  if (sgActive) {
    sgTabs = [{ label: c.sgClothes, v: 'ropa' }, { label: c.sgShoes, v: 'calzado' }].map((t) => ({ label: t.label, onClick: () => setSizeGuideTab(t.v), bg: sgActive === t.v ? '#171717' : '#fff', color: sgActive === t.v ? '#fff' : '#171717', border: sgActive === t.v ? '#171717' : 'var(--line2)' }))
    let rows: string[][]
    if (sgActive === 'calzado') { sgCols = '1fr 1fr 1fr 1fr'; sgHead = c.sgHeadShoes; rows = [['39', '7', '6', '24.5'], ['40', '8', '7', '25.5'], ['41', '8.5', '7.5', '26'], ['42', '9', '8.5', '27'], ['43', '10', '9', '28'], ['44', '11', '10', '28.5'], ['45', '11.5', '10.5', '29.5']] }
    else { sgCols = '1.2fr 1fr 1fr 1fr'; sgHead = c.sgHeadClothes; rows = [['XS', '86-90', '70-74', '88-92'], ['S', '91-96', '75-80', '93-98'], ['M', '97-102', '81-86', '99-104'], ['L', '103-108', '87-92', '105-110'], ['XL', '109-116', '93-100', '111-118']] }
    sgRows = rows.map((r, i) => ({ bg: i % 2 ? 'var(--surface2)' : '#fff', cells: r.map((v, ci) => ({ v, color: ci === 0 ? '#171717' : '#6b6b6b', weight: ci === 0 ? '700' : '400' })) }))
  }

  const tabStyle = (active: boolean): CSSProperties => ({ display: 'flex', alignItems: 'center', padding: '11px 14px', borderRadius: 11, cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: '.15s', ...(active ? { background: 'var(--surface3)', color: 'var(--text)' } : { color: 'var(--muted)' }) })
  const addressList = addresses.map((a) => ({ ...a, notDef: !a.def, borderCol: a.def ? 'var(--text)' : 'var(--line)', mkDefault: makeDefault(a.id), del: deleteAddr(a.id) }))

  const themeLabel = theme === 'dark' ? c.themeLight : c.themeDark
  const langLabel = lang === 'en' ? 'EN' : 'ES'
  const accountLabel = user ? user.name.split(' ')[0] : c.account
  const userInitials = user && user.initials
  const userName = user && user.name
  const userEmail = user && user.email
  const shopTitle = q ? (c.resultsFor + ' “' + query + '”') : (c.shopTitles[cat] || c.collection)
  const shippingFmt = shipping === 0 ? c.free : fmt(shipping)
  const shipColor = shipping === 0 ? '#3a8a5a' : '#171717'
  const freeShipPct = Math.min(100, Math.round(subtotal / freeAt * 100)) + '%'
  const freeShipPctLabel = subtotal >= freeAt ? '100%' : Math.round(subtotal / freeAt * 100) + '%'
  const shipMsg = subtotal >= freeAt ? c.freeShipDone : (c.freeShipNeedPre + fmt(freeAt - subtotal) + c.freeShipNeedSuf)
  const shipBarColor = subtotal >= freeAt ? '#3a8a5a' : '#171717'
  const coSteps = [{ n: '1', label: c.coStepInfo, k: 'info' }, { n: '2', label: c.coStepPay, k: 'pay' }].map((s) => { const active = coStep === s.k; return { n: s.n, label: s.label, bg: active ? '#171717' : 'var(--line2)', color: active ? '#fff' : '#9a978f', txt: active ? '#171717' : '#9a978f' } })
  const shipOpts = [{ label: c.shipExpress, eta: c.shipExpressEta }, { label: c.shipStd, eta: c.shipStdEta }].map((o, i) => ({ label: o.label, eta: o.eta, price: c.free, priceColor: '#3a8a5a', border: i === 0 ? '#171717' : 'var(--line2)', bg: i === 0 ? 'var(--surface2)' : '#fff', dot: i === 0 ? '#171717' : '#c4c1ba', fill: i === 0 ? '#171717' : 'transparent' }))
  const payMethods = [{ k: 'card', label: c.payCardTab }, { k: 'apple', label: c.payAppleTab }, { k: 'klarna', label: c.payKlarnaTab }].map((m) => { const on = payMethod === m.k; return { label: m.label, onClick: () => setPayMethod(m.k as 'card' | 'apple' | 'klarna'), border: on ? '#171717' : 'var(--line2)', bg: on ? '#171717' : '#fff', color: on ? '#fff' : '#171717' } })
  const walletMsg = payMethod === 'apple' ? c.walletApple : c.walletKlarna
  const payCta = (payMethod === 'apple' ? c.payApple : (payMethod === 'klarna' ? c.payKlarna : c.payCard)) + fmt(total)
  const payMsg = c.payMsgs[Math.min(payStep || 0, 3)]
  const payPct = (Math.min(((payStep || 0) + 1) / 3, 1) * 100) + '%'
  const authSubtitle = authTab === 'register' ? c.authRegSub : c.authLoginSub
  const authCta = authTab === 'register' ? c.register : c.login
  const addLabel = canAdd ? c.addToCart : c.chooseSize
  const addBg = canAdd ? '#171717' : '#e9e6df'
  const addColor = canAdd ? '#fff' : '#9a978f'
  const addCursor = canAdd ? 'pointer' : 'not-allowed'
  const ann = c.ann
  const trust = TRUST_ICONS.map((icon, i) => ({ icon, title: c.trust[i].title, body: c.trust[i].body }))
  const reviews = REVIEW_META.map((m, i) => ({ ...m, text: c.reviews[i].text, meta: c.reviews[i].meta }))
  const profileLinks = [{ icon: '⚙', label: c.settings, onClick: openSettings }]
  const settingsIsPerfil = (settingsTab || 'perfil') === 'perfil'
  const settingsIsDir = settingsTab === 'direcciones'
  const settingsIsPref = settingsTab === 'preferencias'
  const maskPe: CSSProperties['pointerEvents'] = cartOpen ? 'auto' : 'none'

  return (
    <div ref={rootRef} className="vesper-scope" data-theme={theme} style={{ position: 'relative', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', transition: 'background .4s', fontFamily: "'DM Sans',system-ui,sans-serif", overflowX: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Bodoni+Moda:wght@500;600&display=swap" />
      <style>{`
        .vesper-scope *{box-sizing:border-box}
        .vesper-scope [data-card]:hover{--qa:1}
        .vesper-scope input::placeholder{color:var(--muted2)}
        [data-theme="light"]{--bg:#ffffff;--surface:#ffffff;--surface2:#faf9f7;--surface3:#f4f2ee;--line:#ececec;--line2:#dcd9d3;--text:#171717;--text2:#3a3a3a;--muted:#6b6b6b;--muted2:#9a978f;--glass:rgba(255,255,255,.9)}
        [data-theme="dark"]{--bg:#0e0f13;--surface:#181a20;--surface2:#141519;--surface3:#20232b;--line:#2b2e37;--line2:#383c46;--text:#ece9e2;--text2:#c9c6bf;--muted:#a29e96;--muted2:#7e7b74;--glass:rgba(18,19,24,.82)}
        .vesper-scope[data-theme="dark"] button[style*="background:#171717"],.vesper-scope[data-theme="dark"] a[style*="background:#171717"]{background:#ece9e2 !important;color:#12131a !important}
        .vesper-scope[data-theme="dark"] [style*="unsplash"]{filter:brightness(.92) contrast(1.02)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes badgePop{0%{transform:scale(0)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
        @keyframes slideToast{from{opacity:0;transform:translate(-50%,16px)}to{opacity:1;transform:translate(-50%,0)}}
        @keyframes annScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes kenBurns{from{transform:scale(1.02)}to{transform:scale(1.14)}}
        @keyframes heartPop{0%{transform:scale(1)}35%{transform:scale(1.4)}60%{transform:scale(.9)}100%{transform:scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes checkPop{0%{transform:scale(0);opacity:0}55%{transform:scale(1.18)}100%{transform:scale(1);opacity:1}}
        @keyframes ringDraw{0%{stroke-dashoffset:170}100%{stroke-dashoffset:0}}
        @keyframes pulseDot{0%,100%{opacity:1}50%{opacity:.3}}
      `}</style>

      {/* CUSTOM CURSOR */}
      <div data-cursor-ring style={{ position: 'fixed', top: 0, left: 0, width: 34, height: 34, margin: '-17px 0 0 -17px', border: '1.5px solid #171717', borderRadius: '50%', pointerEvents: 'none', zIndex: 120, mixBlendMode: 'difference', transition: 'transform .14s ease-out,width .2s,height .2s,opacity .2s', opacity: 0, willChange: 'transform' }} />

      {/* ANNOUNCEMENT */}
      <div style={{ background: '#171717', color: '#fff', display: 'flex', alignItems: 'center', gap: 16, padding: '0 18px 0 0', fontSize: 12.5, letterSpacing: '.02em' }}>
        <div style={{ flex: 1, overflow: 'hidden', padding: '9px 0' }}><div style={{ display: 'flex', width: 'max-content', animation: 'annScroll 30s linear infinite' }}><span style={{ display: 'flex', gap: 40, paddingRight: 40, whiteSpace: 'nowrap' }}>{ann}</span><span style={{ display: 'flex', gap: 40, paddingRight: 40, whiteSpace: 'nowrap' }}>{ann}</span></div></div>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 9, background: '#c0392b', padding: '7px 14px', borderRadius: 30, fontWeight: 600 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--surface)', animation: 'pulseDot 1.4s infinite' }} />{c.flashOffer} <span style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '.05em' }}>{countdown()}</span></div>
      </div>

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--glass)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line)' }}>
        <div className="dnav" style={{ maxWidth: 1300, margin: '0 auto', padding: '16px 28px', display: 'flex', alignItems: 'center', gap: 26 }}>
          {/* Menú hamburguesa (móvil) — categorías */}
          <div className="dnav-only" style={{ position: 'relative', flexShrink: 0 }}>
            <button onClick={() => setMenuOpen((s) => !s)} aria-label="Menu" aria-expanded={menuOpen} style={{ width: 42, height: 42, borderRadius: 40, border: '1px solid var(--line)', background: 'var(--surface2)', color: 'var(--text)', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', fontSize: 19, lineHeight: 1 }}>{menuOpen
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>}</button>
            {menuOpen && (
              <div style={{ position: 'absolute', top: 52, left: 0, minWidth: 200, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, boxShadow: '0 24px 56px -20px rgba(0,0,0,.25)', padding: 8, zIndex: 90, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {navCats.map((n, i) => (
                  <button key={i} onClick={() => { n.onClick(); setMenuOpen(false) }} style={{ fontSize: 14, fontWeight: n.weight as unknown as number, color: n.color, background: 'none', border: 'none', textAlign: 'left', padding: '12px 14px', borderRadius: 10, cursor: 'pointer' }}>{n.label}</button>
                ))}
              </div>
            )}
          </div>
          <a href="#top" style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 23, letterSpacing: '.34em', color: 'var(--text)', textDecoration: 'none', paddingLeft: '.34em', flexShrink: 0 }}>VESPER</a>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, maxWidth: 520, background: 'var(--surface3)', border: '1px solid var(--line)', borderRadius: 40, padding: '11px 18px' }}>
            <span style={{ color: 'var(--muted2)', fontSize: 15 }}>⌕</span>
            <input value={query} onChange={onSearch} placeholder={c.searchPh} style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--text)' }} />
            {q.length > 0 && <button onClick={clearSearch} style={{ background: 'none', border: 'none', color: 'var(--muted2)', cursor: 'pointer', fontSize: 15, padding: '0 2px' }}>✕</button>}
          </div>
          <div className="dnav" style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button onClick={toggleLang} aria-label={c.ariaLang} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 44, background: 'none', border: '1px solid var(--line)', cursor: 'pointer', color: 'var(--text)', padding: '8px 14px', borderRadius: 30, fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 700, letterSpacing: '.03em', textAlign: 'center' }}>{langLabel}</button>
            <button onClick={toggleTheme} aria-label={c.ariaTheme} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, minWidth: 80, background: 'none', border: '1px solid var(--line)', cursor: 'pointer', color: 'var(--text)', padding: '8px 14px', borderRadius: 30, fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 700, letterSpacing: '.03em', textAlign: 'center' }}>
              {theme === 'dark'
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>}
              {themeLabel}
            </button>
            <select defaultValue="USD" onChange={onCurrency} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: 'pointer', outline: 'none', padding: '8px 4px' }}>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="MXN">MX$ MXN</option>
            </select>
            <button onClick={openAccount} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '7px 10px 7px 8px', borderRadius: 30, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 8 }}>{user ? <span style={{ width: 27, height: 27, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a05f,#7a5f30)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '.03em' }}>{userInitials}</span> : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6" /></svg>}<span>{accountLabel}</span></button>
            <button onClick={toggleCart} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 9, background: '#171717', border: 'none', color: '#fff', padding: '11px 20px', borderRadius: 40, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 500 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9.5" cy="20" r="1.2" /><circle cx="18" cy="20" r="1.2" /><path d="M2.5 3.5H5l2.3 11.6a1.4 1.4 0 0 0 1.4 1.1h8.8a1.4 1.4 0 0 0 1.4-1.1L21.5 8H6" /></svg>{c.cart}
              {count > 0 && <span style={{ minWidth: 20, height: 20, padding: '0 5px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', color: 'var(--text)', borderRadius: 20, fontSize: 11, fontWeight: 700, animation: 'badgePop .35s ease' }}>{count}</span>}
            </button>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--line)' }}>
          <div className="dnav-hide" style={{ maxWidth: 1300, margin: '0 auto', padding: '0 28px', display: 'flex', gap: 30, alignItems: 'center', height: 46 }}>
            {navCats.map((n, i) => (
              <a key={i} href="#shop" onClick={n.onClick} style={{ fontSize: 13.5, fontWeight: n.weight as unknown as number, letterSpacing: '.01em', color: n.color, textDecoration: 'none', padding: '4px 0', borderBottom: '2px solid ' + n.underline, transition: 'all .2s' }}>{n.label}</a>
            ))}
            {user && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 24, alignItems: 'center' }}>
                <span onClick={openOrders} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 500, color: 'var(--muted)', cursor: 'pointer' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l9-5 9 5v8l-9 5-9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></svg>{c.ordersNav} <span style={{ background: '#171717', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>{orders.length}</span></span>
                <span onClick={openFavs} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 500, color: 'var(--muted)', cursor: 'pointer' }}>{c.favs} {wish.length > 0 && <span style={{ background: '#171717', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>{wish.length}</span>}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* PROMO CAROUSEL */}
      <section id="top" style={{ maxWidth: 1300, margin: '0 auto', padding: '22px 28px 0' }}>
        <div onMouseEnter={carPause} onMouseLeave={carResume} style={{ position: 'relative', borderRadius: 22, overflow: 'hidden', height: 'min(72vh,500px)', background: '#111114' }}>
          {slidesV.map((s, i) => (
            <div key={i} style={{ position: 'absolute', inset: 0, opacity: s.op, transform: 'scale(' + s.scale + ')', transition: 'opacity .9s cubic-bezier(.4,0,.2,1),transform 1.2s cubic-bezier(.4,0,.2,1)', zIndex: s.z, pointerEvents: s.pe }}>
              <div style={{ position: 'absolute', inset: '-6%', background: 'url(' + s.imgUrl + ') center/cover', animation: 'kenBurns 9s ease-out both', animationPlayState: s.kbState }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg,rgba(10,10,12,.82) 0%,rgba(10,10,12,.55) 42%,rgba(10,10,12,.12) 70%,transparent 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                <div style={{ padding: '0 clamp(34px,5vw,68px)', maxWidth: 600, color: '#fff', transform: s.contentT, opacity: s.op, transition: 'transform .9s cubic-bezier(.2,.7,.2,1) .12s,opacity .9s .12s' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.22)', color: '#fff', fontSize: 11.5, letterSpacing: '.14em', textTransform: 'uppercase', padding: '7px 15px', borderRadius: 30, marginBottom: 22 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />{s.eyebrow}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
                    {s.badge && <div style={{ flexShrink: 0, marginTop: 8, background: '#c0392b', color: '#fff', fontSize: 19, fontWeight: 800, letterSpacing: '-.02em', padding: '12px 15px', borderRadius: 14, boxShadow: '0 12px 30px -10px rgba(192,57,43,.7)' }}>{s.badge}</div>}
                    <h2 style={{ fontSize: 'clamp(32px,4.6vw,58px)', lineHeight: 1.02, margin: 0, fontWeight: 700, letterSpacing: '-.02em' }}>{s.title}</h2>
                  </div>
                  <p style={{ fontSize: 'clamp(15px,1.5vw,17px)', lineHeight: 1.6, color: 'rgba(255,255,255,.78)', margin: '20px 0 30px', maxWidth: 440, fontWeight: 400 }}>{s.sub}</p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <button onClick={s.ctaAction} style={{ background: 'var(--surface)', color: 'var(--text)', padding: '15px 30px', borderRadius: 40, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 9 }}>{s.cta} <span style={{ fontSize: 16 }}>→</span></button>
                    {s.hasTimer && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(0,0,0,.32)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.2)', padding: '11px 16px', borderRadius: 40 }}><span style={{ fontSize: 12, color: 'rgba(255,255,255,.75)' }}>{c.endsIn}</span><span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: '.04em', color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{s.countdown}</span></div>}
                    {s.note && <span style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>{s.note}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ position: 'absolute', zIndex: 6, left: 'clamp(34px,5vw,68px)', bottom: 26, display: 'flex', gap: 12, alignItems: 'center' }}>
            {dots.map((dt, i) => (
              <button key={i} onClick={dt.onClick} style={{ position: 'relative', height: 4, width: dt.w, borderRadius: 4, background: 'rgba(255,255,255,.28)', border: 'none', padding: 0, cursor: 'pointer', overflow: 'hidden', transition: 'width .4s' }}><span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: dt.fill, background: 'var(--surface)', borderRadius: 4, transition: 'width .1s linear' }} /></button>
            ))}
          </div>
          <div style={{ position: 'absolute', zIndex: 6, right: 'clamp(34px,5vw,68px)', bottom: 24, fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: 'rgba(255,255,255,.7)', letterSpacing: '.08em' }}>{String(slide + 1).padStart(2, '0')} <span style={{ opacity: .5 }}>/ {String(SLIDE_META.length).padStart(2, '0')}</span></div>
        </div>
      </section>

      {/* CATEGORY TILES */}
      <section style={{ maxWidth: 1300, margin: '0 auto', padding: '44px 28px 8px' }}>
        <div className="dcards-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {tiles.map((t, i) => (
            <a key={i} href="#shop" onClick={t.onClick} data-reveal style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', aspectRatio: '1/1', textDecoration: 'none', display: 'block' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'url(' + t.imgUrl + ') center/cover', transition: 'transform .7s cubic-bezier(.2,.7,.2,1)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 45%,rgba(0,0,0,.55))' }} />
              <div style={{ position: 'absolute', left: 16, bottom: 15, color: '#fff' }}><div style={{ fontSize: 17, fontWeight: 600 }}>{t.label}</div><div style={{ fontSize: 12.5, opacity: .85 }}>{t.count} {c.productsWord}</div></div>
            </a>
          ))}
        </div>
      </section>
      {/* SHOP */}
      <section id="shop" style={{ maxWidth: 1300, margin: '0 auto', padding: '40px 28px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 18, marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', margin: 0, fontWeight: 700, letterSpacing: '-.01em' }}>{shopTitle}</h2>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 14 }}>{products.length} {c.productsWord} · {c.freeShipFrom}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--muted)' }}>
            <button onClick={toggleFilters} style={{ display: 'flex', alignItems: 'center', gap: 8, background: filtActive ? '#171717' : '#fff', border: '1px solid ' + (filtActive ? '#171717' : 'var(--line2)'), color: filtActive ? '#fff' : '#171717', padding: '10px 16px', borderRadius: 9, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 600 }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 5h18M6 12h12M10 19h4" /></svg>{c.filters}{activeCount > 0 && <span style={{ minWidth: 18, height: 18, background: '#c0392b', color: '#fff', borderRadius: 18, fontSize: 10.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{activeCount}</span>}</button>
            <span>{c.sortBy}</span>
            <select defaultValue="featured" onChange={onSort} style={{ background: 'var(--surface)', border: '1px solid var(--line2)', color: 'var(--text)', padding: '10px 12px', borderRadius: 9, fontSize: 13.5, outline: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
              <option value="featured">{c.sortFeatured}</option>
              <option value="low">{c.sortLow}</option>
              <option value="high">{c.sortHigh}</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 30 }}>
          {chips.map((ch, i) => (
            <button key={i} onClick={ch.onClick} style={{ padding: '9px 18px', borderRadius: 30, border: '1px solid ' + ch.border, background: ch.bg, color: ch.color, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all .2s' }}>{ch.label}</button>
          ))}
        </div>

        {filtersOpen && (
          <div style={{ border: '1px solid var(--line)', borderRadius: 14, padding: '22px 24px', marginBottom: 22, background: 'var(--surface2)', animation: 'fadeUp .3s ease both' }}>
            <div className="dcol-3" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1fr', gap: 28 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text)', marginBottom: 12 }}>{c.sizeWord}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {fSizeOpts.map((s, i) => (
                    <button key={i} onClick={s.onClick} style={{ minWidth: 40, padding: '8px 10px', borderRadius: 8, border: '1px solid ' + s.border, background: s.bg, color: s.color, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 600, transition: 'all .15s' }}>{s.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text)', marginBottom: 12 }}>{c.colorWord}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
                  {fColorOpts.map((col, i) => (
                    <button key={i} onClick={col.onClick} title={col.name} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px 6px 7px', borderRadius: 30, border: '1px solid ' + col.border, background: col.bg, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 500, color: col.txt }}><span style={{ width: 15, height: 15, borderRadius: '50%', background: col.hex, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.14)' }} />{col.name}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text)', marginBottom: 12 }}>{c.priceUpTo} <b style={{ color: '#c0392b' }}>{fmt(priceMax)}</b></div>
                <input type="range" min="190" max="1300" step="10" value={priceMax} onChange={onPrice} style={{ width: '100%', accentColor: 'var(--text)', cursor: 'pointer' }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 18, cursor: 'pointer', fontSize: 13.5, color: 'var(--text)' }}><input type="checkbox" checked={availOnly} onChange={toggleAvail} style={{ width: 17, height: 17, accentColor: 'var(--text)', cursor: 'pointer' }} />{c.onlyAvailable}</label>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line2)' }}>
              <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 13, textDecoration: 'underline', fontFamily: "'DM Sans',sans-serif" }}>{c.clearFilters}</button>
              <button onClick={toggleFilters} style={{ background: '#171717', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: 30, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600 }}>{c.viewWord} {products.length} {c.resultsWord}</button>
            </div>
          </div>
        )}

        <div className="dcards-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 }}>
          {products.map((p) => (
            <div key={p.id} data-card onMouseMove={cardTilt} onMouseLeave={cardUntilt} style={{ animation: 'fadeUp .5s ease both', display: 'flex', flexDirection: 'column', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', transformStyle: 'preserve-3d', boxShadow: '0 12px 28px -18px rgba(0,0,0,.3),0 2px 6px -3px rgba(0,0,0,.12)', transition: 'box-shadow .35s,transform .18s ease-out,border-color .35s', willChange: 'transform' }}>
              <div onClick={p.open} style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', cursor: 'pointer', background: 'var(--surface3)' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'var(--cimg, url(' + p.imgUrl + '))', backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform .9s cubic-bezier(.2,.7,.2,1),background-image .3s', transform: 'scale(calc(1 + var(--qa,0) * 0.07))' }} />
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, background: 'radial-gradient(circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,.4),transparent 42%)', opacity: 'var(--gl,0)' as unknown as number, transition: 'opacity .3s', mixBlendMode: 'overlay' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 60%,rgba(0,0,0,.14))', opacity: 'var(--qa,0)' as unknown as number, transition: 'opacity .4s' }} />
                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                  {p.hasDisc && <span style={{ background: '#c0392b', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, boxShadow: '0 6px 16px -6px rgba(192,57,43,.6)' }}>{p.discBadge}</span>}
                  {p.tag && <span style={{ background: p.tagBg, color: p.tagColor, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, border: '1px solid ' + p.tagBorder }}>{p.tag}</span>}
                </div>
                <button onClick={p.wish} aria-label={c.ariaSave} style={{ position: 'absolute', top: 10, right: 10, width: 38, height: 38, borderRadius: '50%', background: p.wishBg, backdropFilter: 'blur(6px)', border: '1px solid ' + p.wishBorder, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px -4px rgba(0,0,0,.25)', transition: 'transform .2s,background .25s,border-color .25s' }}><svg width="18" height="18" viewBox="0 0 24 24" fill={p.heartFill} stroke={p.heartStroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ animation: p.heartAnim, transition: 'fill .25s,stroke .25s', display: 'block' }}><path d="M12 20.8l-1.7-1.55C5.1 14.55 2.5 12 2.5 8.75 2.5 6.16 4.52 4.2 7.05 4.2c1.5 0 2.94.7 3.88 1.82L12 7.2l1.07-1.18A5.16 5.16 0 0 1 16.95 4.2c2.53 0 4.55 1.96 4.55 4.55 0 3.25-2.6 5.8-7.8 10.5L12 20.8z" /></svg></button>
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, overflow: 'hidden', height: 'calc(var(--qa,0) * 58px)', opacity: 'var(--qa,0)' as unknown as number, transition: 'height .4s cubic-bezier(.2,.7,.2,1),opacity .3s', background: 'linear-gradient(180deg,transparent,rgba(255,255,255,.97) 34%)', padding: '22px 12px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--muted2)', flexShrink: 0, marginRight: 2 }}>{c.addWord}</span>
                    {p.qaSizes.map((qz, i) => (
                      <button key={i} onClick={qz.onClick} style={{ minWidth: 34, padding: '7px 4px', borderRadius: 8, border: '1px solid var(--line2)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, transition: 'all .15s' }}>{qz.label}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ padding: '16px 16px 17px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 11, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--muted2)' }}>{p.catLabel}</span><span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'var(--muted)' }}><span style={{ color: '#f5a623' }}>★</span>{p.rating} <span style={{ color: '#b3b0a9' }}>({p.reviews})</span></span></div>
                <h3 onClick={p.open} style={{ fontSize: 15.5, margin: 0, fontWeight: 600, lineHeight: 1.28, cursor: 'pointer', letterSpacing: '-.005em' }}>{p.name}</h3>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {p.swatches.map((s, i) => (
                    <span key={i} onMouseEnter={s.enter} onMouseLeave={s.leave} title={s.name} style={{ width: 15, height: 15, borderRadius: '50%', background: s.hex, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.14)', cursor: 'pointer', transition: 'transform .18s' }} />
                  ))}
                  <span style={{ fontSize: 11.5, color: 'var(--muted2)', marginLeft: 2 }}>{p.colorCount}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
                  <span style={{ fontSize: 19, fontWeight: 700, color: p.priceColor, letterSpacing: '-.01em' }}>{p.priceFmt}</span>
                  {p.hasWas && <span style={{ fontSize: 13.5, color: '#a5a29b', textDecoration: 'line-through' }}>{p.wasFmt}</span>}
                  {p.hasSave && <span style={{ fontSize: 11.5, fontWeight: 700, color: '#c0392b', background: '#fbecea', padding: '2px 7px', borderRadius: 6 }}>{p.saveFmt}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: p.stockColor }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: p.stockColor }} />{p.stockText}</div>
                <button onClick={p.add} style={{ marginTop: 'auto', width: '100%', background: p.btnBg, color: p.btnColor, border: '1px solid ' + p.btnBorder, padding: 13, borderRadius: 40, cursor: p.btnCursor, fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 600, transition: 'transform .12s,background .2s,border-color .2s' }}>{p.btnLabel}</button>
                <button onClick={p.compare} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: p.cmpColor, fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 2 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4v16M7 4l-3 3M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3" /></svg>{p.cmpLabel}</button>
              </div>
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '70px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🔍</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{c.noResults}</div>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 22px' }}>{c.noResultsBody}</p>
            <button onClick={clearFilters} style={{ background: '#171717', color: '#fff', border: 'none', padding: '13px 26px', borderRadius: 40, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 600 }}>{c.clearAll}</button>
          </div>
        )}
      </section>

      {/* RECENTLY VIEWED */}
      {recentItems.length > 0 && (
        <section style={{ maxWidth: 1300, margin: '0 auto', padding: '20px 28px 0' }}>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text)', marginBottom: 16 }}>{c.recentlyViewed}</div>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {recentItems.map((r, i) => (
              <div key={i} data-card onMouseMove={cardTilt} onMouseLeave={cardUntilt} onClick={r.open} style={{ flex: '0 0 160px', cursor: 'pointer', transformStyle: 'preserve-3d', transition: 'transform .18s ease-out', willChange: 'transform' }}>
                <div style={{ aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden', background: 'var(--surface3)', border: '1px solid var(--line)', marginBottom: 9 }}><div style={{ width: '100%', height: '100%', background: 'url(' + r.imgUrl + ') center/cover', transition: 'transform .6s' }} /></div>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{r.priceFmt}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TRUST */}
      <section style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', marginTop: 44, background: 'var(--surface2)' }}>
        <div className="dcards-4" style={{ maxWidth: 1300, margin: '0 auto', padding: '34px 28px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {trust.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>{t.icon}</div>
              <div><div style={{ fontSize: 14, fontWeight: 600 }}>{t.title}</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{t.body}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ maxWidth: 1300, margin: '0 auto', padding: '60px 28px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 34 }} data-reveal>
          <h2 style={{ fontSize: 'clamp(24px,2.8vw,34px)', margin: 0, fontWeight: 700 }}>{c.reviewsTitle}</h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 14, color: 'var(--muted)' }}><span style={{ color: '#f5a623', letterSpacing: 2 }}>★★★★★</span>{c.reviewsSub}</div>
        </div>
        <div className="dcards-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {reviews.map((r, i) => (
            <div key={i} data-reveal style={{ border: '1px solid var(--line)', borderRadius: 14, padding: 24, background: 'var(--surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}><span style={{ color: '#f5a623', letterSpacing: 2, fontSize: 14 }}>★★★★★</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#2f7d4f', background: '#eaf6ee', padding: '3px 9px', borderRadius: 20 }}>✓ {c.verified}</span></div>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--text2)', margin: '0 0 16px' }}>{r.text}</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>{r.photos.map((ph, pi) => (<div key={pi} style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', background: 'var(--surface3)', border: '1px solid var(--line)' }}><div style={{ width: '100%', height: '100%', background: 'url(' + ph + ') center/cover' }} /></div>))}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, paddingTop: 14, borderTop: '1px solid var(--line)' }}><div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: r.avBg }}><div style={{ width: '100%', height: '100%', background: 'url(' + r.avatar + ') center/cover' }} /></div><div><div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 12, color: 'var(--muted2)' }}>{r.meta}</div></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS COUNTERS */}
      <section data-stats style={{ maxWidth: 1300, margin: '0 auto', padding: '20px 28px 40px' }}>
        <div className="dcards-4" style={{ background: '#171717', color: '#fff', borderRadius: 20, padding: '46px 40px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {stats.map((st, i) => (
            <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ fontSize: 'clamp(30px,3.4vw,46px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{st.display}</div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.55)', marginTop: 9, letterSpacing: '.02em' }}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ maxWidth: 1300, margin: '0 auto', padding: '50px 28px' }}>
        <div style={{ background: '#171717', color: '#fff', borderRadius: 20, padding: '52px 40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px,2.8vw,34px)', margin: '0 0 12px', fontWeight: 700 }}>{c.nlTitle}</h2>
          <p style={{ color: 'rgba(255,255,255,.65)', margin: '0 0 26px', fontSize: 14.5 }}>{c.nlSub}</p>
          <div style={{ display: 'flex', gap: 10, maxWidth: 440, margin: '0 auto', flexWrap: 'wrap' }}>
            <input placeholder={c.nlEmailPh} style={{ flex: 1, minWidth: 200, background: '#26262a', border: '1px solid #3a3a3e', color: '#fff', padding: '15px 18px', borderRadius: 40, outline: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: 14 }} />
            <button style={{ background: 'var(--surface)', color: 'var(--text)', border: 'none', padding: '15px 26px', borderRadius: 40, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>{c.nlBtn}</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--line)', padding: '52px 28px 40px', background: 'var(--surface2)' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40 }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 21, letterSpacing: '.34em', paddingLeft: '.34em', marginBottom: 14 }}>VESPER</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--muted)', margin: '0 0 16px' }}>{c.footerTagline}</p>
            <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--muted2)', fontWeight: 600 }}>VISA · MASTERCARD · AMEX · APPLE PAY</div>
          </div>
          <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap', fontSize: 13.5 }}>
            <div><div style={{ fontWeight: 600, marginBottom: 14 }}>{c.footerShop}</div><div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--muted)' }}><a href="#shop" style={{ color: 'inherit', textDecoration: 'none' }}>{c.footerShopLinks[0]}</a><a href="#shop" style={{ color: 'inherit', textDecoration: 'none' }}>{c.footerShopLinks[1]}</a><a href="#shop" style={{ color: 'inherit', textDecoration: 'none' }}>{c.footerShopLinks[2]}</a></div></div>
            <div><div style={{ fontWeight: 600, marginBottom: 14 }}>{c.footerHelp}</div><div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--muted)' }}><span>{c.footerHelpLinks[0]}</span><span>{c.footerHelpLinks[1]}</span><span>{c.footerHelpLinks[2]}</span></div></div>
            <div><div style={{ fontWeight: 600, marginBottom: 14 }}>{c.footerCompany}</div><div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--muted)' }}><span>{c.footerCompanyLinks[0]}</span><span>{c.footerCompanyLinks[1]}</span><span>{c.footerCompanyLinks[2]}</span></div></div>
          </div>
        </div>
        <div style={{ maxWidth: 1300, margin: '36px auto 0', paddingTop: 22, borderTop: '1px solid var(--line)', fontSize: 12.5, color: 'var(--muted2)' }}>{c.footerRights}</div>
      </footer>

      {/* BACKDROP */}
      <div onClick={closeAll} style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(20,20,20,.4)', opacity: cartOpen ? 1 : 0, pointerEvents: maskPe, transition: 'opacity .35s' }} />

      {/* CART DRAWER */}
      <aside style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 80, width: 'min(420px,94vw)', background: 'var(--surface)', borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column', transform: cartOpen ? 'translateX(0)' : 'translateX(106%)', transition: 'transform .45s cubic-bezier(.22,.7,.2,1)', boxShadow: '-24px 0 60px -30px rgba(0,0,0,.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 24px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{c.yourCart} <span style={{ color: 'var(--muted2)', fontWeight: 500 }}>({count})</span></div>
          <button onClick={closeAll} style={{ background: 'var(--surface3)', border: 'none', width: 34, height: 34, borderRadius: '50%', color: 'var(--text)', fontSize: 16, cursor: 'pointer' }}>✕</button>
        </div>
        {count > 0 ? (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '6px 24px' }}>
              {cartItems.map((it) => (
                <div key={it.key} style={{ display: 'flex', gap: 14, padding: '18px 0', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ width: 74, height: 88, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--surface3)' }}><div style={{ width: '100%', height: '100%', background: 'url(' + it.imgUrl + ') center/cover' }} /></div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><h4 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, lineHeight: 1.3 }}>{it.name}</h4><span style={{ fontSize: 14.5, fontWeight: 700, whiteSpace: 'nowrap' }}>{it.lineFmt}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, fontSize: 12.5, color: 'var(--muted)' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: it.colorHex, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.12)' }} />{it.color}</span><span>·</span><span>{c.sizeLabel} {it.size}</span></div>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line2)', borderRadius: 30, overflow: 'hidden' }}>
                        <button onClick={it.dec} style={{ background: 'none', border: 'none', color: 'var(--text)', width: 30, height: 30, cursor: 'pointer', fontSize: 16 }}>−</button>
                        <span style={{ fontSize: 13, width: 26, textAlign: 'center', fontWeight: 600 }}>{it.qty}</span>
                        <button onClick={it.inc} style={{ background: 'none', border: 'none', color: 'var(--text)', width: 30, height: 30, cursor: 'pointer', fontSize: 16 }}>+</button>
                      </div>
                      <button onClick={it.remove} style={{ background: 'none', border: 'none', color: 'var(--muted2)', cursor: 'pointer', fontSize: 12.5, textDecoration: 'underline' }}>{c.remove}</button>
                    </div>
                  </div>
                </div>
              ))}
              {crossSell.length > 0 && (
                <div style={{ padding: '18px 0 6px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.02em', marginBottom: 12, color: 'var(--text)' }}>{c.completeLook}</div>
                  {crossSell.map((x, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0' }}>
                      <div style={{ width: 52, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--surface3)' }}><div style={{ width: '100%', height: '100%', background: 'url(' + x.imgUrl + ') center/cover' }} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.name}</div><div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{x.priceFmt}</div></div>
                      <button onClick={x.add} style={{ background: 'var(--surface)', border: '1px solid #171717', color: 'var(--text)', borderRadius: 30, padding: '8px 15px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', transition: 'all .2s' }}>{c.addBtn}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--line)', background: 'var(--surface2)' }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text)', marginBottom: 7 }}><span>{shipMsg}</span><span style={{ color: 'var(--muted2)' }}>{freeShipPctLabel}</span></div>
                <div style={{ height: 6, borderRadius: 6, background: 'var(--line2)', overflow: 'hidden' }}><div style={{ height: '100%', width: freeShipPct, background: shipBarColor, borderRadius: 6, transition: 'width .6s cubic-bezier(.2,.7,.2,1)' }} /></div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 9, display: 'flex', alignItems: 'center', gap: 7 }}>📦 {c.estDelivery} <b style={{ color: 'var(--text)', fontWeight: 600 }}>{deliveryEst}</b></div>
              </div>
              <div style={{ marginBottom: 14 }}>
                {coupon ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#eaf6ee', border: '1px solid #c9e6d4', borderRadius: 10, padding: '10px 14px' }}><span style={{ fontSize: 12.5, color: '#2f7d4f', fontWeight: 600 }}>{c.couponAppliedPre}{coupon}{c.couponAppliedSuf}</span><button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>{c.remove}</button></div>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: 8 }}><input value={couponInput} onChange={onCoupon} placeholder={c.couponPh} style={{ flex: 1, border: '1px solid var(--line2)', borderRadius: 10, padding: '11px 13px', fontFamily: "'DM Sans',sans-serif", fontSize: 13, outline: 'none', textTransform: 'uppercase' }} /><button onClick={applyCoupon} style={{ background: 'var(--surface3)', border: '1px solid var(--line2)', color: 'var(--text)', borderRadius: 10, padding: '0 16px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600 }}>{c.apply}</button></div>
                    <div style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 7 }}>{c.couponTry} <b>VESPER10</b> {c.or} <b>BIENVENIDA</b></div>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5, color: 'var(--muted)', marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{c.subtotal}</span><span style={{ color: 'var(--text)' }}>{fmt(subtotal)}</span></div>
                {coupon && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{c.discount} ({coupon})</span><span style={{ color: '#2f7d4f', fontWeight: 600 }}>−{fmt(discount)}</span></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{c.shipping}</span><span style={{ color: shipColor }}>{shippingFmt}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{c.taxIncl}</span><span style={{ color: 'var(--text)' }}>{fmt(tax)}</span></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 14, borderTop: '1px solid var(--line2)', marginBottom: 16 }}><span style={{ fontSize: 16, fontWeight: 700 }}>{c.total}</span><span style={{ fontSize: 20, fontWeight: 700 }}>{fmt(total)}</span></div>
              <button onClick={openCheckout} style={{ width: '100%', background: '#171717', color: '#fff', border: 'none', padding: 16, borderRadius: 40, cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'transform .12s,background .2s' }}>{c.checkout} · {fmt(total)}</button>
              <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11.5, color: 'var(--muted2)' }}>{c.securePay}</div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40, textAlign: 'center' }}>
            <div style={{ width: 66, height: 66, borderRadius: '50%', background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🛒</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{c.emptyCart}</div>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14 }}>{c.emptyCartBody}</p>
            <button onClick={closeAll} style={{ background: '#171717', color: '#fff', border: 'none', padding: '13px 26px', borderRadius: 40, cursor: 'pointer', fontSize: 13.5, fontWeight: 600 }}>{c.startShopping}</button>
          </div>
        )}
      </aside>
      {/* FAVORITES PAGE */}
      {favsOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 88, background: 'var(--surface)', overflowY: 'auto', animation: 'fadeUp .3s ease both' }}>
          <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'var(--glass)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line)', padding: '18px 34px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 20, letterSpacing: '.3em', paddingLeft: '.3em' }}>VESPER</span><span style={{ color: 'var(--line2)' }}>/</span><span style={{ fontSize: 15, fontWeight: 600 }}>{c.favs} <span style={{ color: 'var(--muted2)', fontWeight: 500 }}>({wish.length})</span></span></div>
            <button onClick={closeFavs} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface3)', border: 'none', padding: '10px 18px', borderRadius: 30, color: 'var(--text)', fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>{c.backToStore}</button>
          </div>
          <div style={{ maxWidth: 1300, margin: '0 auto', padding: '38px 34px 70px' }}>
            {wish.length > 0 ? (
              <>
                <div style={{ marginBottom: 26 }}><h1 style={{ fontSize: 'clamp(28px,3.4vw,42px)', margin: '0 0 6px', fontWeight: 700, letterSpacing: '-.01em' }}>{c.wishlistTitle}</h1><p style={{ color: 'var(--muted)', fontSize: 14.5, margin: 0 }}>{c.wishlistSub}</p></div>
                <div className="dcards-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 }}>
                  {favItems.map((f) => (
                    <div key={f.id} data-card onMouseMove={cardTilt} onMouseLeave={cardUntilt} style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', transformStyle: 'preserve-3d', boxShadow: '0 12px 28px -18px rgba(0,0,0,.3),0 2px 6px -3px rgba(0,0,0,.12)', transition: 'box-shadow .35s,transform .18s ease-out,border-color .35s', willChange: 'transform' }}>
                      <div onClick={f.open} style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', cursor: 'pointer', background: 'var(--surface3)' }}><div style={{ position: 'absolute', inset: 0, background: 'url(' + f.imgUrl + ') center/cover', transition: 'transform .8s' }} /><button onClick={f.remove} aria-label={c.ariaRemoveFav} style={{ position: 'absolute', top: 10, right: 10, width: 38, height: 38, borderRadius: '50%', background: 'var(--glass)', backdropFilter: 'blur(6px)', border: '1px solid var(--line)', cursor: 'pointer', color: '#e63329', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px -4px rgba(0,0,0,.25)', transition: 'transform .2s' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="#e63329" stroke="#e63329" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.8l-1.7-1.55C5.1 14.55 2.5 12 2.5 8.75 2.5 6.16 4.52 4.2 7.05 4.2c1.5 0 2.94.7 3.88 1.82L12 7.2l1.07-1.18A5.16 5.16 0 0 1 16.95 4.2c2.53 0 4.55 1.96 4.55 4.55 0 3.25-2.6 5.8-7.8 10.5L12 20.8z" /></svg></button></div>
                      <div style={{ padding: '15px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                        <span style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted2)' }}>{f.catLabel}</span>
                        <h3 onClick={f.open} style={{ fontSize: 15.5, margin: 0, fontWeight: 600, lineHeight: 1.28, cursor: 'pointer' }}>{f.name}</h3>
                        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{f.priceFmt}</div>
                        <button onClick={f.open} style={{ marginTop: 'auto', width: '100%', background: '#171717', color: '#fff', border: 'none', padding: 12, borderRadius: 40, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 600 }}>{c.addToCart}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '90px 40px', textAlign: 'center' }}>
                <div style={{ width: 82, height: 82, borderRadius: '50%', background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, color: '#c0392b' }}>♥</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{c.noFavs}</div>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: 15, maxWidth: 360 }}>{c.noFavsBody}</p>
                <button onClick={closeFavs} style={{ background: '#171717', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: 40, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>{c.exploreCollection}</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SETTINGS PAGE */}
      {settingsPage && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 88, background: 'var(--surface2)', overflowY: 'auto', animation: 'fadeUp .3s ease both' }}>
          <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'var(--glass)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line)', padding: '18px 34px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 20, letterSpacing: '.3em', paddingLeft: '.3em' }}>VESPER</span><span style={{ color: 'var(--line2)' }}>/</span><span style={{ fontSize: 15, fontWeight: 600 }}>{c.settings}</span></div>
            <button onClick={closeSettings} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface3)', border: 'none', padding: '10px 18px', borderRadius: 30, color: 'var(--text)', fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>{c.backToStore}</button>
          </div>
          <div className="dcol-2" style={{ maxWidth: 1000, margin: '0 auto', padding: '44px 28px 80px', display: 'grid', gridTemplateColumns: '230px 1fr', gap: 44, alignItems: 'start' }}>
            <aside style={{ position: 'sticky', top: 100, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '0 6px 20px' }}><div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a05f,#7a5f30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff' }}>{userInitials}</div><div><div style={{ fontSize: 15, fontWeight: 700 }}>{userName}</div><div style={{ fontSize: 12, color: 'var(--muted2)' }}>{c.vipMember}</div></div></div>
              <div onClick={settingsTabHandler('perfil')} style={tabStyle(settingsIsPerfil)}>{c.profile}</div>
              <div onClick={settingsTabHandler('direcciones')} style={tabStyle(settingsIsDir)}>{c.addresses}</div>
              <div onClick={settingsTabHandler('preferencias')} style={tabStyle(settingsIsPref)}>{c.preferences}</div>
              <button onClick={logout} style={{ marginTop: 14, textAlign: 'left', background: 'none', border: 'none', color: 'var(--muted)', padding: '11px 14px', borderRadius: 11, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600 }}>{c.logout}</button>
            </aside>
            <div>
              {settingsIsPerfil && (
                <div>
                  <h1 style={{ fontSize: 'clamp(24px,3vw,34px)', margin: '0 0 4px', fontWeight: 700, letterSpacing: '-.01em' }}>{c.profile}</h1>
                  <p style={{ color: 'var(--muted)', fontSize: 14.5, margin: '0 0 28px' }}>{c.profileSub}</p>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 30, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingBottom: 22, borderBottom: '1px solid var(--line)' }}>
                      <div style={{ width: 66, height: 66, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a05f,#7a5f30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff' }}>{userInitials}</div>
                      <div><div style={{ fontSize: 18, fontWeight: 700 }}>{userName}</div><div style={{ fontSize: 13, color: 'var(--muted2)' }}>{userEmail}</div></div>
                    </div>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>{c.fullName}</span><input defaultValue={userName || ''} style={{ background: 'var(--surface2)', border: '1px solid var(--line2)', borderRadius: 10, padding: '13px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--text)', outline: 'none' }} /></label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>{c.email}</span><input defaultValue={userEmail || ''} style={{ background: 'var(--surface2)', border: '1px solid var(--line2)', borderRadius: 10, padding: '13px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--text)', outline: 'none' }} /></label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}><span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>{c.phone}</span><input placeholder={c.phonePh} style={{ background: 'var(--surface2)', border: '1px solid var(--line2)', borderRadius: 10, padding: '13px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: 'var(--text)', outline: 'none' }} /></label>
                    <div style={{ display: 'flex', gap: 12, marginTop: 6 }}><button onClick={saveProfile} style={{ background: '#171717', color: '#fff', border: 'none', padding: '13px 26px', borderRadius: 40, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 600 }}>{c.saveChanges}</button></div>
                  </div>
                </div>
              )}
              {settingsIsDir && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
                    <div><h1 style={{ fontSize: 'clamp(24px,3vw,34px)', margin: '0 0 4px', fontWeight: 700, letterSpacing: '-.01em' }}>{c.addresses}</h1><p style={{ color: 'var(--muted)', fontSize: 14.5, margin: 0 }}>{c.addressesSub}</p></div>
                    <button onClick={addAddr} style={{ background: '#171717', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: 40, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{c.addAddress}</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
                    {addressList.map((a) => (
                      <div key={a.id} style={{ position: 'relative', background: 'var(--surface)', border: '1px solid ' + a.borderCol, borderRadius: 16, padding: 22 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}><span style={{ fontSize: 14, fontWeight: 700 }}>{a.label}</span>{a.def && <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', background: 'var(--surface3)', color: 'var(--text)', padding: '4px 9px', borderRadius: 20 }}>{c.principal}</span>}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 5 }}>{a.name}</div>
                        <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>{a.line}<br />{a.city}<br />{a.country}</div>
                        <div style={{ fontSize: 13, color: 'var(--muted2)', marginTop: 8 }}>{a.phone}</div>
                        <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
                          {a.notDef && <span onClick={a.mkDefault} style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', cursor: 'pointer' }}>{c.makeDefaultWord}</span>}
                          <span onClick={a.del} style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', cursor: 'pointer', marginLeft: 'auto' }}>{c.deleteWord}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {settingsIsPref && (
                <div>
                  <h1 style={{ fontSize: 'clamp(24px,3vw,34px)', margin: '0 0 4px', fontWeight: 700, letterSpacing: '-.01em' }}>{c.preferences}</h1>
                  <p style={{ color: 'var(--muted)', fontSize: 14.5, margin: '0 0 28px' }}>{c.preferencesSub}</p>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, maxWidth: 560, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--line)' }}><div><div style={{ fontSize: 14.5, fontWeight: 600 }}>{c.darkTheme}</div><div style={{ fontSize: 12.5, color: 'var(--muted2)' }}>{c.darkThemeSub}</div></div><button onClick={toggleTheme} style={{ background: 'var(--surface3)', border: '1px solid var(--line2)', color: 'var(--text)', padding: '9px 18px', borderRadius: 30, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600 }}>{themeLabel}</button></div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--line)' }}><div><div style={{ fontSize: 14.5, fontWeight: 600 }}>{c.emailNotif}</div><div style={{ fontSize: 12.5, color: 'var(--muted2)' }}>{c.emailNotifSub}</div></div><label style={{ position: 'relative', display: 'inline-block', width: 46, height: 26, cursor: 'pointer' }}><input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} /><span style={{ position: 'absolute', inset: 0, background: '#171717', borderRadius: 30, transition: '.2s' }} /><span style={{ position: 'absolute', top: 3, left: 23, width: 20, height: 20, background: '#fff', borderRadius: '50%', transition: '.2s' }} /></label></div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px' }}><div><div style={{ fontSize: 14.5, fontWeight: 600 }}>{c.restockAlerts}</div><div style={{ fontSize: 12.5, color: 'var(--muted2)' }}>{c.restockAlertsSub}</div></div><label style={{ position: 'relative', display: 'inline-block', width: 46, height: 26, cursor: 'pointer' }}><input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} /><span style={{ position: 'absolute', inset: 0, background: 'var(--line2)', borderRadius: 30, transition: '.2s' }} /><span style={{ position: 'absolute', top: 3, left: 3, width: 20, height: 20, background: '#fff', borderRadius: '50%', transition: '.2s' }} /></label></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRM */}
      {confirmLogout && (
        <div onClick={cancelLogout} style={{ position: 'fixed', inset: 0, zIndex: 120, background: 'rgba(10,10,12,.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'fadeUp .22s ease both' }}>
          <div onClick={stop} style={{ width: 'min(400px,94vw)', background: 'var(--surface)', borderRadius: 18, padding: '34px 32px 28px', textAlign: 'center', boxShadow: '0 30px 80px rgba(0,0,0,.35)', animation: 'fadeUp .28s ease both' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg></div>
            <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, letterSpacing: '-.01em' }}>{c.logoutQ}</h3>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.55 }}>{c.logoutBody}</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={cancelLogout} style={{ flex: 1, background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--line2)', padding: 13, borderRadius: 40, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600 }}>{c.cancel}</button>
              <button onClick={doLogout} style={{ flex: 1, background: '#c0392b', color: '#fff', border: 'none', padding: 13, borderRadius: 40, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600 }}>{c.logout}</button>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS PAGE */}
      {ordersPage && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 88, background: 'var(--surface2)', overflowY: 'auto', animation: 'fadeUp .3s ease both' }}>
          <div style={{ position: 'sticky', top: 0, zIndex: 2, background: 'var(--glass)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line)', padding: '18px 34px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 20, letterSpacing: '.3em', paddingLeft: '.3em' }}>VESPER</span><span style={{ color: 'var(--line2)' }}>/</span><span style={{ fontSize: 15, fontWeight: 600 }}>{c.ordersNav}</span></div>
            <button onClick={closeOrders} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface3)', border: 'none', padding: '10px 18px', borderRadius: 30, color: 'var(--text)', fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>{c.backToStore}</button>
          </div>
          <div style={{ maxWidth: 820, margin: '0 auto', padding: '38px 28px 70px' }}>
            <div style={{ marginBottom: 26 }}><h1 style={{ fontSize: 'clamp(28px,3.4vw,42px)', margin: '0 0 6px', fontWeight: 700, letterSpacing: '-.01em' }}>{c.ordersTitle}</h1><p style={{ color: 'var(--muted)', fontSize: 14.5, margin: 0 }}>{c.ordersSub}</p></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {ordersView.map((o) => (
                <div key={o.id} style={{ border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', background: 'var(--surface)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--line)' }}>
                    <div><div style={{ fontSize: 15, fontWeight: 700 }}>#{o.id}</div><div style={{ fontSize: 12.5, color: 'var(--muted2)' }}>{o.date}</div></div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: o.stColor, background: o.stBg, padding: '7px 14px', borderRadius: 20 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: o.stColor }} />{o.stLabel}</span>
                  </div>
                  <div style={{ padding: '20px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                      <div style={{ display: 'flex' }}>
                        {o.thumbs.map((t, i) => (
                          <div key={i} style={{ position: 'relative', width: 54, height: 64, borderRadius: 9, overflow: 'hidden', background: 'var(--surface3)', border: '2px solid #fff', marginLeft: -8 }}><div style={{ width: '100%', height: '100%', background: 'url(' + t.imgUrl + ') center/cover' }} />{t.multi && <span style={{ position: 'absolute', bottom: 1, right: 1, background: '#171717', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 4px', borderRadius: 8 }}>×{t.qty}</span>}</div>
                        ))}
                      </div>
                      <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35 }}>{o.summary}</div><div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 3 }}>{c.total} <b style={{ color: 'var(--text)' }}>{o.totalFmt}</b></div></div>
                    </div>
                    {o.showTrack && (
                      <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0 18px' }}>
                        {o.track.map((s, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: s.flex as unknown as number }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}><span style={{ width: 17, height: 17, borderRadius: '50%', background: s.dotBg, border: '2px solid ' + s.dotBorder, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9 }}>{s.mark}</span><span style={{ fontSize: 10, color: s.txt, whiteSpace: 'nowrap' }}>{s.label}</span></div>
                            {s.hasBar && <span style={{ flex: 1, height: 2, background: s.barColor, margin: '0 4px', marginBottom: 16 }} />}
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 10 }}>
                      {o.actions.map((a, i) => (
                        <button key={i} onClick={a.onClick} style={{ padding: '11px 20px', borderRadius: 30, border: '1px solid ' + a.border, background: a.bg, color: a.color, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 600, transition: 'all .2s' }}>{a.label}</button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* QUICK VIEW */}
      {qv && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={closeQV}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,20,.45)' }} />
          <div onClick={stop} className="dcol-2" style={{ position: 'relative', width: 'min(900px,96vw)', maxHeight: '90vh', overflow: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--surface)', borderRadius: 16, animation: 'fadeUp .35s ease both' }}>
            <div style={{ position: 'relative', minHeight: 440, background: 'url(' + qv.imgUrl + ') center/cover', backgroundColor: 'var(--surface3)' }}>
              <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 7 }}>
                {qv.hasDisc && <span style={{ background: '#c0392b', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>{qv.discBadge}</span>}
                {qv.tag && <span style={{ background: qv.tagBg, color: qv.tagColor, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, border: '1px solid ' + qv.tagBorder }}>{qv.tag}</span>}
              </div>
            </div>
            <div style={{ padding: '34px 34px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 11.5, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted2)' }}>{qv.catLabel}</span>
                <button onClick={closeQV} style={{ background: 'var(--surface3)', border: 'none', width: 32, height: 32, borderRadius: '50%', color: 'var(--text)', fontSize: 15, cursor: 'pointer' }}>✕</button>
              </div>
              <h3 style={{ fontSize: 26, margin: '8px 0 6px', fontWeight: 700, lineHeight: 1.1 }}>{qv.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontSize: 13, color: 'var(--muted)' }}><span style={{ color: '#f5a623' }}>★</span>{qv.rating} · {qv.soldText}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 18 }}><span style={{ fontSize: 24, fontWeight: 700, color: qv.priceColor }}>{qv.priceFmt}</span>{qv.hasWas && <span style={{ fontSize: 15, color: '#a5a29b', textDecoration: 'line-through' }}>{qv.wasFmt}</span>}</div>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--muted)', margin: '0 0 20px' }}>{qv.material}</p>
              <div style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', marginBottom: 22 }}>
                <div style={{ padding: '11px 16px', background: 'var(--surface3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--muted)' }}>{c.specs}</div>
                {qv.specs.map((sp: { label: string; value: string }, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, padding: '10px 16px', borderTop: '1px solid var(--line)', fontSize: 13 }}>
                    <span style={{ color: 'var(--muted)' }}>{sp.label}</span>
                    <span style={{ color: 'var(--text)', fontWeight: 500, textAlign: 'right' }}>{sp.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.02em', color: 'var(--text)', marginBottom: 10 }}>{c.colorDash} {qv.qvColorName}</div>
              <div style={{ display: 'flex', gap: 11, marginBottom: 22 }}>
                {qv.colors.map((col: { hex: string; ring: string; onClick: () => void }, i: number) => (
                  <button key={i} onClick={col.onClick} style={{ width: 32, height: 32, borderRadius: '50%', background: col.hex, cursor: 'pointer', border: '2px solid ' + col.ring, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)' }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{c.sizeWord}</span><span onClick={openSizeGuide} style={{ fontSize: 12, color: 'var(--text)', textDecoration: 'underline', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>📐 {c.sizeGuide}</span></div>
              <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 8 }}>
                {qv.sizes.map((z: { label: string; bg: string; color: string; border: string; cursor: string; deco: string; onClick: () => void }, i: number) => (
                  <button key={i} onClick={z.onClick} style={{ minWidth: 50, padding: '11px 6px', borderRadius: 9, border: '1px solid ' + z.border, background: z.bg, color: z.color, cursor: z.cursor, fontSize: 13, fontWeight: 500, textDecoration: z.deco, transition: 'all .15s' }}>{z.label}</button>
                ))}
              </div>
              {qv.sizeHint && <div style={{ fontSize: 12, color: qv.sizeHintColor, marginBottom: 18 }}>{qv.sizeHint}</div>}
              <div style={{ marginTop: 'auto', display: 'flex', gap: 11, alignItems: 'stretch', paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line2)', borderRadius: 40, overflow: 'hidden' }}>
                  <button onClick={qvDec} style={{ background: 'none', border: 'none', color: 'var(--text)', width: 40, height: '100%', cursor: 'pointer', fontSize: 17 }}>−</button>
                  <span style={{ fontSize: 14, width: 26, textAlign: 'center', fontWeight: 600 }}>{qvQty}</span>
                  <button onClick={qvInc} style={{ background: 'none', border: 'none', color: 'var(--text)', width: 40, height: '100%', cursor: 'pointer', fontSize: 17 }}>+</button>
                </div>
                <button onClick={addQV} style={{ flex: 1, background: addBg, color: addColor, border: 'none', borderRadius: 40, cursor: addCursor, fontSize: 14, fontWeight: 600, padding: 15, fontFamily: "'DM Sans',sans-serif" }}>{addLabel}</button>
              </div>
              <div style={{ marginTop: 22, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted2)', marginBottom: 12 }}>{c.alsoLike}</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {qv.related.map((rp: { name: string; priceFmt: string; imgUrl: string; open: () => void }, i: number) => (
                    <div key={i} onClick={rp.open} style={{ flex: 1, cursor: 'pointer' }}>
                      <div style={{ aspectRatio: '1/1', borderRadius: 10, overflow: 'hidden', background: 'var(--surface3)', marginBottom: 7 }}><div style={{ width: '100%', height: '100%', background: 'url(' + rp.imgUrl + ') center/cover', transition: 'transform .5s' }} /></div>
                      <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rp.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{rp.priceFmt}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT */}
      {checkout && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={closeCheckout} style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,20,.5)', backdropFilter: 'blur(3px)' }} />
          {checkout === 'form' && (
            <div className="dcol-2" style={{ position: 'relative', width: 'min(920px,96vw)', maxHeight: '90vh', overflow: 'auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', background: 'var(--surface)', borderRadius: 18, animation: 'fadeUp .35s ease both' }}>
              <div style={{ padding: '34px 34px 30px', borderRight: '1px solid var(--line)', background: 'var(--surface2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}><div style={{ fontSize: 16, fontWeight: 700 }}>{c.orderSummary}</div><span style={{ fontSize: 12, color: 'var(--muted2)' }}>{count} {c.itemsWord}</span></div>
                {coLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[1, 2, 3].map((k) => (
                      <div key={k} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                        <div style={{ width: 58, height: 68, borderRadius: 8, background: 'linear-gradient(90deg,var(--line) 25%,#f6f5f3 50%,var(--line) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite', flexShrink: 0 }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}><div style={{ height: 12, width: '70%', borderRadius: 6, background: 'linear-gradient(90deg,var(--line) 25%,#f6f5f3 50%,var(--line) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} /><div style={{ height: 11, width: '40%', borderRadius: 6, background: 'linear-gradient(90deg,var(--line) 25%,#f6f5f3 50%,var(--line) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} /></div>
                      </div>
                    ))}
                    <div style={{ height: 1, background: 'var(--line2)', margin: '6px 0' }} />
                    <div style={{ height: 14, width: '100%', borderRadius: 6, background: 'linear-gradient(90deg,var(--line) 25%,#f6f5f3 50%,var(--line) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
                    <div style={{ height: 22, width: '55%', borderRadius: 6, background: 'linear-gradient(90deg,var(--line) 25%,#f6f5f3 50%,var(--line) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {cartItems.map((it) => (
                      <div key={it.key} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                        <div style={{ position: 'relative', width: 58, height: 68, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--surface3)' }}><div style={{ width: '100%', height: '100%', background: 'url(' + it.imgUrl + ') center/cover' }} /><span style={{ position: 'absolute', top: -6, right: -6, minWidth: 20, height: 20, background: '#171717', color: '#fff', borderRadius: 20, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.qty}</span></div>
                        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>{it.name}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>{it.color} · {c.sizeLabel} {it.size}</div></div>
                        <span style={{ fontSize: 13.5, fontWeight: 600 }}>{it.lineFmt}</span>
                      </div>
                    ))}
                    <div style={{ height: 1, background: 'var(--line2)', margin: '4px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)' }}><span>{c.subtotal}</span><span style={{ color: 'var(--text)' }}>{fmt(subtotal)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)' }}><span>{c.shipping}</span><span style={{ color: shipColor }}>{shippingFmt}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)' }}><span>{c.taxInclShort}</span><span style={{ color: 'var(--text)' }}>{fmt(tax)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12, borderTop: '1px solid var(--line2)' }}><span style={{ fontSize: 15, fontWeight: 700 }}>{c.total}</span><span style={{ fontSize: 19, fontWeight: 700 }}>{fmt(total)}</span></div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>📦 {c.estDeliveryShort} <b style={{ color: 'var(--text)' }}>{deliveryEst}</b></div>
                  </div>
                )}
              </div>
              <div style={{ padding: '30px 32px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {coSteps.map((st, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 22, height: 22, borderRadius: '50%', background: st.bg, color: st.color, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{st.n}</span><span style={{ fontSize: 12.5, fontWeight: 600, color: st.txt }}>{st.label}</span></div>
                    ))}
                  </div>
                  <button onClick={closeCheckout} style={{ background: 'var(--surface3)', border: 'none', width: 32, height: 32, borderRadius: '50%', color: 'var(--text)', fontSize: 15, cursor: 'pointer' }}>✕</button>
                </div>
                {coStep === 'info' && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                      <div><label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{c.emailWord}</label><input defaultValue={c.coEmailDef} style={{ width: '100%', border: '1px solid var(--line2)', borderRadius: 10, padding: '12px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: 'none' }} /></div>
                      <div style={{ display: 'flex', gap: 12 }}><div style={{ flex: 1 }}><label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{c.nameWord}</label><input defaultValue={c.coNameDef} style={{ width: '100%', border: '1px solid var(--line2)', borderRadius: 10, padding: '12px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: 'none' }} /></div><div style={{ flex: 1 }}><label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{c.lastName}</label><input defaultValue={c.coLastDef} style={{ width: '100%', border: '1px solid var(--line2)', borderRadius: 10, padding: '12px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: 'none' }} /></div></div>
                      <div><label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{c.addressWord}</label><input defaultValue={c.coAddrDef} style={{ width: '100%', border: '1px solid var(--line2)', borderRadius: 10, padding: '12px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: 'none' }} /></div>
                      <div style={{ display: 'flex', gap: 12 }}><div style={{ flex: 1.4 }}><label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{c.cityWord}</label><input defaultValue={c.coCityDef} style={{ width: '100%', border: '1px solid var(--line2)', borderRadius: 10, padding: '12px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: 'none' }} /></div><div style={{ flex: 1 }}><label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{c.zip}</label><input defaultValue={c.coZipDef} style={{ width: '100%', border: '1px solid var(--line2)', borderRadius: 10, padding: '12px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: 'none' }} /></div></div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginTop: 4 }}>{c.shipMethod}</div>
                      {shipOpts.map((o, i) => (
                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid ' + o.border, borderRadius: 12, padding: '13px 15px', cursor: 'pointer', background: o.bg }}><span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid ' + o.dot, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: o.fill }} /></span><div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{o.label}</div><div style={{ fontSize: 12, color: 'var(--muted2)' }}>{o.eta}</div></div><span style={{ fontSize: 13.5, fontWeight: 700, color: o.priceColor }}>{o.price}</span></label>
                      ))}
                    </div>
                    <button onClick={goPay} style={{ marginTop: 20, width: '100%', background: '#171717', color: '#fff', border: 'none', padding: 16, borderRadius: 40, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600 }}>{c.continueToPay}</button>
                  </>
                )}
                {coStep === 'pay' && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>{c.payMethod}</div>
                      <div style={{ display: 'flex', gap: 9 }}>
                        {payMethods.map((m, i) => (
                          <button key={i} onClick={m.onClick} style={{ flex: 1, padding: '13px 6px', borderRadius: 12, border: '1.5px solid ' + m.border, background: m.bg, color: m.color, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 600, transition: 'all .2s' }}>{m.label}</button>
                        ))}
                      </div>
                      {payMethod === 'card' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                          <div><label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{c.cardNumber}</label><div style={{ position: 'relative' }}><input defaultValue="4242 4242 4242 4242" style={{ width: '100%', border: '1px solid var(--line2)', borderRadius: 10, padding: '12px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: 'none', letterSpacing: '.04em' }} /><div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 4 }}><span style={{ width: 26, height: 16, borderRadius: 3, background: '#1a1f71' }} /><span style={{ width: 26, height: 16, borderRadius: 3, background: '#eb001b', opacity: .85 }} /></div></div></div>
                          <div style={{ display: 'flex', gap: 12 }}><div style={{ flex: 1 }}><label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{c.expires}</label><input defaultValue="12/28" style={{ width: '100%', border: '1px solid var(--line2)', borderRadius: 10, padding: '12px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: 'none' }} /></div><div style={{ flex: 1 }}><label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{c.cvc}</label><input defaultValue="123" style={{ width: '100%', border: '1px solid var(--line2)', borderRadius: 10, padding: '12px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: 'none' }} /></div></div>
                        </div>
                      ) : (
                        <div style={{ background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 12, padding: 18, textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{walletMsg}</div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                      <button onClick={backInfo} style={{ background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--line2)', padding: '16px 20px', borderRadius: 40, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600 }}>←</button>
                      <button onClick={pay} style={{ flex: 1, background: '#171717', color: '#fff', border: 'none', padding: 16, borderRadius: 40, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>{payCta}</button>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: 'var(--muted2)' }}>{c.sslNote}</div>
                  </>
                )}
              </div>
            </div>
          )}
          {checkout === 'processing' && (
            <div style={{ position: 'relative', width: 'min(420px,94vw)', background: 'var(--surface)', borderRadius: 18, padding: '46px 40px', textAlign: 'center', animation: 'fadeUp .3s ease both' }}>
              <div style={{ width: 64, height: 64, margin: '0 auto 24px', position: 'relative' }}><svg width="64" height="64" viewBox="0 0 50 50" style={{ animation: 'spin 1s linear infinite' }}><circle cx="25" cy="25" r="21" fill="none" stroke="#eee" strokeWidth="4" /><circle cx="25" cy="25" r="21" fill="none" stroke="#171717" strokeWidth="4" strokeLinecap="round" strokeDasharray="90 200" /></svg></div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{c.processingPay}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)', minHeight: 20 }}>{payMsg}</div>
              <div style={{ height: 5, borderRadius: 5, background: '#eee', overflow: 'hidden', marginTop: 24 }}><div style={{ height: '100%', width: payPct, background: '#171717', borderRadius: 5, transition: 'width .5s cubic-bezier(.2,.7,.2,1)' }} /></div>
              <div style={{ marginTop: 18, fontSize: 11.5, color: 'var(--muted2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>{c.dontClose}</div>
            </div>
          )}
          {checkout === 'success' && (
            <div style={{ position: 'relative', width: 'min(440px,94vw)', background: 'var(--surface)', borderRadius: 18, padding: '46px 40px', textAlign: 'center', animation: 'fadeUp .3s ease both' }}>
              <div style={{ width: 78, height: 78, margin: '0 auto 22px', borderRadius: '50%', background: '#eaf6ee', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'checkPop .5s cubic-bezier(.2,.7,.2,1) both' }}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2f9e5f" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" style={{ strokeDasharray: 26, animation: 'ringDraw .6s ease .2s both' }} /></svg></div>
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{c.paymentConfirmed}</div>
              <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 20px', lineHeight: 1.6 }}>{c.orderOnWayPre}<b style={{ color: 'var(--text)' }}>#{orderNo}</b>{c.orderOnWaySuf}</p>
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}><div style={{ textAlign: 'left' }}><div style={{ fontSize: 11.5, color: 'var(--muted2)' }}>{c.estDeliveryShort}</div><div style={{ fontSize: 14, fontWeight: 600 }}>{deliveryEst}</div></div><div style={{ textAlign: 'right' }}><div style={{ fontSize: 11.5, color: 'var(--muted2)' }}>{c.totalPaid}</div><div style={{ fontSize: 14, fontWeight: 700 }}>{fmt(total)}</div></div></div>
              <button onClick={finishOrder} style={{ width: '100%', background: '#171717', color: '#fff', border: 'none', padding: 15, borderRadius: 40, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600 }}>{c.keepShopping}</button>
            </div>
          )}
        </div>
      )}

      {/* ACCOUNT */}
      {account && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 98, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={closeAccount}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,20,.5)', backdropFilter: 'blur(3px)' }} />
          {account === 'auth' && (
            <div onClick={stop} style={{ position: 'relative', width: 'min(420px,96vw)', background: 'var(--surface)', borderRadius: 18, padding: 32, animation: 'fadeUp .35s ease both' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}><div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 22, letterSpacing: '.28em', paddingLeft: '.28em' }}>VESPER</div><button onClick={closeAccount} style={{ background: 'var(--surface3)', border: 'none', width: 32, height: 32, borderRadius: '50%', color: 'var(--text)', fontSize: 15, cursor: 'pointer' }}>✕</button></div>
              <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>{authSubtitle}</div>
              <div style={{ display: 'flex', background: 'var(--surface3)', borderRadius: 30, padding: 4, marginBottom: 22 }}>
                <button onClick={tabLogin} style={{ flex: 1, padding: 10, border: 'none', borderRadius: 30, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, background: authTab === 'login' ? '#fff' : 'transparent', color: authTab === 'login' ? '#171717' : '#9a978f', transition: 'all .2s' }}>{c.login}</button>
                <button onClick={tabRegister} style={{ flex: 1, padding: 10, border: 'none', borderRadius: 30, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, background: authTab === 'register' ? '#fff' : 'transparent', color: authTab === 'register' ? '#171717' : '#9a978f', transition: 'all .2s' }}>{c.register}</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {authTab === 'register' && <input value={regName} onChange={onName} placeholder={c.fullName} style={{ width: '100%', border: '1px solid var(--line2)', borderRadius: 10, padding: '13px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: 'none' }} />}
                <input value={regEmail} onChange={onEmail} placeholder={c.email} style={{ width: '100%', border: '1px solid var(--line2)', borderRadius: 10, padding: '13px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: 'none' }} />
                <input type="password" defaultValue="••••••••" placeholder={c.passwordPh} style={{ width: '100%', border: '1px solid var(--line2)', borderRadius: 10, padding: '13px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: 'none' }} />
              </div>
              <button onClick={doAuth} style={{ marginTop: 18, width: '100%', background: '#171717', color: '#fff', border: 'none', padding: 15, borderRadius: 40, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600 }}>{authCta}</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0', color: '#c4c1ba', fontSize: 12 }}><span style={{ flex: 1, height: 1, background: 'var(--line)' }} />{c.continueWith}<span style={{ flex: 1, height: 1, background: 'var(--line)' }} /></div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={doAuth} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--line2)', borderRadius: 40, padding: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}> Apple</button>
                <button onClick={doAuth} style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--line2)', borderRadius: 40, padding: 12, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>G Google</button>
              </div>
              <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11.5, color: 'var(--muted2)' }}>{c.termsNote}</div>
            </div>
          )}
          {account === 'profile' && (
            <div onClick={stop} style={{ position: 'relative', width: 'min(440px,96vw)', background: 'var(--surface)', borderRadius: 18, overflow: 'hidden', animation: 'fadeUp .35s ease both' }}>
              <div style={{ background: '#171717', color: '#fff', padding: '30px 30px 26px', position: 'relative' }}>
                <button onClick={closeAccount} style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(255,255,255,.14)', border: 'none', width: 32, height: 32, borderRadius: '50%', color: '#fff', fontSize: 15, cursor: 'pointer' }}>✕</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#c9a05f,#7a5f30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{userInitials}</div>
                  <div><div style={{ fontSize: 19, fontWeight: 700 }}>{userName}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>{userEmail}</div></div>
                </div>
              </div>
              <div style={{ padding: '22px 30px 26px' }}>
                <div className="dcards-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 22 }}>
                  <div style={{ background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 12, padding: 14, textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 700 }}>12</div><div style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 2 }}>{c.ordersStat}</div></div>
                  <div style={{ background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 12, padding: 14, textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 700 }}>{wish.length}</div><div style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 2 }}>{c.favs}</div></div>
                  <div style={{ background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 12, padding: 14, textAlign: 'center' }}><div style={{ fontSize: 20, fontWeight: 700 }}>VIP</div><div style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 2 }}>{c.levelWord}</div></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {profileLinks.map((l, i) => (
                    <div key={i} onClick={l.onClick} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 4px', borderTop: '1px solid var(--line)', cursor: 'pointer', fontSize: 14 }}><span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{l.icon}</span>{l.label}<span style={{ marginLeft: 'auto', color: '#c4c1ba' }}>›</span></div>
                  ))}
                </div>
                <button onClick={logout} style={{ marginTop: 20, width: '100%', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--line2)', padding: 13, borderRadius: 40, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 600 }}>{c.logout}</button>
              </div>
            </div>
          )}
          {account === 'orders' && (
            <div onClick={stop} style={{ position: 'relative', width: 'min(520px,96vw)', maxHeight: '88vh', overflow: 'auto', background: 'var(--surface)', borderRadius: 18, animation: 'fadeUp .35s ease both' }}>
              <div style={{ position: 'sticky', top: 0, background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 12, padding: '22px 26px', borderBottom: '1px solid var(--line)', zIndex: 2 }}>
                <button onClick={backProfile} style={{ background: 'var(--surface3)', border: 'none', width: 32, height: 32, borderRadius: '50%', color: 'var(--text)', fontSize: 15, cursor: 'pointer' }}>←</button>
                <div style={{ fontSize: 18, fontWeight: 700, flex: 1 }}>{c.ordersNav}</div>
                <button onClick={closeAccount} style={{ background: 'var(--surface3)', border: 'none', width: 32, height: 32, borderRadius: '50%', color: 'var(--text)', fontSize: 15, cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ padding: '16px 26px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {ordersView.map((o) => (
                  <div key={o.id} style={{ border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 18px', background: 'var(--surface2)', borderBottom: '1px solid var(--line)' }}>
                      <div><div style={{ fontSize: 14, fontWeight: 700 }}>#{o.id}</div><div style={{ fontSize: 12, color: 'var(--muted2)' }}>{o.date}</div></div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, color: o.stColor, background: o.stBg, padding: '6px 12px', borderRadius: 20 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: o.stColor }} />{o.stLabel}</span>
                    </div>
                    <div style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <div style={{ display: 'flex' }}>
                          {o.thumbs.map((t, i) => (
                            <div key={i} style={{ position: 'relative', width: 46, height: 54, borderRadius: 8, overflow: 'hidden', background: 'var(--surface3)', border: '2px solid #fff', marginLeft: -8 }}><div style={{ width: '100%', height: '100%', background: 'url(' + t.imgUrl + ') center/cover' }} />{t.multi && <span style={{ position: 'absolute', bottom: 1, right: 1, background: '#171717', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 4px', borderRadius: 8 }}>×{t.qty}</span>}</div>
                          ))}
                        </div>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35 }}>{o.summary}</div><div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{c.total} <b style={{ color: 'var(--text)' }}>{o.totalFmt}</b></div></div>
                      </div>
                      {o.showTrack && (
                        <div style={{ display: 'flex', alignItems: 'center', margin: '6px 0 16px' }}>
                          {o.track.map((s, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: s.flex as unknown as number }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}><span style={{ width: 15, height: 15, borderRadius: '50%', background: s.dotBg, border: '2px solid ' + s.dotBorder, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9 }}>{s.mark}</span><span style={{ fontSize: 9.5, color: s.txt, whiteSpace: 'nowrap' }}>{s.label}</span></div>
                              {s.hasBar && <span style={{ flex: 1, height: 2, background: s.barColor, margin: '0 3px', marginBottom: 16 }} />}
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 9 }}>
                        {o.actions.map((a, i) => (
                          <button key={i} onClick={a.onClick} style={{ flex: 1, padding: 11, borderRadius: 30, border: '1px solid ' + a.border, background: a.bg, color: a.color, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 600, transition: 'all .2s' }}>{a.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SIZE GUIDE */}
      {!!sgActive && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 97, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={closeSizeGuide}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,20,.5)', backdropFilter: 'blur(3px)' }} />
          <div onClick={stop} style={{ position: 'relative', width: 'min(560px,96vw)', maxHeight: '88vh', overflow: 'auto', background: 'var(--surface)', borderRadius: 16, padding: 32, animation: 'fadeUp .35s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}><div style={{ fontSize: 20, fontWeight: 700 }}>{c.sizeGuide}</div><button onClick={closeSizeGuide} style={{ background: 'var(--surface3)', border: 'none', width: 32, height: 32, borderRadius: '50%', color: 'var(--text)', fontSize: 15, cursor: 'pointer' }}>✕</button></div>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '0 0 20px', lineHeight: 1.6 }}>{c.sizeGuideIntro}</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              {sgTabs.map((t, i) => (
                <button key={i} onClick={t.onClick} style={{ padding: '9px 16px', borderRadius: 30, border: '1px solid ' + t.border, background: t.bg, color: t.color, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}>{t.label}</button>
              ))}
            </div>
            <div style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: sgCols, background: '#171717', color: '#fff', fontSize: 12, fontWeight: 600 }}>
                {sgHead.map((h, i) => (<div key={i} style={{ padding: '11px 14px' }}>{h}</div>))}
              </div>
              {sgRows.map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: sgCols, fontSize: 13, borderTop: '1px solid var(--line)', background: r.bg }}>
                  {r.cells.map((cell, ci) => (<div key={ci} style={{ padding: '11px 14px', color: cell.color, fontWeight: cell.weight as unknown as number }}>{cell.v}</div>))}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, fontSize: 12, color: 'var(--muted2)', display: 'flex', alignItems: 'center', gap: 7 }}>{c.sgFootnote}</div>
          </div>
        </div>
      )}

      {/* COMPARE BAR */}
      {compare.length > 0 && (
        <div style={{ position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 86, display: 'flex', alignItems: 'center', gap: 16, background: '#171717', color: '#fff', padding: '12px 14px 12px 20px', borderRadius: 50, boxShadow: '0 20px 50px -18px rgba(0,0,0,.6)', animation: 'slideToast .35s ease' }}>
          <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{c.compareWord} ({compare.length})</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {compareThumbs.map((ct, i) => (
              <div key={i} style={{ position: 'relative', width: 38, height: 44, borderRadius: 7, overflow: 'hidden', background: '#2a2a2a' }}><div style={{ width: '100%', height: '100%', background: 'url(' + ct.imgUrl + ') center/cover' }} /><button onClick={ct.remove} style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#c0392b', color: '#fff', border: '1.5px solid #171717', fontSize: 10, cursor: 'pointer', lineHeight: 1, padding: 0 }}>✕</button></div>
            ))}
          </div>
          <button onClick={openCompare} style={{ background: '#fff', color: '#171717', border: 'none', padding: '11px 22px', borderRadius: 40, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{c.compareNow}</button>
          <button onClick={clearCompare} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>{c.clearWord}</button>
        </div>
      )}

      {/* COMPARE MODAL */}
      {compareOpenComputed && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 93, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={closeCompare}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,20,.55)', backdropFilter: 'blur(4px)' }} />
          <div onClick={stop} style={{ position: 'relative', width: 'min(880px,96vw)', maxHeight: '90vh', overflow: 'auto', background: 'var(--surface)', borderRadius: 18, animation: 'fadeUp .35s ease both' }}>
            <div style={{ position: 'sticky', top: 0, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 26px', borderBottom: '1px solid var(--line)', zIndex: 2 }}><div style={{ fontSize: 19, fontWeight: 700 }}>{c.compareProducts}</div><button onClick={closeCompare} style={{ background: 'var(--surface3)', border: 'none', width: 32, height: 32, borderRadius: '50%', color: 'var(--text)', fontSize: 15, cursor: 'pointer' }}>✕</button></div>
            <div className="dtable-wrap" style={{ padding: '22px 26px 30px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '130px repeat(' + compare.length + ',1fr)', gap: 0, fontSize: 13.5 }}>
                <div />
                {compareCols.map((cc, i) => (
                  <div key={i} style={{ padding: '0 12px 14px', textAlign: 'center' }}><div style={{ aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden', background: 'var(--surface3)', marginBottom: 10 }}><div style={{ width: '100%', height: '100%', background: 'url(' + cc.imgUrl + ') center/cover' }} /></div><div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.25 }}>{cc.name}</div></div>
                ))}
                {compareRows.map((row, ri) => (
                  <div key={'r' + ri} style={{ display: 'contents' }}>
                    <div style={{ padding: '14px 8px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--muted2)', borderTop: '1px solid var(--line)' }}>{row.label}</div>
                    {row.cells.map((cell, ci) => (
                      <div key={ci} style={{ padding: '14px 12px', textAlign: 'center', borderTop: '1px solid var(--line)', color: cell.color, fontWeight: cell.weight as unknown as number }}>{cell.v}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 26, left: '50%', zIndex: 95, transform: 'translateX(-50%)', background: '#171717', color: '#fff', padding: '14px 22px', borderRadius: 40, fontSize: 13.5, fontWeight: 500, boxShadow: '0 18px 44px -20px rgba(0,0,0,.5)', animation: 'slideToast .35s ease', display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: '#7ed99f' }}>✓</span>{toast}</div>
      )}
    </div>
  )
}
