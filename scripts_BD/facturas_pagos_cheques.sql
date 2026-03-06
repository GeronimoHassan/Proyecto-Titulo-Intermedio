-- ============================================================
-- Facturas, Pagos (con cheques, tarjetas, moneda) y Notas de Credito
-- Ejecutar DESPUES de: estadias.sql, consumos.sql, responsables_pago.sql
-- ============================================================

-- ============================================================
-- FACTURAS de la estadia historica (Estadia 6, ya finalizada)
-- ============================================================

-- Factura 1: Estadia 6 (Figueroa, Hab 25) - Alojamiento - PAGADA
INSERT INTO factura (numero, fecha, tipo, estado, total, responsable_id, estadia_id) VALUES
('B-00000001', '2026-02-25', 'B', 'PAGADA', 351150.00, 9, 6);

-- Detalles de Factura 1
INSERT INTO detalle_factura (descripcion, cantidad, precio_unitario, subtotal, factura_id) VALUES
('Alojamiento - Habitación 25', 5, 70230.00, 351150.00, 1);

-- Factura 2: Estadia 6 (Figueroa, Hab 25) - Consumos - PAGADA
INSERT INTO factura (numero, fecha, tipo, estado, total, responsable_id, estadia_id) VALUES
('B-00000002', '2026-02-25', 'B', 'PAGADA', 90500.00, 9, 6);

-- Detalles de Factura 2
INSERT INTO detalle_factura (descripcion, cantidad, precio_unitario, subtotal, factura_id) VALUES
('Desayuno Continental', 2, 5000.00, 10000.00, 2),
('Almuerzo Buffet', 1, 22000.00, 22000.00, 2),
('Cena Show', 1, 30000.00, 30000.00, 2),
('Bebidas Bar', 1, 8000.00, 8000.00, 2),
('Lavandería Express', 1, 6000.00, 6000.00, 2),
('Almuerzo Piscina', 1, 15000.00, 15000.00, 2),
('Minibar Consumo', 1, 4500.00, 4500.00, 2);

-- Factura 3: Factura A a nombre de empresa (TechSolutions) - PENDIENTE (para probar pago)
INSERT INTO factura (numero, fecha, tipo, estado, total, responsable_id, estadia_id) VALUES
('A-00000001', '2026-03-05', 'A', 'PENDIENTE', 47000.00, 1, 2);

-- Detalles de Factura 3 (Smith - Negocios, algunos consumos)
INSERT INTO detalle_factura (descripcion, cantidad, precio_unitario, subtotal, factura_id) VALUES
('Café Nespresso', 2, 2000.00, 4000.00, 3),
('Almuerzo Ejecutivo', 1, 12000.00, 12000.00, 3),
('Whisky Importado', 1, 18000.00, 18000.00, 3),
('Servicio de Planchado', 1, 3000.00, 3000.00, 3),
('Taxi al Aeropuerto', 1, 12000.00, 12000.00, 3);

-- Factura 4: Factura B consumidor final - PENDIENTE (para probar pago)
INSERT INTO factura (numero, fecha, tipo, estado, total, responsable_id, estadia_id) VALUES
('B-00000003', '2026-03-05', 'B', 'PENDIENTE', 30500.00, 6, 4);

-- Detalles de Factura 4 (Rodriguez - consumos)
INSERT INTO detalle_factura (descripcion, cantidad, precio_unitario, subtotal, factura_id) VALUES
('Cerveza Artesanal', 2, 3500.00, 7000.00, 4),
('Hamburguesa Completa', 2, 9500.00, 19000.00, 4),
('Papas Fritas', 1, 4000.00, 4000.00, 4);

-- Factura 5: Factura A a empresa - PENDIENTE (para probar nota de credito)
INSERT INTO factura (numero, fecha, tipo, estado, total, responsable_id, estadia_id) VALUES
('A-00000002', '2026-03-05', 'A', 'PENDIENTE', 350000.00, 1, 5);

-- Detalles de Factura 5 (Fernandez VIP - consumos caros)
INSERT INTO detalle_factura (descripcion, cantidad, precio_unitario, subtotal, factura_id) VALUES
('Champagne Frances', 1, 80000.00, 80000.00, 5),
('Caviar', 1, 120000.00, 120000.00, 5),
('Masaje Piedras Calientes', 1, 30000.00, 30000.00, 5),
('Chofer Privado (Día)', 1, 50000.00, 50000.00, 5),
('Cena Degustación', 1, 60000.00, 60000.00, 5),
('Flores en Habitación', 1, 10000.00, 10000.00, 5);

-- ============================================================
-- PAGOS (de las facturas ya pagadas)
-- ============================================================

-- Pago de Factura 1 (Figueroa alojamiento) - pagado con tarjeta debito
INSERT INTO pago (fecha, monto_total, factura_id) VALUES
('2026-02-25', 351150.00, 1);

INSERT INTO tipo_pago (importe, metodo_pago, pago_id) VALUES
(351150.00, 'TARJETA_DEBITO', 1);

INSERT INTO pago_tarjeta_debito (id, numero_tarjeta, nombre_titular, fecha_vencimiento, codigo_seguridad) VALUES
(1, '4517000011112222', 'MONICA FIGUEROA', '2028-06-01', '456');

-- Pago de Factura 2 (Figueroa consumos) - pagado mixto: efectivo + cheque
INSERT INTO pago (fecha, monto_total, factura_id) VALUES
('2026-02-25', 90500.00, 2);

INSERT INTO tipo_pago (importe, metodo_pago, pago_id) VALUES
(50000.00, 'MONEDA', 2),
(40500.00, 'CHEQUE', 2);

INSERT INTO pago_moneda (id, moneda, cotizacion) VALUES
(2, 'ARS', 1.0);

INSERT INTO pago_cheque (id, numero, banco, plaza, fecha_cobro) VALUES
(3, 'CH-001234', 'Banco Nacion', 'Santa Fe', '2026-03-10');

-- ============================================================
-- CHEQUES EN CARTERA (pagos con cheques a fecha futura)
-- Estos se generan como pagos adicionales de facturas ficticias
-- para tener datos en el listado de cheques
-- ============================================================

-- Factura 6: otra factura pagada con cheque (para tener mas cheques en cartera)
INSERT INTO factura (numero, fecha, tipo, estado, total, responsable_id, estadia_id) VALUES
('B-00000004', '2026-03-01', 'B', 'PAGADA', 120000.00, 6, 1);

INSERT INTO detalle_factura (descripcion, cantidad, precio_unitario, subtotal, factura_id) VALUES
('Almuerzo Familiar', 1, 35000.00, 35000.00, 6),
('Bebidas Minibar', 4, 2500.00, 10000.00, 6),
('Cena Buffet', 1, 40000.00, 40000.00, 6),
('Desayuno Extra', 2, 5000.00, 10000.00, 6),
('Servicio Lavandería', 1, 4500.00, 4500.00, 6),
('Merienda Buffet', 1, 15000.00, 15000.00, 6);

INSERT INTO pago (fecha, monto_total, factura_id) VALUES
('2026-03-01', 120000.00, 6);

INSERT INTO tipo_pago (importe, metodo_pago, pago_id) VALUES
(120000.00, 'CHEQUE', 3);

INSERT INTO pago_cheque (id, numero, banco, plaza, fecha_cobro) VALUES
(4, 'CH-005678', 'Banco Santander', 'Rosario', '2026-03-15');

-- Factura 7: pagada con cheque de tercero
INSERT INTO factura (numero, fecha, tipo, estado, total, responsable_id, estadia_id) VALUES
('A-00000003', '2026-03-02', 'A', 'PAGADA', 85000.00, 2, 7);

INSERT INTO detalle_factura (descripcion, cantidad, precio_unitario, subtotal, factura_id) VALUES
('Menú Infantil', 2, 8000.00, 16000.00, 7),
('Helados Variados', 3, 4000.00, 12000.00, 7),
('Alquiler Películas', 1, 2000.00, 2000.00, 7),
('Pizza Familiar', 1, 18000.00, 18000.00, 7),
('Gaseosas 1.5L', 2, 3000.00, 6000.00, 7);

INSERT INTO pago (fecha, monto_total, factura_id) VALUES
('2026-03-02', 85000.00, 7);

INSERT INTO tipo_pago (importe, metodo_pago, pago_id) VALUES
(85000.00, 'CHEQUE', 4);

INSERT INTO pago_cheque (id, numero, banco, plaza, fecha_cobro) VALUES
(5, 'CH-009012', 'Banco Galicia', 'CABA', '2026-03-20');

-- Factura 8: pagada con cheque a fecha cercana
INSERT INTO factura (numero, fecha, tipo, estado, total, responsable_id, estadia_id) VALUES
('B-00000005', '2026-03-03', 'B', 'PAGADA', 56000.00, 8, 8);

INSERT INTO detalle_factura (descripcion, cantidad, precio_unitario, subtotal, factura_id) VALUES
('Impresiones Color', 10, 1500.00, 15000.00, 8),
('Sala de Reuniones (Hora)', 2, 10000.00, 20000.00, 8),
('Coffee Break', 1, 8000.00, 8000.00, 8),
('Sandwich Club', 1, 8500.00, 8500.00, 8),
('Agua Mineral', 3, 1500.00, 4500.00, 8);

INSERT INTO pago (fecha, monto_total, factura_id) VALUES
('2026-03-03', 56000.00, 8);

INSERT INTO tipo_pago (importe, metodo_pago, pago_id) VALUES
(56000.00, 'CHEQUE', 5);

INSERT INTO pago_cheque (id, numero, banco, plaza, fecha_cobro) VALUES
(6, 'CH-003456', 'Banco HSBC', 'Cordoba', '2026-03-08');

-- Factura 9: pagada con 2 cheques (split)
INSERT INTO factura (numero, fecha, tipo, estado, total, responsable_id, estadia_id) VALUES
('B-00000006', '2026-03-04', 'B', 'PAGADA', 66000.00, 6, 10);

INSERT INTO detalle_factura (descripcion, cantidad, precio_unitario, subtotal, factura_id) VALUES
('Tragos de Autor', 2, 5000.00, 10000.00, 9),
('Tabla de Quesos', 1, 16000.00, 16000.00, 9),
('Acceso Spa', 2, 15000.00, 30000.00, 9),
('Almuerzo Terraza', 1, 20000.00, 20000.00, 9);

INSERT INTO pago (fecha, monto_total, factura_id) VALUES
('2026-03-04', 66000.00, 9);

INSERT INTO tipo_pago (importe, metodo_pago, pago_id) VALUES
(36000.00, 'CHEQUE', 6),
(30000.00, 'CHEQUE', 6);

INSERT INTO pago_cheque (id, numero, banco, plaza, fecha_cobro) VALUES
(7, 'CH-007890', 'Banco Provincia', 'La Plata', '2026-03-12'),
(8, 'CH-007891', 'Banco Macro', 'Mendoza', '2026-03-25');

-- ============================================================
-- Pago mixto: tarjeta credito + efectivo en dolares
-- ============================================================

INSERT INTO factura (numero, fecha, tipo, estado, total, responsable_id, estadia_id) VALUES
('B-00000007', '2026-03-04', 'B', 'PAGADA', 116000.00, 6, 3);

INSERT INTO detalle_factura (descripcion, cantidad, precio_unitario, subtotal, factura_id) VALUES
('Botella de Vino Malbec', 1, 15000.00, 15000.00, 10),
('Cena Romántica', 1, 45000.00, 45000.00, 10),
('Spa Masaje Doble', 1, 50000.00, 50000.00, 10),
('Desayuno a la Habitación', 1, 6000.00, 6000.00, 10);

INSERT INTO pago (fecha, monto_total, factura_id) VALUES
('2026-03-04', 116000.00, 10);

INSERT INTO tipo_pago (importe, metodo_pago, pago_id) VALUES
(80000.00, 'TARJETA_CREDITO', 7),
(36000.00, 'MONEDA', 7);

INSERT INTO pago_tarjeta_credito (id, numero_tarjeta, nombre_titular, fecha_vencimiento, codigo_seguridad) VALUES
(9, '5412000033334444', 'JOAO SILVA', '2027-12-01', '789');

INSERT INTO pago_moneda (id, moneda, cotizacion) VALUES
(10, 'USD', 1200.00);
