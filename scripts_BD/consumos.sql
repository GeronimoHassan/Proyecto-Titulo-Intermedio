INSERT INTO consumo (descripcion, monto, cantidad, fecha, estadia_id, facturado) VALUES
-- Estadia 1 (Familia Garcia, Hab 3, 05-15 Mar)
('Almuerzo Familiar', 35000.00, 1, '2026-03-05', 1, 0),
('Bebidas Minibar', 2500.00, 4, '2026-03-05', 1, 0),
('Cena Buffet', 40000.00, 1, '2026-03-05', 1, 0),
('Desayuno Extra', 5000.00, 2, '2026-03-06', 1, 0),
('Servicio Lavandería', 4500.00, 1, '2026-03-07', 1, 0),
('Merienda Buffet', 15000.00, 1, '2026-03-06', 1, 0),

-- Estadia 2 (Smith Negocios, Hab 41, 05-09 Mar)
('Café Nespresso', 2000.00, 2, '2026-03-05', 2, 0),
('Almuerzo Ejecutivo', 12000.00, 1, '2026-03-05', 2, 0),
('Whisky Importado', 18000.00, 1, '2026-03-05', 2, 0),
('Servicio de Planchado', 3000.00, 1, '2026-03-06', 2, 0),
('Taxi al Aeropuerto', 12000.00, 1, '2026-03-07', 2, 0),

-- Estadia 3 (Silva Pareja Extranjera, Hab 14, 05-14 Mar)
('Botella de Vino Malbec', 15000.00, 1, '2026-03-05', 3, 0),
('Cena Romántica', 45000.00, 1, '2026-03-05', 3, 0),
('Spa Masaje Doble', 50000.00, 1, '2026-03-06', 3, 0),
('Desayuno a la Habitación', 6000.00, 1, '2026-03-06', 3, 0),

-- Estadia 4 (Rodriguez Corta, Hab 22, 05-12 Mar)
('Cerveza Artesanal', 3500.00, 2, '2026-03-05', 4, 0),
('Hamburguesa Completa', 9500.00, 2, '2026-03-05', 4, 0),
('Papas Fritas', 4000.00, 1, '2026-03-05', 4, 0),

-- Estadia 5 (Fernandez VIP, Hab 1, 05-16 Mar)
('Champagne Frances', 80000.00, 1, '2026-03-05', 5, 0),
('Caviar', 120000.00, 1, '2026-03-05', 5, 0),
('Masaje Piedras Calientes', 30000.00, 1, '2026-03-06', 5, 0),
('Chofer Privado (Día)', 50000.00, 1, '2026-03-06', 5, 0),
('Cena Degustación', 60000.00, 1, '2026-03-07', 5, 0),
('Flores en Habitación', 10000.00, 1, '2026-03-05', 5, 0),

-- Estadia 6 (Histórica finalizada, Hab 25, 20-25 Feb) - Facturados
('Desayuno Continental', 5000.00, 2, '2026-02-20', 6, 1),
('Almuerzo Buffet', 22000.00, 1, '2026-02-20', 6, 1),
('Cena Show', 30000.00, 1, '2026-02-21', 6, 1),
('Bebidas Bar', 8000.00, 1, '2026-02-21', 6, 1),
('Lavandería Express', 6000.00, 1, '2026-02-22', 6, 1),
('Almuerzo Piscina', 15000.00, 1, '2026-02-23', 6, 1),
('Minibar Consumo', 4500.00, 1, '2026-02-24', 6, 1),

-- Estadia 7 (Familia Gallardo, Hab 4, 05-17 Mar)
('Menú Infantil', 8000.00, 2, '2026-03-05', 7, 0),
('Helados Variados', 4000.00, 3, '2026-03-05', 7, 0),
('Alquiler Películas', 2000.00, 1, '2026-03-05', 7, 0),
('Pizza Familiar', 18000.00, 1, '2026-03-06', 7, 0),
('Gaseosas 1.5L', 3000.00, 2, '2026-03-06', 7, 0),

-- Estadia 8 (Pereyra Trabajo, Hab 42, 05-22 Mar)
('Impresiones Color', 1500.00, 10, '2026-03-05', 8, 0),
('Sala de Reuniones (Hora)', 10000.00, 2, '2026-03-05', 8, 0),
('Coffee Break', 8000.00, 1, '2026-03-05', 8, 0),
('Sandwich Club', 8500.00, 1, '2026-03-06', 8, 0),
('Agua Mineral', 1500.00, 3, '2026-03-06', 8, 0),
('Servicio Técnico PC', 5000.00, 1, '2026-03-07', 8, 0),

-- Estadia 9 (Leiva Check-in HOY, Hab 15, 05-14 Mar)
('Kit de Bienvenida', 0.00, 1, '2026-03-05', 9, 0),
('Cena Ligera', 12000.00, 2, '2026-03-05', 9, 0),
('Copa de Vino', 4000.00, 2, '2026-03-05', 9, 0),
('Desayuno Buffet', 6500.00, 2, '2026-03-06', 9, 0),

-- Estadia 10 (Robledo Pareja, Hab 30, 05-12 Mar)
('Tragos de Autor', 5000.00, 2, '2026-03-05', 10, 0),
('Tabla de Quesos', 16000.00, 1, '2026-03-05', 10, 0),
('Acceso Spa', 15000.00, 2, '2026-03-06', 10, 0),
('Almuerzo Terraza', 20000.00, 1, '2026-03-06', 10, 0),

-- Cargos de Habitacion (Alojamiento)
-- Estadia 1: 10 noches, Hab 3 (Family Plan: 110500)
('Alojamiento - Habitación 3', 110500.00, 10, '2026-03-15', 1, 0),

-- Estadia 2: 4 noches, Hab 41 (Individual: 50800)
('Alojamiento - Habitación 41', 50800.00, 4, '2026-03-09', 2, 0),

-- Estadia 3: 9 noches, Hab 14 (Doble Sup: 90560)
('Alojamiento - Habitación 14', 90560.00, 9, '2026-03-14', 3, 0),

-- Estadia 4: 7 noches, Hab 22 (Doble Std: 70230)
('Alojamiento - Habitación 22', 70230.00, 7, '2026-03-12', 4, 0),

-- Estadia 5: 11 noches, Hab 1 (Suite: 128600)
('Alojamiento - Habitación 1', 128600.00, 11, '2026-03-16', 5, 0),

-- Estadia 6: 5 noches, Hab 25 (Doble Std: 70230) - Facturado
('Alojamiento - Habitación 25', 70230.00, 5, '2026-02-25', 6, 1),

-- Estadia 7: 12 noches, Hab 4 (Family Plan: 110500)
('Alojamiento - Habitación 4', 110500.00, 12, '2026-03-17', 7, 0),

-- Estadia 8: 17 noches, Hab 42 (Individual: 50800)
('Alojamiento - Habitación 42', 50800.00, 17, '2026-03-22', 8, 0),

-- Estadia 9: 9 noches, Hab 15 (Doble Sup: 90560)
('Alojamiento - Habitación 15', 90560.00, 9, '2026-03-14', 9, 0),

-- Estadia 10: 7 noches, Hab 30 (Doble Std: 70230)
('Alojamiento - Habitación 30', 70230.00, 7, '2026-03-12', 10, 0);
