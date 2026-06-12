# Hotel Premier — Sistema de Gestión Hotelera

## Stack tecnológico
- Backend: Java 17, Spring Boot, Maven
- Base de datos: PostgreSQL (corre en Docker, puerto 5432)
- Frontend: Next.js, React, Tailwind CSS
- Containerización: Docker Compose

## Estructura del proyecto
- /backend  → API REST Spring Boot (paquete base: tp_hotel.tp_hotel)
- /frontend → App Next.js

## Arquitectura del backend
- Capas: Controller → Gestor (Service) → Repository (JPA) → Entity
- DTOs para transporte entre capas
- Patrón Strategy implementado en pagos (EstrategiaPago + StrategyFactory)
- Enumeraciones: CategoriaHabitacion, EstadoHabitacion, EstadoReserva,
  TipoFactura, EstadoFactura, TipoDocumento, IVA, Rol

## Entidades principales
Habitacion, Reserva, Estadia, Huesped, Factura, DetalleFactura,
TipoPago (y subclases), NotaCredito, Consumo, ResponsablePago,
PersonaFisica, PersonaJuridica, Usuario, Direccion

## Gestores existentes
GestorReserva, GestorEstadia, GestorFacturacion, GestorPago,
GestorHabitacion, GestorHuespedes, GestorUsuario, GestorResponsablePago

## Reglas de negocio importantes
- Una estadía puede tener 1 titular + N acompañantes
- La factura se genera al hacer checkout
- Los pagos deben saldar el total completo (sin cuenta corriente)
- Las facturas no se anulan directamente — solo con Nota de Crédito
- El responsable de pago puede ser PersonaFisica o PersonaJuridica

## Estado actual
El sistema está incompleto. Faltan implementar y conectar 
varios casos de uso entre el backend y el frontend.

## Convenciones de código
- Nombres en español (entidades, métodos, variables)
- Respuestas de API en JSON via ResponseEntity<>
- Validaciones en DTOs, lógica de negocio en Gestores